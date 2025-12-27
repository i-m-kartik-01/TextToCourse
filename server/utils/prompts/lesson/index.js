const {lessonPromptV1} = require('./v1');
const {lessonPromptV2} = require('./v2');

const DEFAULT_PROMPT_VERSION = 'v2';
const getLessonPrompt = ({courseTitle, moduleTitle, lessonTitle}, version = DEFAULT_PROMPT_VERSION) => {
    switch(version) {
        case 'v1':
            return lessonPromptV1({courseTitle, moduleTitle, lessonTitle});
        case 'v2':
        default:
            return lessonPromptV2({courseTitle, moduleTitle, lessonTitle});
    }
};

module.exports = {
    getLessonPrompt,
};