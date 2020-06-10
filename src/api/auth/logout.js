'use strict';

const {redisDel} = require('../../utils/redis');

exports.logout = (req, res, next) => {
    const uuid = req.body.uuid;
    redisDel(uuid,(err, reply) =>  {
        if(err){
            return res.json({
                data: {
                    message: "unable to delete refresh token"
                }
            })
        }
        return res.json({
            data : {
                message : "refresh token deleted"
            }
        })
    })
};
