const express = require("express");
const { userAuth } = require("../middlewares/auth");
const User = require("../models/user");

const profileRouter = express.Router();

profileRouter.get("/", userAuth, async (req, res, next) => {
    try {
        const user = req.user;
        res.send(user);
    } catch (err) {
        res.status(500).send(err.message);
    }
});

profileRouter.patch("/", userAuth, async (req, res, next) => {
    try {
        console.log(req.user);
        const id = req.user._id;
        const body = req.body;
        console.log("body " + req.body);
        if (body.email) {
            throw new TypeError("Email change is not allowed");
        }
        await User.findByIdAndUpdate(id, req.body, { runValidators: true });
        res.send("User updated successfully");
    } catch (err) {
        res.status(500).send(err.message);
    }
});

module.exports = profileRouter;
