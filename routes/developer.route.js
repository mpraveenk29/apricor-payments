var express = require('express');
var router = express.Router();
var userCtrlr = require('../controllers/user');
var appCtrlr = require('../controllers/client_application');
var paymentCtrlr = require('../controllers/payment');

// Develoepr - User Authentication
router.post('/user/register', userCtrlr.userRegister);
router.post('/user/login', userCtrlr.userLogin);

// Client Application Setup
router.post('/createApplication', appCtrlr.createApplication);
router.post('/generateKey/:applicationId', appCtrlr.generateKey);
router.get('/applicationDetails/:applicationId', appCtrlr.applicationDetails);
router.post('/accountSettings/:applicationId', appCtrlr.accountSettings);

// Payment
router.post('/payment/order', paymentCtrlr.paymentOrder);
router.get('/payment/checkbalance/:applicationId', paymentCtrlr.checkbalance);
router.post('/payment/refund/:transactionId', paymentCtrlr.refund);
router.get('/payment/transaction/:transactionId', paymentCtrlr.getTransaction);
router.get('/payment/transactions', paymentCtrlr.transactions);


module.exports = router;
