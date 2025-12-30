const {generateCourseOutline, generateLessonContent} = require('./ai');
const Course = require('../models/courseModel');
const Module = require('../models/moduleModel');
const Lesson = require('../models/lessonModel');
const generateCourse = async (topic, userId) => {
    if (!topic || !userId) {
        throw new Error('Topic and User ID are required to generate a course.');
    }

    // 1. Get the parsed AI object (already includes title, modules, etc.)
    const outline = await generateCourseOutline(topic);

    // 2. Use your custom static method to handle the nested saves
    // Note: Passing the whole 'outline' object which contains 'modules'
    const course = await Course.generateCourse({
        ...outline,
        createdBy: userId
    });
    // console.log('Course generated with ID:', outline.modules);
    // 3. Return the course with populated data so you can see it in Postman
    return await Course.findById(course._id); 
};

async function getCoursesByUser(userId) {
  return Course.find({ createdBy: userId })
    .sort({ createdAt: -1 })
    .lean();
}

async function getCourseDetails(courseId) {
  // Fetch course
  const course = await Course.findById(courseId);
  if (!course) {
    throw new Error("Course not found");
  }

  // Ownership check not required for public access
  // if (course.createdBy !== userId) {
  //   throw new Error("Unauthorized access");
  // }

  // Fetch modules
  const modules = await Module.find({ courseId: course._id })
    .sort({ order: 1 })
    .lean();

  // Fetch lessons per module
  const moduleIds = modules.map((m) => m._id);

  const lessons = await Lesson.find({
    moduleId: { $in: moduleIds },
  })
    .sort({ orderNo: 1 })
    .lean();

  // Attach lessons to modules
  const lessonsByModule = {};
  lessons.forEach((lesson) => {
    const key = lesson.moduleId.toString();
    if (!lessonsByModule[key]) lessonsByModule[key] = [];
    lessonsByModule[key].push(lesson);
  });

  const enrichedModules = modules.map((module) => ({
    ...module,
    lessons: lessonsByModule[module._id.toString()] || [],
  }));

  return {
    course,
    modules: enrichedModules,
  };
}

async function deleteCourse(courseId, userId) {
  // Fetch course
  const course = await Course.findById(courseId);
  if (!course) {
    throw new Error("Course not found");
  }

  // Ownership check
  if (course.createdBy !== userId) {
    throw new Error("Unauthorized access");
  }

  // Delete lessons
  const modules = await Module.find({ courseId: course._id });
  const moduleIds = modules.map((m) => m._id);

  await Lesson.deleteMany({ moduleId: { $in: moduleIds } });

  // Delete modules
  await Module.deleteMany({ courseId: course._id });

  // Delete course
  await Course.deleteOne({ _id: course._id });

  return true;
}

module.exports = {
    generateCourse,
    getCoursesByUser,
    getCourseDetails,
    deleteCourse,     
};