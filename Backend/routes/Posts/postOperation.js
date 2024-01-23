const router = require('express').Router();
const verifyJWT = require('../../middleware/verifyJWT');
const { addPost, updatePost, deletePost,
    fetchAllPosts, fetchUserPosts, addComments, handleLike, fetchPostById } = require('../../controllers/Posts/posts.controller');

router.get('/getallposts', verifyJWT, fetchAllPosts);
router.get('/getPostById/:id', verifyJWT, fetchPostById);
router.get('/getalluserposts/:id', verifyJWT, fetchUserPosts);
router.post('/addnewpost', verifyJWT, addPost);
router.patch('/updatepost/:id', verifyJWT, updatePost);
router.delete('/removepost/:id', verifyJWT, deletePost);

router.put('/likes/:id', verifyJWT, handleLike);
router.post('/addcomment/:id', verifyJWT, addComments);


module.exports = router;


