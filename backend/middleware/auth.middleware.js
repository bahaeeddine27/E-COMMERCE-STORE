import jwt from "jsonwebtoken";
import User from "../models/user.model.js";

// Middleware pour protéger les routes nécessitant une authentification
export const protectRoute = async (req, res, next) => {
    try {
        // Vérifie si un jeton d'accès est présent dans les cookies
        const accessToken = req.cookies.accessToken;
        if (!accessToken) {
            return res.status(401).json({ message: "Non autorisé - Aucun jeton d'accès fourni" });
        }
        try {
            // Vérifie et décode le jeton avec la clé secrète
            const decoded = jwt.verify(accessToken, process.env.ACCESS_TOKEN_SECRET);
            // Recherche de l'utilisateur correspondant au `userId` du jeton
            const user = await User.findById(decoded.userId).select("-password"); // Exclure le champ "password"

            if (!user) {
                return res.status(401).json({ message: "utilisateur introuvable" });
            }

            // Ajoute l'utilisateur trouvé à l'objet `req` pour les prochaines étapes
            req.user = user;

            // Passe au middleware suivant ou à la route
            next();
        } catch (error) {

            // Gestion spécifique des erreurs liées au jeton
            if (error.name === "TokenExpiredError") {
                return res.status(401).json({ message: "Non autorisé – Jeton expiré" });
            }

            // Relance d'autres erreurs pour la gestion globale
            throw error;
        }
    } catch (error) {
        // Log et réponse en cas d'erreur inattendue
        console.log("Erreur dans le middleware ProtectRoute", error.message);
        res.status(401).json({ message: "Non autorisé - Jeton d'accès invalide" });
    }
};

// Middleware pour protéger les routes réservées aux administrateurs
export const adminRoute = (req, res, next) => {

    // Vérifie si l'utilisateur est authentifié et a le rôle "admin"
    if (req.user && req.user.role === "admin") {
        next(); // Passe au middleware ou à la route suivante
    } else {
        // Retourne une réponse si l'utilisateur n'est pas autorisé
        return res.status(403).json({ message: "Accès refusé - Administrateur uniquement" });
    }
}