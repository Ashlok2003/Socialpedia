const router = require('express').Router();
const logoutController = require('../../controllers/Authentication/logoutController');
const refreshTokenController = require('../../controllers/Authentication/refreshTokenController');
const registerController = require('../../controllers/Authentication/registerController');
const authController = require('../../controllers/Authentication/authController');
const fetchAllUsersController = require('../../controllers/Users/fetchAllUsers');
const getUserController = require('../../controllers/Users/getUserController');
const followData = require('../../controllers/Users/followData');
const handleUserUpdate = require('../../controllers/Users/handleUserUpdate');


router.post('/login', authController.handleLogin);
router.get('/logout', logoutController.handleLogout);
router.get('/refresh', refreshTokenController.handleRefreshToken);
router.post('/register', registerController.handleNewUser);
router.get('/fetchallusers', fetchAllUsersController.fetchAllUsers);
router.get('/fetchuserbyuserid/:id', getUserController.fetchUserDetailsById);
router.post('/handleFollowing', followData.handleFollowers);
router.patch('/handleUserUpdate', handleUserUpdate.updateProfile);

module.exports = router;
