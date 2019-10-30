
const mongoose = require('mongoose');
const validator = require('validator');
const jwt = require('jsonwebtoken');
const crypto = require("crypto");
const uuid = require("uuid");
const clientApplicationsModel = require('./client_application');

const transactionShema = mongoose.Schema({
    transactionId: {
        type: String,
        required: true,
        trim: true
    },
    merchantId: {
        type: String,
        required: true,
        trim: true
    },
    amount: {
        type: Number,
        required: true
    },
    currency: {
        type: String,
        required: true
    },
    date: {
        type: Date, // `Date.now()` returns the current unix timestamp as a number
        default: Date.now
    },
    status: {
        type: String, // success, failure, refund
        required: true
    },
    applicationId: {
        type: mongoose.Schema.Types.ObjectId,
        required: true
    }
});

const transactionModel = mongoose.model('transactions', transactionShema);


const paymentOrderLibrary = (paymentDetails, callback) => {
    // Validation for required fields
    var requiredFields = ['applicationId', 'amount', 'currency', 'merchantId', 'cardNumber'];
    var bodyKeys = Object.keys(paymentDetails);
    var isRequiredFields = false;
    for (let key in requiredFields) {
        if (bodyKeys.indexOf(key) === -1) {
            isRequiredFields = true;
        }
    }
    if (isRequiredFields) {
        // return res.status(400).send('Fields are required!!')
        callback({
            status: 400,
            error: 'Fields are required!!'
        }, null);
    }
    // here Need to connect Bank processor for Card validation
    if (paymentDetails.cardNumber !== '4444444444444444') {
        // return res.status(400).send('Card declined')
        callback({
            status: 400,
            error: 'Card declined'
        }, null);
    }
    clientApplicationsModel.findById(paymentDetails.applicationId , (err, data) => {
        if (!data || err) {
            // return res.status(401).send({error: 'No application found!'})
            callback({
                status: 401,
                error: 'No application found!'
            }, null);
        } else {
            // Here need to validate application currency type 
            // And Need to Bank processor APIs (right now this is dummy API)
            paymentDetails.transactionId = crypto.randomBytes(16).toString("hex");
            data.accountBalance += paymentDetails.amount;
            const transaction = new transactionModel(paymentDetails);
            data.save(() => {
                transaction.save( ()=> {
                    callback(null, {
                        status: 'success',
                        amountPaid: paymentDetails.amount,
                        transactionId: paymentDetails.transactionId // RRN
                    });
                });
            });
        }
    });
}

const paymentOrder = (req, res, next) => {
    paymentOrderLibrary(req.body, (err, data) => {
        if (err) {
            res.status(err.status).send(err.error);
        } else {
            res.send(data);
        }
    })
};

const checkbalance = (req, res, next) => {
    clientApplicationsModel.findById(req.params.applicationId, (err, data) => {
        if (!data || err) {
            return res.status(401).send({error: 'No application found!'})
        } else {
            res.send({
                accountBalance: data.accountBalance
            });
        }
    });
};

const refund = (req, res, next) => {
    // Refund code
};

const getTransaction = (req, res, next) => {
    try {
        transactionModel.findById(req.params.transactionId, (err, data) => {
            if (!data || err) {
                return res.status(401).send({error: 'No transaction found!'})
            } else {
                res.send(data);
            }
        });
    } catch (error) {
        res.status(400).send(error);
    }
};

const transactions = (req, res, next) => {
    try {
        transactionModel.find({}, (err, data) => {
            if (!data || err) {
                return res.status(401).send({error: 'No transaction found!'})
            } else {
                res.send(data);
            }
        });
    } catch (error) {
        res.status(400).send(error);
    }
};

module.exports = {
    paymentOrder: paymentOrder,
    checkbalance: checkbalance,
    refund: refund,
    getTransaction: getTransaction,
    transactions: transactions,
    paymentOrderLibrary: paymentOrderLibrary
}
