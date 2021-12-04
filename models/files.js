const mongoose = require('mongoose');

const Schema = mongoose.Schema;

const file = new Schema({
    title: {
        type: String,
        required: true
    },
    link: {
        type: String,
       required: true
    },
    brisilink: {
        type: String,
       required: true
    },
    direkcija: {
        type: String,
        required: true
    },
    brojcanik: {
        type: Number
    }
}, { timestamps: true });

module.exports = mongoose.model('File', file)