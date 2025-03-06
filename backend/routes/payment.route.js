import express from "express";
import { protectRoute } from "../middleware/auth.middleware.js";
import { checkoutSuccess, createCheckoutSession } from "../controllers/payment.controller.js";

const router = express.Router();

/**
 * @swagger
 * /api/payment/create-checkout-session:
 *   post:
 *     summary: Créer une session de paiement pour le checkout
 *     security:
 *       - bearerAuth: []
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               amount:
 *                 type: number
 *                 description: Montant total de la commande
 *               currency:
 *                 type: string
 *                 description: Devise utilisée pour la transaction
 *     responses:
 *       200:
 *         description: Session de paiement créée avec succès
 *       400:
 *         description: Erreur lors de la création de la session
 */
router.post("/create-checkout-session", protectRoute, createCheckoutSession);

/**
 * @swagger
 * /api/payment/checkout-success:
 *   post:
 *     summary: Traiter le succès du checkout
 *     security:
 *       - bearerAuth: []
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               sessionId:
 *                 type: string
 *                 description: ID de la session de paiement
 *     responses:
 *       200:
 *         description: Succès du checkout
 *       400:
 *         description: Erreur lors du traitement du succès du checkout
 */
router.post("/checkout-success", protectRoute, checkoutSuccess);

export default router;
