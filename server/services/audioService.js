const axios = require('axios');

let client = null;

// Bridging the modern SDK just like in your ai.js
async function getClient() {
  if (client) return client;
  const { GoogleGenAI } = await import("@google/genai");
  client = new GoogleGenAI({ apiKey: process.env.GEMINI_API_KEY });
  return client;
}

const MODEL_NAME = "gemini-2.5-flash"; // Or 2.5-flash as you have it

const generateHinglishAudio = async (englishText) => {
  try {
    const aiClient = await getClient();

    // 1. TRANSLATION: English -> Hinglish using Gemini
    const translationResult = await aiClient.models.generateContent({
      model: MODEL_NAME,
      contents: [{ 
        role: 'user', 
        parts: [{ text: `Translate the following educational text into Hinglish (a mix of Hindi and English). Keep technical terms in English and make it sound like a classroom lecture: "${englishText}"` }] 
      }]
    });

    const hinglishText = translationResult.text;

    // 2. AUDIO GENERATION: Using Google Text-to-Speech API
    // We use the same API key you are using for Gemini
    const ttsUrl = `https://texttospeech.googleapis.com/v1/text:synthesize?key=${process.env.GEMINI_API_KEY}`;
    
    const ttsResponse = await axios.post(ttsUrl, {
      input: { text: hinglishText },
      voice: { 
        languageCode: "en-IN", 
        name: "en-IN-Wavenet-D" // This is a premium Indian-English voice that handles Hinglish well
      },
      audioConfig: { 
        audioEncoding: "LINEAR16", // This results in a .wav file
        speakingRate: 1.0,
        pitch: 0
      }
    });

    // 3. OUTPUT: Buffer for immediate playback
    return Buffer.from(ttsResponse.data.audioContent, 'base64');

  } catch (error) {
    console.error("Audio Service Error:", error.response?.data || error.message);
    throw new Error("Failed to generate Hinglish audio explanation");
  }
};

module.exports = { generateHinglishAudio };