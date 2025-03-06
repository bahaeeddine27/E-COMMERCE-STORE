import express from 'express';
import {
  deleteProduct,
  createProduct,
  getProductsByCategory,
  getAllProducts,
  getRecommendedProducts,
  getFeaturedProducts,
  toggleFeaturedProduct,
  updateProductPrice,
  getProductById,
} from '../controllers/product.controller.js';
import { protectRoute, adminRoute } from '../middleware/auth.middleware.js';

const router = express.Router();

/**
 * @swagger
 * /api/products:
 *   get:
 *     summary: Récupérer tous les produits (Admin seulement)
 *     security:
 *       - bearerAuth: []
 *     responses:
 *       200:
 *         description: Liste de tous les produits
 */
router.get('/', protectRoute, adminRoute, getAllProducts);

/**
 * @swagger
 * /api/products/featured:
 *   get:
 *     summary: Récupérer les produits en vedette
 *     responses:
 *       200:
 *         description: Retourne les produits en vedette
 */
router.get('/featured', getFeaturedProducts);

/**
 * @swagger
 * /api/products/category/{category}:
 *   get:
 *     summary: Récupérer les produits par catégorie
 *     parameters:
 *       - in: path
 *         name: category
 *         required: true
 *         schema:
 *           type: string
 *     responses:
 *       200:
 *         description: Liste des produits de la catégorie demandée
 */
router.get('/category/:category', getProductsByCategory);

/**
 * @swagger
 * /api/products/recommendations:
 *   get:
 *     summary: Récupérer des recommandations de produits
 *     responses:
 *       200:
 *         description: Liste des produits recommandés
 */
router.get('/recommendations', getRecommendedProducts);

/**
 * @swagger
 * /api/products:
 *   post:
 *     summary: Ajouter un nouveau produit (Admin seulement)
 *     security:
 *       - bearerAuth: []
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               name:
 *                 type: string
 *               price:
 *                 type: number
 *               category:
 *                 type: string
 *     responses:
 *       201:
 *         description: Produit créé avec succès
 */
router.post('/', protectRoute, adminRoute, createProduct);

/**
 * @swagger
 * /api/products/{id}:
 *   get:
 *     summary: Récupérer un produit par son ID
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: string
 *     responses:
 *       200:
 *         description: Détails du produit demandé
 */
router.get('/:id', getProductById);

/**
 * @swagger
 * /api/products/{id}:
 *   patch:
 *     summary: Mettre en avant un produit (Admin seulement)
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: string
 *     responses:
 *       200:
 *         description: Produit mis en avant
 */
router.patch('/:id', protectRoute, adminRoute, toggleFeaturedProduct);

/**
 * @swagger
 * /api/products/{id}:
 *   delete:
 *     summary: Supprimer un produit (Admin seulement)
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: string
 *     responses:
 *       200:
 *         description: Produit supprimé
 */
router.delete('/:id', protectRoute, adminRoute, deleteProduct);

/**
 * @swagger
 * /api/products/{id}/price:
 *   patch:
 *     summary: Modifier le prix d'un produit (Admin seulement)
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: string
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               price:
 *                 type: number
 *     responses:
 *       200:
 *         description: Prix mis à jour
 */
router.patch('/:id/price', protectRoute, adminRoute, updateProductPrice);

export default router;
