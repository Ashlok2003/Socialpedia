const User = require('../../models/User');

const handleLogout = async (req, res) => {

    try {

        const cookies = req.cookies;
        if (!cookies) return res.sendStatus(204);

        console.log(cookies);

        const refreshToken = cookies.jwt;

        const foundUserData = await User.findOneAndUpdate(
            { refreshToken },
            { $unset: { refreshToken: '' } }
        );


        if (!foundUserData) {
            res.clearCookie('jwt', { httpOnly: true });
            return res.sendStatus(204);
        }


        await User.findOneAndUpdate({ refreshToken }, { refreshToken: '' });
        res.clearCookie('jwt', { httpsOnly: true, sameSite: 'None', secure: true });

        return res.sendStatus(204);

    } catch (error) {
        return res.sendStatus(500);
    }
}

module.exports = { handleLogout };