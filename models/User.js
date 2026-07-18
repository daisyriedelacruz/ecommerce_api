const mongoose = require("mongoose");

const userSchema = new mongoose.Schema({
  firstName: {
    type: String,
    required: [true, "Please input your first name."],
  },
  lastName: {
    type: String,
    required: [true, "Please input your last name."],
  },
  age: {
    type: Number,
    required: [true, "Please input your age."],
  },
  email: {
    type: String,
    required: [true, "Please input your active email."],
  },
  password: {
    type: String,
    required: [true, "Please input your password."],
  },
  contactNumber: {
    type: String,
    required: [true, "Please input your contact number."],
  },
  address: {
    type: String,
    required: [true, "Please input your address."],
  },
  isAdmin: {
    type: Boolean,
    default: false,
  },
  dateCreated: {
    type: Date,
    default: new Date(),
  },
  cart: [
    {
      productId: String,
      productName: String,
      imageUrl: String,
      price: Number,
      quantity: Number,
      subtotal: Number,
    },
  ],

  cartTotal: {
    type: Number,
    default: 0,
  },

  orders: [
    {
      products: [
        {
          productId: {
            type: String,
            required: [true, "Please enter your product ID."],
          },
          productName: {
            type: String,
            required: [true, "Please enter your product name."],
          },
          price: {
            type: Number,
          },
          imageUrl: { type: String },
          quantity: {
            type: Number,
            default: 0,
          },
        },
      ],
      totalAmount: {
        type: Number,
        required: [true, "Please input the total amount of orders."],
      },
      purchasedOn: {
        type: Date,
        default: new Date(),
      },
    },
  ],
});

module.exports = mongoose.model("User", userSchema);
