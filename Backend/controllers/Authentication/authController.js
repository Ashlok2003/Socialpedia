/*
! Whenever an user login then new access token and refresh token is generated ... */

require('dotenv').config();

const User = require('../../models/User');
const bcrypt = require('bcrypt');
const JWT = require('jsonwebtoken');

const handleLogin = async (req, res) => {

    const { email, password } = req.body;


    const foundUserData = await User.findOne({ email });

    if (!foundUserData) return res.sendStatus(403);


    const isMatch = await bcrypt.compare(password, foundUserData.password);

    if (isMatch) {

        const accessToken = JWT.sign(
            { "name": foundUserData.name },
            process.env.ACCESS_TOKEN_SECRET,
            { expiresIn: '30s' }
        );

        const refreshToken = JWT.sign(
            { "name": foundUserData.name },
            process.env.REFRESH_TOKEN_SECRET,
            { expiresIn: '1d' }
        );

        try {
            await User.findOneAndUpdate({ email }, { $set: { accessToken, refreshToken } });

            res.cookie('jwt', refreshToken, {
                httpOnly: true, sameSite: 'None',
                secure: true,
                path: '/',
                maxAge: 24 * 60 * 60 * 1000
            });

            const updatedUserData = await User.findOne({ email });

            //! Accessing all the server- functionalities using accesstoken only... :)
            return res.status(200).json({ userData: { ...updatedUserData, accessToken } });
        }
        catch (error) {
            return res.status(404).json({ "message": "Database Error Encountered !" })
        }

    }
    else {
        res.sendStatus(401);
    }
}

module.exports = { handleLogin };