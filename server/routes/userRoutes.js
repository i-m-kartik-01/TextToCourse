const express = require('express');
const router = express.Router();
const userController = require('../controllers/userController');
const checkJwt  = require('../middlewares/authMiddleware');

// This route syncs Auth0 data with MongoDB
router.post('/sync', checkJwt, userController.syncUser);

// This route gets the user's local profile and courses
router.get('/profile', checkJwt, userController.getUserProfile);

module.exports = router;