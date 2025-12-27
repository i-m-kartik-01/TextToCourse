const Module = require("../models/moduleModel");
const Lesson = require("../models/lessonModel");
const Course = require("../models/courseModel");

/**
 * Get all modules for a course (ordered)
 */
async function getModulesByCourse(courseId, userId) {
  // Fetch course
  const course = await Course.findById(courseId);
  if (!course) {
    throw new Error("Course not found");
  }

  // Ownership check
  if (course.createdBy !== userId) {
    throw new Error("Unauthorized access");
  }

  // Fetch modules in order
  const modules = await Module.find({ courseId })
    .sort({ order: 1 })
    .lean();

  return modules;
}

/**
 * Get a single module with its lessons
 */
async function getModuleById(moduleId, userId) {
  // Fetch module
  const module = await Module.findById(moduleId).lean();
  if (!module) {
    throw new Error("Module not found");
  }

  // Fetch course (ownership check)
  const course = await Course.findById(module.courseId);
  if (!course) {
    throw new Error("Course not found");
  }

  if (course.createdBy !== userId) {
    throw new Error("Unauthorized access");
  }

  // Fetch lessons for module
  const lessons = await Lesson.find({ moduleId: module._id })
    .sort({ orderNo: 1 })
    .lean();

  return {
    ...module,
    lessons,
  };
}

module.exports = {
  getModulesByCourse,
  getModuleById,
};
