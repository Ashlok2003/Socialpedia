require("dotenv").config();

const express = require("express");
const app = express();
const cookieParser = require("cookie-parser");
const mongoose = require("mongoose");
const cors = require("cors");
const PORT = process.env.PORT || 3500;

app.use(express.json());
app.use(cookieParser());
app.use("/uploads", express.static("uploads"));

app.use(
  cors({
    origin: function (origin, callback) {
      const allowedOrigins = [
        "http://localhost:5173",
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

app.use("/", (req, res) => {
  res.send("Hello World !");
});

const expressServer = app.listen(7000, () => {
  console.log("Server is Running on Port ", PORT);
});

require("./services/messaging")(expressServer);
