const express = require("express");
const router = express.Router();

const lessonController = require("../controllers/lessonController");
const { checkJwt } = require("../middlewares/authMiddleware");
// All lesson routes are assumed to be protected by auth middleware

// Get a single lesson (with content)
router.get(
  "/lessons/:lessonId",
  lessonController.getLessonById
);

// Generate AI content for a lesson
router.post(
  "/lessons/:lessonId/generate",
  checkJwt, 
  lessonController.generateLesson
);

// Regenerate AI content for a lesson
router.post(
  "/lessons/:lessonId/regenerate",
  checkJwt,
  lessonController.regenerateLesson
);

router.get(
  "/lessons/:lessonId/generate-audio",
  checkJwt,
  lessonController.getLessonAudio
);


module.exports = router;
