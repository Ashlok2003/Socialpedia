const router = require('express').Router();
const { addPost, updatePost, deletePost,
    fetchAllPosts, fetchUserPosts, addComments, handleLike, fetchPostById } = require('../../controllers/Posts/posts.controller');
//! All Post related operations should handle gracefully.....

router.get('/getallposts', fetchAllPosts);
router.get('/getPostById/:id', fetchPostById);
router.get('/getalluserposts/:id', fetchUserPosts);
router.post('/addnewpost', addPost);
router.patch('/updatepost/:id', updatePost);
router.delete('/removepost/:id', deletePost);

router.put('/likes/:id', handleLike);
router.post('/addcomment/:id', addComments);


module.exports = router;


