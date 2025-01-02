const Product = require('../models/Products');

exports.getAllProducts = async (req, res) => {
    try {
        const products = await Product.find({});
        const ess = products.filter(p => p.productCategory === 'ESS').map(p => ({ productName: p.productName, _id: p._id ,productId:p.productId}));
        const ev = products.filter(p => p.productCategory === 'EV').map(p => ({ productName: p.productName, _id: p._id,productId:p.productId }));
        res.json({ products });
    } catch (error) {
        res.status(500).json({ error: 'Error fetching products' });
    }
};

exports.getProductById = async (req, res) => {
    try {
        const product = await Product.findById(req.params.id);
        if (!product) return res.status(404).json({ message: 'Product not found' });
        res.json({ product });
    } catch (err) {
        res.status(500).json({ message: 'Error fetching product details' });
    }
};
