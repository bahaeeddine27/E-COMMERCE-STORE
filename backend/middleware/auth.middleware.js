import jwt from 'jsonwebtoken';
import User from '../models/user.model.js';

export const protectRoute = async (req, res, next) => {
  const accessToken = req.cookies.accessToken;
  if (!accessToken) {
    return res.status(401).json({ message: "Non autorisé - Aucun jeton d'accès fourni" });
  }
  try {
    const decoded = jwt.verify(accessToken, process.env.ACCESS_TOKEN_SECRET);
    const user = await User.findById(decoded.userId).select('-password'); // Exclure le champ "password"

    if (!user) {
      return res.status(401).json({ message: 'Utilisateur introuvable' });
    }

    req.user = user;
    next();
  } catch (error) {
    // Si le jeton est expiré ou invalide, renvoie un message d'erreur clair
    if (error.name === 'TokenExpiredError') {
      return res.status(401).json({ message: 'Non autorisé – Jeton expiré' });
    } else if (error.name === 'JsonWebTokenError') {
      return res.status(401).json({ message: 'Non autorisé – Jeton invalide' });
    }
    console.log('Erreur dans le middleware ProtectRoute', error.message);
    res.status(401).json({ message: 'Non autorisé - Erreur de jeton' });
  }
};


// Middleware pour protéger les routes réservées aux administrateurs
export const adminRoute = (req, res, next) => {
  if (!req.user) {
    return res.status(401).json({ message: 'Non autorisé - Utilisateur non authentifié' });
  }

  if (req.user.role !== 'admin') {
    return res.status(403).json({ message: 'Accès refusé - Administrateur uniquement' });
  }

  next();
};

