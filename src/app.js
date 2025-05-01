const express = require("express");
const connectDB = require('./config/database');
const { default: mongoose } = require("mongoose");
const User = require("./models/user");

const app = express();

app.post("/signup", (req,res,next) => {
    const userObj = req.body;
    console.log(req);
    console.log(userObj);
    const user = new User(userObj);
    user.save().then(() => res.send("Saved successfully!")).catch(() => res.send("error"))
})

connectDB().then(() => {
    console.log("Database connection established");
    app.listen(8000, () => {
        console.log("app is running")
    })
}).catch(err => console.log("Error connecting to the database"))