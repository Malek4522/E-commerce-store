const Product = require('../models/Product');

// @desc    Create a new product
// @route   POST /api/products
// @access  Private/Admin
const createProduct = async (req, res) => {
    try {
        const { name, description, type, price, variants, links, isNew, soldPrice } = req.body;

        // Validate required fields
        if (!name || !type || !price) {
            return res.status(400).json({
                success: false,
                message: 'Please provide all required fields'
            });
        }

        // Validate product type
        const validTypes = ['Jumpsuit', 'Robe', 'Jupe'];
        if (!validTypes.includes(type)) {
            return res.status(400).json({
                success: false,
                message: 'Invalid product type'
            });
        }

        // Validate price
        if (price < 0) {
            return res.status(400).json({
                success: false,
                message: 'Price cannot be negative'
            });
        }

        // Validate variants if provided
        if (variants) {
            for (const variant of variants) {
                if (!variant.size || !variant.color || variant.quantity < 0) {
                    return res.status(400).json({
                        success: false,
                        message: 'Invalid variant data'
                    });
                }
            }
        }

        const product = await Product.create({
            name,
            description,
            type,
            price,
            variants: variants || [],
            links: links || [],
            isNew,
            soldPrice
        });

        res.status(201).json({
            success: true,
            data: product
        });

    } catch (error) {
        res.status(500).json({
            success: false,
            message: 'Server Error',
            error: error.message
        });
    }
};

const deleteProduct = async (req, res) => {
    try {
        const { id } = req.params;

        const product = await Product.findById(id);
        
        if (!product) {
            return res.status(404).json({
                success: false,
                message: 'Product not found'
            });
        }

        await product.deleteOne();

        res.status(200).json({
            success: true,
            message: 'Product deleted successfully'
        });

    } catch (error) {
        res.status(500).json({
            success: false, 
            message: 'Server Error',
            error: error.message
        });
    }
};

const updateProduct = async (req, res) => {
    try {
        const { id } = req.params;
        const { name, description, type, price, variants, links, isNew, soldPrice } = req.body;
        
        const product = await Product.findById(id);

        if (!product) {
            return res.status(404).json({
                success: false,
                message: 'Product not found'
            });
        }

        // Update fields if they exist in request body
        if (name) product.name = name;
        if (description !== undefined) product.description = description;
        if (type) {
            // Validate product type
            const validTypes = ['Jumpsuit', 'Robe', 'Jupe'];
            if (!validTypes.includes(type)) {
                return res.status(400).json({
                    success: false,
                    message: 'Invalid product type'
                });
            }
            product.type = type;
        }
        if (price !== undefined) {
            // Validate price
            if (price < 0) {
                return res.status(400).json({
                    success: false,
                    message: 'Price cannot be negative'
                });
            }
            product.price = price;
        }
        if (variants) {
            // Validate variants
            for (const variant of variants) {
                if (!variant.size || !variant.color || variant.quantity < 0) {
                    return res.status(400).json({
                        success: false,
                        message: 'Invalid variant data'
                    });
                }
            }
            await product.updateVariants(variants);
        }
        if (links) {
            product.links = links;
        }
        if (isNew !== undefined) {
            product.isNew = isNew;
        }
        if (soldPrice !== undefined) {
            if (soldPrice < 0) {
                return res.status(400).json({
                    success: false,
                    message: 'Sold price cannot be negative'
                });
            }
            product.soldPrice = soldPrice;
        }
        
        await product.save();

        res.status(200).json({
            success: true,
            data: product
        });
    } catch (error) {
        res.status(500).json({
            success: false, 
            message: 'Server Error',
            error: error.message
        });
    }
}

const getProducts = async (req, res) => {
    try {
        const products = await Product.find();
        res.status(200).json({ success: true, data: products });
    } catch (error) {
        res.status(500).json({
            success: false,
            message: 'Server Error',
            error: error.message
        });
    }
}

const getRopeProducts = async (req, res) => {
    try {
        const products = await Product.find({ type: 'Robe' });
        res.status(200).json({ success: true, data: products });
    } catch (error) {
        res.status(500).json({ success: false, message: 'Server Error', error: error.message });
    }
}

const getJumpsuitProducts = async (req, res) => {
    try {
        const products = await Product.find({ type: 'Jumpsuit' });
        res.status(200).json({ success: true, data: products });
    } catch (error) {
        res.status(500).json({ success: false, message: 'Server Error', error: error.message });
    }
}

const getJupeProducts = async (req, res) => {
    try {
        const products = await Product.find({ type: 'Jupe' });
        res.status(200).json({ success: true, data: products });
    } catch (error) {
        res.status(500).json({ success: false, message: 'Server Error', error: error.message });
    }
}

const setProductNew = async (req, res) => {
    try {
        const { id } = req.params;
        const { isNew } = req.body;

        const product = await Product.findById(id);
        
        if (!product) {
            return res.status(404).json({
                success: false,
                message: 'Product not found'
            });
        }

        product.isNew = isNew;
        await product.save();

        res.status(200).json({
            success: true,
            data: product
        });
    } catch (error) {
        res.status(500).json({
            success: false,
            message: 'Server Error',
            error: error.message
        });
    }
}

// @desc    Get all products marked as new
// @route   GET /api/products/new
// @access  Public
const getNewProducts = async (req, res) => {
    try {
        const products = await Product.find({ isNew: true });
        res.status(200).json({
            success: true,
            data: products
        });
    } catch (error) {
        res.status(500).json({
            success: false,
            message: 'Server Error',
            error: error.message
        });
    }
};

// @desc    Get all products with discounted prices
// @route   GET /api/products/sale
// @access  Public 
const getSaleProducts = async (req, res) => {
    try {
        const products = await Product.find({
            $and: [
                { soldPrice: { $gt: 0 } },
                { $expr: { $lt: ["$soldPrice", "$price"] } }
            ]
        });
        res.status(200).json({
            success: true,
            data: products
        });
    } catch (error) {
        res.status(500).json({
            success: false,
            message: 'Server Error',
            error: error.message
        });
    }
};


// @desc    Get a single product by ID
// @route   GET /api/products/admin/:id
// @access  Private/Admin
const getProduct = async (req, res) => {
    try {
        const product = await Product.findById(req.params.id);
        
        if (!product) {
            return res.status(404).json({
                success: false,
                message: 'Product not found'
            });
        }

        res.status(200).json({
            success: true,
            data: product
        });
    } catch (error) {
        res.status(500).json({
            success: false,
            message: 'Server Error',
            error: error.message
        });
    }
};



module.exports = {
    createProduct,
    deleteProduct,
    updateProduct,
    getProducts,
    setProductNew,
    getProduct,
    getNewProducts,
    getSaleProducts,
    getRopeProducts,
    getJumpsuitProducts,
    getJupeProducts
};