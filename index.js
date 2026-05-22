const express = require("express");
const mongoose = require("mongoose");
require("dotenv").config();
const cors = require("cors");
const userRoutes = require("./routes/userRoutes");
const productRoutes = require("./routes/productRoutes");

const app = express();

const corsOptions = {
  // origin that is allowed to send requests
  origin: ["http://localhost:3000"],
  // allows credentials like authorization headers
  credentials: true,
  // Provides status code for successful request
  optionsSuccessStatus: 200,
  // methods: ["GET", "POST"]
};
// MongoDB Connection
mongoose.connect(process.env.MONGODB_STRING);

let db = mongoose.connection;
db.on("error", console.error.bind(console, "Connection error"));
db.once("open", () => console.log("Now connected to MongoDB Atlas"));

// Middlewares
app.use(cors());
app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use("/users", userRoutes);
app.use("/products", productRoutes);

const port = process.env.PORT || 4000;

// Listener
app.listen(port, () => {
  console.log(`API is now running on port ${port}.`);
});
