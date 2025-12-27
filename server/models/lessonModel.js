const mongoose = require("mongoose");

const LessonSchema = new mongoose.Schema(
  {
    title: {
      type: String,
      required: true,
      trim: true,
    },

    courseId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Course",
      required: true,
      index: true,
    },

    moduleId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Module",
      required: true,
      index: true,
    },

    orderNo: {
      type: Number,
      required: true,
    },

    content: {
      type: [mongoose.Schema.Types.Mixed],
      default: []
    },

    quiz: [
      {
        question: String,
        options: [String],
        answer: String,
        explanation: String,
        default: {}
      }
    ],
    isEnriched: { type: Boolean, default: false },
    videoId: { 
      type: String, 
      default: null // Empty until the first time the lesson is viewed
    }
  },
  { timestamps: true }
);


LessonSchema.index({moduleId: 1, orderNo: 1 });

module.exports = mongoose.model("Lesson", LessonSchema);