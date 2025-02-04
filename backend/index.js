const express = require("express")
const mongoose = require("mongoose")
const helmet = require("helmet")
const rateLimit = require("express-rate-limit")
const cors = require("cors")
const csrf = require("csurf")
const cookieParser = require("cookie-parser")
const dotenv = require("dotenv")
const { authenticate } = require('./middleware/auth');
const app = express()
const fileUpload = require('express-fileupload');

// Security headers
app.use(helmet())

// CORS configuration
const corsOptions = {
  origin: process.env.FRONTEND_URL || "http://localhost:3000",
  credentials: true,
  optionsSuccessStatus: 200,
}
app.use(cors(corsOptions))

app.use(fileUpload({
  createParentPath: true
}));

// Body parsing
app.use(express.json())
app.use(cookieParser())

// Rate limiting
const limiter = rateLimit({
  windowMs: 15 * 60 * 1000, // 15 minutes
  max: 100, // limit each IP to 100 requests per windowMs
})
app.use(limiter)


// Routes
app.use('/api/auth', require('./routes/authRoutes'));
app.use('/api/user', authenticate, require('./routes/userRoutes'));
app.use('/api/products', require('./routes/productRoutes'));
app.use('/api/categories', require('./routes/categoryRoutes'));
app.use('/api/reviews', require('./routes/reviewRoutes'));
app.use('/api/cart', authenticate, require('./routes/cartRoutes'));
app.use('/api/orders', authenticate, require('./routes/orderRoutes'));

// Error handler for CSRF token errors
app.use((err, req, res, next) => {
  if (err.code === "EBADCSRFTOKEN") {
    return res.status(403).json({ message: "Invalid CSRF token" })
  }
  next(err)
})

dotenv.config()

// Check for required environment variables
if (!process.env.JWT_SECRET || !process.env.MONGODB_CLOUDURL) {
  console.error("FATAL ERROR: JWT_SECRET or MONGODB_CLOUDURL is not defined.")
  process.exit(1)
}

// Connect to MongoDB
mongoose
  .connect(process.env.MONGODB_CLOUDURL)
  .then(() => console.log("Connected to MongoDB"))
  .catch((err) => console.error("Could not connect to MongoDB", err))

const PORT = process.env.PORT || 3000
app.listen(PORT, () => console.log(`Server running on port ${PORT}`))

