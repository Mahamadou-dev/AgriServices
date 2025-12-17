const mongoose = require('mongoose');

const farmSchema = new mongoose.Schema({
    name: {
        type: String,
        required: true
    },
    size: {
        type: Number,
        required: true
    },
    unit: {
        type: String,
        default: 'hectares'
    },
    location: {
        latitude: Number,
        longitude: Number
    },
    crops: [String]
});

const farmerSchema = new mongoose.Schema({
    userId: {
        type: String,
        required: true
    },
    firstName: {
        type: String,
        required: true
    },
    lastName: {
        type: String,
        required: true
    },
    phone: {
        type: String,
        required: true
    },
    address: {
        street: String,
        city: String,
        region: String,
        country: String
    },
    farms: [farmSchema]
}, {
    timestamps: true
});

module.exports = mongoose.model('Farmer', farmerSchema);
