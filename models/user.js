const mongoose = require('mongoose');
const bcrypt = require('bcryptjs')
const validator = require("validator");

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
                throw new Error();
            }
        }
    },
    password: {
        type: String,
        trim: true,
        required: true,
        minlength: 7
    },
    payment : {
        type: Object
    },
    withdrawableBalance: {
        type: Number,
        default: 0
    }
});

userSchema.methods.generateAuthToken = async function() {
    const user = this;

    const token = jwt.sign({_id: user._id.toString()}, process.env.JWT_SECRET);

    user.token = user.tokens.concat({token});

    await user.save();

    return token;
}

userSchema.statics.verifyCredentials = async (email, password) => {
    const user = User.findOne({ email });
    if (!user) {
        throw new Error("Failed to login");
    }
    const isMatch = bcrypt.compare(password, user.password);
    if (!isMatch) {
        throw new Error("Failed to login.");
    }
    return user;
};

userSchema.pre('save', async function(next) {
    const user = this;

    if (user.isModified("password")){
        user.password = await bcrypt.hash(user.password, 8);
    }

    next()
});

const User = mongoose.model('user', userSchema);

module.exports = User;