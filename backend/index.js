const express = require('express');
const dotenv = require('dotenv');
const connectDB = require('./database/database');
const cors = require('cors');
const fileUpload = require('express-fileupload');
const helmet = require('helmet');
const xssClean = require('xss-clean');
const mongoSanitize = require('express-mongo-sanitize');
const cookieParser = require('cookie-parser');
const csrf = require('csurf');

const app = express();

// Security Middleware
app.use(helmet()); // Secure HTTP headers
app.use(xssClean()); // Prevent XSS
app.use(mongoSanitize()); // Prevent NoSQL Injection

// JSON & URL encoding
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// File upload config
app.use(fileUpload({
    createParentPath: true
}));

// Use Cookie Parser for CSRF token storage
app.use(cookieParser());

// CSRF Protection Middleware
const csrfProtection = csrf({ cookie: true });
app.use(csrfProtection);

// CORS config
const corsOptions = {
    origin: true,
    credentials: true,
    optionSuccessStatus: 200
};
app.use(cors(corsOptions));

dotenv.config();
connectDB();

// Define routes
app.use('/api/user', require('./routes/userRoutes'));
app.use('/api/products', require('./routes/productRoutes'));
app.use('/api/carts', require('./routes/cartRoutes'));
app.use('/api/categories', require('./routes/categoryRoutes'));
app.use('/api/reviews', require('./routes/reviewRoutes'));
app.use('/api/orders', require('./routes/orderRoutes'));

// Endpoint to get CSRF token
app.get('/csrf-token', (req, res) => {
    res.json({ csrfToken: req.csrfToken() });
});

const PORT = 5500;
app.listen(PORT, () => {
    console.log(`Server-app is running on port ${PORT}`);
});
