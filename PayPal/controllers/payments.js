const paypal = require('@paypal/checkout-server-sdk');
const client = require('../utilities/paypal/client');
const Payment= require('../models/payment');
const Transaction= require('../models/transaction');

module.exports = {
  create: async (req, res) => {
    let request = new paypal.orders.OrdersCreateRequest();
    request.headers["prefer"] = "return=representation";
    request.requestBody({
        "intent": "AUTHORIZE",
        "purchase_units": [
            {
                "amount": {
                    "currency_code": req.body.currency_code,
                    "value": req.body.amount
                }
            }
        ]
    });

    let response = await client.execute(request);

    // console.log(request);
    // console.log(response);

    let approveLink = '';
    response.result.links.every(link => {
      if (link.rel == 'approve') {
        approveLink = link.href;
        return false;
      }

      return true;
    });

    res.status(response.statusCode)
       .send({
         order_id: response.result.id,
         approve_link: approveLink
       })
  },
  authorize: async (req, res) => {
    const request = new paypal.orders.OrdersAuthorizeRequest(req.body.order_id);
    request.requestBody({});
    let response = await client.execute(request);

    let authorization = response.result.purchase_units[0].payments.authorizations[0];

    const payment = await Payment.create({
      user: req.user.id,
      status: 'authorized',
      delivery_address: req.body.delivery_address
    })

    const transaction = await Transaction.create({
      amount: authorization.amount.value,
      payment: payment,
      type: 'authorization',
      external_reference: authorization.id,
      processor_response: JSON.stringify(response.result)
    })

    console.log(request);
    console.log(response);

    res.status(response.statusCode)
       .send({
          transaction: transaction
       })
  },
  void: async (req, res) => {
    let transaction = await Transaction.findOne({ payment: req.params.id, type: 'authorization' });
    const request = new paypal.payments.AuthorizationsVoidRequest(transaction.external_reference);
    let response = await client.execute(request);

    transaction = await Transaction.create({
      amount: transaction.amount,
      payment: transaction.payment,
      type: 'void',
      external_reference: transaction.external_reference,
      processor_response: JSON.stringify(response)
    })

    await Payment.findByIdAndUpdate(req.params.id, { status: 'voided' });

    console.log(request);
    console.log(response);

    res.status(response.statusCode)
       .send({
          transaction: transaction
       })
  },
  capture: async (req,res)=>{
    let transaction = await Transaction.findOne({payment: req.params.id, type: 'authorization'});
    const request = new paypal.payments.AuthorizationsCaptureRequest(transaction.external_reference);
    request.requestBody({});
    let response = await client.execute(request);
    // console.log(request);
    // console.log(response);

    let capture = response.result;

      transaction = await Transaction.create({
      amount: transaction.amount,
      payment: req.params.id,
      type: 'capture',
      external_reference: capture.id,
      processor_response: JSON.stringify(response.result)
    })

    // console.log(request);
    // console.log(response);
    await Payment.findByIdAndUpdate(req.params.id, { status: 'captured' });

    res.status(response.statusCode)
       .send({
          transaction: transaction
       })
    },
    refund: async(req,res)=>{
      let transaction = await Transaction.findOne({payment: req.params.id, type: 'capture'});
      const request = new paypal.payments.CapturesRefundRequest(transaction.external_reference);
      request.requestBody({});
      let response = await client.execute(request);
      
      console.log(request);
      console.log(response);

      let refund = response.result;
      
      transaction = await Transaction.create({
        amount: transaction.amount,
        payment: req.params.id,
        type: 'refund',
        external_reference: refund.id,
        processor_response: JSON.stringify(response.result)
      })
      await Payment.findByIdAndUpdate(req.params.id, { status: 'refunded' });


      res.status(response.statusCode).send({
        transaction: transaction
      });
    }
};
