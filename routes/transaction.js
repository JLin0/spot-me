const express = require("express");
const router = new express.Router();
const auth = require("../middleware/auth");
const lender = require("../models/user");
const transaction = require("../models/transaction");
const Stripe = require('stripe');
const stripe = Stripe(process.env.STRIPE_KEY);


router.post("/lend", auth, async (req, res) => {
    console.log("Hello from lend")
    
    try {
        const { payment } = await lender.findById(req.query.uuid);
        console.log(payment);
        const charge = await stripe.charges.create({
            amount: req.query.amount,
            currency: 'usd',
            description: 'Example charge',
            source: req.query.token,
        });
        console.log(charge.amount)

        lender.findByIdAndUpdate(req.query.recipient, {
            $inc: {
                withdrawableBalance: charge.amount
            } 
        }, { useFindAndModify: false }, (err, dbRes) => {
            if (err) {
                console.log("OH AN ERROR")
                return res.send(err);
            }
            
        });

        const trans = new transaction({
            borrower: req.query.recipient,
            lender: req.query.uuid,
            amount: charge.amount,
            type: 'lending'
        });
        trans.save((err) => {
            if (err) {
                console.log("Could not save new transaction.");
            }
        })

        res.status(200).send(charge.amount.toString())
    } catch (e) {
        console.log("There has been an error in attempt to charge");
        console.log(e);
        return res.send(e)
    } 
});

router.patch("/disburse", auth, async (req, res) => {
    console.log("Hello from disburse")
    const user = await lender.findOne({
        _id: req.params.id
    })

    if (user.withdrawableBalance < req.query.amount) {
        return res.status(200).send({error: `User ${user._id} has an insufficient balance.`})
    }

    user.withdrawableBalance -= req.query.amount;
    await user.save();
    
    res.status(200).send(user.withdrawableBalance.toString());
});

module.exports = router;