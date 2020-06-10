require('dotenv').config();

const {login} = require('../../auth/login');
const {logout} = require('../../auth/logout');

const {Admin}  = require ('./administration.dao');
const {Books, IssuedBooks} = require('../books/books.dao');

exports.login = login(Admin);

exports.logout = logout;

exports.create = (req,res, next) => {

    const {name, edition, author, can_read_in_library, can_take_home, inventory} = req.body;

    Books.create({name,edition,author,can_read_in_library,can_take_home,inventory})
        .then(book => {
            return res.status(201).json({
                message: `Book successfully created`,
                data: book
            })
        })
        .catch(err => {
            console.log(err,"ERROR");
            return res.json({
                message: `Couldn't create book. Please try again`
            });
        })
};

exports.getAllBooks = (req,res,next) => {
    let query = {};
    if(req.params.id){
        query = {_id:req.params.id}
    }
    Books.get(query)
        .then(books => {
            return res.json({
                message:`All the book(s) in the library`,
                data: books
            })
        })
        .catch(err => {
            console.log(err,"ERROR");
            return res.json({
                message: `Couldn't fetch the book(s). Please try again later`
            })
        })
};

exports.update = (req,res, next) => {

    let body = req.body;
    Books.update({_id:req.params.id},body)
        .then(book => {
            return res.json({
                message: `Updated the book`,
                data: book
            })
        })
        .catch(err => {
            console.log(err, " : ERROR");
            return res.json({
                message: `Updating the book failed.`
            })
        })
};

exports.updateIssuedBooks = (req, res, next) => {

    let query = {};
    let body = req.body;

    if(body.book_id) {
        query.book_id = body.book_id
    }
    if(body.user_id) {
        query.user_id = body.user_id
    }
    if(body.status_of_issue_request){
        query.status_of_issue_request = body.status_of_issue_request
    }
    if(body.time_of_issue_request){
        query.time_of_issue_request = body.time_of_issue_request
    }
    if(body.time_of_issue){
        query.time_of_issue = body.time_of_issue
    }
    if(body.status_of_return_request){
        query.status_of_return_request = body.status_of_return_request
    }
    if(body.time_of_returned_request){
        query.time_of_returned_request = body.time_of_returned_request
    }
    if(body.time_of_returned){
        query.time_of_returned = body.time_of_returned
    }

    IssuedBooks.update({_id:req.params.id}, query)
        .then(book => {
            return res.json({
                message: `Updated the issued book`,
                data: book
            })
        })
        .catch(err => {
            console.log(err, " : ERROR");
            return res.json({
                message: `Updating the issued book failed.`
            })
        })
};

exports.getIssuedBooks = (req,res,next) => {
    let query = {};
    if(req.params.id){
        query = {_id: req.params.id}
    }
    IssuedBooks.get(query)
        .then(books => {
            return res.json({
                message:`All the issued book(s) in the library`,
                data: books
            })
        })
        .catch(err => {
            console.log(err,"ERROR");
            return res.json({
                message: `Couldn't fetch the issued book(s). Please try again later`
            })
        })
};

exports.delete = (req, res, next) => {
    const id = req.params.id;
    Books.delete({_id:id})
        .then(book => {
            return res.json({
                message: `Successfully deleted the book.`
            })
        })
        .catch(err => {
            return res.json({
                message : `Error while deleting.`
            })
        })
};

