const mongoose = require("mongoose");

const url= "mongodb+srv://shreyadidwania95:7aEcurdkXe7ubRLu@namastenodecluster.esmqfad.mongodb.net/dev-connector"

const connectDB = async () => {
    await mongoose.connect(url);
}

module.exports = connectDB;