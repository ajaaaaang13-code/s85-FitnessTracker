
const bcrypt = require("bcrypt");
const mongoose = require("mongoose");

const userSchema = new mongoose.Schema(
  {
    email: {
      type: String,
      required: true,
      unique: true,
      lowercase: true,
      trim: true,
      match: /^[^\s@]+@[^\s@]+\.[^\s@]+$/,
    },
    password: {
      type: String,
      required: true,
      minlength: 8,
      select: false,
    },
    isAdmin: {
      type: Boolean,
      default: false,
    },
  },
  { timestamps: true }
);

userSchema.pre("save", async function hashPassword() {
  if (this.isModified("password")) {
    this.password = await bcrypt.hash(this.password, 10);
  }
});

module.exports = mongoose.model("user", userSchema);
