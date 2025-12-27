const courseOutlinePromptV2 = (topic) => `
You are a senior curriculum architect designing a professional online course.

OBJECTIVE:
Design a high-quality course on "${topic}" suitable for beginners progressing to intermediate learners and advanced practitioners.

STRICT OUTPUT RULES:
- Output MUST be valid JSON
- Do NOT include markdown, comments, or explanations
- Do NOT wrap JSON in code blocks

JSON STRUCTURE:
{
  "title": "string",
  "description": "string",
  "tags": ["string"],
  "modules": [
    {
      "title": "string",
      "lessons": ["string"]
    }
  ]
}

CONTENT GUIDELINES:
- 3 to 6 modules total
- Each module must contain 3 to 5 lessons
- First module: fundamentals & terminology
- Middle modules: core concepts and practical understanding
- Final module(s): advanced concepts or real-world applications
- Lesson titles should be action-oriented and non-repetitive

TAGGING RULES:
- 4 to 6 tags
- Tags should reflect skills, concepts, or tools related to the topic
- Use lowercase, no spaces (kebab-case allowed)

FINAL CHECK:
Ensure the JSON is syntactically valid and complete.

OUTPUT:
Return ONLY the JSON object.
`;
module.exports = {
  courseOutlinePromptV2,
};
