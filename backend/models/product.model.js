import mongoose from "mongoose";

// product schema
const productSchema = new mongoose.Schema({
    name: {
        type: String,
        required: true
    },
    description: {
        type: String,
        required: true
    },
    price: {
        type: Number,
        required: true,
        min: 0
    },
    image: {
        type: String,
        required: true,
        default: "URL_DE_L_IMAGE_PAR_DÉFAUT"
    },
    category: {
        type: String,
        required: true
    },
    isFeatured: {
        type: Boolean,
        default: false
    }
}, {timestamps: true});

const Product = mongoose.model("Product", productSchema);

export default Product;