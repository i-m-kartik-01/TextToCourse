const courseService = require("../services/courseService");

/**
 * Generate a new course using AI
 * POST /api/courses/generate
 */
exports.generateCourse = async (req, res) => {
  try {
    const { topic } = req.body;

    if (!topic || topic.trim().length < 3) {
      return res.status(400).json({
        message: "Topic is required and must be at least 3 characters",
      });
    }
    const userId = req.auth?.payload?.sub || "dev-user"; // Fallback for testing
    const course = await courseService.generateCourse(
      topic,
      userId // Auth0 user id
    );

    return res.status(201).json(course);
  } catch (error) {
    console.error("Generate course error:", error);
    return res.status(500).json({
      message: "Failed to generate course",
      error: error.message,
    });
  }
};

/**
 * Get all courses created by the logged-in user
 * GET /api/courses
 */
exports.getMyCourses = async (req, res) => {
  try {
    const courses = await courseService.getCoursesByUser(req.auth.payload.sub);
    return res.json(courses);
  } catch (error) {
    console.error("Get courses error:", error);
    return res.status(500).json({
      message: "Failed to fetch courses",
    });
  }
};

/**
 * Get a single course with its modules
 * GET /api/courses/:courseId
 */
exports.getCourseById = async (req, res) => {
  try {
    const { courseId } = req.params;

    const course = await courseService.getCourseDetails(
      courseId,
    );

    return res.json(course);
  } catch (error) {
    console.error("Get course error:", error);
    return res.status(404).json({
      message: error.message || "Course not found",
    });
  }
};

/**
 * Delete a course (and related modules & lessons)
 * DELETE /api/courses/:courseId
 */
exports.deleteCourse = async (req, res) => {
  try {
    const { courseId } = req.params;

    await courseService.deleteCourse(courseId, req.auth.payload.sub);

    return res.json({
      message: "Course deleted successfully",
    });
  } catch (error) {
    console.error("Delete course error:", error);
    return res.status(403).json({
      message: error.message || "Not authorized",
    });
  }
};
