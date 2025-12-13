const mongoose = require('mongoose');

const SweetSchema = new mongoose.Schema({
    id: { // Keeping legacy ID for compatibility with frontend/mock data structure if needed, but MongoDB uses _id
        type: Number,
        unique: true
    },
    name: {
        type: String,
        required: true
    },
    category: {
        type: String,
        required: true
    },
    price: {
        type: Number,
        required: true
    },
    quantity: {
        type: Number,
        required: true
    },
    image: {
        type: String,
        default: ''
    }
});

module.exports = mongoose.model('Sweet', SweetSchema);
