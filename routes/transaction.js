const express = require('express');
const router = new express.Router();
const auth = require('../middleware/auth');
const User = require('../models/user');
const transaction = require('../models/transaction');
const stripe = require('../services/stripe');

router.post('/transaction/lend', auth, async (req, res) => {
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

        res.status(200).send(newTransaction);
    } catch (e) {
        return res.status(400).send(e.toString());
    } 
});

// disburse from authenticated account
router.post('/transaction/disburse', auth, async (req, res) => {
    const user = req.user;
    
    try {
        if (user.withdrawableBalance < req.body.amount) {
            throw new Error(`User ${user._id} has an insufficient balance.`);
        }
    
        // Log this lending transaction.
        const newTransaction = new transaction({
            borrower: user._id,
            lender: user._id,
            amount: req.body.amount,
            type: 'disburse',
            description: req.body.description
        });
        await newTransaction.save();
    
        // Deduct the withdrawn amount
        user.withdrawableBalance -= req.body.amount;
        await user.save();
        
        res.status(200).send(newTransaction);
    } catch (e) {
        res.status(400).send(e.toString())
    }
});

module.exports = router;
