const jwt = require('jsonwebtoken');
const bcrypt = require('bcrypt');
const User = require('../models/User');

const dotenv = require('dotenv')
dotenv.config();
const key = process.env.JWT_SECRET;

exports.signup = async (req, res) => {
    const { 
        name, email, password, customerName, contactDetails, mobileNo, landlineNo, gstDetails, 
        location, houseNo, street, landmark, city, country, postalCode 
    } = req.body;

    // Validate required fields for user and address
    if (!name || !email || !password || !customerName || !contactDetails || !mobileNo || !location || !houseNo || !street || !city || !country || !postalCode) {
        return res.status(400).json({ message: 'Please fill in all required fields.' });
    }

    try {
        // Hash the password
        const hashedPassword = await bcrypt.hash(password, 10);

        // Create the new user object
        const user = new User({ 
            name, 
            email, 
            password: hashedPassword, 
            addresses: [{
                customerName,
                contactDetails,
                mobileNo,
                landlineNo,
                gstDetails,
                location,
                houseNo,
                street,
                landmark,
                city,
                country,
                postalCode
            }]
        });

        // Save the user to the database
        await user.save();

        // Generate a JWT token
        const token = jwt.sign({ userId: user._id }, key , { expiresIn: '7d' });

        // Send response with token and message
        res.status(201).json({ token, message: 'User registered and address added successfully.' });
    } catch (err) {
        console.error('Error signing up and adding address:', err);
        res.status(500).json({ error: 'Error signing up and adding address' });
    }
};

// exports.signup = async (req, res) => {
//     const { name, email, password } = req.body;
//     try {
//         const hashedPassword = await bcrypt.hash(password, 10);
//         const user = new User({ name, email, password: hashedPassword });
//         await user.save();

//         // Generate JWT token after successful signup
//         const token = jwt.sign({ userId: user._id }, 'your_jwt_secret_key', { expiresIn: '7d' });

//         res.status(201).json({ token, message: 'User registered successfully' });
//     } catch (err) {
//         res.status(500).json({ error: 'Error signing up' });
//     }
// };
exports.login = async (req, res) => {
    const { email, password } = req.body;
    try {
        const user = await User.findOne({ email });
        if (!user) return res.status(401).json({ message: 'Invalid email or password' });

        const isMatch = await bcrypt.compare(password, user.password);
        if (!isMatch) return res.status(401).json({ message: 'Invalid email or password' });

        const token = jwt.sign({ userId: user._id }, key , { expiresIn: '1y' });
        res.status(200).json({ token, message: 'Login successful' });
    } catch (err) {
        res.status(500).json({ error: 'Error logging in' });
    }
};


exports.getUserDetails = async (req, res) => {
    try {
        // Get the token from the Authorization header
        const token = req.headers.authorization?.split(' ')[1]; // Assumes format: Bearer <token>

        if (!token) {
            return res.status(401).json({ message: 'No token provided.' });
        }

        // Verify the token and extract user ID
        const decoded = jwt.verify(token,key);
        const userId = decoded.userId;

        // Find user by user ID
        const user = await User.findById(userId);

        if (!user) {
            return res.status(404).json({ message: 'User not found.' });
        }

        // Return user details without password
        const { password, ...userDetails } = user.toObject(); // Exclude the password field

        res.status(200).json({ userDetails });
    } catch (error) {
        if (error.name === 'TokenExpiredError') {
            return res.status(401).json({ message: 'Token has expired. Please log in again.' });
        } else {
            console.error('Error fetching user details:', error);
            res.status(500).json({ message: 'Server error. Please try again later.' });
        }
    }
};
// exports.addAddress = async (req, res) => {
//     const { 
//         customerName, contactDetails, mobileNo, landlineNo, gstDetails, 
//         location, email, houseNo, street, landmark, city, country, postalCode 
//     } = req.body;

//     // Validate required fields
//     if (!customerName || !contactDetails || !mobileNo || !location || !email || !houseNo || !street || !city || !country || !postalCode) {
//         return res.status(400).json({ message: 'Please fill in all required fields.' });
//     }

//     try {
//         // Find user by email
//         let user = await User.findOne({ email });
        
//         if (!user) {
//             return res.status(404).json({ message: 'User not found.' });
//         }

//         // Create the new address object
//         const newAddress = {
//             customerName,
//             contactDetails,
//             mobileNo,
//             landlineNo,
//             gstDetails,
//             location,
//             houseNo,
//             street,
//             landmark,
//             city,
//             country,
//             postalCode,
//             email
//         };

//         // Add the address to the user's addresses array
//         user.addresses.push(newAddress);

//         // Save the user document
//         await user.save();

//         res.status(200).json({ message: 'Address registered successfully', user });
//     } catch (error) {
//         console.error('Error saving address:', error);
//         res.status(500).json({ message: 'Server error. Please try again later.' });
//     }
// };

// exports.addAddress = async (req, res) => {
//     const { 
//         customerName, contactDetails, mobileNo, landlineNo, gstDetails, 
//         location, houseNo, street, landmark, city, country, postalCode 
//     } = req.body;

//     // Validate required fields
//     if (!customerName || !contactDetails || !mobileNo || !location || !houseNo || !street || !city || !country || !postalCode) {
//         return res.status(400).json({ message: 'Please fill in all required fields.' });
//     }

//     try {
//         // Get the token from the Authorization header
//         const token = req.headers.authorization?.split(' ')[1]; // Assumes format: Bearer <token>
        
//         if (!token) {
//             return res.status(401).json({ message: 'No token provided.' });
//         }

//         // Verify the token and extract user ID
//         const decoded = jwt.verify(token, 'your_jwt_secret_key'); // Replace with your secret key
//         const userId = decoded.userId; // Assuming the token contains userId

//         // Find user by user ID
//         let user = await User.findById(userId);
        
//         if (!user) {
//             return res.status(404).json({ message: 'User not found.' });
//         }

//         // Create the new address object
//         const newAddress = {
//             customerName,
//             contactDetails,
//             mobileNo,
//             landlineNo,
//             gstDetails,
//             location,
//             houseNo,
//             street,
//             landmark,
//             city,
//             country,
//             postalCode,
//         };

//         // Add the address to the user's addresses array
//         user.addresses.push(newAddress);

//         // Save the user document
//         await user.save();

//         res.status(200).json({ message: 'Address registered successfully', user });
//     } catch (error) {
//         if (error.name === 'TokenExpiredError') {
//             // Handle token expiration
//             console.log(error);
//             res.status(401).json({ message: 'Token has expired. Please log in again.' });
//         } else {
//             console.error('Error saving address:', error);
//             res.status(500).json({ message: 'Server error. Please try again later.' });
//         }
//     }
// };
