const mongoose = require("mongoose");
const validator = require("validator");
const jwt = require("jsonwebtoken");
const bcrypt = require("bcrypt");

const userSchema = new mongoose.Schema(
    {
        firstName: {
            type: String,
            maxLength: 12,
            minLength: 3,
            required: true,
        },
        lastName: {
            type: String,
            required: true,
            maxLength: 12,
            minLength: 3,
        },
        email: {
            type: String,
            required: true,
            validate(val) {
                if (!validator.isEmail(val)) throw new Error("invalid email");
            },

            //validate: [{
            //     validator: function(v) {
            //         const regex = /\b[A-Za-z0-9._%+-]+@[A-Za-z0-9.-]+\.[A-Z|a-z]{2,}\b/;

            //         return regex.test(v);
            //     },
            //     message: "Not a correct email format"
            // }

            // this is equal to unique
            // {
            //     validator: async function (value) {
            //       // Check if email already exists
            //       if (this.isNew || this.isModified('email')) {
            //         const existing = await mongoose.models.User.findOne({ email: value });
            //         return !existing;
            //       }
            //       return true;
            //     },
            //     message: 'Email already exists'
            //   }],
            lowercase: true,
            trim: true,
            required: true,
            unique: true,
        },
        password: {
            type: String,
            required: true,
            validate(value) {
                if (!validator.isStrongPassword(value)) {
                    throw new Error("Enter a Strong Password: " + value);
                }
            },
        },
        age: {
            type: Number,
        },
        gender: {
            type: String,
            enum: {
                values: ["Female", "Male", "Others"],
            },
        },
        skills: {
            type: [String],
            validate: [
                {
                    validator: function (val) {
                        return val.length <= 5;
                    },
                    message: "Max skills limit is 5",
                },
            ],
        },
        photoUrl: {
            type: String,
            default: "https://geographyandyou.com/images/user-profile.png",
            validate(value) {
                if (!validator.isURL(value)) {
                    throw new Error("Invalid Photo URL: " + value);
                }
            },
        },
    },
    { timestamps: true }
);

userSchema.methods.getJWT = async function () {
    const token = await jwt.sign({ _id: this._id }, "newsupersecret", {
        expiresIn: "1d",
    });

    return token;
};

userSchema.methods.validatePassword = async function (password) {
    const isValid = await bcrypt.compare(password, this.password);
    if (!isValid) {
        throw new Error("Incorrect email or password");
    }
};

const User = mongoose.model("User", userSchema);

module.exports = User;
