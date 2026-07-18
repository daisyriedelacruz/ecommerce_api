const Product = require("../models/Product");
const bcrypt = require("bcrypt");
const auth = require("../auth");

// Add a product

module.exports.addProduct = (req, res) => {
  if (req.user.isAdmin) {
    if (!req.file) {
      return res
        .status(400)
        .send({ message: "Please provide a bouquet image." });
    }

    let newProduct = new Product({
      productName: req.body.productName,
      description: req.body.description,
      price: req.body.price,
      stock: req.body.stock,
      imageUrl: req.file.path,
      category: req.body.category,
    });

    newProduct
      .save()
      .then((product) => {
        console.log(product);
        res.status(201).send({
          message: `${req.body.productName} is successfully added!`,
          product: product,
        });
      })
      .catch((error) => {
        console.log(error);
        res
          .status(500)
          .send({ message: "An error occurred while adding the product." });
      });
  } else {
    res
      .status(401)
      .send({ message: "You are not allowed to access this page!" });
  }
};

// Retrieve all active products
module.exports.getAvailableProducts = (req, res) => {
  return Product.find({ isAvailable: true }).then((result) =>
    res.status(200).send({ result }),
  );
};

// Retrieve all products
module.exports.getAllProducts = (req, res) => {
  if (req.user.isAdmin) {
    return Product.find({}).then((result) => res.status(200).send({ result }));
  } else {
    return res
      .status(401)
      .send({ message: "You have no access to this page!" });
  }
};

// Retrieve a single product
module.exports.getProduct = (req, res) => {
  return Product.findById(req.params.productId).then((result) =>
    res.status(200).send({ result }),
  );
};

// Update a product
module.exports.updateProduct = (req, res) => {
  if (req.user.isAdmin) {
    let updateProduct = {
      productName: req.body.productName,
      description: req.body.description,
      category: req.body.category,
      price: req.body.price,
      stock: req.body.stock,
    };
    return Product.findByIdAndUpdate(req.params.productId, updateProduct, {
      returnDocument: "after",
    })
      .then((result) => {
        console.log(result);
        res.status(200).send({ result });
      })
      .catch((error) => {
        console.log(error);
        res
          .status(500)
          .send({ message: "An error occurred while updating the product." });
      });
  } else {
    return res
      .status(401)
      .send({ message: "You have no access to this page!" });
  }
};

// Archive a product

module.exports.archiveProduct = (req, res) => {
  let updateisAvailableField = {
    isAvailable: false,
  };

  if (req.user.isAdmin) {
    return Product.findByIdAndUpdate(
      req.params.productId,
      updateisAvailableField,
      { returnDocument: "after" },
    )
      .then((result) => {
        res
          .status(200)
          .send({ message: "Product archived successfully!", result: result });
      })
      .catch((error) => {
        res
          .status(500)
          .send({ message: "An error occurred while archiving the product." });
      });
  } else {
    return res
      .status(401)
      .send({ message: "You have no access to this page!" });
  }
};

// Activate a product
module.exports.activateProduct = (req, res) => {
  let updateisAvailableField = {
    isAvailable: true,
  };

  if (req.user.isAdmin) {
    return Product.findByIdAndUpdate(
      req.params.productId,
      updateisAvailableField,
      { returnDocument: "after" },
    )
      .then((result) => {
        res
          .status(200)
          .send({ message: "Product activated successfully!", result: result });
      })
      .catch((error) => {
        res
          .status(500)
          .send({ message: "An error occurred while activating the product." });
      });
  } else {
    return res
      .status(401)
      .send({ message: "You have no access to this page!" });
  }
};

module.exports.productSearch = async (req, res) => {
  try {
    const { searchItem } = req.body;

    if (!searchItem) {
      return res.status(400).json({ error: "Search query is required" });
    }

    const products = await Product.find({
      $or: [
        { productName: { $regex: searchItem, $options: "i" } },
        { description: { $regex: searchItem, $options: "i" } },
      ],
    });

    res.json(products);
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: "Internal Server Error" });
  }
};

module.exports.searchProductsByPrice = async (req, res) => {
  try {
    const { minPrice, maxPrice } = req.body;

    const products = await Product.find({
      price: { $gte: minPrice, $lte: maxPrice },
    });

    res.status(200).send({ products });
  } catch (error) {
    console.error(error);
    res.status(500).send({ error: "Internal Server Error" });
  }
};
