const User = require("../models/User");
const Product = require("../models/Product");

// Get cart items (Non-admin)
module.exports.getCartItems = async (req, res) => {
  try {
    if (req.user.isAdmin) {
      return res.status(403).send("Admin accounts cannot have a cart.");
    }

    const user = await User.findById(req.user.id);

    return res.status(200).send({
      success: true,
      cart: user.cart,
      cartTotal: user.cartTotal,
    });
  } catch (error) {
    console.log(error);

    return res.status(500).send({
      success: false,
      message: "Failed to retrieve cart items.",
    });
  }
};

// Checkout and place order
module.exports.checkout = async (req, res) => {
  try {
    if (req.user.isAdmin) {
      return res.status(403).send("Admin accounts cannot place orders.");
    }

    // Find user
    const user = await User.findById(req.user.id);

    // Check if cart is empty
    if (!user.cart.length) {
      return res.status(400).send("Cart is empty.");
    }

    // Validate stock before checkout
    for (const item of user.cart) {
      const product = await Product.findById(item.productId);

      if (!product) {
        return res.status(404).send(`${item.productName} not found.`);
      }

      if (product.stock < item.quantity) {
        return res
          .status(400)
          .send(`Insufficient stock for ${item.productName}.`);
      }
    }

    // Save order in user.orders
    user.orders.push({
      products: user.cart,
      totalAmount: user.cartTotal,
    });

    // Update products
    for (const item of user.cart) {
      const product = await Product.findById(item.productId);

      product.orders.push({
        userId: user._id,
        email: user.email,
        productName: item.productName,
        quantity: item.quantity,
      });

      // Deduct stock
      product.stock -= item.quantity;

      await product.save();
    }

    // Clear cart after successful checkout
    user.cart = [];
    user.cartTotal = 0;

    await user.save();

    return res.status(200).send({
      success: true,
      message: "Checkout successful.",
      orders: user.orders,
    });
  } catch (error) {
    console.log(error);

    return res.status(500).send({
      success: false,
      message: "Checkout failed.",
    });
  }
};

// Update quantity in cart (Non-admin)
module.exports.updateCartQuantity = async (req, res) => {
  try {
    const userId = req.user.id;
    const { productId, quantity } = req.body;
    console.log(productId, quantity);
    if (!productId || typeof quantity !== "number" || quantity < 1) {
      return res.status(400).send({
        success: false,
        message: "Invalid product ID or quantity. Quantity must be at least 1.",
      });
    }

    const product = await Product.findById(productId);
    console.log(product);
    if (!product) {
      return res.status(404).send({
        success: false,
        message: "Product not found.",
      });
    }

    if (quantity > product.stock) {
      return res.status(400).send({
        success: false,
        message: `Cannot update quantity. Only ${product.stock} items are in stock.`,
      });
    }

    const user = await User.findById(userId);
    if (!user) {
      return res.status(404).send({
        success: false,
        message: "User not found.",
      });
    }

    const cartItemIndex = user.cart.findIndex(
      (item) => item.productId.toString() === productId,
    );

    if (cartItemIndex === -1) {
      return res.status(404).send({
        success: false,
        message: "Item not found in your cart.",
      });
    }

    user.cart[cartItemIndex].quantity = quantity;
    await user.save();

    return res.status(200).send({
      success: true,
      message: "Quantity updated successfully",
      cartItems: user.cartItems,
    });
  } catch (error) {
    console.error("Error updating cart quantity:", error);
    return res.status(500).send({
      success: false,
      message: "An internal server error occurred.",
    });
  }
};

// Remove item from cart
module.exports.removeFromCart = async (req, res) => {
  try {
    const userId = req.user.id;
    const { productId } = req.body;

    const updatedUser = await User.findByIdAndUpdate(
      userId,
      {
        $pull: { cart: { productId: productId } }, // 'cart' is your array field name
      },
      { new: true }, // Return the updated document after modification
    ).populate("cart.productId"); // Optional: populate product details for frontend

    if (!updatedUser) {
      return res.status(404).json({ message: "User or Cart not found" });
    }

    res.status(200).json({
      message: "Item removed from cart successfully",
      cart: updatedUser.cart, // Send back the updated cart array
    });
  } catch (error) {
    console.error("Error removing item from cart:", error);
    res.status(500).json({ message: "Server error", error: error.message });
  }
};
