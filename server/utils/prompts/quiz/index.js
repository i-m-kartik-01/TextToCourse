const {quizPromptV1} = require("./v1");
const {quizPromptV2} = require("./v2");

const DEFAULT_PROMPT_VERSION = "v2";
const getQuizPrompt = (
  quizContext,
  version = DEFAULT_PROMPT_VERSION
) => {
  switch (version) {
    case "v1":
      return quizPromptV1(quizContext);
    case "v2":
    default:
      return quizPromptV2(quizContext);
  }
};

module.exports = {
  getQuizPrompt,
};