const mongoose = require('mongoose');
const { ObjectId } = mongoose.Schema;

const itemSchema = new mongoose.Schema({
  title: {
    type: String,
    required: true,
  },
  price: {
    type: String,
    required: true,
  },
  city: {
    type: String,
    required: true,
  },
  country: {
    type: String,
    default: 'Indonesia',
  },
  isPopular: {
    type: Boolean,
    default: false,
  },
  sumBooking: {
    type: Number,
    default: 0,
  },
  description: {
    type: String,
    required: true,
  },
  unit: {
    type: String,
    default: 'night',
  },
  categoryId: [
    {
      type: ObjectId,
      ref: 'Category',
    },
  ],
  imageId: [
    {
      type: ObjectId,
      ref: 'Image',
    },
  ],
  featureId: [
    {
      type: ObjectId,
      ref: 'Feature',
    },
  ],
  activityId: [
    {
      type: ObjectId,
      ref: 'Activity',
    },
  ],
});

const Item = mongoose.model('Item', itemSchema);
module.exports = Item;
