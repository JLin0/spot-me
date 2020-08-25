const express = require('express');
const router = new express.Router();
const auth = require('../middleware/auth');
const User = require('../models/user');
const transaction = require('../models/transaction');
const stripe = require('../services/stripe');

router.post('/transaction/lend', auth, async (req, res) => {
    console.log('Hello from lend');
    
    try {
        chargeResponse = await stripe.createCharge(req.body.amount, req.body.chargeDescription, req.body.chargeSource);

        // Add borrowed money to recipient's withdrawable balance. 
        const recipient = await User.findById(req.body.recipient);
        if (chargeResponse.captured){
            recipient.withdrawableBalance += chargeResponse.amount;
            await recipient.save()
        }

        // Log this lending transaction.
        const newTransaction = new transaction({
            borrower: req.body.recipient,
            lender: req.user._id,
            amount: req.body.amount,
            type: 'lending',
            description: chargeResponse.description
        });
        await newTransaction.save();

        res.status(200).send(chargeResponse.amount.toString());
    } catch (e) {
        return res.status(400).send(e.toString());
    } 
});

router.post('/transaction/disburse', auth, async (req, res) => {
    console.log('Hello from disburse');
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
