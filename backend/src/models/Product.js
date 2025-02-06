const mongoose = require('mongoose');

const variantSchema = new mongoose.Schema({
    size: {
        type: String,
        required: [true, 'Size is required'],
        trim: true
    },
    color: {
        type: String,
        required: [true, 'Color is required'],
        trim: true
    },
    quantity: {
        type: Number,
        required: [true, 'Quantity is required'],
        min: [0, 'Quantity cannot be negative'],
        default: 0
    }
});

const productSchema = new mongoose.Schema({
    name: {
        type: String,
        required: [true, 'Product name is required'],
        trim: true
    },
    description: {
        type: String,
        trim: true
    },
    type: {
        type: String,
        required: [true, 'Product type is required'],
        enum: ['Jumpsuit', 'Robe', 'Jupe'],
        trim: true
    },
    price: {
        type: Number,
        required: [true, 'Product price is required'],
        min: [0, 'Price cannot be negative']
    },
    variants: [variantSchema],
    soldPrice: {
        type: Number,
        default: 0,
        min: 0
    },
    isNew: {
        type: Boolean,
        default: true
    },
    links: [{
        url: {
            type: String,
            trim: true,
        },
        type: {
            type: String,
            required: true,
            enum: ['video', 'image'],
            trim: true
        }
    }]
}, {
    timestamps: true,
    toJSON: { virtuals: true },
    toObject: { virtuals: true }
});

// Virtual property for available colors
productSchema.virtual('colors').get(function() {
    return [...new Set(this.variants.map(variant => variant.color))];
});

// Virtual property for available sizes
productSchema.virtual('sizes').get(function() {
    return [...new Set(this.variants.map(variant => variant.size))];
});

// Method to update variant quantity
productSchema.methods.updateVariantQuantity = async function(size, color, quantityChange) {
    
    console.log(size, color);
    console.log(this.variants);
    
    // Search for the variant with matching size and color
    const variant = this.variants.find(v => v.size === size && v.color === color);
    if (!variant) {
        throw new Error('Variant not found');
    }

    const newQuantity = variant.quantity + quantityChange;
    if (newQuantity < 0) {
        throw new Error('Insufficient quantity');
    }

    if (newQuantity === 0) {
        this.variants = this.variants.filter(v => !(v.size === size && v.color === color));
    } else {
        variant.quantity = newQuantity;
    }
    
    return await this.save();
};

const Product = mongoose.model('Product', productSchema);

module.exports = Product;
