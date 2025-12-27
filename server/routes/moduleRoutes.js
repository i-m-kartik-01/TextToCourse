const express = require("express");
const router = express.Router();

const moduleController = require("../controllers/moduleController");

// All module routes are assumed to be protected by auth middleware

// Get all modules for a course
router.get(
  "/courses/:courseId/modules",
  moduleController.getModulesByCourse
);

// Get a single module with its lessons
router.get(
  "/modules/:moduleId",
  moduleController.getModuleById
);

module.exports = router;
