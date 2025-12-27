const {courseOutlinePromptV1} = require('./v1');
const {courseOutlinePromptV2} = require('./v2');

const DEFAULT_PROMPT_VERSION = 'v2';
const getCourseOutlinePrompt = (topic, version = DEFAULT_PROMPT_VERSION) => {
    switch(version) {
        case 'v1':
            return courseOutlinePromptV1(topic);
        case 'v2':
        default:
            return courseOutlinePromptV2(topic);
    }
};

module.exports = {
    getCourseOutlinePrompt,
};