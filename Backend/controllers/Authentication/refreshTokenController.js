/*
! This is responsible to refresh the refresh token of an user ...*/

require('dotenv').config();

const User = require('../../models/User');
const JWT = require('jsonwebtoken');

const handleRefreshToken = async (req, res) => {

    const cookies = req.cookies;
    
    if (!cookies?.jwt) return res.sendStatus(401);
    //! Since the jwt access token is not available in cookies redirect to the authController

    const refreshToken = cookies.jwt;
    console.log(refreshToken);

    try {
        const foundUserData = await User.findOne({ refreshToken });

        if (!foundUserData) return res.sendStatus(403);

        JWT.verify(
            refreshToken,
            process.env.REFRESH_TOKEN_SECRET,

            (error, decoded) => {

                if (error || foundUserData.username !== decoded.username) return res.sendStatus(403);

                //! Assigning a new accessToken for about 30 minutes....
                const accessToken = JWT.sign(
                    { "username": foundUserData.username },
                    process.env.ACCESS_TOKEN_SECRET,
                    { expiresIn: '30m' }
                );

                return res.json({ accessToken });
            }
        )

    } catch (error) {
        return res.sendStatus(500);
    }

}

module.exports = { handleRefreshToken };

/*
* We must designed in such a way that server functionalties like
* makeing post, uploading reels, updating profile, and messaging and video
* calling should pass through JWT verification to operate....
*/
