const jwt = require("jsonwebtoken");

const verifyToken = (req, res, next) => {
  const token = req.header("Authorization")?.split(" ")[1]; // Extract the token from "Bearer <token>"
  if (!token) {
    return res.status(401).json({ message: "Access Denied. No token provided." });
  }

  try {
    const verified = jwt.verify(token, process.env.JWT_SECRET); // Verify the token using the secret key
    console.log("Decoded Token:", verified); // Log the decoded token for debugging
    req.user = verified; // Attach the decoded token payload to `req.user`
    next(); // Proceed to the next middleware/route handler
  } catch (err) {
    return res.status(400).json({ message: "Invalid Token" });
  }
};

module.exports = verifyToken;
