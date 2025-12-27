const mongoose = require("mongoose");
const Module = require("./moduleModel");
const Lesson = require("./lessonModel");

const courseSchema = new mongoose.Schema(
  {
    title: {
      type: String,
      required: true,
      trim: true,
    },

    createdBy: {
      type: String, // Auth0 user id
      required: true,
      index: true,
    },

  },
  { timestamps: true }
);

/**
 * Static method to create a course with modules and lessons
 */
courseSchema.statics.generateCourse = async function ({
  title,
  modules,
  createdBy,
}) {
  // 1. Create the course first
  const course = await this.create({
    title,
    createdBy,
  });

  // 2. Map through modules to create them
  for (let i = 0; i < modules.length; i++) {
    const moduleData = modules[i];
    
    // Create the module
    const module = await Module.create({
      title: moduleData.title,
      courseId: course._id,
      order: i + 1,
    });

    // 3. Create lessons for THIS module
    if (moduleData.lessons && Array.isArray(moduleData.lessons)) {
      const lessonPromises = moduleData.lessons.map((lessonTitle, index) => {
        return Lesson.create({
          title: lessonTitle,
          courseId: course._id, // Link to course
          moduleId: module._id, // Link to module
          orderNo: index + 1,
          content: [] // Initialize empty content
        });
      });
      console.log('Lesson created:', moduleData.lessons);
      
      // Wait for all lessons in this module to save
      await Promise.all(lessonPromises);
    }
  }

  return course;
};

module.exports = mongoose.model("Course", courseSchema);
