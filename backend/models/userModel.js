const mongoose = require("mongoose")
const bcrypt = require("bcrypt")

const userSchema = new mongoose.Schema({
  firstName: { type: String, required: true },
  lastName: { type: String, required: true },
  email: { type: String, required: true, unique: true },
  password: { type: String, required: true },
  profileImage: { type: String },
  contactNumber: { type: Number },
  location: { type: String },
  role: { type: String, enum: ["user", "admin"], default: "user" },
  mfaEnabled: { type: Boolean, default: false },
  mfaSecret: { type: String },
  passwordLastChanged: { type: Date, default: Date.now },
  loginAttempts: { type: Number, default: 0 },
  lockUntil: { type: Date },
  lastLogin: { type: Date },
})

// Password hashing middleware
userSchema.pre("save", async function (next) {
  if (!this.isModified("password")) return next()
  try {
    const salt = await bcrypt.genSalt(12)
    this.password = await bcrypt.hash(this.password, salt)
    next()
  } catch (error) {
    next(error)
  }
})

// Password comparison method
userSchema.methods.comparePassword = async function (candidatePassword) {
  return bcrypt.compare(candidatePassword, this.password)
}

// Method to increment login attempts
userSchema.methods.incrementLoginAttempts = function () {
  // If we have a previous lock that has expired, restart at 1
  if (this.lockUntil && this.lockUntil < Date.now()) {
    return this.updateOne({
      $set: { loginAttempts: 1 },
      $unset: { lockUntil: 1 },
    })
  }
  // Otherwise we're incrementing
  const updates = { $inc: { loginAttempts: 1 } }
  // Lock the account if we've reached max attempts and it's not locked already
  if (this.loginAttempts + 1 >= 5 && !this.isLocked) {
    updates.$set = { lockUntil: Date.now() + 15 * 60 * 1000 } // Lock for 15 minutes
  }
  return this.updateOne(updates)
}

// Helper method to check if account is locked
userSchema.virtual("isLocked").get(function () {
  return !!(this.lockUntil && this.lockUntil > Date.now())
})

const User = mongoose.model("User", userSchema)
module.exports = User

