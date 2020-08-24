const express = require("express");
const router = new express.Router();
const auth = require("../middleware/auth");
const lender = require("../models/user");
const transaction = require("../models/transaction");
const stripe = require('../services/stripe');

router.post("/transaction/lend", auth, async (req, res) => {
    console.log("Hello from lend");
    
    try {
        chargeResponse = stripe.charge(req.query.amount, req);

        // Add borrowed money to recipient's withdrawable balance. 
        const recipient = await User.findById(req.query.recipient);
        recipient.withdrawableBalance += charge.amount;
        await recipient.save()

        // Log this lending transaction.
        const trans = new transaction({
            borrower: req.query.recipient,
            lender: req.query.uuid,
            amount: charge.amount,
            type: 'lending'
        });
        await trans.save();

        res.status(200).send(charge.amount.toString())
    } catch (e) {
        console.log("There has been an error in attempt to charge");
        console.log(e);
        return res.send(e)
    } 
});

router.post("/transaction/disburse", auth, async (req, res) => {
    console.log("Hello from disburse");
    const user = await lender.findOne({
        _id: req.params.id
    })

    if (user.withdrawableBalance < req.query.amount) {
        return res.status(400).send({error: `User ${user._id} has an insufficient balance.`})
    }

    // Deduct the withdrawn amount
    user.withdrawableBalance -= req.query.amount;
    await user.save();
    
    res.status(200).send({message: `User ${user._id} has withdrawn.`});
});

module.exports = router;