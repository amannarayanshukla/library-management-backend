//TODO: use bin/www and app.js also use config npm instead of dotenv
// use a logger as middleware remove log npm

'use strict';

require('dotenv').config();

const express = require('express');
const bodyParser = require('body-parser');
const cors = require('cors');

const db = require('./src/config/database');

const {authenticateToken} = require('./src/api/middleware/auth');
const {verify} = require('./src/api/middleware/verify');


const userRouter = require('./src/api/components/users/users.routes');
const AdminRouter  = require('./src/api/components/administrator/administration.routes');


const app = express();

const PORT = process.env.EXPRESS_PORT;

// call the database connectivity function
db();


app.use(cors());
// parse application/x-www-form-urlencoded
app.use(bodyParser.urlencoded({ extended: false }));


// parse application/json
app.use(bodyParser.json());

app.get(`/`,authenticateToken,(req, res) => {
    res.json({
        data : {
            message : `You are in home`
        }
    });
});

app.use(`/api/user/login`, userRouter);
app.use('/api/admin/login', AdminRouter);

app.use('/api/user',authenticateToken,verify("user"),userRouter);
app.use('/api/admin',authenticateToken,verify("admin") ,AdminRouter);

app.listen(PORT, () => {
   console.info( `App listening on port ${PORT}`);
});

