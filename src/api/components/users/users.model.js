const mongoose = require ('mongoose');
const Schema = mongoose.Schema;

const usersSchema = new Schema({
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
    membership_days: {
        type : Number,
        required: true,
    },
    reading_hours: {
        type: Number,
        required: true,
    },
    orders: Array,
    currentOrderBook: Schema.Types.Mixed
}, {
    timestamps: true,
});

module.exports = usersSchema;
