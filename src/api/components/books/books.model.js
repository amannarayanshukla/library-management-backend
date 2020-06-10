const mongoose = require ('mongoose');
const Schema = mongoose.Schema;

const booksSchema = new Schema({
    image : {
        type: String,
        required: true,
    },
    name:  {
        type: String,
        required: true,
    },
    edition: {
        type: String,
        required: true,
    },
    author: {
        type: String,
        required : true,
    },
    can_read_in_library: {
        type : Boolean,
        required: true,
    },
    can_take_home: {
        type: Boolean,
        required: true,
    },
    inventory: {
        type: Number,
        required: true,
    }
}, {
    timestamps: true,
});


const issuedBooksSchema = new Schema({
    image : {
        type: String,
        required: true,
    },
    name:  {
        type: String,
        required: true,
    },
    author: {
        type: String,
        required : true,
    },
    book_id: {
        type: String,
        required: true,
    },
    user_id : {
        type : String,
        required: true,
    },
    status_of_issue_request: {
        type: String,
        enum : ['pending', 'approved', 'rejected'],
        required: true,
    },
    time_of_issue_request : {
        type: Date,
        required: true
    },
    time_of_issue : {
        type: Date,
    },
    status_of_return_request: {
        type: String,
        enum : ['pending', 'approved', 'rejected'],
    },
    time_of_returned_request : {
        type: Date,
    },
    time_of_returned : {
        type: Date,
    },
    type : {
        type: String,
        enum : ['library', 'home'],
        required: true,
    }
}, {
    timestamps: true
});

module.exports = {
    booksSchema,
    issuedBooksSchema,
};
