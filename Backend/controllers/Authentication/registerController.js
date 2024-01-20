const bcrypt = require('bcrypt');
const User = require('../../models/User');

/* 
! Onboarding the new user at the platform.... */

const handleNewUser = async (req, res) => {
    const { name, email, password, bio } = req.body;

    if (!name || !email || !password || !bio)
        return res.status(404).json({ "message": "Username & Password & Avatar Image Required... Required !" });

    const duplicate = await User.findOne({ email });
    if (duplicate) return res.status(409).json({ "message": "User Already Exists !" });

    try {

        const hashedPassword = await bcrypt.hash(password, 10);

        const newUser = new User({
            name,
            email,
            password: hashedPassword,
            bio,
        });

        await newUser.save();

        console.log("User Enter Successfully !");
        return res.status(201).json(newUser)

    } catch (error) {
        res.status(500).json({ "message": error.message });
    }
}

module.exports = { handleNewUser };