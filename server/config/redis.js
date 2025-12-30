const { createClient } = require('redis');

// Create the client pointing to the local IPv4 address
const redisClient = createClient({
    url: process.env.REDIS_URL 
});

redisClient.on('error', (err) => console.log('Redis Client Error', err));

const connectRedis = async () => {
    if (!redisClient.isOpen) {
        await redisClient.connect();
        console.log("Redis Connected Successfully");
    }
};

// Export both the client and the connection function
module.exports = { redisClient, connectRedis };