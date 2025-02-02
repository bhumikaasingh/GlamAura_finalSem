const express = require('express');
const csrf = require('csurf');
const { createUser, loginUser, profileUser, updateUser, getAllUser, deleteUser } = require('../controllers/userControllers');

const router = express.Router();

// Apply CSRF Protection
const csrfProtection = csrf({ cookie: true });

router.post('/register', csrfProtection, createUser);
router.post('/login', csrfProtection, loginUser);
router.get('/profile/:id', profileUser);
router.patch('/update/:id', csrfProtection, updateUser);
router.get('/all', getAllUser);
router.delete('/delete/:id', csrfProtection, deleteUser);

module.exports = router;
