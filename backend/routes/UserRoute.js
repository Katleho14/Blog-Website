import express from "express";
import {
  deleteUserById,
  getAllUsers,
  getSingleUserById,
  loginUser,
  registerUser,
  updateUserById
} from "../controller/UserController.js";

import multer from "multer";
const upload = multer({ dest: "uploads/" }); // optional, for file uploads

const router = express.Router();

// User registration
router.post("/register", registerUser);

// User login (POST only)
router.post("/login", loginUser);

// Prevent accidental GET on /login route
router.get("/login", (req, res) => {
  res.status(405).json({
    message: "Method Not Allowed. Please use POST /login instead."
  });
});

// Get all users
router.get("/", getAllUsers);

// Get single user by ID
router.get("/:id", getSingleUserById);

// Update user by ID
router.patch("/:id", updateUserById);

// Delete user by ID
router.delete("/:id", deleteUserById);

export default router;
