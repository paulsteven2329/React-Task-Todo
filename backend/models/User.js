// backend/models/User.js
// Defines User model with validation, prevents redefinition to avoid OverwriteModelError.
// Adheres to SRP: Only responsible for User schema and logic.
const mongoose = require('mongoose');
const bcrypt = require('bcryptjs');

const userSchema = new mongoose.Schema({
  username: { type: String, required: true, unique: true },
  email: { type: String, required: true, unique: true },
  password: { type: String, required: true },
  tasks: [{ type: mongoose.Schema.Types.ObjectId, ref: 'Task' }], // References Task model
});

// Hash password before saving (OCP: Extensible for additional fields)
userSchema.pre('save', async function (next) {
  if (!this.isModified('password')) return next();
  this.password = await bcrypt.hash(this.password, 10);
  next();
});

// Method to compare passwords (ISP: Specific method for password comparison)
userSchema.methods.comparePassword = async function (candidatePassword) {
  return bcrypt.compare(candidatePassword, this.password);
};

// Export existing model if compiled, else create new to prevent OverwriteModelError
module.exports = mongoose.models.User || mongoose.model('User', userSchema);