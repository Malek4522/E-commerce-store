const Order = require('../models/Order');
const Product = require('../models/Product');
const mongoose = require('mongoose');

// Validate status transition
const isValidStatusTransition = (currentStatus, newStatus) => {
    const validTransitions = {
        'waiting': ['processing', 'canceled'],
        'processing': ['shipped', 'canceled'],
        'shipped': ['delivered', 'canceled'],
        'delivered': ['canceled'],
        'canceled': ['waiting'] // only allow reactivating to waiting state
    };
    
    return validTransitions[currentStatus]?.includes(newStatus) || false;
};

// Create a new order
exports.createOrder = async (req, res) => {
    const session = await mongoose.startSession();
    session.startTransaction();

    try {
        const { productId, color, size, fullName, phoneNumber, state, region, delivery, status } = req.body;
        // Validate product existence
        const product = await Product.findById(productId).session(session);
        if (!product) {
            throw new Error('Product not found');
        }

        // Check if the product has enough stock for the requested variant
        const variant = product.variants.find(v => v.color === color && v.size === size);
        if (!variant || variant.quantity === 0) {
            throw new Error('Insufficient stock for the requested variant');
        }

        // Update variant quantity - pass -1 as the change in quantity
        await product.updateVariantQuantity(variant.size, variant.color, -1, session);

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

        await order.save({ session });
        
        // Populate the product field before sending response
        const populatedOrder = await Order.findById(order._id)
            .populate('product')
            .session(session);
        
        await session.commitTransaction();
        
        res.status(201).json({
            success: true,
            data: populatedOrder
        });
    } catch (error) {
        await session.abortTransaction();
        res.status(400).json({
            success: false,
            message: error.message
        });
    } finally {
        session.endSession();
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

// Update order
exports.updateOrder = async (req, res) => {
    const session = await mongoose.startSession();
    session.startTransaction();

    try {
        const { statusNumber, ...updateData } = req.body;
        const order = await Order.findById(req.params.id).session(session);

        if (!order) {
            throw new Error('Order not found');
        }

        // Handle status update
        if (statusNumber !== undefined) {
            const previousStatus = order.status;
            const newStatus = await order.updateStatusByNumber(statusNumber);
            
            // Validate status transition
            if (!isValidStatusTransition(previousStatus, newStatus)) {
                throw new Error(`Invalid status transition from ${previousStatus} to ${newStatus}`);
            }

            // Handle quantity changes only if status actually changed
            if (previousStatus !== newStatus) {
                const product = await Product.findById(order.product).session(session);
                if (!product) {
                    throw new Error('Associated product not found');
                }

                const variant = product.variants.find(v => v.color === order.color && v.size === order.size);
                
                // Case 1: Changing to canceled - add quantity back
                if (newStatus === 'canceled') {
                    // Add 1 back to quantity
                    await product.updateVariantQuantity(order.size, order.color, 1, session);
                }
                // Case 2: Changing from canceled to another status - subtract quantity
                else if (previousStatus === 'canceled') {
                    if (!variant || variant.quantity === 0) {
                        throw new Error('Insufficient stock for reactivating order');
                    }
                    // Subtract 1 from quantity
                    await product.updateVariantQuantity(order.size, order.color, -1, session);
                }
            }
        }

        // Update other fields if provided
        if (Object.keys(updateData).length > 0) {
            Object.assign(order, updateData);
            await order.save({ session });
        }

        await session.commitTransaction();

        res.status(200).json({
            success: true,
            data: order
        });
    } catch (error) {
        await session.abortTransaction();
        res.status(400).json({
            success: false,
            message: error.message
        });
    } finally {
        session.endSession();
    }
};

// Delete order
exports.deleteOrder = async (req, res) => {
    const session = await mongoose.startSession();
    session.startTransaction();

    try {
        const order = await Order.findById(req.params.id)
            .populate('product')
            .session(session);

        if (!order) {
            throw new Error('Order not found');
        }

        // Handle quantity changes before deleting
        if (order.status !== 'canceled' && order.product) {
            const variant = order.product.variants.find(v => v.color === order.color && v.size === order.size);
            // Only add quantity back if the variant still exists
            if (variant) {
                // Add 1 back to quantity
                await order.product.updateVariantQuantity(
                    order.size,
                    order.color, 
                    1,
                    session
                );
            }
        }

        await Order.deleteOne({ _id: order._id }).session(session);
        await session.commitTransaction();

        res.status(200).json({
            success: true,
            message: 'Order deleted successfully'
        });
    } catch (error) {
        await session.abortTransaction();
        res.status(500).json({
            success: false,
            message: error.message
        });
    } finally {
        session.endSession();
    }
};

