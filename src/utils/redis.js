'use strict';

require('dotenv').config();

const redis = require('redis');


const client = redis.createClient({host : process.env.REDIS_HOSTNAME, port: process.env.REDIS_PORT}); //creates a new client

const redisSet = (key, token,cb) => {
    client.set(key, token, cb);
};

const redisDel = (key,cb) => {
    client.del(key,cb)
};

module.exports  = {
    redisSet,
    redisDel
};
