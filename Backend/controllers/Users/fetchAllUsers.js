const User = require('../../models/User');

const fetchAllUsers = async (req, res) => {
    try {
        const users = await User.find();
        const userData = users.map((user) => {
            return { user: { id: user._id, email: user.email, name: user.name } };
        });

        return res.status(200).json(userData);
    } catch (error) {
        res.status(500).json({ "message": "Server Error Encountered!" });
    }
}

module.exports = { fetchAllUsers };
