const express = require('express');
const connectDB = require('./config/database');
const User = require('./models/user');
const bcrypt = require('bcrypt');
const validator = require('validator');
const cookieParser = require('cookie-parser');
const { userAuth } = require('./middlewares/auth');
const profileRouter = require('./routes/profile');
const requestRouter = require('./routes/request');
const userRouter = require('./routes/user');

const app = express();
app.use(express.json());
app.use(cookieParser());

app.use('/profile', profileRouter);
app.use('/requests', requestRouter);
app.use('/', userRouter);

connectDB()
    .then(() => {
        console.log('Database connection established');
        app.listen(8000, () => {
            console.log('app is running');
        });
    })
    .catch((err) => console.log('Error connecting to the database'));
