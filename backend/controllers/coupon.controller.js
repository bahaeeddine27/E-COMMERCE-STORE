import Coupon from "../models/coupon.model.js";

// Récupérer le coupon actif de l'utilisateur
export const getCoupon = async (req, res) => {
    try {
        // Recherche un coupon actif lié à l'utilisateur
        const coupon = await Coupon.findOne({ userId: req.user._id, isActive: true });
        if (!coupon) {
            // Si aucun coupon actif n'est trouvé, retourne une réponse 404
            return res.status(404).json({ message: "Aucun coupon actif trouvé" });
        }
        res.json(coupon); // Renvoie le coupon actif trouvé
    } catch (error) {
        console.log("Erreur dans le contrôleur getCoupon", error.message);
        res.status(500).json({ message: "erreur de serveur", error: error.message });
    }
};

// Valider un coupon (vérification de la date d'expiration et de l'activation)
export const validateCoupon = async (req, res) => {
    try {
        const { code } = req.body; // Extraction du code de coupon depuis le corps de la requête
        const coupon = await Coupon.findOne({ code: code, userId: req.user._id, isActive: true });

        // Si le coupon n'est pas trouvé
        if (!coupon) {
            return res.status(404).json({ message: "Coupon introuvable ou inactif" });
        }

        // Vérification de l'expiration du coupon
        if (coupon.expirationDate < new Date()) {
            coupon.isActive = false; // Désactiver le coupon expiré
            await coupon.save(); // Sauvegarde la modification dans la base de données
            return res.status(404).json({ message: "Coupon expiré" });
        }

        // Si le coupon est valide, retourne les détails du coupon
        res.json({
            message: "Le coupon est valide",
            code: coupon.code,
            discountPercentage: coupon.discountPercentage
        });
    } catch (error) {
        console.log("Erreur dans le contrôleur validateCoupon", error.message);
        res.status(500).json({ message: "erreur de serveur", error: error.message });
    }
};