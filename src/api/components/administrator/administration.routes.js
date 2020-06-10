const express = require('express');
const Admins = require('./administration.controller');

const router = express.Router();

router.post('/create',Admins.create);
router.put(`/update/:id`,Admins.update);

router.get('/get-all-books',Admins.getAllBooks);
router.get('/get-all-books/:id',Admins.getAllBooks);
router.get('/get-issued-books',Admins.getIssuedBooks);
router.get('/get-issued-books/:id',Admins.getIssuedBooks);
router.put(`/update/issued-book/:id`,Admins.updateIssuedBooks);

module.exports = router;
