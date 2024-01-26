const mongoose = require('mongoose');

const userSchema = new mongoose.Schema({
    name: {
        type: String,
        required: true, min: 3, max: 20, unique: true
    },
    email: {
        type: String,
        required: true, min: 8, max: 50, unique: true,
    },
    password: {
        type: String,
        required: true, min: 8, max: 50, unique: true
    },
    bio: {
        type: String,
        required: true, max: 5000
    },
    avatarImage: {
        type: String,
        default: 'https://upload.wikimedia.org/wikipedia/commons/thumb/1/12/User_icon_2.svg/330px-User_icon_2.svg.png'
    },
    followers: [{
        id: { type: mongoose.Schema.Types.ObjectId, ref: 'User' },
        name: String,
        email: String,
        avatarImage: String
    }],
    following: [{
        id: { type: mongoose.Schema.Types.ObjectId, ref: 'User' },
        name: String,
        email: String,
        avatarImage: String
    }],
    accessToken: {
        type: String,
        default: ''
    },
    refreshToken: {
        type: String,
        default: ''
    },
    conversations: {
        type: [{}],
        default: []
    }
});

userSchema.index({ name: 1 });
module.exports = mongoose.model("User", userSchema);
