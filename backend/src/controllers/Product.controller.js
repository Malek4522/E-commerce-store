const Product = require('../models/Product');

// @desc    Create a new product
// @route   POST /api/products
// @access  Private/Admin
const createProduct = async (req, res) => {
    try {
        const { name, description, type, price, variants, links } = req.body;

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
            links: links || []
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
        const { name, description, type, price, variants, links } = req.body;
        
        const product = await Product.findById(id);

        if (!product) {
            return res.status(404).json({
                success: false,
                message: 'Product not found'
            });
        }

        // Update fields if they exist in request body
        if (name) product.name = name;
        if (description) product.description = description;
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

module.exports = {
    createProduct,
    deleteProduct,
    updateProduct,
    getProducts,
    setProductNew
};
