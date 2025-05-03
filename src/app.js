const express = require("express");
const connectDB = require('./config/database');
const { default: mongoose } = require("mongoose");
const User = require("./models/user");

const app = express();
app.use(express.json());

app.get("/users", (req, res, next) => {
    User.find().then((users) => {
        res.send(users)
    })
})
app.patch("/users/:userId", (req, res, next) => {
    const id = req.params.userId;
    User.findByIdAndUpdate(id, req.body, { runValidators: true }).then((users) => {
        res.send(users)
    }).catch((err) => res.send("error: "+ err))
})

app.post("/signup", (req,res,next) => {
    const userObj = req.body;
    console.log(userObj);
    const user = new User(userObj);
    user.save().then(() => res.send("Saved successfully!")).catch((err) => res.send("error: "+ err))
})

connectDB().then(() => {
    console.log("Database connection established");
    app.listen(8000, () => {
        console.log("app is running")
    })
}).catch(err => console.log("Error connecting to the database"))