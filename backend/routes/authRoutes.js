const express = require("express")
const router = express.Router()
const authController = require("../controllers/authController")
const bruteForceProtection = require("../middleware/bruteForceProtection")
const csrfProtection = require("../middleware/csrfProtection")

router.post("/register", authController.register)
router.post("/login", bruteForceProtection, authController.login)
router.post("/check-password-strength",  authController.checkPasswordStrength)

module.exports = router

