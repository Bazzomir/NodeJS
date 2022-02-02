const paypal = require('@paypal/checkout-server-sdk');

require('dotenv').config();

// Creating an environment
let clientId = process.env.PAYPAL_CLIENT_ID;
let clientSecret = process.env.PAYPAL_CLIENT_SECRET;

// This sample uses SandboxEnvironment. In production, use LiveEnvironment
let environment = new paypal.core.SandboxEnvironment(clientId, clientSecret);
let client = new paypal.core.PayPalHttpClient(environment);

// Call API with your client and get a response for your call
let authorize = async function(orderId) {
    const request = new paypal.orders.OrdersAuthorizeRequest(orderId);
    request.requestBody({});
    let response = await client.execute(request);
    console.log(`Response: ${JSON.stringify(response)}`);

    // If call returns body in response, you can get the deserialized version from the result attribute of the response.
    // console.log(`Order: ${JSON.stringify(response.result)}`);
}

authorize('0MA49857ET489842T');