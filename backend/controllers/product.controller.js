import { redis } from '../lib/redis.js';
import cloudinary from '../lib/cloudinary.js';
import Product from '../models/product.model.js';

//product controllers
export const getAllProducts = async (req, res) => {
    try {
        const products = await Product.find({});
        res.json({ products });
    } catch (error) {
        console.log("Error in getAllProducts controller", error.message);
        res.status(500).json({ message: "Server Error", error: error.message });
    }
};

export const getFeaturedProducts = async (req, res) => {
    try {
        let featuredProducts = await redis.get("featured_products");
        if (featuredProducts) {
            return res.json(JSON.parse(featuredProducts));
        }
        featuredProducts = await Product.find({ isFeatured: true }).lean();

        if (!featuredProducts) {
            return res.status(404).json({ message: "No Featured products not found" });
        }
        await redis.get("featured_products", JSON.stringify(featuredProducts));

        res.json(featuredProducts);
    } catch (error) {
        console.log("Error in getFeaturedProducts controller", error.message);
        res.status(500).json({ message: "Server Error", error: error.message });
    }
};

export const createProduct = async (req, res) => {
    try {
        const { name, description, price, image, category } = req.body; // Assurez-vous que 'image' est utilisé partout
        let cloudinaryResponse = null;

        // Vérifiez si une image a été envoyée
        if (image) {
            cloudinaryResponse = await cloudinary.uploader.upload(image, { folder: "products" });
        }

        // Créez le produit avec l'URL de l'image
        const product = await Product.create({
            name,
            description,
            price,
            image: cloudinaryResponse && cloudinaryResponse.secure_url ? cloudinaryResponse.secure_url : "",
            category,
        });

        res.status(201).json(product);
    } catch (error) {
        console.log("Error in createProduct controller", error.message);
        res.status(500).json({ message: "Server Error", error: error.message });
    }
};


export const deleteProduct = async (req, res) => {
    try {
        const product = await Product.findById(req.params.id)

        if (!product) {
            return res.status(404).json({ message: "Product not found" });
        }
        if (product.image) {
            const publicId = product.image.split("/").pop().split(".")[0];
            try {
                await cloudinary.uploader.destroy(`products/${publicId}`)
                console.log("deleted image from cloudinary");
            } catch (error) {
                console.log("error deleting image from cloudinary", error)
            }
        }
        await Product.findByIdAndDelete(req.params.id);
        res.json({ message: "Product deleted successfully" });
    } catch (error) {
        console.log("Error in deleteProduct controller", error.message);
        res.status(500).json({ message: "Server Error", error: error.message });
    }
};

export const getRecommendedProducts = async (req, res) => {
    try {
        const products = await Product.aggregate([
            {
                $sample: { size: 3 }
            },
            {
                $project: {
                    _id: 1,
                    name: 1,
                    description: 1,
                    image: 1,
                    price: 1,
                }
            }
        ])
        res.json(products);
    } catch (error) {
        console.log("Error in getRecommendedProducts controller", error.message);
        res.status(500).json({ message: "Server Error", error: error.message });
    }
};

export const getProductsByCategory = async (req, res) => {
    const { category } = req.params;
    try {
        const products = await Product.find({ category });
        res.json({ products });
    } catch (error) {
        console.log("Error in getProductsByCategory controller", error.message);
        res.status(500).json({ message: "Server Error", error: error.message });
    }
};

export const toggleFeaturedProduct = async (req, res) => {
    try {
        const product = await Product.findById(req.params.id);
        if (product) {
            product.isFeatured = !product.isFeatured;
            const updatedProduct = await product.save();
            await updateFeaturedProductsCache();
            res.json(updatedProduct);
        } else {
            res.status(404).json({ message: "Product not found" });
        }
    } catch (error) {
        console.log("Error in toggleFeaturedProduct controller", error.message);
        res.status(500).json({ message: "Server Error", error: error.message });
    }
};

export const updateProductPrice = async (req, res) => {
    const { id } = req.params;
    const { price } = req.body;  // On récupère le nouveau prix dans le corps de la requête

    try {
        const product = await Product.findById(id);
        
        if (!product) {
            return res.status(404).json({ message: "Product not found" });
        }

        // Mettre à jour le prix
        product.price = price;
        const updatedProduct = await product.save();  // Sauvegarde le produit mis à jour
        
        // Mettre à jour le cache si nécessaire
        await updateFeaturedProductsCache();

        res.json(updatedProduct);  // Retourne le produit mis à jour
    } catch (error) {
        console.log("Error in updateProductPrice controller", error.message);
        res.status(500).json({ message: "Server Error", error: error.message });
    }
};

async function updateFeaturedProductsCache() {
    try {
        const featuredProducts = await Product.find({ isFeatured: true }).lean();
        await redis.set("featured_products", JSON.stringify(featuredProducts));
    } catch (error) {
        console.log("Error in update cache function");
    }  
};