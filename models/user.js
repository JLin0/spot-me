const mongoose = require('mongoose');
const bcrypt = require('bcryptjs')
const validator = require('validator');
const jwt = require('jsonwebtoken');

const userSchema = new mongoose.Schema({
    fName : {
        type: String,
        required: true
    },
    lName: {
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

userSchema.methods.toJSON = function() {
    const user = this;
    const userObject = user.toObject();

    delete userObject.password;
    delete userObject.tokens;

    return userObject;
};

userSchema.methods.generateAuthToken = async function() {
    const user = this;

    const token = jwt.sign({_id: user._id.toString()}, process.env.JWT_SECRET);

    user.tokens = user.tokens.concat({ token });
    await user.save();

    return token;
}

userSchema.statics.verifyCredentials = async (email, password) => {
    const user = User.findOne({ email });
    if (!user) {
        throw new Error('Failed to login. Your email or username is incorrect.');
    }

    const isMatch = bcrypt.compare(password, user.password);
    if (!isMatch) {
        throw new Error('Failed to login. Your email or username is incorrect.');
    }

    return user;
};

userSchema.pre('save', async function(next) {
    const user = this;

    if (user.isModified('password')){
        user.password = await bcrypt.hash(user.password, 8);
    }

    next();
});

const User = mongoose.model('user', userSchema);

module.exports = User;
