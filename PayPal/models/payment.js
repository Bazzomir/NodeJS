const mongoose = require('mongoose');

const paymentSchema = mongoose.Schema({
  user: {
    type: mongoose.Types.ObjectId,
    ref: 'user'
  },
  status: {
    type: String,
    required: true
  },
  delivery_address: {
    type: String
  },
}, { timestamps: true });

module.exports = mongoose.model('payment', paymentSchema)
