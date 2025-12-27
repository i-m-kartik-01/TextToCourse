const Quiz = require("../models/quizModel");
const Course = require("../models/courseModel");
const { generateQuizAI } = require("./ai");
const { getQuizPrompt } = require("../utils/prompts/quiz");

/**
 * Generate quiz for a course (only once)
 */
async function generateQuiz({ courseId, userId }) {
  // Fetch course
  const course = await Course.findById(courseId);
  if (!course) {
    throw new Error("Course not found");
  }

  // Ownership check
  if (course.createdBy !== userId) {
    throw new Error("Unauthorized access");
  }

  // Prevent duplicate quiz
  const existingQuiz = await Quiz.findOne({ courseId });
  if (existingQuiz) {
    return existingQuiz;
  }

  // Build prompt context
  const quizContext = {
    courseTitle: course.title,
    courseDescription: course.description || "",
  };

  // Generate quiz using AI
  let quizData; // Renamed from aiText to quizData because it's an object
  try {
    // The ai.js function already returns a parsed JSON object
    quizData = await generateQuizAI(quizContext, "v2");
  } catch (err) {
    // Fallback to v1
    quizData = await generateQuizAI(quizContext, "v1");
  }

  // --- REMOVED THE aiText.slice AND JSON.parse LOGIC ---
  // It was crashing because quizData is already an object

  // Persist quiz
  const quiz = await Quiz.create({
    courseId,
    // Ensure you access the correct key from your AI response (questions or quiz)
    questions: quizData.questions || quizData.quiz || quizData,
  });

  return quiz;
}
/**
 * Get quiz for a course
 */
async function getQuizByCourse({ courseId, userId }) {
  const course = await Course.findById(courseId);
  if (!course) {
    throw new Error("Course not found");
  }

  // if (course.createdBy !== userId) {
  //   throw new Error("Unauthorized access");
  // }

  const quiz = await Quiz.findOne({ courseId });
  if (!quiz) {
    throw new Error("Quiz not found");
  }

  return quiz;
}

/**
 * Submit quiz and calculate score
 */
async function submitQuiz({ courseId, answers, userId }) {
  const quiz = await Quiz.findOne({ courseId });
  if (!quiz) {
    throw new Error("Quiz not found");
  }

  const course = await Course.findById(courseId);
  if (!course || course.createdBy !== userId) {
    throw new Error("Unauthorized access");
  }

  if (answers.length !== quiz.questions.length) {
    throw new Error("Answer count mismatch");
  }

  let score = 0;

  quiz.questions.forEach((q, index) => {
    if (answers[index] === q.correctAnswerIndex) {
      score++;
    }
  });

  return {
    totalQuestions: quiz.questions.length,
    correctAnswers: score,
    scorePercentage: Math.round(
      (score / quiz.questions.length) * 100
    ),
  };
}

/**
 * Get quiz with correct answers (review mode)
 */
async function getQuizWithAnswers({ courseId, userId }) {
  // Fetch course
  const course = await Course.findById(courseId);
  if (!course) {
    throw new Error("Course not found");
  }

  // Ownership check
  // if (course.createdBy !== userId) {
  //   throw new Error("Unauthorized access");
  // }

  // Fetch quiz
  const quiz = await Quiz.findOne({ courseId }).lean();
  if (!quiz) {
    throw new Error("Quiz not found");
  }

  // Return quiz with answers
  return {
    courseId,
    totalQuestions: quiz.questions.length,
    questions: quiz.questions.map((q, index) => ({
      questionNo: index + 1,
      question: q.question,
      options: q.options,
      correctAnswerIndex: q.correctAnswerIndex,
    })),
  };
}


module.exports = {
  generateQuiz,
  getQuizByCourse,
  submitQuiz, 
  getQuizWithAnswers,
};
