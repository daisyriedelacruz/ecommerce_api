const express = require("express");
const router = express.Router();
const cartControllers = require("../controllers/cartControllers");
const auth = require("../auth");

// Get cart items (Non-admin)
router.get("/", auth.verify, cartControllers.getCartItems);

// Update quantity in cart
router.patch(
  "/update-cart-quantity",
  auth.verify,
  cartControllers.updateCartQuantity,
);

// Remove item from cart
router.delete("/remove-from-cart", auth.verify, cartControllers.removeFromCart);

// Checkout and place order
router.post("/checkout", auth.verify, cartControllers.checkout);

module.exports = router;
