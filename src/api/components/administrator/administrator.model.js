const mongoose = require ('mongoose');
const Schema = mongoose.Schema;

const adminSchema = new Schema({
    name:  {
        type: String,
    },
    email: {
        type: String,
        unique : true,
        required : true,
    },
    password: {
        type: String,
        required: true,
    },
}, {
    timestamps: true,
});

module.exports = adminSchema;
