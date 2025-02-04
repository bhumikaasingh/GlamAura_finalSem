const User = require("../models/userModel")

const bruteForceProtection = async (req, res, next) => {
  const user = await User.findOne({ email: req.body.email })
  if (!user) {
    return next()
  }

  if (user.isLocked) {
    return res.status(423).json({ message: "Account is locked. Please try again later." })
  }

  next()
}

module.exports = bruteForceProtection

