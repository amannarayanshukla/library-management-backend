//1. One Admin - Login and Logout
// Admin - get

// 2. Issue books - For Reading - DONE when updating booksSchema
// 3. Issue books -  Taking home -  DONE when updating booksSchema
// 4. Acceptance - Book returns after reading -  DONE when updating booksSchema
// 5. Acceptance - Book returns after taking home -  DONE when updating booksSchema

// 6. Creation - Create new books - DONE when creating booksSchema
// 7. Update - Update the existing books - DONE when update booksSchema
// 8. Delete - Delete books - DONE when deleting booksSchema

// 9. Specify - If book for in-house reading - DONE when creating booksSchema
// 10. Specify - If book for take home - when creating booksSchema


// 11. Get all the books which are issued - DONE when get issuedBooksSchema


// 12. Get all the books - DONE when get booksSchema
// 13. Get a particular books - DONE when get booksSchema

'use strict';
const mongoose = require('mongoose');
const adminSchema = require('./administrator.model');
const books = require ('../books/books.model');

adminSchema.statics = {
    get: function(query,cb) {
        return this.find(query).exec();
    }
};

const adminModel = mongoose.model('Admin', adminSchema);

module.exports = {
    Admin : adminModel
};
