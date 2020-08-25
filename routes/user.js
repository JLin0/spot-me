const express = require('express');
const router = new express.Router();
const auth = require('../middleware/auth');
const User = require('../models/user');

router.post('/user/create', async (req, res) => {
    const newUser = new User(req.body);

    try {
        await newUser.save();

        const token = await newUser.generateAuthToken();

        res.status(201).send({ newUser, token });
    } catch (e) {
        res.status(400).send(`Failed to create a new user: ${e.toString()}`);
    }
});

router.post('/user/login', async (req, res) => {
    console.log('Hello, from the login endpoint');
    try {
        const user = await User.verifyCredentials(req.body.email, req.body.password);
        const token = await user.generateAuthToken();
        res.status(200).send({ user, token });
    } catch(e) {
        res.status(400).send(`Failed to login: ${e.toString()}`);
    }
});

router.post('/user/logout', auth, async (req, res) => {
    try {
        req.user.tokens = req.user.tokens.filter((token) => {
            return token.token !== req.token;
        });
        await req.user.save();
        res.status(200).send('You have been logged out.');
    } catch (e) {
        res.status(500).send(e.toString());
    }
});

// logout of all devices and clear json web tokens
router.post('/user/logoutAll', auth, async (req, res) => {
    try {
        req.user.tokens = [];
        await req.user.save();
        res.status(200).send('You have been logged out of all devices.');
    } catch(e) {
        res.status(500).send(e);
    }
});

// get up to date info on logged in user
router.get('/user', auth, async (req, res) => {
    res.status(200).send(req.user);
});

module.exports = router;
