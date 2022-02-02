const mongoose = require('mongoose');

const transactionSchema = mongoose.Schema({
  amount: {
    type: Number,
    required: true
  },
  type: {
    type: String,
    required: true
  },
  external_reference: {
    type: String,
    required: true
  },
  processor_response: {
    type: String,
    required: true
  },
  payment: {
    type: mongoose.Types.ObjectId,
    ref: 'payment'
  }
}, { timestamps: true });

module.exports = mongoose.model('transaction', transactionSchema)
