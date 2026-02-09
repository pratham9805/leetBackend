const { createClient } =require('redis');

const redisClient = createClient({
    username: 'default',
    password: process.env.REDIS_PASSWORD,
    socket: {
        host: 'redis-11051.crce206.ap-south-1-1.ec2.cloud.redislabs.com',
        port: 11051
    }
});
module.exports=redisClient;