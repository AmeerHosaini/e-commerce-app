require("dotenv").config();
const express = require("express");
const connectDB = require("./config/db");
const path = require("path");
const morgan = require("morgan");
const cookieParser = require("cookie-parser");
const mongoSanitize = require("express-mongo-sanitize");
const helmet = require("helmet");
const xss = require("xss-clean");
const rateLimit = require("express-rate-limit");
const hpp = require("hpp");
const cors = require("cors");
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

// body parser
app.use(express.json());

// Nested Objects
app.use(express.urlencoded({ extended: true }));

// Cookie parser
app.use(cookieParser());

// Sanitize Data
app.use(mongoSanitize());

// Set security headers
app.use(helmet());

// Prevent Xss Attacks
app.use(xss());

// Rate limiting
const limiter = rateLimit({
  windowMs: 10 * 60 * 1000, // 10 mins
  max: 100,
});

app.use(limiter);

// Prevent http params pollution
app.use(hpp());

// Enable CORS
app.use(cors());

// Route middlewares mounted to their routes
app.use("/api/products", productRoute);
app.use("/api/users", userRoute);
app.use("/api/orders", orderRoute);
app.use("/api/upload", uploadRoute);
app.get("/api/config/paypal", (req, res) => {
  res.send(process.env.PAYPAL_CLIENT_ID);
});

app.use("/uploads", express.static("uploads"));

if (process.env.NODE_ENV === "production") {
  app.use(express.static(path.join(__dirname, "../frontend", "build")));

  app.get("*", (req, res) =>
    res.sendFile(path.join(__dirname, "../frontend", "build", "index.html"))
  );
} else {
  app.get("/", (req, res) => {
    res.send("API is running....");
  });
}

// Without this, our upload folder will be restricted. We need to make it available to the browser by making it static
// -- path is a node js module to work with files - join() we want to join different fragments of folder - __dirname points to the current directory

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
