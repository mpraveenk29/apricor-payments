## apricor-payments 

The apricor-payments Node library provides integration access to the apricor-payments Gateway sandbox, This is demo application for API documentation and node library.

## Installation

* `npm install apricor-payments`
* `var apricorPayment = require('apricor-payments')`

### Dependencies

* node >= 4

## Quick Start

```javascript
var apricorPayment = require('apricor-payments');

var gateway = apricorPayment({
  environment: 'stage', // 'prod'
  merchantId: 'your_merchant_id',
  merchantKey: 'your_merchant_key',
  applicationName: 'your_applicatin_name'
});

gateway.paymentOrder({
  amount: 50.00,
  currency: 'INR'
}, function (err, result) {
  if (err) {
    console.error(err);
    return;
  }

  console.log('Transaction details', result.transactionId);
  console.log('Transaction paid amount'. result.amountPaid);
});
```

## API's for apricor-payment gateway sandbox
* register and login
* client application creation and settings
* payment order, check balance etc

** Clone the repository and start the server
`npm start`

```
// User Authentication
http://localhost:3000/api/developer/user/register
http://localhost:3000/api/developer/user/login

// Client Application Setup
http://localhost:3000/api/developer/createApplication
http://localhost:3000/api/developer/generateKey/:applicationId
http://localhost:3000/api/developer/applicationDetails/:applicationId
http://localhost:3000/api/developer/accountSettings/:applicationId

// Payment
http://localhost:3000/api/developer/payment/order
http://localhost:3000/api/developer/payment/checkbalance/:applicationId
http://localhost:3000/api/developer/payment/refund/:transactionId
http://localhost:3000/api/developer/payment/transaction/:transactionId
http://localhost:3000/api/developer/payment/transactions
```
