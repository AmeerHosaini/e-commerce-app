const mongoose = require("mongoose");

const UserSchema = new mongoose.Schema(
  {
    name: {
      type: String,
      required: [true, "Please provide your name"],
    },

    email: {
      type: String,
      required: [true, "Please provide your email"],
      match: [
        /^(([^<>()[\]\\.,;:\s@"]+(\.[^<>()[\]\\.,;:\s@"]+)*)|(".+"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/,
        "Please provide valid email",
      ],
      // creates a unique index (not a validator) -- if we want to create a user with an already existing email, we will get a duplicate error
      unique: true,
    },

    password: {
      type: String,
      required: [true, "Please provide your password"],
      minLength: [6, "Password cannot be less than 6 characters"],
    },

    isAdmin: {
      type: Boolean,
      required: true,
      default: false,
    },
  },
  {
    // This creates the createdat and updatedat field automatically for us
    timestamps: true,
  }
);

module.exports = mongoose.model("User", UserSchema);
