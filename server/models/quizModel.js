const mongoose = require("mongoose");

const questionSchema = new mongoose.Schema({
  question: {
    type: String,
    required: true,
  },
  options: {
    type: [String],
    required: true,
  },
  correctAnswerIndex: {
    type: Number,
    required: true,
  },
});

const quizSchema = new mongoose.Schema(
  {
    courseId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Course",
      required: true,
      index: true,
      unique: true, // one quiz per course
    },
    questions: {
      type: [questionSchema],
      default: [],
    },
  },
  { timestamps: true }
);

module.exports = mongoose.model("Quiz", quizSchema);
