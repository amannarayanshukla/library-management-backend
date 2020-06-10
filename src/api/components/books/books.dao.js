'use strict';
const mongoose = require('mongoose');
const books = require ('./books.model');
const {booksSchema, issuedBooksSchema} = books;

booksSchema.statics = {
    create : (data, cb) => {
        const book = new this(data);
        return book.save()
    },

    get: function(query, cb) {
        return this.find(query).lean();
    },

    update: function(query, updateData, cb) {
        return this.findOneAndUpdate(query, {$set: updateData},{new: true}).lean();
    },

    delete: function(query, cb) {
        this.findOneAndDelete(query,cb);
    }
};

issuedBooksSchema.statics = {
    create : function(data, cb) {
        const book = new this(data);
        return book.save();
    },

    get: function(query, cb) {
        return this.find(query).exec();
    },

    update: function(query, updateData, cb) {
        return this.findOneAndUpdate(query, updateData,{new: true}).exec();
    },

    delete: function(query, cb) {
        return this.findOneAndDelete(query).exec();
    }
};


const booksModel = mongoose.model('Books', booksSchema);
const issuedBooksModel = mongoose.model('IssuedBooks', issuedBooksSchema);

module.exports = {
    Books : booksModel,
    IssuedBooks :issuedBooksModel
};
