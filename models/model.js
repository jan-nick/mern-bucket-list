const mongoose = require('mongoose')

const Schema = mongoose.Schema

let itemSchema = new Schema({
    item: {
        type: String
    },
    total: {
        type: Number
    },
    saved: {
        type: Number
    }
})

module.exports = mongoose.model('itemSchema', itemSchema)