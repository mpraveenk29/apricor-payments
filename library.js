var request = require('request');
var paymentCtrlr = require('./controllers/payment');
exports.apricorPayment = function(config) {
    var apricorPaymentURL = "http://localhost:3000/api/developer";
    var merchantDetails = {
        environment: 'stage',
        applicationName: config.applicationName,
        merchantId: config.merchantId,
        merchantKey: config.merchantKey
    };
    return {
        paymentOrder: (amountDetails, callback) => {
            amountDetails = {merchantDetails, amountDetails};
            paymentCtrlr.paymentOrderLibrary(amountDetails, callback);
        }
    }
}
