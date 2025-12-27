const { redisClient } = require('../config/redis');
const youtubeService = require('../services/youtubeService');
const Lesson = require('../models/lessonModel');
const getLessonVideo = async (req, res) => {
    const { lessonId } = req.params;
    const cacheKey = `video:${lessonId}`;

    try {
        // 1. Check Redis (Volatile Cache) 
        const cachedVideoId = await redisClient.get(cacheKey);
        if (cachedVideoId) {
            console.log("Redis Hit!");
            return res.json({ videoId: cachedVideoId });
        }

        // 2. Fetch Lesson from MongoDB
        const lesson = await Lesson.findById(lessonId);
        
        // --- CRITICAL GUARD CLAUSE ---
        // This stops the "Cannot read properties of null (reading 'find')" error
        if (!lesson || !lesson.content) {
            console.log("Lesson or content array missing for ID:", lessonId);
            return res.status(404).json({ 
                message: "Lesson found, but it has no content structure to search for a video query." 
            });
        }

        // 3. Check MongoDB (Persistent Cache) [cite: 36, 89]
        if (lesson.videoId) {
            console.log("MongoDB Hit! Repopulating Redis...");
            await redisClient.setEx(cacheKey, 3600, lesson.videoId); 
            return res.json({ videoId: lesson.videoId });
        }

        // 4. Safe to call .find() now because we know 'lesson' is not null [cite: 178]
        const videoBlock = lesson.content.find(b => b.type === 'video_query');

        if (!videoBlock || !videoBlock.value) {
            return res.status(404).json({ 
                message: "This lesson does not contain a video search query." 
            });
        }

        // 5. Call YouTube API Service [cite: 176, 179]
        console.log("Cache Miss: Fetching from YouTube API...");
        const fetchedId = await youtubeService.fetchVideoIdFromYouTube(videoBlock.value);

        if (fetchedId) {
            await Lesson.findByIdAndUpdate(lessonId, { videoId: fetchedId });
            await redisClient.setEx(cacheKey, 3600, fetchedId);
            return res.json({ videoId: fetchedId });
        } else {
            return res.status(404).json({ message: "No relevant YouTube video found." });
        }

    } catch (error) {
        console.error("YouTube Controller Error:", error);
        res.status(500).json({ 
            message: "Internal Server Error", 
            error: error.message 
        });
    }
};
module.exports = {
  getLessonVideo,
};