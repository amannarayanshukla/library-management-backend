'use strict';

require('dotenv').config();

const jwt = require('jsonwebtoken');
const redis = require('redis');

const client = redis.createClient({host : process.env.REDIS_HOSTNAME, port: process.env.REDIS_PORT}); //creates a new client

//Authentication
exports.authenticateToken = (req, res, next) => {

    client.get(String(req.body.uuid), (err,reply) => {
        if(err){
            return res.json({
                message : `UUID not found in redis.`
            })
        }
        let token = req.body.accessToken;
        if(!token){
            return res.status(401).json({message : "token not found"})
        }

        // verify a token symmetric
        jwt.verify(token, process.env.ACCESS_TOKEN_SECRET, function(err, user) {
            if(err) {
                return res.status(401).json({
                    message : "error authenticating token"
                });
            }
            req.body.email = user.email;
            next()
        });
    });
};
