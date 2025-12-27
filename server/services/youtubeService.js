const axios = require('axios');

const fetchVideoIdFromYouTube = async (query) => {
  const apiKey = process.env.YOUTUBE_API_KEY;
  const response = await axios.get('https://www.googleapis.com/youtube/v3/search', {
    params: {
      q: query,
      part: 'snippet',
      maxResults: 1,
      type: 'video',
      videoEmbeddable: 'true',
      key: apiKey
    }
  });
  return response.data.items[0]?.id?.videoId;
};

module.exports = { fetchVideoIdFromYouTube };