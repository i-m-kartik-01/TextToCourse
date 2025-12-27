const Lesson = require("../models/lessonModel");
const Module = require("../models/moduleModel");
const Course = require("../models/courseModel");
const { generateLessonContent } = require("./ai");

/**
 * Generate AI content for a single lesson and save it
 */
// async function generateLessonForCourse({
//   lessonId,
//   userId,
// }) {
//   const lesson = await Lesson.findById(lessonId);
//   if (!lesson) {
//     throw new Error("Lesson not found");
//   }

//   const module = await Module.findById(lesson.moduleId);
//   if (!module) {
//     throw new Error("Module not found");
//   }

//   const course = await Course.findById(lesson.courseId);
//   if (!course) {
//     throw new Error("Course not found");
//   }

//   if (course.createdBy !== userId) {
//     throw new Error("Unauthorized access");
//   }

//   const aiText = await generateLessonContent({
//     courseTitle: course.title,
//     moduleTitle: module.title,
//     lessonTitle: lesson.title,
//   });

//   lesson.content = aiText;
//   await lesson.save();

//   return lesson;
// }

async function generateLessonForCourse({ lessonId, userId }) {
  // Use .lean() to get a plain JS object instead of a heavy Mongoose document
  const lesson = await Lesson.findById(lessonId).lean();
  if (!lesson) throw new Error("Lesson not found");

  const module = await Module.findById(lesson.moduleId).lean();
  if (!module) throw new Error("Module not found");

  const course = await Course.findById(lesson.courseId).lean();
  if (!course) throw new Error("Course not found");

  if (course.createdBy !== userId) {
    throw new Error("Unauthorized access");
  }

  // Debug Log: Check your terminal to see exactly what is being sent
  // console.log("DEBUGGING AI INPUTS:", {
  //   course: course.title,
  //   module: module.title,
  //   lesson: lesson.title
  // });

  const { content, quiz } = await generateLessonContent({
    courseTitle: course.title,
    moduleTitle: module.title,
    lessonTitle: lesson.title,
  });

  const updatedLesson = await Lesson.findByIdAndUpdate(
    lessonId, 
    { 
      content, 
      quiz, 
      isEnriched: true 
    },
    { new: true } // Returns the updated document
  );

  return updatedLesson;
}

/**
 * Regenerate lesson content (same flow, reused logic)
 */
async function regenerateLessonContent({
  lessonId,
  userId,
}) {
  return generateLessonForCourse({ lessonId, userId });
}


async function getLessonById(lessonId, userId) {
  const lesson = await Lesson.findById(lessonId);
  if (!lesson) throw new Error("Lesson not found");

  const course = await Course.findById(lesson.courseId);
  if (!course) throw new Error("Course not found");

  if (course.createdBy !== userId) {
    throw new Error("Unauthorized");
  }

  return lesson;
}


module.exports = {
  generateLessonForCourse,
  regenerateLessonContent, 
  getLessonById,
};
