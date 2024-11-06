import Product from '../models/product.model.js';
import mongoose from 'mongoose';
export const getProducts = async(req,res) => {
    try {
        const products = await Product.find({});
        res.status(200).json({ sucess: true, count: products.length, data: products });
    } catch (error) {
        console.log("Error getting products", error.message);
        res.status(500).json({ sucess: false, message: 'Server Error getting products' });
    }
}

export const createProduct = async(req,res) => {
    const product = req.body; //user will send this data
    if (!product.name || !product.price || !product.image) {
        return res.status(400).json({ sucess: false, message: 'All fields are required' });
    }

    const newProduct = new Product(product)
    try {
        await newProduct.save();
        res.status(201).json({ sucess: true, message: 'Product created', data: newProduct });
    } catch (error) {
        console.log("Error creating product", error.message);
        res.status(500).json({ sucess: false, message: 'Server Error creating product' });
    }
}

export const updateProduct = async(req,res) => {
    const { id } = req.params;

    const product = req.body;

    if (!mongoose.Types.ObjectId.isValid(id)) {
        return res.status(400).json({ sucess: false, message: 'Product not found' });
    }

    try {
        const updatedProduct = await Product.findByIdAndUpdate(id, product, { new: true });
        res.status(200).json({ sucess: true,data: updatedProduct, message: 'Product updated' });
    } catch (error) {
        res.status(500).json({ sucess: false, message: 'Server Error updating product' });
    }
}

export const deleteProduct = async(req,res) => {
    const { id } = req.params;

    if (!mongoose.Types.ObjectId.isValid(id)) {
        return res.status(400).json({ sucess: false, message: 'Product not found' });
    }
    
    try {
        await Product.findByIdAndDelete(id);
        res.status(200).json({ sucess: true, message: 'Product deleted' });
    } catch (error) {
        console.log("Error deleting product", error.message);
        res.status(500).json({ sucess: false, message: 'Server Error deleting product' });
    }
}