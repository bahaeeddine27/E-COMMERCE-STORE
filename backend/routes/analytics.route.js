import express from 'express';
import { protectRoute, adminRoute } from '../middleware/auth.middleware.js';
import { getAnalyticsData, getDailySalesData } from '../controllers/analytics.controller.js';

const router = express.Router(); // Création d'un routeur Express

/**
 * @swagger
 * /api/analytics:
 *   get:
 *     summary: Récupérer les données analytiques et les ventes quotidiennes des 7 derniers jours
 *     security:
 *       - bearerAuth: []
 *     responses:
 *       200:
 *         description: Données analytiques et des ventes quotidiennes récupérées avec succès
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 analyticsData:
 *                   type: object
 *                   description: Données analytiques générales de l'API.
 *                 dailySalesData:
 *                   type: array
 *                   description: Liste des ventes quotidiennes pour les 7 derniers jours.
 *                   items:
 *                     type: object
 *                     properties:
 *                       date:
 *                         type: string
 *                         format: date
 *                         description: Date de la vente
 *                       sales:
 *                         type: number
 *                         description: Montant des ventes du jour
 *       401:
 *         description: Non autorisé, l'utilisateur doit être administrateur
 *       500:
 *         description: Erreur interne du serveur
 */
router.get('/', protectRoute, adminRoute, async (req, res) => {
  try {
    // Appel de la fonction pour récupérer les données analytiques générales
    const analyticsData = await getAnalyticsData();

    // Définir une plage de dates pour les ventes des 7 derniers jours
    const endDate = new Date(); // Date actuelle
    const startDate = new Date(endDate.getTime() - 7 * 24 * 60 * 60 * 1000); // 7 jours avant la date actuelle

    // Appel de la fonction pour récupérer les données des ventes quotidiennes sur la période spécifiée
    const dailySalesData = await getDailySalesData(startDate, endDate);

    // Envoi de la réponse avec les données analytiques et les ventes quotidiennes
    res.json({
      analyticsData,
      dailySalesData,
    });
  } catch (error) {
    // Log en cas d'erreur dans la gestion de la route
    console.log("Erreur dans l'itinéraire d'analyse", error.message);

    // Retourne une réponse d'erreur au client
    res.status(500).json({ message: 'Erreur de serveur', error: error.message });
  }
});

export default router;
