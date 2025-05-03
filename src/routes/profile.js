const express = require("express");
const { userAuth } = require("../middlewares/auth");
const User = require("../models/user");

const profileRouter = express.Router();

profileRouter.get("/", async (req, res, next) => {
    try {
        const user = req.user;
        res.send(user);
    } catch (err) {
        res.status(500).send(err.message);
    }
});

profileRouter.patch("/", async (req, res, next) => {
    try {
        const id = req.user._id;
        const body = req.body;
        const NOT_ALLOWED_FIELDS = ["email", "password"];
        const isEditNotAllowed = Object.keys(body).some((field) =>
            NOT_ALLOWED_FIELDS.includes(field)
        );
        if (isEditNotAllowed) {
            throw new Error("Something went wrong!!!!");
        }

        await User.findByIdAndUpdate(id, req.body, { runValidators: true });
        res.send("User updated successfully");
    } catch (err) {
        res.status(500).send(err.message);
    }
});

module.exports = profileRouter;
