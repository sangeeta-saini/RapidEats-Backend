import express from "express";
import UserModel from "../models/user.model.js";

const router = express.Router();

function validateEmail(email) {
  const emailRegex = /^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}$/;
  return emailRegex.test(email);
}

// ✅ GET user info
router.get("/", async (req, res) => {
  try {
    const userId = req.headers["user-id"] || req.query.id;

    if (!userId) {
      return res.status(400).json({ message: "User ID is required" });
    }

    const user = await UserModel.findById(userId).select("-password");

    if (!user) {
      return res.status(404).json({ message: "User not found" });
    }

    res.json(user);
  } catch (error) {
    console.error("Error fetching user:", error);
    res.status(500).json({ message: "Internal server error" });
  }
});

router.post("/", async (req, res) => {
  const { email, password } = req.body;

  if (!email) {
    return res.status(400).json({
      message: {
        email: "email is required",
      },
    });
  } else if (!validateEmail(email)) {
    return res.status(400).json({
      message: {
        email: "invalid email",
      },
    });
  }

  if (!password) {
    return res.status(400).json({
      message: {
        password: "password is required",
      },
    });
  }

  const user = await UserModel.findOne({ email });

  if (!user) {
    return res.status(400).json({
      message: "user not found",
    });
  }

  if (user.password !== password) {
    return res.status(400).json({
      message: "password is incorrect",
    });
  }

  return res.json(user);
});

router.post("/signup", async (req, res) => {
  try {
    const { name, email, password } = req.body;

    if (!name) {
      return res.status(400).json({
        message: "Name is required",
      });
    } else if (!validateEmail(email)) {
      return res.status(400).json({
        message: "Invalid email format",
      });
    }

    if (!password || password.length < 7) {
      return res.status(400).json({
        message: "Password must be at least 7 characters long",
      });
    }

    const user = await UserModel.findOne({ email });

    if (user) {
      return res.status(400).json({
        message: "User already exist with  this email ID",
      });
    }

    await UserModel.create({
      name,
      email,
      password,
    });

    res.status(200).json({
      message: "Sign-up sucessful",
    });
  } catch (error) {
    console.log(error);
    res.status(500).json({
      message: "Internal server error",
    });
  }
});

export default router;
