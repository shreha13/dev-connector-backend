const express = require('express');
const connectDB = require('./config/database');
const User = require('./models/user');
const bcrypt = require('bcrypt');
const validator = require('validator');
const cookieParser = require('cookie-parser');
const jwt = require('jsonwebtoken');
const { userAuth } = require('./middlewares/auth');

const app = express();
app.use(express.json());
app.use(cookieParser());

app.get('/users', (req, res, next) => {
    User.find().then((users) => {
        res.send(users);
    });
});
app.patch('/users/:userId', (req, res, next) => {
    try {
        const id = req.params.userId;
        const body = req.body;
        if (body.email) {
            throw new TypeError('email change is not allowed');
        }
        User.findByIdAndUpdate(id, req.body, { runValidators: true })
            .then((users) => {
                res.send(users);
            })
            .catch((err) => res.send('error: ' + err));
    } catch (err) {
        res.status(500).send(err.message);
    }
});

app.post('/login', async (req, res, next) => {
    try {
        const { email, password } = req.body;
        const user = await User.findOne({ email });
        const isValid = await bcrypt.compare(password, user?.password ?? '');
        if (!isValid) {
            throw new Error('Incorrect email or password');
        }
        // CREATE JWT TOKEN
        const token = await jwt.sign({ _id: user._id }, 'newsupersecret', {
            expiresIn: '10m',
        });

        // ADD TOKEN TO COOKIE AND SEND BACK
        res.cookie('token', token);
        res.send('Loggedin successfully');
    } catch (err) {
        res.status(500).send(err.message);
    }
});

app.get('/profile', userAuth, async (req, res, next) => {
    try {
        const user = req.user;
        res.send(user);
    } catch (err) {
        res.status(500).send(err.message);
    }
});

app.post('/signup', async (req, res, next) => {
    try {
        const { firstName, lastName, email, password } = req.body;
        if (!validator.isStrongPassword(password)) {
            throw new Error('Enter a Strong Password');
        }
        const passwordHash = await bcrypt.hash(password, 10);
        const user = new User({
            firstName,
            lastName,
            email,
            password: passwordHash,
        });
        await user.save();
        res.send('Saved successfully!');
    } catch (err) {
        res.status(500).send(err.message);
    }
});

connectDB()
    .then(() => {
        console.log('Database connection established');
        app.listen(8000, () => {
            console.log('app is running');
        });
    })
    .catch((err) => console.log('Error connecting to the database'));
