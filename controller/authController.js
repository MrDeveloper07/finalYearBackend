const User = require("../models/User");
const jwt = require("jsonwebtoken");
const cloudinary = require('../config/cloudinary');


// User signup

const signup = async (req, res) => {
  try {
    const { name, email, profession, password } = req.body;

    // Check for required fields
    if (!name || !email || !profession || !password) {
      return res.status(400).json({ message: 'All fields are required' });
    }

    // Upload image to Cloudinary
    let image = null;
    if (req.file) {
      const result = await cloudinary.uploader.upload(req.file.path, {
        folder: 'profile_images', // Optional folder in Cloudinary
      });
      image = result.secure_url;
    }

    // Create the user
    const newUser = new User({
      name,
      email,
      profession,
      password, // Hash the password before saving in production
      image,
      subscription: "basic",
    });

    await newUser.save();
    res.status(201).json({ message: 'User created successfully', user: newUser });
  } catch (error) {
    console.error('Error during signup:', error);
    res.status(500).json({ message: 'Server error' });
  }
};

// User login
const login = async (req, res) => {
  const { email, password } = req.body;
console.log(email)
  // Check if all fields are provided
  if (!email || !password) {
    return res.status(400).json({ message: "Email and password are required" });
  }

  try {
    // Find user by email
    const user = await User.findOne({ email });
    if (!user) {
      return res.status(400).json({ message: "Invalid email or password" });
    }

    // Compare provided password with hashed password in the database
    if (password !== user.password) {
        return res.status(400).json({ message: "Invalid email or password" });
      }
  

    // Create a JWT token
    const token = jwt.sign({ userId: user._id }, process.env.JWT_SECRET, {
      expiresIn: "1h", // Token expires in 1 hour
    });

    // Respond with success and token
    res.status(200).json({ message: "Login successful", token });
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: "Server error. Please try again." });
  }
};



module.exports = { signup, login };
