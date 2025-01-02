const express = require('express');
const { viewCart, updateCart , deleteFromCart} = require('../controllers/cartController');
const authMiddleware = require('../middleware/authMiddleware');
const router = express.Router();

router.get('/', authMiddleware, viewCart);
router.post('/update', authMiddleware, updateCart);
router.delete('/delete', authMiddleware ,deleteFromCart);

module.exports = router;
