const User = require('../../models/User');
const mongoose = require('mongoose');

const handleFollowers = async (req, res) => {
    try {
        const { id, userId } = req.body;

        const currentUser = await User.findOne({ _id: id });

        const { name, email, avatarImage } = await User.findOne({ _id: userId });

        const isFollowing = currentUser.following.some(follow => follow.name == name);

        if (isFollowing) {
            console.log("Unfollow");
            await User.updateOne(
                { _id: id },
                { $pull: { following: { id: userId } } }
            );

            await User.updateOne(
                { _id: userId },
                { $pull: { followers: { id } } }
            );

            return res.status(200).json({ "message": "Unfollowed!" });
        } else {
            console.log("Follow");
            await User.updateOne(
                { _id: id },
                { $addToSet: { following: { id: userId, name, email, avatarImage } } }
            );

            await User.updateOne(
                { _id: userId },
                { $addToSet: { followers: { id, name: currentUser.name, email: currentUser.email, avatarImage: currentUser.avatarImage } } }
            );

            return res.status(200).json({ "message": "Following!" });
        }
    } catch (error) {
        console.error("Error Encountered!", error);
        return res.status(500).json({ "message": "Adding Followers Error!" });
    }
}

module.exports = { handleFollowers };
