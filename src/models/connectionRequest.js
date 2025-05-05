const mongoose = require("mongoose");

const connectionRequestSchema = new mongoose.Schema({
    sender: {
        type: mongoose.Schema.Types.ObjectId,
        required: true,
        ref: "User",
    },
    receiver: {
        type: mongoose.Schema.Types.ObjectId,
        required: true,
        ref: "User",
    },
    status: {
        type: String,
        enum: {
            values: ["accepted", "rejected", "interested", "ignored"],
        },
        required: true,
    },
});

// creating composite index
connectionRequestSchema.index({ sender: 1, receiver: 1 });

connectionRequestSchema.pre("save", function (next) {
    if (this.sender.equals(this.receiver))
        throw new Error("Cannot send request to your own self");

    next();
});

const ConnectionRequest = mongoose.model(
    "connectionRequest",
    connectionRequestSchema
);

module.exports = ConnectionRequest;
