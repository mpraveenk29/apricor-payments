var dbURL = "mongodb+srv://apricorpayment:apricorpayment@cluster0-wh4wq.mongodb.net/test?retryWrites=true&w=majority";

const mongoose = require('mongoose');

// mongoose.Promise = global.Promise;

var db = mongoose.connect(dbURL, {
    useNewUrlParser: true,
    useCreateIndex: true,
});


console.log('Mongodb succussfully connected...');