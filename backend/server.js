require("dotenv").config();
const express = require("express");
const connectDB = require("./config/db");
const colors = require("colors");
const productRoute = require("./routes/productRoute");
const userRoute = require("./routes/userRoute");
const errorHandlerMiddleware = require("./middlewares/error_handler");

const app = express();
// connectDB() with the previous setup

app.use(express.json());

// Routes
app.use("/api/products", productRoute);
app.use("/api/users", userRoute);

// Error Handler Middleware --- NOTE: This must be included below the routes and every other middleware
app.use(errorHandlerMiddleware);

const port = process.env.PORT || 5000;

app.listen(
  port,
  console.log(
    `Server is listening in ${process.env.NODE_ENV} mode on port ${port}`.yellow
      .bold.underline
  )
);

const start = async () => {
  try {
    await connectDB(process.env.MONGO_URI);
  } catch (error) {
    console.log(`Error: ${error.message}`.red.underline.bold);
  }
};

start();
