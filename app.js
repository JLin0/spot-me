const express = require('express');
const app = express();

require('dotenv').config();
require('./db/mongoose');

const port = process.env.PORT || 3000;

const spotterRouter = require('./routes/user');
const transactionRouter = require('./routes/transaction');

app.use(express.json());
app.use(spotterRouter);
app.use(transactionRouter);

app.get('/', (req, res) => {
    res.status(200).send("Hello from the spot-me home endpoint.");
});

 app.listen(port, () => {
     console.log("The server is up and running.");
 });