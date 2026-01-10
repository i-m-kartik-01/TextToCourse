const express = require("express");
const router = express.Router();

const courseController = require("../controllers/courseController");
const quizController = require("../controllers/quizController");
const checkJwt  = require("../middlewares/authMiddleware");

// All routes here are assumed to be protected by auth middleware
// e.g. app.use("/api", authMiddleware);

// Create course using AI
router.post(
  "/courses/generate",
  checkJwt,
  courseController.generateCourse
);

// Get all courses for logged-in user
router.get(
  "/courses",
  checkJwt,
  courseController.getMyCourses
);

// Get course with modules and lessons
router.get(
  "/courses/:courseId",
  courseController.getCourseById
);

// Delete a course
router.delete(
  "/courses/:courseId",
  checkJwt,
  courseController.deleteCourse
);

// Generate final quiz for course
router.post(
  "/courses/:courseId/quiz/generate",
  checkJwt,
  quizController.generateQuiz
);

// Get quiz (without answers)
router.get(
  "/courses/:courseId/quiz",
  quizController.getQuizByCourse
);

// Submit quiz
router.post(
  "/courses/:courseId/quiz/submit",
  checkJwt,
  quizController.submitQuiz
);

// Review quiz with correct answers
router.get(
  "/courses/:courseId/quiz/review",
  quizController.reviewQuiz
);

module.exports = router;
