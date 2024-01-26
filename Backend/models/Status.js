const mongoose = require('mongoose');

const statusSchema = new mongoose.Schema({
    userId: {
        type: String,
        required: true
    },
    name: {
        type: String,
        required: true
    },
    email: {
        type: String,
        required: true
    },
    avatarImage: {
        type: String,
        required: true
    },
    images: {
        type: [{}],
        default: [],
        required: true
    }
});

module.exports = mongoose.model("Status", statusSchema);