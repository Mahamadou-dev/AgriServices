const mongoose = require('mongoose');

const farmerSchema = new mongoose.Schema({
    firstName: {
        type: String,
        required: [true, 'First name is required'],
        trim: true,
        minlength: [2, 'First name must be at least 2 characters long']
    },
    lastName: {
        type: String,
        required: [true, 'Last name is required'],
        trim: true,
        minlength: [2, 'Last name must be at least 2 characters long']
    },
    email: {
        type: String,
        required: [true, 'Email is required'],
        unique: true,
        trim: true,
        lowercase: true,
        // SECURITY: Using simpler, non-ReDoS-vulnerable regex
        // This regex is efficient and safe from exponential backtracking
        validate: {
            validator: function(v) {
                return /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(v);
            },
            message: props => `${props.value} is not a valid email address!`
        }
    },
    phone: {
        type: String,
        required: [true, 'Phone number is required'],
        trim: true
    },
    farmName: {
        type: String,
        required: [true, 'Farm name is required'],
        trim: true
    },
    location: {
        type: String,
        required: [true, 'Location is required'],
        trim: true
    },
    farmSize: {
        type: Number,
        required: [true, 'Farm size is required'],
        min: [0, 'Farm size must be positive']
    },
    farmSizeUnit: {
        type: String,
        enum: ['hectares', 'acres', 'square meters'],
        default: 'hectares'
    },
    crops: [{
        type: String,
        trim: true
    }],
    status: {
        type: String,
        enum: ['active', 'inactive', 'suspended'],
        default: 'active'
    },
    registrationDate: {
        type: Date,
        default: Date.now
    }
}, {
    timestamps: true
});

farmerSchema.index({ email: 1 });
farmerSchema.index({ lastName: 1, firstName: 1 });

const Farmer = mongoose.model('Farmer', farmerSchema);
module.exports = Farmer;
