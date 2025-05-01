const express = require("express");

const app = express();

app.use((req, res) => {
    res.send("Yes, I'm listening")
})

app.listen(8000, () => {
    console.log("app is running")
})