const User = require('../../models/User');

const updateProfile = async (req, res) => {
    try {
        const userId = req.params.id;
        const { name, email, password, bio } = req.body;

        const updateData = {};
        if (name) updateData.name = name;
        if (email) updateData.email = email;
        if (password) updateData.password = password;
        if (bio) updateData.bio = bio;

        const updatedData = await User.findByIdAndUpdate(userId, { $set: updateData }, { new: true });

        if (!updatedData)
            return res.status(404).json({ message: 'User not found' });

        return res.status(200).json({ message: 'Profile updated successfully', data: updatedData });
    } catch (error) {
        return res.status(500).json({ message: 'Internal server error' });
    }
}

module.exports = { updateProfile };