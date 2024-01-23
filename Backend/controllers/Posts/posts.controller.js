//* All the post related Crud Operation handled here.....
const path = require('path');
const multer = require('multer');
const Post = require('../../models/Posts');

const storage = multer.diskStorage({
    destination: (req, file, callback) => {
        callback(null, 'uploads/images/');
    },
    filename: (req, file, callback) => {
        callback(null, file.fieldname + '-' + Date.now() + path.extname(file.originalname));
    },
});

const upload = multer({
    storage: storage,
    limits: { fileSize: 50 * 1024 * 1024 }
}).single('postImage');

const addPost = (req, res) => {
    upload(req, res, async (error) => {
        if (error) {
            console.error(error); // Log the actual error for debugging
            return res.status(500).json({ message: 'Internal Server Error' });
        }

        if (!req.file) {
            // Handling the case when the user doesn't provide an image
            const { userId, title, postId, description } = req.body;

            try {
                const newPost = new Post({ userId, postId, title, description, isImage: false });
                await newPost.save();
                return res.sendStatus(200);
            } catch (error) {
                console.error(error);
                return res.status(500).json({ message: 'Error While Creating a Post' });
            }
        }

        const { userId, postId, title, description } = req.body;
        const imageUrl = req.file.path;

        console.log(userId, title, description, imageUrl);

        try {
            const newPost = new Post({ userId, title, postId, description, isImage: true, imagePath: imageUrl });
            await newPost.save();
            return res.sendStatus(200);
        } catch (error) {
            console.error(error);
            return res.status(500).json({ message: 'Error While Creating a Post' });
        }
    });
};

const updatePost = async (req, res) => {
    try {
        const postId = req.params.id;
        const { title, description } = req.body;

        const updated = await Post.findOneAndUpdate({ postId }, { title, description }, { new: true });

        if (!updated) {
            return res.status(404).json({ message: "Post not found" });
        }

        return res.status(200).json({ message: "Post updated successfully", post: updated });

    } catch (error) {
        return res.status(500).json({ message: "Error while updating post", error });
    }
};


const deletePost = async (req, res) => {
    try {
        const postId = req.params.id;
        const deleted = await Post.findOneAndDelete({ postId });

        if (!deleted)
            return res.status(404).json({ message: "Post Not Found !" });

        return res.sendStatus(200);

    } catch (error) {
        return res.status(500).json({ message: "Error While Deleting Posts !" });
    }
}


const fetchAllPosts = async (req, res) => {
    try {
        const posts = await Post.find();
        return res.status(200).json(posts);
    } catch (error) {
        return res.status(500).json({ message: "Error While Fetching Posts !" });
    }
}

const fetchUserPosts = async (req, res) => {
    try {
        const id = req.params.id;
        
        const response = await Post.find({ userId: id });

        return res.status(200).json(response);
    } catch (error) {

        return res.status(500).json({ message: "Error While Fetching User Posts !" });
    }
}

const fetchPostById = async (req, res) => {
    try {
        const name = req.params.id;
        const response = await Post.findOne({ userId: name });
        return res.status(200).json(response);

    } catch (error) {
        return res.status(500).json({ message: "Error While Fetching User Posts !" });
    }
}
//! Likes and comments section starts here on.......

const addComments = async (req, res) => {
    try {
        const postId = req.params.id;
        const { userId, username, userImage, text } = req.body;

        console.log(postId, userId, username, userImage, text);

        const post = await Post.findOne({ postId });

        if (!post) {
            return res.status(404).json({ message: "Post-Not-Found" });
        }

        post.comments.push({ userId, user: username, userImage, text });
        await post.save();

        return res.sendStatus(200);

    } catch (error) {
        return res.status(500).json({ message: "Server Issue Encountered !" });
    }
}

const handleLike = async (req, res) => {
    try {

        const postId = req.params.id;
        const { userId } = req.body;

        const post = await Post.findOne({ postId });

        if (post.likes.includes(userId)) {
            post.likes = post.likes.filter((x) => x.toString() !== userId);
        }
        else {
            post.likes.push(userId);
        }

        await post.save();

        return res.sendStatus(200);

    } catch (error) {
        return res.status(500).json({ message: "Server Issue Encountered !" });
    }
}



module.exports = { addPost, updatePost, deletePost, fetchAllPosts, fetchPostById, fetchUserPosts, addComments, handleLike };