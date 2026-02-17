require("dotenv").config();

const express = require("express");
const cors = require("cors");
const mongoose = require("mongoose");
const userRoute = require("./Routes/userRoutes");
const chatRoute = require("./Routes/chatRoutes");
const messageRoute = require("./Routes/messageRoutes");

const app = express();

app.use(express.json());
app.use(cors());

app.use("/api/users", userRoute);
app.use("/api/chats", chatRoute);
app.use("/api/messages", messageRoute);

app.get("/", (req, res) => {
    res.send("Server is working");
});


const port = process.env.PORT || 5500;
const uri = process.env.ATLAS_URI;

mongoose.connect(uri)
.then(() => {
    console.log("MongoDB connection established");
    app.listen(port, () => {
        console.log(`Server running on port: ${port}`);
    });
})
.catch((error) => {
    console.log("MongoDB connection failed:", error.message);
});
