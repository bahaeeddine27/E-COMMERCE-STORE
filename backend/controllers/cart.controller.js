import Product from "../models/product.model.js";

// Récupère les produits présents dans le panier de l'utilisateur
export const getCartProducts = async (req, res) => {
    try {
        // Trouve tous les produits correspondant aux IDs dans le panier utilisateur
        const products = await Product.find({_id: {$in: req.user.cartItems}});
        // Ajoute la quantité associée à chaque produit
        const cartItems = products.map((product) => {
            const item = req.user.cartItems.find((cartItem) => cartItem.id === product.id);
            return { ...product.toJSON(), quantity: item.quantity };
        });
        res.json(cartItems); // Renvoie les produits avec leurs quantités
    } catch (error) {
        console.log("Erreur dans le contrôleur getCartProducts", error.message);
        res.status(500).json({ message: "erreur de serveur", error: error.message });
    }
};

// Ajoute un produit au panier de l'utilisateur
export const addToCart = async (req, res) => {
    try {
        const { productId, quantity } = req.body;
        const user = req.user;

        // Vérifie si l'article existe déjà dans le panier
        const existingItem = user.cartItems.find(item => item.id === productId);
        if (existingItem) {
            existingItem.quantity += 1; // Augmente la quantité si déjà présente
        } else {
            user.cartItems.push(productId); // Ajoute un nouvel article au panier
        }
        await user.save(); // Sauvegarde les modifications dans la base de données
        res.json(user.cartItems); // Renvoie le panier mis à jour
    } catch (error) {
        console.log("Erreur dans le contrôleur addToCart", error.message);
        res.status(500).json({ message: "erreur de serveur", error: error.message });
    }
}; 

// Supprime tous les produits ou un produit spécifique du panier
export const removeAllFromCart = async (req, res) => {
    try {
        const { productId } = req.body;
        const user = req.user;
        if (!productId) {
            // Si aucun ID de produit n'est fourni, vide tout le panier
            user.cartItems = [];
        } else {
            // Supprime un produit spécifique du panier
            user.cartItems = user.cartItems.filter((item) => item.id !== productId);
        }
        await user.save(); // Sauvegarde les modifications dans la base de données
        res.json(user.cartItems); // Renvoie le panier mis à jour
    } catch (error) {
        res.status(500).json({ message: "erreur de serveur", error: error.message });
    }
};

// Met à jour la quantité d'un produit dans le panier
export const updateQuantity = async (req, res) => {
    try {
        const {id: productId} = req.params; // ID du produit à mettre à jour
        const { quantity } = req.body;
        const user = req.user;
        // Trouve l'article correspondant dans le panier
        const existingItem = user.cartItems.find((item) => item.id === productId);

        if(existingItem) {
            if(quantity === 0) {
                // Supprime l'article si la quantité devient 0
                user.cartItems = user.cartItems.filter((item) => item.id !== productId);
                await user.save();
                return res.json(user.cartItems); // Renvoie le panier mis à jour
            }
            existingItem.quantity = quantity; // Met à jour la quantité
            await user.save(); 
            res.json(user.cartItems); // Renvoie le panier mis à jour
        } else {
            res.status(404).json({message: "Article introuvable dans le panier"}); 
        }
    } catch (error) {
        console.log("Erreur dans le contrôleur updateQuantity", error.message);
        res.status(500).json({ message: "erreur de serveur", error: error.message });
    }
};