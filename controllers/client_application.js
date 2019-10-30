
const mongoose = require('mongoose');
const validator = require('validator');
const jwt = require('jsonwebtoken');
const crypto = require("crypto");
const uuid = require("uuid");

const applicationSchema = mongoose.Schema({
    name: {
        type: String,
        required: true,
        trim: true
    },
    merchantId: {
        type: String,
        required: true,
        trim: true
    },
    merchantKey: {
        type: String,
        required: false,
        trim: true
    },
    successCallabck: {
        type: String,
        required: false
    },
    failureCallabck: {
        type: String,
        required: false
    },
    errorCallabck: {
        type: String,
        required: false
    },
    activate: {
        type: Boolean,
        default: true
    },
    user: {
        type: mongoose.Schema.Types.ObjectId,
        required: true
    },
    accountBalance: {
        type: Number,
        required: false,
        default: 0
    }
});

const clientApplications = mongoose.model('Applications', applicationSchema);

const createApplication = (req, res, next) => {
    try {
        req.body.merchantId = crypto.randomBytes(10).toString("hex");
        req.body.merchantKey = uuid.v1(); // Time Based key
        const cApp = new clientApplications(req.body);
        cApp.save(() => {
            res.status(201).send(cApp);
        });
    } catch (error) {
        res.status(400).send(error);
    }
};

const generateKey = (req, res, next) => {
    try {
        clientApplications.findById(req.params.clientApplications, { 
            user: req.body.user
        }, (err, data) => {
            if (!data || err) {
                return res.status(401).send({error: 'No application found!'})
            } else {
                data.merchantKey = uuid.v1(); // Time Based key
                data.save(() => {
                    res.send(data);
                });
            }
        });
    } catch (error) {
        res.status(400).send(error);
    }
};

const applicationDetails = (req, res, next) => {
    clientApplications.findById(req.params.clientApplications, (err, data) => {
        if (!data || err) {
            return res.status(401).send({error: 'No application found!'})
        } else {
            res.send(data);
        }
    });
};

const accountSettings = (req, res, next) => {
    clientApplications.findById(req.params.clientApplications, (err, data) => {
        if (!data || err) {
            return res.status(401).send({error: 'No application found!'})
        } else {
            data.successCallabck = req.body.successCallabck;
            data.failureCallabck = req.body.failureCallabck;
            data.errorCallabck = req.body.errorCallabck;
            data.activate = req.body.accountSettings;
            data.save(() => {
                res.send(data);
            });
        }
    });
};

module.exports = {
    createApplication: createApplication,
    generateKey: generateKey,
    applicationDetails: applicationDetails,
    accountSettings: accountSettings,
    clientApplicationsModel: clientApplications
};
