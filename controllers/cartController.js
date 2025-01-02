
const User = require('../models/User');
const Product = require('../models/Products');
const mongoose = require('mongoose');//const ProductPrice = require('../models/ProductPrice');

exports.viewCart = async (req, res) => {
    try {
        const user = await User.findById(req.user.userId);
        console.log(req.user.userId);
        if (!user || !user.cart) return res.status(404).json({ message: 'Cart is empty or user not found' });
        res.json({ cart: user.cart });
    } catch (err) {
        res.status(500).json({ error: 'Server error' });
    }
};

// exports.updateCart = async (req, res) => {
//     try {
//         const { product_id, quantity, Ah_Rating_Selected, Voltage_Rating_Selected } = req.body;

//         // Ensure product_id is provided
//         if (!product_id) return res.status(400).json({ message: 'Product ID is required' });

//         const Kw_Rating = (Ah_Rating_Selected * Voltage_Rating_Selected * quantity) / 1000;

//         // Find the product using the product_id string directly
//         const product = await Product.findById(product_id);
//         if (!product) return res.status(404).json({ message: 'Product not found' });

//         // Find the user and their cart
//         const user = await User.findById(req.user.userId);
//         const cartItemIndex = user.cart.findIndex(item => item.product_id.equals(product_id));

//         // Calculate the product price
//         const productPrice = await calculateProductPrice(Kw_Rating, product_id);

//         if (cartItemIndex > -1) {
//             // Update existing cart item
//             user.cart[cartItemIndex] = {
//                 ...user.cart[cartItemIndex],
//                 product_id,
//                 quantity,
//                 Ah_Rating_Selected,
//                 Voltage_Rating_Selected,
//                 Kw_Rating,
//                 Price: productPrice
//             };
//         } else {
//             // Add new cart item
//             user.cart.push({
//                 product_id,
//                 quantity,
//                 Ah_Rating_Selected,
//                 Voltage_Rating_Selected,
//                 Kw_Rating,
//                 Price: productPrice
//             });
//         }

//         // Check if cart exceeds the limit
//         if (user.cart.length > 100) return res.status(400).json({ message: 'Cart limit exceeded. Please place an order.' });

//         // Save the updated user document
//         await user.save();

//         res.json({ message: 'Item added to cart successfully' });
//     } catch (err) {
//         res.status(500).json({ message: 'Internal server error' });
//         console.log(err);
//     }
// };
exports.updateCart = async (req, res) => {
    try {
        const { product_id, quantity, Ah_Rating_Selected, Voltage_Rating_Selected } = req.body;

        console.log("Product ID:", product_id);
        console.log("User ID:", req.user.userId);

        // Ensure product_id is provided
        if (!product_id) return res.status(400).json({ message: 'Product ID is required' });

        const Kw_Rating = (Ah_Rating_Selected * Voltage_Rating_Selected * quantity) / 1000;

        // Find the product using the product_id string directly
        const product = await Product.findById(product_id);
        if (!product) {
            console.log("Product not found");
            return res.status(404).json({ message: 'Product not found' });
        }

        // Find the user and their cart
        const user = await User.findById(req.user.userId);
        if (!user) {
            console.log("User not found");
            return res.status(404).json({ message: 'User not found' });
        }

        const cartItemIndex = user.cart.findIndex(item => item.product_id.equals(product_id));

        // Calculate the product price
        const productPrice = await calculateProductPrice(Kw_Rating, product_id);

        if (cartItemIndex > -1) {
            // Update existing cart item
            user.cart[cartItemIndex] = {
                ...user.cart[cartItemIndex],
                product_id,
                quantity,
                Ah_Rating_Selected,
                Voltage_Rating_Selected,
                Kw_Rating,
                Price: productPrice
            };
        } else {
            // Add new cart item
            user.cart.push({
                product_id,
                quantity,
                Ah_Rating_Selected,
                Voltage_Rating_Selected,
                Kw_Rating,
                Price: productPrice
            });
        }

        // Check if cart exceeds the limit
        if (user.cart.length > 100) return res.status(400).json({ message: 'Cart limit exceeded. Please place an order.' });

        // Save the updated user document
        await user.save();

        res.json({ message: 'Item added to cart successfully' });
    } catch (err) {
        console.log(err);
        res.status(500).json({ message: 'Internal server error', err });
    }
};

// Function to delete an item from the user's cart
exports.deleteFromCart = async (req, res) => {
    try {
        // Ensure product_id is provided
        const { product_id } = req.body;
        if (!product_id) return res.status(400).json({ message: 'Product ID is required' });

        // Find the user and their cart
        const user = await User.findById(req.user.userId);
        if (!user || !user.cart) return res.status(404).json({ message: 'User not found or cart is empty' });

        // Find the index of the cart item
        const cartItemIndex = user.cart.findIndex(item => item.product_id.equals(product_id));

        if (cartItemIndex === -1) {
            return res.status(404).json({ message: 'Product not found in cart' });
        }

        // Remove the item from the cart
        user.cart.splice(cartItemIndex, 1);

        // Save the updated user document
        await user.save();

        res.json({ message: 'Item removed from cart successfully' });
    } catch (err) {
        res.status(500).json({ message: 'Internal server error' });
        console.log(err);
    }
};


async function calculateProductPrice(Kw_Rating, product_id) {
    // Map of product IDs to their corresponding price per watt
    const priceMap = {
        '66dddbc27c951159e8776838': 18,
        '66dddde47c951159e877683c': 11,
        '66ddde357c951159e8776840': 12,
        '66ddde707c951159e8776842': 12,
        '66dddf087c951159e8776844': 14,
        '66dde0ea7c951159e8776846': 12,
        '673f67e26c97259b8183306a':12,
    };

    // Get the price per watt for the given product ID
    const pricePerKw = priceMap[product_id];

    // Calculate and return the total price based on the Kw_Rating
    return Kw_Rating * 1000 * pricePerKw;
}
