const mongoose = require("mongoose");

const productSchema = new mongoose.Schema({
  productName: {
    type: String,
    required: [true, "Please input the product name."],
  },
  description: {
    type: String,
    required: [true, "Please input the product description."],
  },
  price: {
    type: Number,
    required: [true, "Please input the price."],
  },
  stock: {
    type: Number,
    required: [true, "Please input items available."],
  },
  isAvailable: {
    type: Boolean,
    default: true,
  },
  dateAdded: {
    type: Date,
    default: new Date(),
  },
  category: {
    type: String,
  },
  imageUrl: {
    type: String,
    required: true,
  },
  orders: [
    {
      orderId: {
        type: String,
      },
      userId: {
        type: String,
      },
      email: {
        type: String,
      },
      quantity: {
        type: Number,
        default: 0,
      },
      purchasedOn: {
        type: Date,
        default: new Date(),
      },
    },
  ],
});
module.exports = mongoose.model("Product", productSchema);
