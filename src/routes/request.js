const express = require("express");
const ConnectionRequest = require("../models/connectionRequest");
const User = require("../models/User");

const requestRouter = express.Router();

requestRouter.post("/send/:status/:receiverId", async (req, res, next) => {
    try {
        const senderId = req.user._id;
        const status = req.params.status;
        const receiverId = req.params.receiverId;

        const ALLOWED_STATUS = ["ignored", "interested"];
        isAllowed = ALLOWED_STATUS.includes(status);
        if (!isAllowed) throw new Error("incorrect status");

        const receiver = await User.findById(receiverId);
        if (!receiver) throw new Error("User not found");

        const isConnectionExisting = await ConnectionRequest.findOne({
            $or: [
                { sender: senderId, receiver: receiverId },
                { sender: receiverId, receiver: senderId },
            ],
        });
        console.log(isConnectionExisting);
        if (isConnectionExisting) throw new Error("Request already exists");

        const request = new ConnectionRequest({
            sender: senderId,
            receiver: receiverId,
            status: status,
        });
        await request.save();

        res.json({ message: "Connection request sent successfully" });
    } catch (err) {
        res.status(500).json({ error: err.message });
    }
});

requestRouter.post("/review/:status/:requestId", async (req, res) => {
    try {
        const loggedInUser = req.user;
        const { status, requestId } = req.params;
        const ALLOWED_STATUSES = ["accepted", "rejected"];
        const isUpdateAllowed = ALLOWED_STATUSES.includes(status);
        if (!isUpdateAllowed) throw new Error("Not allowed to accept");
        const connectionRequest = await ConnectionRequest.findOne({
            _id: requestId,
            receiver: loggedInUser._id,
            status: "interested",
        });
        if (!connectionRequest) throw new Error("Request not found");
        connectionRequest.status = status;
        await connectionRequest.save();
        res.json({ message: `Connection request ${status} successfully` });
    } catch (err) {
        res.status(500).json({ error: err.message });
    }
});

requestRouter.get("/", async (req, res) => {
    try {
        const loggedInUser = req.user;
        const requests = await ConnectionRequest.find({
            receiver: loggedInUser._id,
            status: "interested",
        }).populate("sender", ["firstName", "lastName"]);
        res.json({ data: requests });
    } catch (err) {
        res.status(500).json({ error: err.message });
    }
});

module.exports = requestRouter;
