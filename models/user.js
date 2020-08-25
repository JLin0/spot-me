const mongoose = require('mongoose');
const bcrypt = require('bcryptjs')
const validator = require('validator');
const jwt = require('jsonwebtoken');

const userSchema = new mongoose.Schema({
    firstName : {
        type: String,
        required: true
    },
    lastName: {
        type: String,
        required: true
    },
    email: {
        type: String,
        required: true,
        unique: true,
        validate(value) {
            if (!validator.isEmail(value)){
                throw new Error('Incorrect email form.');
            }
        }
    },
    password: {
        type: String,
        trim: true,
        required: true,
        minlength: 7
    },
    withdrawableBalance: {
        type: Number,
        default: 0
    },
    tokens: [{
        token: {
            type: String,
            required: true
        }
    }]
});

// Remove sensitive information before return user info back to endpoint caller.
userSchema.methods.toJSON = function() {
    const user = this;
    const userObject = user.toObject();

    delete userObject.password;
    delete userObject.tokens;

    return userObject;
};

// Generate a json web token with user id and our secret key phrase.
userSchema.methods.generateAuthToken = async function() {
    const user = this;

    const token = jwt.sign({_id: user._id.toString()}, process.env.JWT_SECRET);

    user.tokens = user.tokens.concat({ token });
    await user.save();

    return token;
}

// See if there is a user with such an email and password.
userSchema.statics.verifyCredentials = async (email, password) => {
    const user = await User.findOne({ email });
    if (!user){
        throw new Error();
    }
    const isMatch = await bcrypt.compare(password, user.password)
    if (!isMatch) {
        throw new Error('Failed to login. Your email or username is incorrect.');
    }

    return user;
};

// hash password again in case it is changed.
userSchema.pre('save', async function(next) {
    const user = this;

    if (user.isModified('password')) {
        user.password = await bcrypt.hash(user.password, 8);
    }

    next();
});

const User = mongoose.model('User', userSchema);

module.exports = User;
