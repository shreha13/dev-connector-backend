const jwt = require("jsonwebtoken");
const User = require("../models/user");

const userAuth = async (req, res, next) => {
    try {
        const { token } = req.cookies;

        if (!token) throw new Error();

        const decoded = await jwt.verify(token, "newsupersecret");

        const user = await User.findById(decoded._id);
        if (!user) throw new Error();
        req.user = user;
        next();
    } catch (err) {
        res.status(500).json({ error: "Invalid Token, please login " });
    }
};

module.exports = {
    userAuth,
};
