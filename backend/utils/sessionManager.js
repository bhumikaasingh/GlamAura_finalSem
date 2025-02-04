const jwt = require("jsonwebtoken")

const createSession = (user) => {
  const payload = {
    id: user._id,
    email: user.email,
    role: user.role,
  }
  return jwt.sign(payload, process.env.JWT_SECRET, { expiresIn: "1h" })
}

const verifySession = (token) => {
  try {
    return jwt.verify(token, process.env.JWT_SECRET)
  } catch (error) {
    return null
  }
}

module.exports = { createSession, verifySession }

