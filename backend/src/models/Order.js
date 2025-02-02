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
    state: {
        type: String,
        required: [true, 'State is required'],
        enum: [
            'Adrar', 'Chlef', 'Laghouat', 'Oum El Bouaghi', 'Batna', 'Béjaïa', 'Biskra',
            'Béchar', 'Blida', 'Bouira', 'Tamanrasset', 'Tébessa', 'Tlemcen', 'Tiaret',
            'Tizi Ouzou', 'Alger', 'Djelfa', 'Jijel', 'Sétif', 'Saïda', 'Skikda',
            'Sidi Bel Abbès', 'Annaba', 'Guelma', 'Constantine', 'Médéa', 'Mostaganem',
            'M\'Sila', 'Mascara', 'Ouargla', 'Oran', 'El Bayadh', 'Illizi', 'Bordj Bou Arréridj',
            'Boumerdès', 'El Tarf', 'Tindouf', 'Tissemsilt', 'El Oued', 'Khenchela',
            'Souk Ahras', 'Tipaza', 'Mila', 'Ain Defla', 'Naâma', 'Ain Témouchent',
            'Ghardaïa', 'Relizane', 'Timmimoun', 'Bordj Badji Mokhtar', 'Ouled Djellal',
            'Béni Abbès', 'In Salah', 'In Guezzam', 'Touggourt', 'Djanet', 'M\'Ghair',
            'El Menia'
        ],
        trim: true
    },
    region: {
        type: String,
        required: [true, 'Region is required'], 
        trim: true
    },
    
    status: {
        type: String,
        required: [true, 'Status is required'],
        enum: ['waiting', 'delivering', 'delivered', 'canceled'],
        default: 'waiting'
    }
    ,
    delivery: {
        type: String,
        required: [true, 'Delivery type is required'],
        enum: ['home', 'center'],
        default: 'home'
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
