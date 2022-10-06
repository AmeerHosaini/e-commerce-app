require("dotenv").config();
const express = require("express");
const connectDB = require("./config/db");
const colors = require("colors");
const productRoute = require("./routes/productRoute");
const errorHandlerMiddleware = require("./middlewares/error_handler");

const app = express();
// connectDB() with the previous setup

// Routes
app.use("/api/products", productRoute);

// Error Handler Middleware --- NOTE: This must be included below the routes and every other middleware
app.use(errorHandlerMiddleware);

const port = process.env.PORT || 5000;

const start = async () => {
  try {
    await connectDB(process.env.MONGO_URI);
    app.listen(
      port,
      console.log(
        `Server is listening in ${process.env.NODE_ENV} mode on port ${port}`
          .yellow.bold.underline
      )
    );
  } catch (error) {
    console.log(`Error: ${error.message}`.red.underline.bold);
  }
};

start();
