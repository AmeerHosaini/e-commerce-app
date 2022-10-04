const mongoose = require("mongoose");
const colors = require("colors");
// const connectDB = async () => {
//   try {

//     const connect = await mongoose.connect(process.env.MONGO_URI)
//     console.log(`MongoDB connected: ${connect.connection.host}`);
//   }
//   catch (error) {
//     console.log(`Error: ${error.message}`)
//     process.exit(1);
//   }
// }

const connectDB = (uri) => {
  try {
    const connect = mongoose.connect(uri);
    console.log(`MongoDB connected successfully`.cyan.underline.bold);
    return connect;
  } catch (error) {
    console.log(`Error: ${error.message}`.red.underline.bold);
    process.exit(1);
  }
};

module.exports = connectDB;
