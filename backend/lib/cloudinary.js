import {v2 as cloudinary} from "cloudinary";
import dotenv from "dotenv";

// Chargement des variables d'environnement depuis le fichier .env
dotenv.config();

// Configuration de Cloudinary
cloudinary.config({
    cloud_name: process.env.CLOUDINARY_CLOUD_NAME,
    api_key: process.env.CLOUDINARY_API_KEY,
    api_secret: process.env.CLOUDINARY_API_SECRET,
});

export default cloudinary;