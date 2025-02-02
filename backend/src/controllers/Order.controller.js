const Order = require('../models/Order');
const Product = require('../models/Product');
const mongoose = require('mongoose');

// Create a new order
exports.createOrder = async (req, res) => {
    try {
        const { productId, color, size, fullName, phoneNumber, state, region, delivery, status } = req.body;

        // Validate product existence
        const product = await Product.findById(productId);
        if (!product) {
            return res.status(404).json({ message: 'Product not found' });
        }

        // Check if the product has enough stock for the requested variant
        const variant = product.variants.find(v => v.color === color && v.size === size);
        if (!variant || variant.quantity === 0) {
            return res.status(400).json({ message: 'Insufficient stock for the requested variant' });
        }

        const order = new Order({
            product: productId,
            color,
            size,
            fullName,
            phoneNumber,
            state,
            region,
            delivery,
            status: status || 'waiting'
        });

        await order.save();
        
        // Populate the product field before sending response
        const populatedOrder = await Order.findById(order._id).populate('product');
        
        res.status(201).json({
            success: true,
            data: populatedOrder
        });
    } catch (error) {
        res.status(400).json({
            success: false,
            message: error.message
        });
    }
};

// Get all orders
exports.getAllOrders = async (req, res) => {
    try {
        const orders = await Order.find()
            .populate('product')
            .sort({ createdAt: -1 });

        res.status(200).json({
            success: true,
            count: orders.length,
            data: orders
        });
    } catch (error) {
        res.status(500).json({
            success: false,
            message: error.message
        });
    }
};

// Get single order
exports.getOrder = async (req, res) => {
    try {
        const order = await Order.findById(req.params.id).populate('product');
        
        if (!order) {
            return res.status(404).json({
                success: false,
                message: 'Order not found'
            });
        }

        res.status(200).json({
            success: true,
            data: order
        });
    } catch (error) {
        res.status(500).json({
            success: false,
            message: error.message
        });
    }
};

// Update order status
exports.updateOrder = async (req, res) => {
    try {
        const { statusNumber, ...updateData } = req.body;
        const order = await Order.findById(req.params.id);

        if (!order) {
            return res.status(404).json({
                success: false,
                message: 'Order not found'
            });
        }

        // If statusNumber is provided, update status using the special method
        if (statusNumber !== undefined) {
            await order.updateStatusByNumber(statusNumber);
        }

        // Update other fields if provided
        if (Object.keys(updateData).length > 0) {
            Object.assign(order, updateData);
            await order.save();
        }

        res.status(200).json({
            success: true,
            data: order
        });
    } catch (error) {
        res.status(400).json({
            success: false,
            message: error.message
        });
    }
};

// Delete order
exports.deleteOrder = async (req, res) => {
    try {
        const order = await Order.findById(req.params.id);

        if (!order) {
            return res.status(404).json({
                success: false,
                message: 'Order not found'
            });
        }

        await Order.deleteOne({ _id: order._id });

        res.status(200).json({
            success: true,
            message: 'Order deleted successfully'
        });
    } catch (error) {
        res.status(500).json({
            success: false,
            message: error.message
        });
    }
};

