const mongoose = require('mongoose');

const transactionSchema = new mongoose.Schema({
    borrower : {
        type: String
    },
    lender: {
        type: String
    },
    amount: {
        type: Number,
        default: 0
    },
    type: {
        type: String,
        default: ""
    },
    ts: {
        type: Date,
        default: Date.now
    },
    description: {
        type: String,
        default: "No description"
    }
});

const Transaction = mongoose.model('Transaction', transactionSchema);

module.exports = Transaction;
