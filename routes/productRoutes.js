const express = require("express");
const auth = require("../auth");
const router = express.Router();
const productControllers = require("../controllers/productControllers");

// Adding a product
router.post("/", auth.verify, productControllers.addProduct);

// Retrieving all active products
router.get("/", productControllers.getAvailableProducts);

// Retrieving all products
router.get(
  "/all",
  auth.verify,
  auth.verifyAdmin,
  productControllers.getAllProducts,
);

router.get("/search-name", productControllers.searchProductsByName);
router.get("/search-price", productControllers.searchProductsByPrice);

// Retrieve a product
router.get("/:productId", productControllers.getProduct);

// Updating a product
router.patch("/:productId", auth.verify, productControllers.updateProduct);

// Archiving a product
router.patch(
  "/archive/:productId",
  auth.verify,
  productControllers.archiveProduct,
);

// Activating a product
router.patch(
  "/activate/:productId",
  auth.verify,
  productControllers.activateProduct,
);

module.exports = router;
