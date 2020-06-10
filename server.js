/*TODO : removing only the refresh token when logging
    out however if the access token is still valid than
     what should be done since we are not deleting that
      */

require('dotenv').config();

const express = require('express');
const bodyParser = require('body-parser');
const bcrypt = require('bcrypt');
const jwt = require('jsonwebtoken');
const redis = require('redis');
const uuidv4 = require('uuid').v4();


const app = express();
const client = redis.createClient({host : process.env.REDIS_HOSTNAME, port: process.env.REDIS_PORT}); //creates a new client
const saltRounds = 10;

//mongodb
// db();

//TODO:  move redis also to config
//redis
client.on('connect', function() {
    console.log('redis connected');
});


//TODO: Make a schema in MongoDB
let users = [{
    email : "aman",
    password : "$2b$10$wfNcP/QawmqSKIDugkV1iOSpcUhHQpimmO/MKwooqrEvoZunHZH/S"
}, {
    email : "aryan",
    password : "$2b$10$wfNcP/QawmqSKIDugkV1iOSpcUhHQpimmO/MKwooqrEvoZunHZH/S"
}];


// parse application/x-www-form-urlencoded
app.use(bodyParser.urlencoded({ extended: false }));

// parse application/json
app.use(bodyParser.json());

const createAccessToken = (email) => {
    return jwt.sign({ email}, process.env.ACCESS_TOKEN_SECRET, {expiresIn: '15s'});
};

const authenticateToken = (req, res, next) => {
    //TODO: check if uuid is present in redis or not is not than fail
    let token = req.headers.authorization;
    if(!token){
        return res.json({message : "token not found"})
    }
    token = token.split(' ')[1];

    // verify a token symmetric
    jwt.verify(token, process.env.ACCESS_TOKEN_SECRET, function(err, user) {
        if(err) {
            return res.json({message : "error authenticating token"});
        }
        req.body.email = user.email;
        next()
    });

};

app.get('/', authenticateToken, function (req, res) {

    return res.json({users});
});

app.post('/token', (req, res) => {
    const refreshToken = req.body.token;
    const uuid = req.body.uuid;

    if(!refreshToken || !uuid){
        return res.json({message : "no refresh token found or uuid found"})
    }

    client.get(uuid, function(err, reply) {
        if(err){
            return res.json({message: "uuid not found"})
        }
        if(!reply){
            return res.json({message : "no key found for the uuid"})
        }

        // verify a token symmetric
        if(refreshToken === reply ){
        jwt.verify(refreshToken, process.env.REFRESH_TOKEN_SECRET, function(err, user) {
            const accessToken = createAccessToken(user.email);
            return res.json({accessToken});
        })} else {
            return res.json({message :"wrong refresh token mapped"});
        }
    });
});

app.post('/user/register', (req, res) => {

    bcrypt.hash(req.body.password, saltRounds, function(err, hash) {
        if(err){
            return res.json({message : "unable to register please try again"});
        }
        //TODO: add user to the database
        users.push({
            email : req.body.email,
            password : hash
        });

        return res.json({message : "successful register in", email : req.body.email});
    });
});

app.post('/user/login', (req, res) => {

    const user = users.filter(item => {
        return item.email === req.body.email;
    });

    bcrypt.compare(req.body.password, user[0].password, function(err, result) {
        if(err){
            return res.json({message : "unable to login please try again"});
        }
        if(!result){
            return res.json({message : "wrong email or password"});
        }
        const accessToken = createAccessToken({email : req.body.email});
        const refreshToken = jwt.sign({email: req.body.email}, process.env.REFRESH_TOKEN_SECRET);
        const uuid = uuidv4;

        client.set(uuid, refreshToken, function(err, reply) {
            if(err){
                return res.json({message : "please try login in again"})
            }
            return res.json({message : "successful logged in", email : req.body.email, accessToken, refreshToken, uuid});
        });
    });
});

app.post('/user/logout',authenticateToken,(req, res) => {
    const uuid = req.body.uuid
    client.del(uuid, function(err, reply) {
        if(err){
            return res.json({message: "unable to delete refresh token"})
        }
        return res.json({message : "refresh token deleted"})
    });
});

app.listen(3000);
