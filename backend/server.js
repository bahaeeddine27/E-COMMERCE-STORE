import express from 'express';
import dotenv from 'dotenv';
import cors from 'cors';
import authRoutes from './routes/auth.routes.js';
import productRoutes from './routes/product.route.js';
import cartRoutes from './routes/cart.route.js';
import couponRoutes from './routes/coupon.route.js';
import paymentRoutes from './routes/payment.route.js';
import analyticsRoutes from './routes/analytics.route.js';
import cookieParser from 'cookie-parser';
import { connectDB } from './lib/db.js';
import setupSwagger from './swagger.js';

// Charger les variables d'environnement depuis le fichier .env
dotenv.config();

const app = express();
const PORT = process.env.PORT || 5000;

// Configuration CORS pour autoriser l'envoi des cookies
app.use(
  cors({
    origin: 'http://localhost:5173', // Remplace par l'URL de ton frontend
    credentials: true, // Permet d'envoyer les cookies dans les requêtes
  })
);

// Utilisez la compression des réponses
app.use(compression());

app.use(express.json({ limit: '50mb' }));
app.use(cookieParser());

// Connexion à la base de données avant de démarrer le serveur
connectDB();

// Configuration de Swagger
setupSwagger(app);

// Définition des routes
app.use('/api/auth', authRoutes);
app.use('/api/products', productRoutes);
app.use('/api/cart', cartRoutes);
app.use('/api/coupons', couponRoutes);
app.use('/api/payments', paymentRoutes);
app.use('/api/analytics', analyticsRoutes);

// Démarrage du serveur
app.listen(PORT, () => {
  console.log(`✅ Server is running on http://localhost:${PORT}`);
});
