const express = require("express");
const router = new express.Router();
const auth = require("../middleware/auth");
const lender = require("../models/user");

router.post('/create', (req, res) => {
    console.log("Hello from create endpoint");
    const newUser = new lender({
        fName: req.query.fName,
        lName: req.query.lName,
        payment: null
    });
    
    newUser.save((err) =>{
        if (err) {
            console.log("Could not create new user.")
            console.log(err);
            return res.send(err)
        }
        res.send(`Your new user was created: ${newUser._id}`)
    })
});

router.post("/user/login", (req, res) => {
    console.log("Hello the login endpoint")
    const uid = req.params.uid;
    lender.findOne({
        _id: uid
    }).then((user) => {
        res.status(200).send(user);
    }).catch(e => {
        res.status(404).send(e);
    });
});

router.post("/user/logout/", auth, async (req, res) => {

});

router.get("/account", auth, (req, res) => {
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