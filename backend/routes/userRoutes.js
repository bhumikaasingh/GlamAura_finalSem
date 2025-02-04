const express = require("express")
const router = express.Router()
const userController = require("../controllers/userController")
const { authenticate } = require("../middleware/auth")
const csrfProtection = require("../middleware/csrfProtection")

router.get("/profile", authenticate, userController.getUserProfile)
router.put("/profile", authenticate, userController.updateUserProfile)
router.get("/profile/:id", authenticate, userController.getProfileById)
router.put("/update-profile/:id", authenticate, userController.updateUserById)
router.get("/get_all_users", authenticate, userController.getAllUsers)
router.delete("/delete_user/:id", authenticate, userController.deleteUser)

module.exports = router

