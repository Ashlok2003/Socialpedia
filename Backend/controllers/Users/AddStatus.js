const Status = require('../../models/Status');
const path = require('path');
const multer = require('multer');
const fs = require('fs').promises;

const storage = multer.diskStorage({
    destination: (req, file, callback) => {
        callback(null, 'uploads/status/');
    },
    filename: (req, file, callback) => {
        callback(null, file.fieldname + '-' + Date.now() + path.extname(file.originalname));
    },
});

const upload = multer({
    storage: storage,
    limits: { fileSize: 50 * 1024 * 1024 }
}).single('statusImage');

const addStatus = async (req, res) => {

    upload(req, res, async (error) => {
        if (error) {
            return res.status(500).json({ "message": "Internal Server Error !" });
        }

        if (!req.file) {
            return res.status(400).json({ "message": "No Image Selected !" });
        }

        const { userId, name, email, text, avatarImage } = req.body;
        const imageUrl = req.file.path;

        try {
            const user = await Status.findOne({ userId });
            if (user) {
                user.images.push({ text, imageUrl });
                await user.save();
                return res.status(200).json({ "message": "Status Added !" });
            }
            else {
                const newStatus = new Status({ userId, name, email, avatarImage, images: [{ text, imageUrl }] });
                await newStatus.save();
                return res.status(200).json({ "message": "Status Added !" });
            }
        } catch (error) {
            return res.status(500).json({ "message": "Internal Server Error !" });
        }
    })
}

const getAllStatus = async (req, res) => {
    try {
        const status = await Status.find();
        res.status(200).json(status);
    } catch (error) {
        return res.status(500).json({ "message": "Internal Server Error !" });
    }
}

const removeStatus = async (req, res) => {
    try {
        const { userId, imageUrl } = req.body;

        const user = await Status.findOne({ userId });

        if (!user) {
            return res.status(404).json({ "message": "User Not Found !" });
        }

        user.images = user.images.filter(image => image !== imageUrl);

        if (user.images.length === 0) {
            await Status.findOneAndRemove({ userId });
        } else {
            await user.save();
        }

        await fs.unlink(imageUrl);

        return res.status(200).json({ "message": "Status Removed !" });
    } catch (error) {
        return res.status(500).json({ "message": "Internal Server Error !" });
    }
}

module.exports = { addStatus, removeStatus, getAllStatus };