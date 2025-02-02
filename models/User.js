const mongoose = require('mongoose');
const userSchema = new mongoose.Schema({
  name: { type: String, required: true },
  email: { type: String, required: true, unique: true },
  profession: { type: String, required: true },
  password: { type: String, required: true },
  image: { type: String }, // Store the Cloudinary URL
});

const User = mongoose.model('User', userSchema);
module.exports = User;
