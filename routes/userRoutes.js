const express = require("express");
const router = express.Router();

const userControllers = require("../controllers/userControllers");
const auth = require("../auth");

// User registration
router.post("/register", userControllers.registerUser);

// User login
router.post("/login", userControllers.loginUser);

// Retrieving user details
router.get("/details", auth.verify, userControllers.getUserDetails);

// POST route for resetting the password
router.patch("/reset-password", auth.verify, userControllers.resetPassword);

// Update user profile route
router.put("/update-profile", auth.verify, userControllers.updateProfile);

// Updating role to admin
router.patch(
  "/set-admin/:id",
  auth.verify,
  auth.verifyAdmin,
  userControllers.setAdmin,
);

// Updating role to non-admin
router.patch(
  "/set-non-admin/:id",
  auth.verify,
  auth.verifyAdmin,
  userControllers.setNonAdmin,
);

// Add to cart (Non-admin)
router.post("/add-to-cart", auth.verify, userControllers.addToCart);

// Retrieving user orders
router.get("/my-orders", auth.verify, userControllers.retrieveOrders);

// Retrieving all orders
router.get(
  "/all-orders",
  auth.verify,
  auth.verifyAdmin,
  userControllers.allOrders,
);
module.exports = router;
