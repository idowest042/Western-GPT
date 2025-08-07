import User from "../Gpt-Model/UserModel.js"
import bcrypt from 'bcryptjs';
import { sendWelcomeEmail,sendLoginEmail } from "../config/mail.js"
import jwt from "jsonwebtoken";
import { generateToken } from "../config/utilis.js";

export const register = async (req, res) => {
  try {
    const { name, email, password } = req.body;
    
    // Validation
    if (!name || !email || !password) {
      return res.status(400).json({ message: "Please fill all the fields" });
    }
    
    const existingUser = await User.findOne({ email });
    if (existingUser) {
      return res.status(400).json({ message: "User already exists" });
    }
    
    if (password.length < 6) {
      return res.status(400).json({ message: "Password must be at least 6 characters long" });
    }

    // Hash password
    const salt = await bcrypt.genSalt(10);
    const hashedPassword = await bcrypt.hash(password, salt);

    // Create user
    const user = await User.create({
      name,
      email,
      password: hashedPassword
    });

    // Send welcome email (don't await to avoid blocking the response)
    sendWelcomeEmail(user.email, user.name);

    if(user){
               // Generate token and set it in the response
               const token = generateToken(user._id, res);
               // Send success response
             return res.status(201).json({
                   id: user._id,
                   name: user.name,
                   email: user.email,
                   token // Include the token in the response
               });    
           }

  } catch (error) {
    console.error("Error in register:", error);
    return res.status(500).json({ message: "Internal server error" });
  }
};
export const login = async (req, res) => {
  try {
    const { email, password } = req.body;

    if (!email || !password) {
      return res.status(400).json({ message: "Please fill all the fields" });
    }

    const user = await User.findOne({ email });
    if (!user) {
      return res.status(400).json({ message: "User not found" });
    }

    const isPasswordValid = await bcrypt.compare(password, user.password);
    if (!isPasswordValid) {
      return res.status(400).json({ message: "Invalid credentials" });
    }

    // ✅ Send login email
    await sendLoginEmail(user.email, user.name);

    const token = generateToken(user._id);
    res.json({
      success: true,
      message: "Login successful",
      user: { id: user._id, name: user.name, email: user.email },
      token
    });

  } catch (error) {
    console.error("Login error:", error);
    res.status(500).json({ message: "Internal server error" });
  }
};
export const logout = async (req,res) => {
    try{
        res.clearCookie("token");
        return res.status(200).json({ message: "Logged out successfully" });
    }catch(error){
        console.error("Logout error:", error);
        res.status(500).json({ message: "Internal server error" });
    }
  }
// Add this to your user routes
export const checkAuth = async (req, res) => {
  try {
    // The user is already attached to req by the protectRoute middleware
    res.json({
      success: true,
      user: {
        id: req.user._id,
        name: req.user.name,
        email: req.user.email
      }
    });
  } catch (error) {
    console.error("Get user error:", error);
    res.status(500).json({ message: "Internal server error" });
  }
};

// In your routes file, add:
// router.get("/me", protectRoute, getMe);
