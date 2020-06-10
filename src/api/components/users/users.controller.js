require('dotenv').config();
const jwt = require('jsonwebtoken');
const bcrypt = require('bcrypt');
const redis = require('redis');
const uuidv4 = require('uuid').v4();
const moment = require('moment');

const {login} = require('../../auth/login');
const {logout} = require('../../auth/logout');

const client = redis.createClient({host : process.env.REDIS_HOSTNAME, port: process.env.REDIS_PORT}); //creates a new client

const {Users}  = require ('./users.dao');

const {Books, IssuedBooks} = require('../books/books.dao');


exports.login = login(Users);

exports.logout = logout;

exports.getAllBooks = (req,res,next) => {
    //TODO:  Get all the books - DONE when get booksSchema
    //TODO: Get a particular books - DONE when get booksSchema
    let query = {};
    if(req.params.id){
        query = {_id:req.params.id}
    }
    Books.get(query)
        .then((books) => {
            return res.json({
                data: {
                    message:"success, got all the books",
                    books
                }
            })
        })
        .catch(err => {
            return res.json({
                data: {
                    message: "failed couldn't get the books."
                }
            })
        })
};

exports.issuedRequestRaised = (req,res, next) => {
    const {bookID,userID,time_of_issue_request,time_of_returned_request,type} = req.body;

    const format = 'HH:mm:ss';

    const time = moment(time_of_issue_request,format);
    let endTime;
    if (time_of_returned_request === 7 || time_of_returned_request === 1) {
        endTime = moment(time_of_issue_request).add(time_of_returned_request, 'days');
    } else {
        endTime = moment(time_of_returned_request,format);
    }

    const beforeTime = moment('04:30:00',format);
    const afterTime = moment('11:00:00',format);


    if (!moment(time).isBetween(beforeTime, afterTime)) {
        Users.get({_id:userID})
            .then((user) => {
                return user[0]
            })
            .then(user => {
                if(type === 'library'){
                    if(user._doc.reading_hours >= endTime.diff(time, 'hours')){
                        return bookID;
                    } else {
                        return Promise.reject(`The hours are more than what you have available`);
                    }
                } else if (type === 'home'){
                    if(user._doc.membership >= endTime.diff(time,'days')){
                        console.log(bookID);
                        return bookID;
                    } else {
                        return Promise.reject(`The days are more than what you have available`);
                    }
                } else {
                    return Promise.reject(`The type is incorrect`);
                }
            })
            .then(bookID => {
                return Books.find({_id: bookID})
            })
            .then(books => {
                return books[0]
            })
            .then((book)=>{
                if(book.inventory >= 1){
                    return Books.update({_id: bookID}, {$inc : {inventory : -1}})
                } else {
                    return Promise.reject(`The inventory for the book is empty`);
                }
            })
            .then((book) => {
                //TODO: handle time better
                if(type === 'home'){
                    return Users.update({_id: userID},
                        {
                            $set : {currentOrderBook : book},
                            $push : {orders: book},
                            $inc : {'membership': -(endTime.diff(time, 'days'))}
                        },
                        { multi: true})
                } else {
                    return Users.update({_id: userID},
                        {
                          $set : {currentOrderBook : book},
                          $push : {orders: book},
                          $inc : {'reading_hours': -(endTime.diff(time, 'hours'))}
                        },
                        { multi: true})
                }
            })
            .then(user => {
                // console.log(user,"USER");
                return IssuedBooks.create({
                    name:user._doc.currentOrderBook.name,
                    author:user._doc.currentOrderBook.author ,
                    image: user._doc.currentOrderBook.image,
                    book_id: bookID,
                    user_id : user.id,
                    status_of_issue_request: `pending`,
                    time_of_issue_request,
                    time_of_returned_request,
                    type
                })
            })
            .then(book => {
                return res.status(201).json({
                    data: {
                        message : "issued-request-raised received",
                        data : book
                    }
                })
            })
            .catch(err => {
                console.error(err,"Error");
                return res.json({
                    message: err
                });
            });
    } else {
        return res.json({
            message: `The time is NOT in between 10am and 5pm`
        });
    }



    /*
    1.   Check the time if NOT between 10am to 5pm return response
    2. Get the user using the _id
    3. Check if the time period chosen is correct i.e. within the membership or reading hours
    4. If wrong return response from here
    5. If right get the book ID and check the inventory
    6. If inventory is 0 return response saying not possible
    7. update the book schema inventory -1
    8. update the user schema push order to order and current order update also membership or reading hours
    9. create the issued book
    10. return the book in response
    * */


};

exports.readRequestRaised = (req,res,next) => {
    //TODO
    /*
    1. Check the time if NOT between 10am to 5pm return response
    2. Use the issued id to get the issued book document
    2. Update the time_of_return_request to current time
    3. Set the current return_request status
    * */

    const {issuedID,time_of_returned_request} = req.body;

    const format = 'hh:mm:ss';

    const time = moment(time_of_returned_request).format(),
        beforeTime = moment('10:00:00'),
        afterTime = moment('17:00:00');

    //TODO: need to update this and make it work
    if (!(moment(time).isBetween(beforeTime, afterTime))) {
        IssuedBooks.update({_id:issuedID} ,
            {
                $set : {
                    status_of_return_request: 'pending',
                    time_of_returned_request
                }
            },
            { multi: true})
            .then(book => {
                return res.json({
                    message: `The return request is handled please try again.`,
                    data: book
                })
            })
            .catch(err => {
                return res.json({
                    message: `Please try again issue could not be raised`
                })
            })
    } else {
    return res.json({
        message: `The time is NOT in between 10am and 5pm`
    });
}
};

exports.getAllIssuedBooks = (req,res,next) => {
    //TODO:  Get all the books - DONE when get booksSchema
    //TODO: Get a particular books - DONE when get booksSchema
    let query = {};
    if(req.params.id){
        query = {_id:req.params.id}
    }
    IssuedBooks.get(query)
        .then((books) => {
            return res.json({
                data: {
                    message:"success, got all the issued books",
                    books
                }
            })
        })
        .catch(err => {
            return res.json({
                data: {
                    message: "failed couldn't get the issued books."
                }
            })
        })
};



