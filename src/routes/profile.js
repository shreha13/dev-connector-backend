const express = require("express");
const { userAuth } = require("../middlewares/auth");
const User = require("../models/user");
const validator = require("validator");
const bcrypt = require("bcrypt");

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

profileRouter.post("/change-password", async (req, res, next) => {
    try {
        const body = req.body;
        const ALLOWED_FIELDS = ["email", "password"];
        const isEditAllowed = Object.keys(body).every((field) =>
            ALLOWED_FIELDS.includes(field)
        );
        if (!isEditAllowed) {
            throw new Error("Something went wrong!!!!");
        }

        if (!validator.isStrongPassword(body.password)) {
            throw new Error("Enter a Strong Password");
        }
        const passwordHash = await bcrypt.hash(body.password, 10);
        const user = await User.findOneAndUpdate(
            { email: body.email },
            { password: passwordHash }
        );
        if (!user) throw new Error("Something went wrong!!!!");
        res.clearCookie("token");
        res.send("password reset, please login");
    } catch (err) {
        res.status(500).send(err.message);
    }
});

module.exports = profileRouter;
