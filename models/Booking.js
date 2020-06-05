const mongoose = require('mongoose');
const { ObjectId } = mongoose.Schema;

const bookingSchema = new mongoose.Schema({
  bookingStartDate: {
    type: Date,
    required: true,
  },
  bookingEndDate: {
    type: Date,
    required: true,
  },
  invoice: {
    type: String,
    required: true,
  },
  date: {
    type: Date,
  },
  itemId: {
    _id: {
      type: ObjectId,
      ref: 'Item',
      require: true,
    },
    title: {
      type: String,
      require: true,
    },
    price: {
      type: Number,
      require: true,
    },
    duration: {
      type: Number,
      require: true,
    },
  },
  total: {
    type: Number,
    require: true,
  },
  memberId: {
    type: ObjectId,
    required: true,
    ref: 'Member',
  },
  // bankId: {
  //   type: ObjectId,
  //   ref: 'Bank',
  // },
  payments: {
    proofPayment: {
      type: String,
      required: true,
    },
    bankFrom: {
      type: String,
      required: true,
    },
    status: {
      type: String,
      default: 'Proses',
    },
    accountHolder: {
      type: String,
      required: true,
    },
  },
});

const Booking = mongoose.model('Booking', bookingSchema);
module.exports = Booking;
