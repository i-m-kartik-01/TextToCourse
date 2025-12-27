const moduleService = require("../services/moduleService");

/**
 * Get all modules for a course
 * GET /api/courses/:courseId/modules
 */
const getModulesByCourse = async (req, res) => {
  try {
    const { courseId } = req.params;
    const userId = req.auth.payload.sub;

    const modules = await moduleService.getModulesByCourse(
      courseId,
      userId
    );

    return res.json(modules);
  } catch (error) {
    console.error("Get modules error:", error);

    return res.status(403).json({
      message: error.message || "Failed to fetch modules",
    });
  }
};

/**
 * Get a single module with its lessons
 * GET /api/modules/:moduleId
 */
const getModuleById = async (req, res) => {
  try {
    const { moduleId } = req.params;
    const userId = req.auth.payload.sub;

    const module = await moduleService.getModuleById(
      moduleId,
      userId
    );

    return res.json(module);
  } catch (error) {
    console.error("Get module error:", error);

    return res.status(404).json({
      message: error.message || "Module not found",
    });
  }
};

module.exports = {
  getModulesByCourse,
  getModuleById,
};  