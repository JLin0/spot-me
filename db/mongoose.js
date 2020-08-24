const mongoose = require("mongoose");

mongoose.connect(process.env.MONGODB_URI, {useUnifiedTopology: true, useNewUrlParser: true, useCreateIndex: true})
.then(() => {
    console.log("Yes! Mongoose is connected!")
}).catch(e => {
    console.log("There has been an error connecting to mongoose.");
});