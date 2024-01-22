const User = require('../../models/User');

const fetchUserDetailsById = async (req, res) => {
    try {
        const userId = req.params.id;
        const user = await User.findOne({ _id: userId })
            .select("_id name email bio avatarImage followers following");
        res.status(200).json(user);
    } catch (error) {
        res.sendStatus(500);
    }
}

module.exports = { fetchUserDetailsById };