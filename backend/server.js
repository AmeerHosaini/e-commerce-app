require("dotenv").config();
const express = require("express");
const connectDB = require("./config/db");
const path = require("path");
const morgan = require("morgan");
const colors = require("colors");
const productRoute = require("./routes/productRoute");
const userRoute = require("./routes/userRoute");
const orderRoute = require("./routes/orderRoute");
const uploadRoute = require("./routes/uploadRoutes");
const errorHandlerMiddleware = require("./middlewares/error_handler");

const app = express();
// connectDB() with the previous setup

// Logger
if (process.env.NODE_ENV === "development") {
  app.use(morgan("dev"));
}

app.use(express.json());

// Routes
app.use("/api/products", productRoute);
app.use("/api/users", userRoute);
app.use("/api/orders", orderRoute);
app.use("/api/upload", uploadRoute);

app.get("/api/config/paypal", (req, res) => {
  res.send(process.env.PAYPAL_CLIENT_ID);
});

// const __dirname = path.resolve();

if (process.env.NODE_ENV === "production") {
  app.use(express.static("/frontend/build"));

  app.get("*", (req, res) => {
    res.sendFile(path.resolve("frontend", "build", "index.html"));
  });
} else {
  app.get("/", (req, res) => {
    res.send("API is running....");
  });
}

// Without this, our upload folder will be restricted. We need to make it available to the browser by making it static
// -- path is a node js module to work with files - join() we want to join different fragments of folder - __dirname points to the current directory
// app.use("/uploads", express.static(path.join(__dirname, "/uploads")));
app.use("/uploads", express.static("uploads"));

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
