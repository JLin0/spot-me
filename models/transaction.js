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
    }
})
const Transaction = mongoose.model('transaction', transactionSchema)
module.exports = Transaction;