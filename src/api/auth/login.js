'use strict';

require('dotenv').config();

const bcrypt = require('bcrypt');
const uuidv4 = require('uuid').v4();
const jwt = require('jsonwebtoken');

const {redisSet} = require('../../utils/redis');


//create access token
const createAccessToken = (email, role) => {
    return jwt.sign({ email : email, role :role}, process.env.ACCESS_TOKEN_SECRET, {expiresIn: '1h'});
};

exports.login = (DefaultDAO) => (req, res, next) => {
    const email = req.body.email;
    let role;
    if(DefaultDAO.modelName === "Users"){
        role = 'user';
    }
    if(DefaultDAO.modelName === "Admin"){
        role = 'admin';
    }
    DefaultDAO.get({email})
        .then((user) => {
            bcrypt.compare(req.body.password, user[0].password, function(err, result) {
                if(err){
                    return res.json({
                        data : {
                            message : "unable to login please try again"
                        }
                    });
                }
                if(!result){
                    return res.json({
                        data : {
                            message : "wrong email or password"
                        }
                    });
                }
                const accessToken = createAccessToken(user[0].email, role);
                const refreshToken = jwt.sign({
                    email: user[0].email,
                    role:role
                }, process.env.REFRESH_TOKEN_SECRET);
                const uuid = uuidv4;

                redisSet(uuid,refreshToken,(err,reply) => {
                    console.log(user,"user");
                    console.log(err,"reply");
                        if(err){
                            return res.json({
                                data : {
                                    message : "please try logging in again"
                                }
                            })
                        }
                        return res.json({
                            data : {
                                message : "successful logged in",
                                email : user.email,
                                userID: user[0]._id,
                                role,
                                accessToken,
                                refreshToken,
                                uuid,
                            }
                        });
                })
            });
        })
        .catch(err => {
            return res.status(202).json({
                data : {
                    message : "unable to login please try again"
                }
            })
        })
};
