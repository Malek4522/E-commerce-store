const mongoose = require('mongoose');

const orderSchema = new mongoose.Schema({
    product: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'Product',
        required: [true, 'Product reference is required']
    },
    color: {
        type: String,
        required: [true, 'Color is required'],
        trim: true
    },
    size: {
        type: String, 
        required: [true, 'Size is required'],
        trim: true
    },
    fullName: {
        type: String,
        required: [true, 'Full name is required'],
        trim: true
    },
    phoneNumber: {
        type: String,
        required: [true, 'Phone number is required'],
        trim: true
    },
    address: {
        type: String,
        required: [true, 'Address is required'],
        trim: true
    },
    status: {
        type: String,
        required: [true, 'Status is required'],
        enum: ['waiting', 'delivering', 'delivered', 'canceled'],
        default: 'waiting'
    }
}, {
    timestamps: true
});

// Method to update order status based on number (1-4)
orderSchema.methods.updateStatusByNumber = function(statusNumber) {
    const statusMap = {
        1: 'waiting',
        2: 'delivering', 
        3: 'delivered',
        4: 'canceled'
    };

    if (!statusMap[statusNumber]) {
        throw new Error('Invalid status number. Must be between 1-4');
    }

    this.status = statusMap[statusNumber];
    return this.save();
};


const Order = mongoose.model('Order', orderSchema);

module.exports = Order;
