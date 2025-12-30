const lessonService = require("../services/lessonService");
const audioService = require("../services/audioService");
const Lesson = require("../models/lessonModel");
const mongoose = require("mongoose");
/**
 * Generate AI content for a lesson
 * POST /api/lessons/:lessonId/generate
 */
const generateLesson = async (req, res) => {
  try {
    const { lessonId } = req.params;
    
    // Validate if the ID is a valid MongoDB ObjectId
    if (!mongoose.Types.ObjectId.isValid(lessonId)) {
      return res.status(400).json({
        message: `Invalid Lesson ID format: ${lessonId}. Ensure there are no colons or extra spaces.`
      });
    }

    const userId = req.auth.payload.sub || "dev-user";

    const lesson = await lessonService.generateLessonForCourse({
      lessonId,
      userId,
    });

    return res.status(200).json(lesson);
  } catch (error) {
    console.error("Generate lesson error:", error);
    return res.status(500).json({
      message: error.message || "Failed to generate lesson content",
    });
  }
};

/**
 * Regenerate AI content for a lesson
 * POST /api/lessons/:lessonId/regenerate
 */
const regenerateLesson = async (req, res) => {
  try {
    const { lessonId } = req.params;
    const userId = req.auth.payload.sub;

    const lesson = await lessonService.regenerateLessonContent({
      lessonId,
      userId,
    });

    return res.status(200).json(lesson);
  } catch (error) {
    console.error("Regenerate lesson error:", error);

    return res.status(400).json({
      message: error.message || "Failed to regenerate lesson content",
    });
  }
};

/**
 * Get a single lesson (with content)
 * GET /api/lessons/:lessonId
 */
const getLessonById = async (req, res) => {
  try {
    const { lessonId } = req.params;

    const lesson = await lessonService.getLessonById(lessonId);
    if (!lesson) {
      return res.status(404).json({ message: "Lesson not found Kartik" });
    }
    return res.json(lesson);
  } catch (error) {
    console.error("Get lesson error:", error);

    return res.status(404).json({
      message: error.message || "Lesson not found",
    });
  }
};

const getLessonAudio = async (req, res) => {
  try {
    const { lessonId } = req.params;

    // 1. Fetch lesson
    const lesson = await Lesson.findById(lessonId);
    if (!lesson) return res.status(404).json({ message: "Lesson not found" });

    // 2. Prepare text (combining paragraph blocks)
    const englishText = lesson.content
      .filter(block => block.type === 'paragraph')
      .map(block => block.text)
      .join(' ');

    if (!englishText) return res.status(400).json({ message: "No content available for audio" });

    // 3. Generate Audio Buffer
    const audioBuffer = await audioService.generateHinglishAudio(englishText);

    // 4. Return as .wav stream
    res.set({
      'Content-Type': 'audio/wav',
      'Content-Disposition': 'inline; filename="explanation.wav"',
    });
    
    res.send(audioBuffer);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

module.exports = {
  generateLesson,
  regenerateLesson,
  getLessonById,
  getLessonAudio,
};
