import Order from "../models/order.model.js";
import Product from '../models/product.model.js';
import User from '../models/user.model.js';

// Cette fonction calcule les données d'analyse globales, y compris le total des utilisateurs, des produits, des ventes et des revenus totaux
export const getAnalyticsData = async () => {
    // Compte le nombre total d'utilisateurs dans la base de données.
    const totalUsers = await User.countDocuments();

    // Compte le nombre total de produits dans la base de données.
    const totalProducts = await Product.countDocuments();

    // Grouper toutes les commandes pour obtenir les totaux.
    const salesData = await Order.aggregate([
        {
            $group: {
                _id: null,
                totalSales: {$sum: 1},// Compte le nombre total de commandes.
                totalRevenue: {$sum: "$totalAmount"}// Calcule la somme des montants des commandes.
            }
        }
    ])

    // Si aucune commande n'existe, initialise les totaux à 0.
    const {totalSales, totalRevenue} = salesData[0] || {totalSales: 0, totalRevenue: 0};

    // Retourne un objet contenant toutes les données d'analyse calculées.
    return {
        users: totalUsers,
        products: totalProducts,
        totalSales,
        totalRevenue,
    };
};

// Cette fonction calcule les données des ventes quotidiennes (ventes et revenus) pour une plage de dates donnée.
export const getDailySalesData = async (startDate, endDate) => {
    try {
        // Agrégation pour récupérer les ventes quotidiennes entre startDate et endDate.
        const dailySalesData = await Order.aggregate([
            {
                // Filtre les commandes en fonction de leur date de création.
                $match: {
                    createdAt: {
                        $gte: startDate, // Commandes créées à partir de la date de début.
                        $lt: endDate, // Commandes créées avant la date de fin.
                    },
                },
            },
            {
                // Grouper les commandes par jour.
                $group: {
                    _id: { $dateToString: { format: "%Y-%m-%d", date: "$createdAt" } }, // Format YYYY-MM-DD.
                    sales: { $sum: 1 }, // Compte le nombre de commandes par jour.
                    revenue: { $sum: "$totalAmount" }, // Calcule les revenus pour chaque jour.  
                },
            },
            {
                // Trie les résultats par date (ordre croissant).
                $sort: { _id: 1 },
            },
        ]);
        // Génère une liste de dates entre startDate et endDate.
        const dateArray = getDatesInRange(startDate, endDate);
    
        // Retourne les données de ventes pour chaque date de la plage.
        return dateArray.map(date => {
            // Recherche les données pour une date donnée dans les résultats d'agrégation.
            const foundData = dailySalesData.find(item => item._id === date);
            return {
                date, // Date actuelle
                sales: foundData?.sales || 0, // Nombre de ventes pour cette date (ou 0 si aucune donnée).
                revenue: foundData?.revenue || 0, // Revenu pour cette date (ou 0 si aucune donnée).
            }
        });
    } catch (error) {
        // Lance une erreur en cas de problème lors de l'exécution.
        throw error;
    }
};

// Cette fonction génère un tableau de dates entre deux dates (startDate et endDate).
function getDatesInRange(startDate, endDate) {
    const dates = [];
    let currentDate = new Date(startDate);

    // Parcourt les jours entre la date de début et la date de fin.
    while(currentDate <= endDate) {
        // Ajoute la date formatée (YYYY-MM-DD) au tableau.
        dates.push(currentDate.toISOString().split('T')[0]);
        // Passe au jour suivant.
        currentDate.setDate(currentDate.getDate() + 1);
    }
    return dates; // Retourne la liste des dates.
}