const mongoose = require('mongoose');

const postSchema = new mongoose.Schema({
    userId: {
        type: String,
        required: true
    },
    title: {
        type: String,
        required: true, unique: true
    },
    description: {
        type: String,
        required: true, unique: true
    },

    isImage: {
        type: Boolean,
        default: false
    },

    imagePath: {
        type: String,
        default: '',
    },

    likes: [{ type: String, required: true }],

    comments: [{
        user: { type: String, required: true },
        text: { type: String, required: true },
        createdAt: { type: Date, default: Date.now }
    }],

    createdAt: { type: Date, default: Date.now }

});

module.exports = mongoose.model("Post", postSchema);