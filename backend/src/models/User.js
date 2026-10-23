import mongoose from "mongoose";
import bcrypt from "bcrypt";

const SALT_ROUNDS = 12; // jitna zyada, utna secure aur utna slow

const userSchema = new mongoose.Schema(
  {
    name: {
      type: String,
      required: [true, "Name is required"],
      trim: true,
      minlength: [2, "Name must be at least 2 characters"],
      maxlength: [50, "Name cannot exceed 50 characters"],
    },
    email: {
      type: String,
      required: [true, "Email is required"],
      unique: true,
      lowercase: true, // "A@x.com" aur "a@x.com" ek hi maane jayenge
      trim: true,
      match: [/^\S+@\S+\.\S+$/, "Please enter a valid email"],
    },
    password: {
      type: String,
      required: [true, "Password is required"],
      minlength: [8, "Password must be at least 8 characters"],
      maxlength: [72, "Password cannot exceed 72 characters"], // bcrypt ki limit
      select: false, // queries me password default me nahi aayega
    },
  },
  { timestamps: true }
);

// Save hone se pehle password ko hash karo (sirf tab jab password naya ya badla ho)
userSchema.pre("save", async function () {
  if (!this.isModified("password")) return;
  this.password = await bcrypt.hash(this.password, SALT_ROUNDS);
});

// Login ke waqt: diya hua password stored hash se match karta hai ya nahi
userSchema.methods.comparePassword = function (candidatePassword) {
  return bcrypt.compare(candidatePassword, this.password);
};

// JSON me bhejte waqt password aur __v hata do
userSchema.set("toJSON", {
  transform: (doc, ret) => {
    delete ret.password;
    delete ret.__v;
    return ret;
  },
});

const User = mongoose.model("User", userSchema);

export default User;