const express = require("express");
const validator = require("validator");
const bcrypt = require("bcrypt");
const User = require("../models/user");
const { userAuth } = require("../middlewares/auth");
const ConnectionRequest = require("../models/connectionRequest");

const userRouter = express.Router();

userRouter.post("/signup", async (req, res, next) => {
    try {
        const { firstName, lastName, email, password } = req.body;
        if (!validator.isStrongPassword(password)) {
            throw new Error("Enter a Strong Password");
        }
        const passwordHash = await bcrypt.hash(password, 10);
        const user = new User({
            firstName,
            lastName,
            email,
            password: passwordHash,
        });
        await user.save();
        res.json({ message: "Saved successfully!" });
    } catch (err) {
        res.status(500).json({ error: err.message });
    }
});

userRouter.post("/login", async (req, res, next) => {
    try {
        const { email, password } = req.body;
        const user = await User.findOne({ email });
        if (!user) throw new Error("Incorrect email or password");
        await user.validatePassword(password);
        // CREATE JWT TOKEN
        const token = await user.getJWT();

        // ADD TOKEN TO COOKIE AND SEND BACK
        res.cookie("token", token, {
            expires: new Date(Date.now() + 1000 * 60 * 60 * 24), // after + the number is in ms ie, 10 mins = 10*60*1000
        });
        res.json({ message: "Loggedin successfully" });
    } catch (err) {
        res.status(500).json({ error: err.message });
    }
});

userRouter.post("/logout", (req, res) => {
    try {
        res.clearCookie("token");
        res.json({ message: "Logged out suceessfully" });
    } catch (err) {
        res.status(500).json({ error: err.message });
    }
});

userRouter.get("/feed", userAuth, async (req, res, next) => {
    try {
        const userId = req.user._id;
        const users = await User.find({ _id: { $ne: userId } });
        res.json({ data: users });
    } catch (err) {
        res.status(500).json({ error: err.message });
    }
});

userRouter.get("/connections", userAuth, async (req, res) => {
    try {
        const loggedInUser = req.user;
        const connections = await ConnectionRequest.find({
            $or: [{ sender: loggedInUser._id }, { receiver: loggedInUser }],
            status: "accepted",
        })
            .populate("sender", ["firstName", "lastName"])
            .populate("receiver", ["firstName", "lastName"]);

        res.json({ data: connections });
    } catch (err) {
        res.json({ error: err.message });
    }
});

module.exports = userRouter;
