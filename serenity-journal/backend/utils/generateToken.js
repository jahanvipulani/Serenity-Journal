import jwt from "jsonwebtoken";

// Generates a signed JWT containing the user's id
const generateToken = (id) => {
  return jwt.sign({ id }, process.env.JWT_SECRET, {
    expiresIn: process.env.JWT_EXPIRES_IN || "30d",
  });
};

export default generateToken;
