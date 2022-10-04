const users = require("./data/users");
const products = require("./data/products");
const UserModel = require("./models/UserModel");
const ProductModel = require("./models/ProductModel");
const OrderModel = require("./models/UserModel");
const connectDB = require("./config/db");

require("dotenv").config();

const importData = async () => {
  try {
    await connectDB(process.env.MONGO_URI);
    // Second, Insert the data into the db
    // We have a connection between the products and the users
    // We want the admin user to be the object id for all the products
    const createdUsers = await UserModel.insertMany(users);
    const adminUser = createdUsers[0]._id;
    // Set it to the products, map through this and add the admin user to each one
    const sampleProducts = products.map((product) => {
      // return an object with the existing items in the product
      return { ...product, user: adminUser };
    });

    await ProductModel.insertMany(sampleProducts);
    console.log("Data Imported!".green.inverse);
    process.exit();
  } catch (error) {
    console.log(`Error: ${error.message}`.red.underline.bold);
    process.exit(1);
  }
};

const destroyData = async () => {
  try {
    await UserModel.deleteMany();
    await ProductModel.deleteMany();
    await OrderModel.deleteMany();

    console.log("Data Destroyed!".red.inverse);
    process.exit();
  } catch (error) {
    console.log(`Error: ${error.message}`.red.underline.bold);
    process.exit(1);
  }
};

if (process.argv[2] === "-d") {
  destroyData();
} else {
  importData();
}
