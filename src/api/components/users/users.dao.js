//1. User list pre created
// 2. User - Login and Logout

// 3. Issue the book b/w 10 am and 5 pm -  DONE issuedBooksSchema create
//     1. Issuing for either a day (if book issued at 4pm, user has to return by 5pm)
//     2. Issuing for 7 days
//     3.  *** IF ENDING IN 5 DAYS DO NOT ALLOW BOOKS TO GET ISSUED
//     4. *** NO ISSUE AFTER 3 PM
//     5. *** IF USER IS SELECTING SAME BOOK (AUTHOR, EDITOR) ISSUE REQUEST SHOULD BE ALLOWED

// 4. Returning of book b/w 10 am and 5 pm - DONE issuedBooksSchema update

// 5. View the book any time - one or many - DONE booksSchema get

// 6. Membership - days - Number of days the user can issue the book to take home
// 7. Reading - hours - Number of hours the user can issue book and read in library itself

// 8. View all the books in the library - DONE booksSchema get

// 9. All the books which was issued previously - DONE issuedBooksSchema get and delete
//     1. View this list - get method
//     2. Delete this list - delete method

// 10. Update details of his/her profile - DONE - usersSchema update
//11. Get the details of the profile -  DONE - usersSchema get

//TODO: Need to make dao file for books schema

'use strict';
const mongoose = require('mongoose');
const usersSchema = require('./users.model');

usersSchema.statics = {

    get: function(query, cb) {
        return this.find(query).exec();
    },

    update: function(query, updateData, cb) {
        return this.findOneAndUpdate(query, updateData,{new: true}).exec();
    },

};

const usersModel = mongoose.model('Users', usersSchema);

module.exports = {
    Users : usersModel
};
