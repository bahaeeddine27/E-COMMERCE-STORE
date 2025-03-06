import Coupon from "../models/coupon.model.js";
import Order from "../models/order.model.js";
import { stripe } from "../lib/stripe.js";

// Crée une session de paiement Stripe
export const createCheckoutSession = async (req, res) => {
    try {
        const { products, couponCode } = req.body;

        // Validation des produits
        if (!Array.isArray(products) || products.length === 0) {
            return res.status(400).json({ error: "Tableau de produits invalide ou vide" });
        }

        let totalAmount = 0;

        // Préparation des items Stripe
        const lineItems = products.map(product => {
            const amount = Math.round(product.price * 100); // Conversion en centimes pour Stripe
            totalAmount += amount * product.quantity;
            return {
                price_data: {
                    currency: "eur",
                    product_data: {
                        name: product.name,
                        images: [product.image],
                    },
                    unit_amount: amount,
                },
                quantity: product.quantity || 1,
            };
        });

        console.log("Éléments de campagne :", lineItems); // Vérifie la structure des items

        let coupon = null;
        if (couponCode) {
            // Recherche d'un coupon actif
            coupon = await Coupon.findOne({ code: couponCode, userId: req.user._id, isActive: true });
            if (coupon) {
                // Applique la réduction du coupon
                totalAmount -= Math.round(totalAmount * coupon.discountPercentage / 100);
            }
        }

        console.log("Montant total après coupon :", totalAmount); // Vérifie le montant total après coupon

        const session = await stripe.checkout.sessions.create({
            payment_method_types: ["card"],
            line_items: lineItems,
            mode: "payment",
            success_url: `${process.env.CLIENT_URL}/purchase-success?session_id={CHECKOUT_SESSION_ID}`,
            cancel_url: `${process.env.CLIENT_URL}/purchase-cancel`,
            discounts: coupon ? [
                { coupon: await createStripeCoupon(coupon.discountPercentage) }
            ] : [],
            metadata: {
                userId: req.user._id.toString(),
                couponCode: couponCode || "",
                products: JSON.stringify(
                    products.map(p => ({
                        id: p._id,
                        quantity: p.quantity,
                        price: p.price,
                    }))
                ),
            },
        });

        console.log("Session Stripe créée :", session); // Vérifie si la session a été correctement créée

        res.status(200).json({ id: session.id, totalAmount: totalAmount / 100 }); // Retourne le montant en euros
    } catch (error) {
        console.error("Erreur lors de la création de la session Stripe :", error);
        res.status(500).json({ error: "Erreur lors de la création de la session", message: error.message });
    }
};

// Gestion d'un paiement réussi via Stripe
export const checkoutSuccess = async (req, res) => {
    try {
        const { sessionId } = req.body;
        const session = await stripe.checkout.sessions.retrieve(sessionId);

        // Vérifie si le paiement a été complété
        if (session.payment_status === "paid") {
            if (session.metadata.couponCode) {
                // Désactiver le coupon utilisé
                await Coupon.findOneAndUpdate({
                    code: session.metadata.couponCode,
                    userId: session.metadata.userId
                }, {
                    isActive: false
                });
            }

            // Création d'une commande dans la base de données
            const products = JSON.parse(session.metadata.products);
            const newOrder = new Order({
                user: session.metadata.userId,
                products: products.map(product => ({
                    product: product.id,
                    quantity: product.quantity,
                    price: product.price
                })),
                totalAmount: session.amount_total / 100, // Convertir en euros
                stripeSessionId: sessionId
            });

            await newOrder.save();

            res.status(200).json({
                success: true,
                message: "Paiement réussi",
                orderId: newOrder._id,
            });
        } else {
            res.status(400).json({ error: "Le paiement n'a pas été effectué" });
        }
    } catch (error) {
        console.error("Erreur lors du paiement réussi :", error);
        res.status(500).json({ error: "Erreur lors du paiement réussi", message: error.message });
    }
};

// Fonction pour créer un coupon Stripe
async function createStripeCoupon(discountPercentage) {
    try {
        console.log("Création du coupon avec un pourcentage de réduction : ", discountPercentage);
        if (!discountPercentage) {
            throw new Error("Le pourcentage de réduction est invalide");
        }

        const coupon = await stripe.coupons.create({
            percent_off: discountPercentage,
            duration: "once",
        });
        return coupon.id;
    } catch (error) {
        console.error("Erreur lors de la création du coupon Stripe :", error);
        throw new Error("Erreur lors de la création du coupon Stripe");
    }
}

// Fonction pour créer un coupon personnalisé pour un utilisateur
async function createNewCoupon(userId) {
    try {
        const newCoupon = new Coupon({
            code: "GIFT" + Math.random().toString(36).substring(2, 8).toUpperCase(),
            discountPercentage: 10,
            expirationDate: new Date(Date.now() + 30 * 24 * 60 * 60 * 1000), // Valable 30 jours
            userId: userId,
        });
        await newCoupon.save();

        return newCoupon;
    } catch (error) {
        console.error("Erreur lors de la création du coupon pour l'utilisateur :", error);
        throw new Error("Erreur lors de la création du coupon");
    }
}
