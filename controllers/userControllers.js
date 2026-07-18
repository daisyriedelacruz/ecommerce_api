const User = require("../models/User");
const Product = require("../models/Product");
const bcrypt = require("bcrypt");
const auth = require("../auth");

// User registration
module.exports.registerUser = (req, res) => {
  return User.find({ email: req.body.email }).then((result) => {
    if (result.length > 0) {
      return res.status(409).send({ message: "Email already exists!" });
    } else if (!req.body.email.includes("@")) {
      return res.status(400).send({ message: "Invalid email format" });
    } else if (req.body.contactNumber.length !== 11) {
      return res
        .status(400)
        .send({ message: "Contact number must be 11 characters long" });
    } else if (req.body.password.length < 8) {
      return res
        .status(400)
        .send({ message: "Password must be atleast 8 characters long" });
    } else if (
      typeof req.body.firstName !== "string" ||
      typeof req.body.lastName !== "string"
    ) {
      return res
        .status(400)
        .send({ message: "First name and last name must be strings" });

      // If all needed requirements are achieved
    } else if (req.body.age >= 18) {
      let newUser = new User({
        firstName: req.body.firstName,
        lastName: req.body.lastName,
        email: req.body.email,
        age: req.body.age,
        password: bcrypt.hashSync(req.body.password, 10),
        address: req.body.address,
        contactNumber: req.body.contactNumber,
      });

      return newUser
        .save()
        .then((user) => {
          res.status(201).send({
            message: "Congratulations! Your account has been created!",
          });
        })
        .catch((error) => {
          console.log(error);
          res.status(500).send({
            message: "An error occurred while creating your account.",
          });
        });
    } else {
      return res
        .status(400)
        .send({ message: "You must be at least 18 years old to register." });
    }
  });
};

// User login
module.exports.loginUser = (req, res) => {
  return User.findOne({ email: req.body.email }).then((result) => {
    if (result == null) {
      return res.status(404).send({ message: "No user found!" });
    } else {
      const isPasswordCorrect = bcrypt.compareSync(
        req.body.password,
        result.password,
      );

      if (isPasswordCorrect) {
        return res.status(200).send({ access: auth.createAccessToken(result) });
      } else {
        return res
          .status(401)
          .send({ message: "Incorrect email or password!" });
      }
    }
  });
};

// Retrieve user details
module.exports.getUserDetails = (req, res) => {
  return User.findById(req.user.id)
    .then((user) => {
      if (!user) {
        // if user not found,
        return res.status(404).send({ message: "User not found" });
      } else {
        // if the user is found, return the user.
        user.password = "";
        return res.status(200).send(user);
      }

      user.password = "";
      res.status(200).send(user);
    })
    .catch((error) => errorHandler(error, req, res));
};

// Reset password
module.exports.resetPassword = async (req, res) => {
  try {
    const { currentPassword, newPassword } = req.body;
    const { id } = req.user;

    const user = await User.findById(id);
    if (!user) {
      return res.status(404).json({ message: "User not found" });
    }

    if (newPassword.length < 8) {
      return res
        .status(400)
        .json({ message: "Password must be at least 8 characters." });
    }

    const isMatch = await bcrypt.compare(currentPassword, user.password);
    if (!isMatch) {
      return res
        .status(400)
        .json({ updated: false, message: "Incorrect current password." });
    }

    const hashedPassword = await bcrypt.hash(newPassword, 10);

    await User.findByIdAndUpdate(
      id,
      { password: hashedPassword },
      { returnDocument: "after" },
    );

    res
      .status(200)
      .json({ updated: true, message: "Password reset successfully!" });
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: "Internal server error" });
  }
};

// Update the user profile
module.exports.updateProfile = async (req, res) => {
  try {
    const userId = req.user.id;

    const { firstName, lastName, contactNumber, email, address } = req.body;

    if (contactNumber.length !== "11") {
      return res
        .status(400)
        .send({ message: "Contact number must be 11 characters" });
    }

    const updatedUser = await User.findByIdAndUpdate(
      userId,
      { firstName, lastName, contactNumber, email, address },
      { returnDocument: "after" },
    );

    res.json({ updatedUser, message: "Details successfully updated!" });
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: "Failed to update profile" });
  }
};

// Update user role to admin
module.exports.setAdmin = (req, res) => {
  let updateRole = {
    isAdmin: true,
  };
  console.log(req.user.isAdmin);
  if (req.user.isAdmin) {
    return User.findByIdAndUpdate(req.params.id, updateRole, { new: true })
      .then((result) => {
        res.send(result);
      })
      .catch((error) => {
        res.send(false);
      });
  } else {
    return res.status(401).send("You have no access to this page!");
  }
};

// Update user role to non-admin
module.exports.setNonAdmin = (req, res) => {
  let updateRole = {
    isAdmin: false,
  };
  console.log(req.user.isAdmin);
  if (req.user.isAdmin) {
    return User.findByIdAndUpdate(req.params.id, updateRole, { new: true })
      .then((result) => {
        res.send(result);
      })
      .catch((error) => {
        res.send(false);
      });
  } else {
    return res.status(401).send("You have no access to this page!");
  }
};

// Retrieve user's orders Non-admin
module.exports.retrieveOrders = (req, res) => {
  return User.findById(req.user.id).then((result) => {
    res.status(200).send(result.orders);
  });
};

// Add to cart (Non-admin)
module.exports.addToCart = async (req, res) => {
  try {
    if (req.user.isAdmin) {
      return res.status(403).send("Admin accounts cannot add items to cart.");
    }

    const { productId, quantity } = req.body;

    // Find product
    const product = await Product.findById(productId);

    if (!product) {
      return res.status(404).send("Product not found.");
    }

    // Check stock
    if (product.stock < quantity) {
      return res.status(400).send("Insufficient stock.");
    }

    // Find user
    const user = await User.findById(req.user.id);

    // Check if item already exists in cart
    const existingItem = user.cart.find(
      (item) => item.productId.toString() === productId,
    );

    if (existingItem) {
      existingItem.quantity += quantity;
      existingItem.subtotal = existingItem.quantity * existingItem.price;
    } else {
      user.cart.push({
        productId: product._id,
        productName: product.productName,
        imageUrl: product.imageUrl,
        price: product.price,
        quantity,
        subtotal: product.price * quantity,
      });
    }

    // Recompute cart total
    user.cartTotal = user.cart.reduce(
      (total, item) => total + item.subtotal,
      0,
    );

    await user.save();

    return res.status(200).send({
      success: true,
      message: "Item added to cart.",
      cart: user.cart,
      cartTotal: user.cartTotal,
    });
  } catch (error) {
    console.log(error);

    return res.status(500).send({
      success: false,
      message: "Failed to add item to cart.",
    });
  }
};

// Retrieve all orders - Admin Only
module.exports.allOrders = (req, res) => {
  if (req.user.isAdmin) {
    return User.find({}).then((result) => {
      res
        .status(200)
        .send({ orders: result.map((user) => user.orders).flat() });
    });
  } else {
    return res
      .status(401)
      .send({ message: "You have no access to this page!" });
  }
};
