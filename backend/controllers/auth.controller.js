import User from '../models/user.model.js';
import { redis } from '../lib/redis.js';
import jwt from 'jsonwebtoken';

// Cette fonction génère des jetons d'accès (valable 15 minutes) et d'actualisation (valable 7 jours) pour un utilisateur donné
const generateTokens = (userId) => {
  const accessToken = jwt.sign({ userId }, process.env.ACCESS_TOKEN_SECRET, {
    expiresIn: '15m', // Jeton d'accès expirant dans 15 minutes
  });
  const refreshToken = jwt.sign({ userId }, process.env.REFRESH_TOKEN_SECRET, {
    expiresIn: '7d', // Jeton d'actualisation expirant dans 7 jours
  });
  return { accessToken, refreshToken };
};

// Cette fonction stocke le jeton d'actualisation dans Redis avec une expiration de 7 jours
const storeRefreshToken = async (userId, refreshToken) => {
  await redis.set(`refresh_token:${userId}`, refreshToken, 'EX', 7 * 24 * 60 * 60); // 7 jours d'expiration
};

// Configure les cookies contenant les jetons d'accès et d'actualisation
const setCookies = (res, accessToken, refreshToken) => {
  res.cookie('accessToken', accessToken, {
    httpOnly: true, // Empêche l'accès au cookie depuis le client JavaScript
    secure: process.env.NODE_ENV === 'production' ? true : false, // Active le mode sécurisé en production
    sameSite: 'Lax', // Empêche l'envoi du cookie dans les requêtes croisées
    maxAge: 15 * 60 * 1000, // Valable 15 minutes.
  });
  res.cookie('refreshToken', refreshToken, {
    httpOnly: true,
    secure: process.env.NODE_ENV === 'production' ? true : false,
    sameSite: 'Lax',
    maxAge: 7 * 24 * 60 * 60 * 1000, // Valable 7 jours
  });
};

// Contrôleur pour l'inscription d'un utilisateur
export const signup = async (req, res) => {
  const { email, password, name } = req.body;
  try {
    // Vérifie si l'utilisateur existe déjà
    const userExists = await User.findOne({ email });

    if (userExists) {
      return res.status(400).json({ message: "L'utilisateur existe déjà" });
    }
    // Crée un nouvel utilisateur
    const user = await User.create({ name, email, password });

    // Génère les jetons pour l'utilisateur et les stocke
    const { accessToken, refreshToken } = generateTokens(user._id);
    await storeRefreshToken(user._id, refreshToken);

    // Configure les cookies avec les jetons
    setCookies(res, accessToken, refreshToken);

    // Retourne les informations de l'utilisateur nouvellement créé
    res.status(201).json({
      _id: user._id,
      name: user.name,
      email: user.email,
      role: user.role,
    });
  } catch (error) {
    console.log("Erreur lors de l'inscription", error.message);
    res.status(500).json({ message: error.message });
  }
};

// Contrôleur pour la déconnexion d'un utilisateur
export const logout = async (req, res) => {
  try {
    // Récupère le jeton d'actualisation depuis les cookies
    const refreshToken = req.cookies.refreshToken;
    if (refreshToken) {
      // Vérifie et supprime le jeton d'actualisation de Redis
      const decoded = jwt.verify(refreshToken, process.env.REFRESH_TOKEN_SECRET);
      await redis.del(`refresh_token:${decoded.userId}`);
    }
    // Efface les cookies contenant les jetons
    res.clearCookie('accessToken');
    res.clearCookie('refreshToken');
    res.json({ message: 'Déconnexion réussie' });
  } catch (error) {
    console.log('Erreur dans le contrôleur de déconnexion', error.message);
    res.status(500).json({ message: 'Server error', error: error.message });
  }
};

// Contrôleur pour la connexion d'un utilisateur
export const login = async (req, res) => {
  try {
    const { email, password } = req.body;
    const user = await User.findOne({ email });

    if (user && (await user.comparePassword(password))) {
      // Si l'utilisateur est valide, génère les jetons et les configure dans les cookies
      const { accessToken, refreshToken } = generateTokens(user._id);
      await storeRefreshToken(user._id, refreshToken);

      setCookies(res, accessToken, refreshToken);
      res.json({
        _id: user._id,
        name: user.name,
        email: user.email,
        role: user.role,
      });
    } else {
      res.status(401).json({ message: 'Email ou mot de passe invalide' });
    }
  } catch (error) {
    console.log('Erreur de connexion', error.message);
    res.status(500).json({ message: error.message });
  }
};

// Contrôleur pour actualiser le jeton d'accès
export const refreshToken = async (req, res) => {
  try {
    const refreshToken = req.cookies.refreshToken; // Récupérer le jeton d'actualisation depuis les cookies

    if (!refreshToken) {
      return res.status(401).json({ message: "Aucun jeton d'actualisation fourni" });
    }

    // Vérifier le jeton d'actualisation
    const decoded = jwt.verify(refreshToken, process.env.REFRESH_TOKEN_SECRET);
    const storedToken = await redis.get(`refresh_token:${decoded.userId}`);

    if (!storedToken || storedToken !== refreshToken) {
      return res.status(403).json({ message: "Jeton d'actualisation invalide" });
    }

    // Générer un nouveau token d'accès
    const accessToken = jwt.sign({ userId: decoded.userId }, process.env.ACCESS_TOKEN_SECRET, {
      expiresIn: '15m',
    });

    // Envoyer le nouveau token d'accès via un cookie
    res.cookie('accessToken', accessToken, {
      httpOnly: true,
      secure: process.env.NODE_ENV === 'production' ? true : false,
      sameSite: 'Lax',
      maxAge: 15 * 60 * 1000,
    });

    res.json({ message: "Jeton d'accès rafraîchi avec succès" });
  } catch (error) {
    console.log("Erreur lors de l'actualisation du jeton", error.message);
    res.status(500).json({ message: 'Erreur serveur', error: error.message });
  }
};

// Contrôleur pour récupérer le profil de l'utilisateur
export const getProfile = async (req, res) => {
  try {
    // Retourne les informations utilisateur attachées à la requête
    res.json(req.user);
  } catch (error) {
    res.status(500).json({ message: 'erreur de serveur', error: error.message });
  }
};
