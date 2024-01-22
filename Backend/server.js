require("dotenv").config();

const express = require("express");
const app = express();
const cookieParser = require("cookie-parser");
const mongoose = require("mongoose");
const cors = require("cors");
const User = require("./models/User");
const PORT = process.env.PORT || 8000;
const fs = require('fs').promises;
const path = require('path');

app.use(express.json());
app.use(cookieParser());
app.use("/uploads", express.static("uploads"));

app.use(
    cors({
        origin: function (origin, callback) {
            const allowedOrigins = [
                "http://localhost:5173",
                "https://d5vml3-5173.csb.app",
                "https://d5vml3-8000.csb.app",
                "http://other-allowed-origin",
            ];

            if (!origin || allowedOrigins.indexOf(origin) !== -1)
                callback(null, true);
            else callback(new Error("Not allowed by CORS"));
        },
        methods: "GET,HEAD,PUT,PATCH,POST,DELETE",
        credentials: true,
        optionsSuccessStatus: 200,
    }),
);

app.use(express.urlencoded({ extended: false }));

mongoose
    .connect(process.env.MONGODB_URL)
    .then(() => console.log("Connection Successfull !"))
    .catch((error) => console.log(error));

//! Authentication related API's :)
app.use("/users", require("./routes/Authentication/userOperations"));

//! Post related API's :)
app.use("/post", require("./routes/Posts/postOperation"));

//! Video calling sections starts here on......

//! Chat Applications Sections starts here on......
app.use("/chat", require("./routes/Chats/chats.routes"));

app.get("/", (req, res) => {
    res.send("Hello World !");
});


app.get('/avatarImages', async (req, res) => {
    try {
        const avatarPath = path.join(__dirname, 'uploads', 'avatars');
        const files = await fs.readdir(avatarPath);
        const randomImage = shuffleArray(files);
        const data = randomImage.slice(0, 6)
        res.json({ images: data });
    } catch (error) {
        res.sendStatus(500);
    }
});

function shuffleArray(array) {
    for (let i = array.length - 1; i > 0; i--) {
        const j = Math.floor(Math.random() * (i + 1));
        [array[i], array[j]] = [array[j], array[i]];
    }
    return array;
}

app.get('/fetchUserStartWith/:name', async (req, res) => {
    try {
        const searchName = req.params.name;
        const PAGE_SIZE = 10;
        const page = parseInt(req.query.page) || 1;

        const users = await User.find({ name: { $regex: new RegExp(`^${searchName}`, 'i') } })
            .select('_id name email bio avatarImage followers following')
            .limit(PAGE_SIZE)
            .skip((page - 1) * PAGE_SIZE);

        if (users.length === 0)
            return res.status(404).json({ message: 'No users found.' });


        res.json(users);
    } catch (error) {
        console.error(error);
        res.sendStatus(500);
    }
});

const expressServer = app.listen(PORT, () => {
    console.log("Server is Running on Port ", PORT);
});

require("./services/messaging")(expressServer);
