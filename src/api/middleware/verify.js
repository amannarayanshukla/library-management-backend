'use strict';

require('dotenv').config();

const jwt = require('jsonwebtoken');

//Authentication
exports.verify = (role) => (req, res, next) => {

        let token = req.body.accessToken;

        // verify a token symmetric
        jwt.verify(token, process.env.ACCESS_TOKEN_SECRET, function(err, user) {
            if(err) {
                return res.status(401).json({
                    message : "error authenticating token"
                });
            }
            if(role !== user.role){
                return res.status(401).json({
                    message : "role is wrong here"
                });
            }
            next();
        });
};
