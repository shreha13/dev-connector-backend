const mongoose = require("mongoose");

const userSchema = new mongoose.Schema({
    firstName: {
        type: String,
        maxLength: 12,
        minLength: 3,
        required: true
    },
    lastName: {
        type: String,
        required: true,
        maxLength: 12,
        minLength: 3
    },
    email: {
        type: String,
        required: true,
        validate: [{
            validator: function(v) {
                const regex = /\b[A-Za-z0-9._%+-]+@[A-Za-z0-9.-]+\.[A-Z|a-z]{2,}\b/;

                return regex.test(v);
            },
            message: "Not a correct email format"
        }
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
        //   }
        ], 
        lowercase: true, 
        trim: true,
        required: true,
        unique: true
    },
    password: {
        type: String,
        required: true
    },
    age: {
        type: Number
    },
    gender: {
        type: String,
        enum: {
            values: ["Female", "Male", "Others"]
        }
    },
    skills: {
        type: [String]
    }
}, { timestamps: true });

const User = mongoose.model("User", userSchema);

module.exports = User;

