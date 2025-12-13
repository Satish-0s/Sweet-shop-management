const mongoose = require('mongoose');

const PurchaseSchema = new mongoose.Schema({
    user_id: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'User',
        required: true
    },
    sweet_id: {
        type: Number, // Using the custom numerical ID to match Sweet model
        required: true
    },
    quantity: {
        type: Number,
        default: 1
    },
    date: {
        type: Date,
        default: Date.now
    }
});

module.exports = mongoose.model('Purchase', PurchaseSchema);
