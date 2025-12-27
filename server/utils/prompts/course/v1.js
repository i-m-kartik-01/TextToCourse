const courseOutlinePromptV1 = (topic) => `
You are an expert instructional designer.

TASK:
Create a structured online course about "${topic}".

RULES (STRICT):
- Return ONLY valid JSON
- No markdown
- No explanations
- No extra text before or after JSON

JSON SCHEMA:
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

REQUIREMENTS:
- 3 to 6 modules
- Each module must have 3 to 5 lessons
- Course flow must be from foundational concepts to advanced topics
- Lesson titles should be concise and descriptive

OUTPUT:
Return ONLY the JSON object.
`;

module.exports = {
  courseOutlinePromptV1,
};
