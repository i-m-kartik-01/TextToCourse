const quizService = require("../services/quizService");

/**
 * Generate final quiz for a course
 * POST /api/courses/:courseId/quiz/generate
 */
const generateQuiz = async (req, res) => {
  try {
    const { courseId } = req.params;
    const userId = req.auth.payload.sub ;

    const quiz = await quizService.generateQuiz({
      courseId,
      userId,
    });

    return res.status(201).json(quiz);
  } catch (error) {
    console.error("Generate quiz error:", error);

    return res.status(400).json({
      message: error.message || "Failed to generate quiz",
    });
  }
};

/**
 * Get quiz for a course
 * GET /api/courses/:courseId/quiz
 */
const getQuizByCourse = async (req, res) => {
  try {
    const { courseId } = req.params;
    const userId = req.auth?.payload?.sub || "dev-user";

    const quiz = await quizService.getQuizByCourse({
      courseId,
      userId,
    });

    return res.json(quiz);
  } catch (error) {
    console.error("Get quiz error:", error);

    return res.status(404).json({
      message: error.message || "Quiz not found",
    });
  }
};

/**
 * Submit quiz answers and get score
 * POST /api/courses/:courseId/quiz/submit
 */
const submitQuiz = async (req, res) => {
  try {
    const { courseId } = req.params;
    const { answers } = req.body;
    const userId = req.auth.payload.sub;

    if (!Array.isArray(answers)) {
      return res.status(400).json({
        message: "Answers must be an array",
      });
    }

    const result = await quizService.submitQuiz({
      courseId,
      answers,
      userId,
    });

    return res.json(result);
  } catch (error) {
    console.error("Submit quiz error:", error);

    return res.status(400).json({
      message: error.message || "Failed to submit quiz",
    });
  }
};

const reviewQuiz = async (req, res) => {
  try {
    const { courseId } = req.params;
    const userId = req.auth?.payload?.sub || "dev-user";

    const quizWithAnswers = await quizService.getQuizWithAnswers({
      courseId,
      userId,
    });

    return res.json(quizWithAnswers);
  } catch (error) {
    console.error("Review quiz error:", error);

    return res.status(400).json({
      message: error.message || "Failed to review quiz",
    });
  }
};
module.exports = {
  generateQuiz,
  getQuizByCourse,
  submitQuiz,  
  reviewQuiz,
};  