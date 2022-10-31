const mongoose = require("mongoose");
const bcrypt = require("bcryptjs");
const jwt = require("jsonwebtoken");

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

// Certain things happen when app runs. Before save, encrypt the password (middleware)
UserSchema.pre("save", async function (next) {
  // We need to make sure that when the user updates his name or email but not the password, we dont want to hash it
  // We dont want this to run. Otherwise, we cannot login
  if (!this.isModified("password")) {
    next();
  }
  const salt = await bcrypt.genSalt(10);
  this.password = await bcrypt.hash(this.password, salt);
});

UserSchema.methods.createJwt = function () {
  return jwt.sign({ id: this._id }, process.env.JWT_SECRET, {
    expiresIn: "30d",
  });
};

UserSchema.methods.comparePassword = async function (enteredPassword) {
  // compare the entered password with user's password
  return await bcrypt.compare(enteredPassword, this.password);
};

module.exports = mongoose.model("User", UserSchema);
