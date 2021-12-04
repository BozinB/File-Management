const mongoose = require('mongoose');

const Schema = mongoose.Schema;

const dokument = new Schema({
    imeKirilica: {
        type: String,
        required: true
    },
    imeLatinica
    : {
        type: String,
        required: true
    },
    pozicija: {
        type: Number,
        required: true
    },
    parrent: {
        
            type: mongoose.Schema.Types.ObjectId, 
            //required: true,
            default: null
        
    },
    children: [{
        type: mongoose.Schema.Types.ObjectId
    }],
    successors: [{
        type: mongoose.Schema.Types.ObjectId
    }],
    files: []
}, { timestamps: true });

module.exports = mongoose.model('Department', dokument)