import express from "express";
import { protectRoute } from "../middleware/auth.middleware.js";
import { getCoupon, validateCoupon } from "../controllers/coupon.controller.js";

const router = express.Router();

/**
 * @swagger
 * /api/coupons:
 *   get:
 *     summary: Récupérer les coupons disponibles
 *     security:
 *       - bearerAuth: []
 *     responses:
 *       200:
 *         description: Liste des coupons disponibles
 *       401:
 *         description: Non autorisé, token manquant ou invalide
 */
router.get("/", protectRoute, getCoupon);

/**
 * @swagger
 * /api/coupons/validate:
 *   post:
 *     summary: Valider un coupon
 *     security:
 *       - bearerAuth: []
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               couponCode:
 *                 type: string
 *                 description: Code du coupon à valider
 *     responses:
 *       200:
 *         description: Coupon validé avec succès
 *       400:
 *         description: Coupon invalide ou expiré
 *       401:
 *         description: Non autorisé, token manquant ou invalide
 */
router.post("/validate", protectRoute, validateCoupon);

export default router;
