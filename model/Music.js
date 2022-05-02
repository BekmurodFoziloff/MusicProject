const { Schema, model } = require('mongoose')

const MusicSchema = Schema({
    singer: {
        type: String,
        required: true
    },
    name: {
        type: String,
        required: true
    },
    comment: {
        type: String,
        required: true
    }
})

module.exports = model('Music', MusicSchema)