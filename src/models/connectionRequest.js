const mongoose = require("mongoose");

const connectionRequestSchema = new mongoose.Schema({
    sender: {
        type: mongoose.Schema.Types.ObjectId,
        required: true,
    },
    receiver: {
        type: mongoose.Schema.Types.ObjectId,
        required: true,
    },
    status: {
        type: String,
        enum: {
            values: ["accepted", "rejected", "interested", "ignored"],
        },
        required: true,
    },
});

const ConnectionRequest = mongoose.model(
    "connectionRequest",
    connectionRequestSchema
);

module.exports = ConnectionRequest;
