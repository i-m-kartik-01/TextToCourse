const express = require('express');
const router = express.Router();

const youtubeController = require('../controllers/youtubeController');
const checkJwt  = require('../middlewares/authMiddleware');

// Route to get YouTube video for a lesson
router.get('/lessons/:lessonId/video', youtubeController.getLessonVideo);

module.exports = router;