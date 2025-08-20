import mongoose from "mongoose";
import bcrypt from "bcryptjs";

const userSchema = new mongoose.Schema({
  name: { type: String, required: true, trim: true },
  email: { type: String, required: true, trim: true, lowercase: true },
  password: { type: String, required: true },
  phone: { type: String, trim: true },
  role: { type: String, enum: ["admin", "customer"], default: "customer" },
  isActive: { type: Boolean, default: true },
  lastLogin: { type: Date },
});

userSchema.pre("save", async function (next) {
  if (!this.isModified("password")) return next();

  this.password = await bcrypt.hash(this.password, 12);
  next();
});

export const User = mongoose.model("User", userSchema);
