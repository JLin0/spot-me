const express = require("express");
const router = new express.Router();
const auth = require("../middleware/auth");
const User = require("../models/user");

router.post('/user/create', (req, res) => {
    console.log("Hello from create endpoint");
    const newUser = new lender({
        fName: req.query.fName,
        lName: req.query.lName,
    });

    try {
        await newUser.save();
        const token = await newUser.generateAuthToken();

        res.status(201).send({ user, token });
    } catch (e) {
        res.status(400).send(e);
    }
    
});

router.post("/user/login", (req, res) => {
    console.log("Hello the login endpoint")
    try {
        const user = await User.findByCredentials(req.query.email, req.query.password);
        const token = await user.generateAuthToken();
        res.send(200).send({user, token});
    } catch(e) {
        res.status(400).send("Failed to login.")
    }
    
});

router.post("/user/logout", auth, async (req, res) => {

});

router.post("/user/logoutAll", auth, async (req, res) => {

});

router.get("/user", auth, (req, res) => {
    console.log("Hello from get account")
    const uid = req.params.uid;
    lender.findOne({
        _id: uid
    }).then((user) => {
        res.status(200).send(user);
    }).catch(e => {
        res.status(404).send(e);
    });
});

module.exports = router