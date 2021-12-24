const mongoose = require("mongoose");
const bcrypt = require("bcryptjs");
const Schema = mongoose.Schema;
var generateName = require("sillyname");
const Friend = require("./Friend");

// Create a schema
const userSchema = new Schema({
  methods: {
    type: [String],
    required: true,
  },
  photo: {
    type: String,
  },
  isVerified: {
    type: Boolean,
    default: false,
  },
  local: {
    email: {
      type: String,
      lowercase: true,
    },
    password: {
      type: String,
    },
  },
  google: {
    type: Object,
  },
  facebook: {
    type: Object,
  },
  username: {
    type: String,
    unique: true,
    default: generateName().split(" ").join(""),
  },
  desc: {
    type: String,
    default: "Hi there! let's a play a match",
  },
  active: {
    type: Boolean,
    default: true,
  },
  rating: {
    type: Number,
    default: 800,
  },
  friends: [
    {
      type: Schema.Types.ObjectId,
      ref: "friend",
    },
  ],
});

userSchema.pre("save", async function (next) {
  try {
    if (!this.methods.includes("local")) {
      next();
    }
    //the user schema is instantiated
    const user = this;
    //check if the user has been modified to know if the password has already been hashed
    if (!user.isModified("local.password")) {
      next();
    }
    // Generate a salt
    const salt = await bcrypt.genSalt(10);
    // Generate a password hash (salt + hash)
    const passwordHash = await bcrypt.hash(this.local.password, salt);
    // Re-assign hashed version over original, plain text password
    this.local.password = passwordHash;
    next();
  } catch (error) {
    next(error);
  }
});

userSchema.methods.isValidPassword = async function (newPassword) {
  try {
    return await bcrypt.compare(newPassword, this.local.password);
  } catch (error) {
    throw new Error(error);
  }
};

// Create a model
const User = mongoose.model("user", userSchema);

// Export the model
module.exports = User;
