const mongoose = require('mongoose');
const Schema = mongoose.Schema;

// Address Schema from the old model
const addressSchema = new Schema({
    customerName: { type: String, required: true },   // Customer Name
    contactDetails: { type: String, required: true }, // Contact Details
    mobileNo: { type: String, required: true },       // Mobile Number
    landlineNo: { type: String, required: false },    // Landline Number (optional)
    gstDetails: { type: String, required: false },    // GST Details (optional)
    location: { type: String, required: true },       // Location (can be city/region)
  //  email: { type: String, required: true },          // Email Address
    houseNo: { type: String, required: true },        // House Number
    street: { type: String, required: true },         // Street Name
    landmark: { type: String, required: false },      // Landmark (optional)
    city: { type: String, required: true },           // City
    country: { type: String, required: true },        // Country
    postalCode: { type: String, required: true },     // Postal/ZIP Code
});

// Create User schema
const userSchema = new Schema({
    name: {
        type: String,
        required: true
    },
    email: {
        type: String,
        required: true,
        unique: true
    },
    password: {
        type: String,
        required: true
    },
    orders: {
        type: Array,
        default: []
    },
    addresses: [addressSchema], // Using the previous address schema
    cart: [{
        product_id: {
            type: mongoose.Schema.Types.ObjectId,
            ref: 'Product',
            required: true
        },
        quantity: {
            type: Number,
            required: true,
            default: 0
        },
        Ah_Rating_Selected: {
            type: Number,
            required: true,
            default: 0
        },
        Voltage_Rating_Selected: {
            type: Number,
            required: true,
            default: 0
        },
        Kw_Rating: {
            type: Number,
            required: true,
            default: 0
        },
        Price: {
            type: Number,
            required: true,
            default: 0
        }
    }],
    createdAt: {
        type: Date,
        default: Date.now
    },
    updatedAt: {
        type: Date,
        default: Date.now
    }
});

// Pre-save middleware to update the updatedAt field
userSchema.pre('save', function (next) {
    this.updatedAt = Date.now();
    next();
});

// Export the User model
module.exports = mongoose.model('User', userSchema);
