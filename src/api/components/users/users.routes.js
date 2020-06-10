const express = require('express');
const Users = require('./users.controller');

var router = express.Router();

router.post('/',Users.login);
router.post('/logout',Users.logout);
router.get('/get-all-books',Users.getAllBooks);
router.get('/get-all-books/:id',Users.getAllBooks);
router.post('/issued-request-raised', Users.issuedRequestRaised);
router.post('/return-request-raised', Users.readRequestRaised);
router.post('/get-all-issued-books',Users.getAllIssuedBooks);
router.post('/get-all-issued-books/:id',Users.getAllIssuedBooks);


module.exports = router;
