// const mongoose = require('mongoose');

// const productSchema = new mongoose.Schema({
//     productId: {
//         type: String,
//         required: true,
//         unique: true
//     },
//     productName: {
//         type: String,
//         required: true
//     },
//     voltageRatings: [
//         {
//             type: String,
//             required: true
//         }
//     ],
//     ahRatings: [
//         {
//             type: String,
//             required: true
//         }
//     ],
//     productCategory: {
//         type: String,
//         required: true
//     },
//     // Add timestamps to track creation and update times
// }, { timestamps: true });

// const Product = mongoose.model('Product', productSchema);

// module.exports = Product;
const mongoose = require('mongoose');

const productSchema = new mongoose.Schema({
    productId: {
        type: String,
        required: true,
        unique: true
    },
    productName: {
        type: String,
        required: true
    },
    voltageRatings: [
        {
            type: String,
            required: true
        }
    ],
    ahRatings: [
        {
            type: String,
            required: true
        }
    ],
    productCategory: {
        type: String,
        required: true
    },
    subprodlst: [
        {
            modalNo: {
                type: String,
                required: true
            },
            M_voltageRating: {
                type: Number,
                required: true,
                set: v => parseFloat(v) // Ensures the value is stored as a float
            },
            M_AhRating: {
                type: Number,
                required: true,
                set: v => parseFloat(v) // Ensures the value is stored as a float
            }
        }
    ],
    image: {
        type: [String], // Defines image as an array of strings
        default: [], // Default value is an empty array
        validate: {
            validator: function (images) {
                return images.every(img => typeof img === 'string'); // Ensures all elements are strings
            },
            message: 'Each image should be a valid string (URL or Base64).'
        }
    }

});

const Product = mongoose.model('Product', productSchema);

module.exports = Product;
