const mongoose = require('mongoose');
const validator = require('validator');
const bcrypt = require("bcryptjs")
const jwt = require('jsonwebtoken');

mongoose.connect('mongodb://localhost:27017/stocks_database', { useNewUrlParser: true, useUnifiedTopology: true }).then(() => {
    console.log("Connected to database");
}).catch((err) => {
    console.log("Error is : ", err);
});

const userSchema = new mongoose.Schema({
    name: {
        type: String,
        required: [true, "Please Enter your name"],
        maxLength: [30, "Name cannot exceed 30 characters"],
        minLength: [4, "Name should have more than 4 characters"],
    },
    email: {
        type: String,
        required: [true, "Please Enter your email address"],
        unique: true,
        validate: [validator.isEmail, "Please enter a valid email"],
    },
    password: {
        type: String,
        required: [true, "Please Enter your Password"],
        minLength: [8, "Password should be greater than or equal to 8 characters"],
        select: false,
    },
    date: {
        type: Date,
        default: Date.now()
    },
    tokens: [
        {
            token: {
                type: String,
                required: true,
            },
        },
    ],
});

userSchema.pre("save", async function (next) {

    if (!this.isModified("password")) {
        next();
    }
    this.password = await bcrypt.hash(this.password, 10);
});

//JWT Token
userSchema.methods.getJWTToken = async function () {
    try {
        let token = jwt.sign({ id: this._id }, process.env.JWT_SECRET);
        this.tokens = this.tokens.concat({ token });
        await this.save();
        console.log("ID is : ", this._id);
        // verify if the token is generated or not
        const decoded = jwt.verify(token, process.env.JWT_SECRET);
        return token;
    }
    catch (err) {
        console.log(err);
    }
};

module.exports = mongoose.model("Users", userSchema);
