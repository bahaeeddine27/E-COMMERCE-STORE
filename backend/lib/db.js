import mongoose from "mongoose";

// Fonction pour se connecter à la base de données MongoDB
export const connectDB = async () => {
    try {
        const conn = await mongoose.connect(process.env.MONGO_URI);
        console.log(`MongoDB connecté : ${conn.connection.host}`);
    } catch (error) {
        console.log("Erreur de connexion à MONGODB", error.message);
        process.exit(1);
    }
}