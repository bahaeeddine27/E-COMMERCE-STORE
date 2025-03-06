import express from 'express';
import { addToCart, removeAllFromCart, getCartProducts, updateQuantity } from '../controllers/cart.controller.js';
import { protectRoute } from '../middleware/auth.middleware.js';

const router = express.Router();

/**
 * @swagger
 * /api/cart:
 *   get:
 *     summary: Récupérer les produits dans le panier
 *     security:
 *       - bearerAuth: []
 *     responses:
 *       200:
 *         description: Liste des produits dans le panier
 *       401:
 *         description: Non autorisé, token manquant ou invalide
 */
router.get("/", protectRoute, getCartProducts);

/**
 * @swagger
 * /api/cart:
 *   post:
 *     summary: Ajouter un produit au panier
 *     security:
 *       - bearerAuth: []
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               productId:
 *                 type: string
 *                 description: ID du produit à ajouter au panier
 *               quantity:
 *                 type: number
 *                 description: Quantité du produit à ajouter
 *     responses:
 *       201:
 *         description: Produit ajouté au panier
 *       400:
 *         description: Erreur de validation des données
 *       401:
 *         description: Non autorisé, token manquant ou invalide
 */
router.post("/", protectRoute, addToCart);

/**
 * @swagger
 * /api/cart:
 *   delete:
 *     summary: Supprimer tous les produits du panier
 *     security:
 *       - bearerAuth: []
 *     responses:
 *       200:
 *         description: Panier vidé avec succès
 *       401:
 *         description: Non autorisé, token manquant ou invalide
 */
router.delete("/", protectRoute, removeAllFromCart);

/**
 * @swagger
 * /api/cart/{id}:
 *   put:
 *     summary: Mettre à jour la quantité d'un produit dans le panier
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: string
 *         description: ID du produit dont la quantité doit être mise à jour
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               quantity:
 *                 type: number
 *                 description: Nouvelle quantité du produit
 *     responses:
 *       200:
 *         description: Quantité du produit mise à jour
 *       400:
 *         description: Erreur lors de la mise à jour
 *       401:
 *         description: Non autorisé, token manquant ou invalide
 */
router.put("/:id", protectRoute, updateQuantity);

export default router;
