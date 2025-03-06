import { redis } from '../lib/redis.js';
import cloudinary from '../lib/cloudinary.js';
import Product from '../models/product.model.js';

// Contrôleur pour récupérer tous les produits
export const getAllProducts = async (req, res) => {
    try {
        // Récupère tous les produits dans la base de données
        const products = await Product.find({});
        res.json({ products }); // Retourne les produits
    } catch (error) {
        console.log("Erreur dans le contrôleur getAllProducts", error.message);
        res.status(500).json({ message: "erreur de serveur", error: error.message });
    }
};

// Contrôleur pour récupérer les produits en vedette
export const getFeaturedProducts = async (req, res) => {
    try {
        // Vérifie si les produits en vedette sont déjà en cache Redis
        let featuredProducts = await redis.get("featured_products");
        if (featuredProducts) {
            return res.json(JSON.parse(featuredProducts)); // Retourne les données depuis le cache
        }

        // Si non en cache, récupère les produits en vedette depuis la base de données
        featuredProducts = await Product.find({ isFeatured: true }).lean();

        if (!featuredProducts) {
            return res.status(404).json({ message: "Aucun produit en vedette introuvable" });
        }

        // Met en cache les produits en vedette
        await redis.set("featured_products", JSON.stringify(featuredProducts)); // Correction ici

        res.json(featuredProducts); // Retourne les produits
    } catch (error) {
        console.log("Erreur dans le contrôleur getFeaturedProducts", error.message);
        res.status(500).json({ message: "erreur de serveur", error: error.message });
    }
};

// Contrôleur pour créer un nouveau produit
export const createProduct = async (req, res) => {
    try {
        const { name, description, price, image, category } = req.body;
        let cloudinaryResponse = null;

        // Télécharge l'image sur Cloudinary si elle existe
        if (image) {
            cloudinaryResponse = await cloudinary.uploader.upload(image, { folder: "products" });
        }

        // Crée le produit avec l'URL de l'image téléchargée
        const product = await Product.create({
            name,
            description,
            price,
            image: cloudinaryResponse && cloudinaryResponse.secure_url ? cloudinaryResponse.secure_url : "", // Ajoute l'URL de l'image si elle existe
            category,
        });
 
        res.status(201).json(product); // Retourne le produit créé
    } catch (error) {
        res.status(500).json({ message: "erreur de serveur", error: error.message });
    }
};

// Contrôleur pour supprimer un produit
export const deleteProduct = async (req, res) => {
    try {
        const product = await Product.findById(req.params.id)

        if (!product) {
            return res.status(404).json({ message: "Produit introuvable" });
        }
        // Supprime l'image associée sur Cloudinary
        if (product.image) {
            const publicId = product.image.split("/").pop().split(".")[0]; // Récupère l'ID public de l'image
            try {
                await cloudinary.uploader.destroy(`products/${publicId}`)
                console.log("image supprimée de cloudinary");
            } catch (error) {
                console.log("erreur lors de la suppression de l'image de cloudinary", error)
            }
        }
        // Supprime le produit dans la base de données
        await Product.findByIdAndDelete(req.params.id);
        res.json({ message: "Produit supprimé avec succès" });
    } catch (error) {
        console.log("Erreur dans le contrôleur deleteProduct", error.message);
        res.status(500).json({ message: "erreur de serveur", error: error.message });
    }
};

// Contrôleur pour récupérer des produits recommandés (3 produits aléatoires)
export const getRecommendedProducts = async (req, res) => {
    try {
        const products = await Product.aggregate([
            {
                $sample: { size: 3 } // Sélectionne aléatoirement 3 produits
            },
            {
                $project: { 
                    _id: 1,
                    name: 1,
                    description: 1,
                    image: 1,
                    price: 1,
                } // Retourne uniquement certains champs
            }
        ])
        res.json(products); // Retourne les produits recommandés
    } catch (error) {
        console.log("Erreur dans le contrôleur getRecommendedProducts", error.message);
        res.status(500).json({ message: "erreur de serveur", error: error.message });
    }
};

// Contrôleur pour récupérer les produits par catégorie
export const getProductsByCategory = async (req, res) => {
    const { category } = req.params;
    try { 
        // Récupère les produits correspondant à une catégorie spécifique
        const products = await Product.find({ category });
        res.json({ products });
    } catch (error) {
        console.log("Erreur dans le contrôleur getProductsByCategory", error.message);
        res.status(500).json({ message: "erreur de serveur", error: error.message });
    }
};

// Contrôleur pour récupérer un produit par ID
export const getProductById = async (req, res) => {
    try {
        const product = await Product.findById(req.params.id);

        if (!product) {
            return res.status(404).json({ message: "Produit introuvable" });
        }

        res.json(product);
    } catch (error) {
        console.log("Erreur dans le contrôleur getProductById", error.message);
        res.status(500).json({ message: "erreur de serveur", error: error.message });
    }
};

// Contrôleur pour activer/désactiver un produit en vedette
export const toggleFeaturedProduct = async (req, res) => {
    try {
        const product = await Product.findById(req.params.id);
        if (product) {
            product.isFeatured = !product.isFeatured; // Inverse l'état "isFeatured"
            const updatedProduct = await product.save();

            // Met à jour le cache des produits en vedette
            await updateFeaturedProductsCache();
            res.json(updatedProduct); // Retourne le produit mis à jour
        } else {
            res.status(404).json({ message: "Produit introuvable" });
        }
    } catch (error) {
        console.log("Erreur dans le contrôleur toggleFeaturedProduct", error.message);
        res.status(500).json({ message: "erreur de serveur", error: error.message });
    }
};

// Contrôleur pour mettre à jour le prix d'un produit
export const updateProductPrice = async (req, res) => {
    const { id } = req.params;
    const { price } = req.body;  // Nouveau prix

    try {
        const product = await Product.findById(id);
        
        if (!product) {
            return res.status(404).json({ message: "Produit introuvable" });
        }

        // Mettre à jour le prix
        product.price = price;
        const updatedProduct = await product.save();  // Sauvegarde le produit mis à jour
        
        // Mettre à jour le cache si nécessaire
        await updateFeaturedProductsCache();

        res.json(updatedProduct);  // Retourne le produit mis à jour
    } catch (error) {
        console.log("Erreur dans le contrôleur updateProductPrice", error.message);
        res.status(500).json({ message: "erreur de serveur", error: error.message });
    }
};

// Fonction pour mettre à jour le cache des produits en vedette
async function updateFeaturedProductsCache() {
    try {
        const featuredProducts = await Product.find({ isFeatured: true }).lean();
        await redis.set("featured_products", JSON.stringify(featuredProducts)); // Met à jour le cache Redis
    } catch (error) {
        console.log("Erreur dans la fonction de cache de mise à jour");
    }  
};