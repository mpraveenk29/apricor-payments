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
