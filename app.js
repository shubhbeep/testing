const express = require('express');
const mongoose = require('mongoose');
const bodyParser = require('body-parser');
const productRoutes = require('./routes/productRoutes');
const userRoutes = require('./routes/userRoutes');
const cartRoutes = require('./routes/cartRoutes');
const dotenv = require('dotenv')
dotenv.config();
const app = express();
const PORT = process.env.PORT || 5001;
const mongoURL = process.env.MONGO_URI;
console.log(typeof(mongoURL),mongoURL)
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: true }));

mongoose.connect(mongoURL, {
    useNewUrlParser: true,
    useUnifiedTopology: true
}).then(() => console.log('Connected to MongoDB')).catch(err => console.error('Connection error', err));

app.use('/products', productRoutes);
app.use('/users', userRoutes);
app.use('/cart', cartRoutes);

app.listen(PORT, () => {
    console.log(`Server running on port ${PORT}`);
});
