const User = require("../models/userModel")
const { createSession } = require("../utils/sessionManager")
const validatePassword = require("../middleware/passwordValidation")
const zxcvbn = require("zxcvbn")

exports.register = async (req, res) => {
  try {
    const { email, password, firstName, lastName } = req.body

    if (!validatePassword(password)) {
      return res.status(400).json({ message: "Password does not meet complexity requirements" })
    }

    const user = new User({ email, password, firstName, lastName })
    await user.save()

    const token = createSession(user)
    res.status(201).json({ token })
  } catch (error) {
    res.status(500).json({ message: "Error registering user", error: error.message })
  }
}

exports.login = async (req, res) => {
  try {
    const { email, password } = req.body
    const user = await User.findOne({ email })

    if (!user || !(await user.comparePassword(password))) {
      await user.incrementLoginAttempts()
      return res.status(401).json({ message: "Invalid credentials" })
    }

    // Reset login attempts on successful login
    user.loginAttempts = 0
    user.lockUntil = null
    user.lastLogin = new Date()
    await user.save()

    const token = createSession(user)
    res.json({ token })
  } catch (error) {
    res.status(500).json({ message: "Error logging in", error: error.message })
  }
}

exports.checkPasswordStrength = (req, res) => {
    try {
      const { password } = req.body
      if (!password) {
        return res.status(400).json({ message: "Password is required" })
      }
      const result = zxcvbn(password)
      res.json({ score: result.score, feedback: result.feedback })
    } catch (error) {
      console.error("Error checking password strength:", error)
      res.status(500).json({ message: "Error checking password strength", error: error.message })
    }
  }
