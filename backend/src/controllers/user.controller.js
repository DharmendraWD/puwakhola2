const Path = require("path");
const fs = require("fs");
const bcrypt = require("bcrypt"); 
const { pool } = require("../db/dbConn");
const jwt = require("jsonwebtoken");

// create user api 
const createUser = async (req, res) => {
  try {
    let { email, fullName, password, isAdmin, mobNo, gender } = req.body;
    const image = req.file?.filename;
    const imagePath = image ? Path.join("uploads", "users", image) : null;

    // Validate required fields
    if (!email || !password || !fullName || isAdmin === undefined || !mobNo) {
      // Delete uploaded image if validation fails
      if (imagePath && fs.existsSync(imagePath)) {
        fs.unlinkSync(imagePath);
      }
      return res.status(400).json({
        success: false,
        message: "All fields are required",
      });
    }

    if (!image) {
      return res.status(400).json({
        success: false,
        message: "Image is required",
      });
    }

    //  Check if user exists (using async/await)
    const [existingUsers] = await pool.query(
      "SELECT * FROM users WHERE email = ?",
      [email]
    );

    if (existingUsers.length > 0) {
      // Delete uploaded image since user exists
      if (imagePath && fs.existsSync(imagePath)) {
        fs.unlinkSync(imagePath);
      }
      return res.status(400).json({
        success: false,
        message: "User already exists",
      });
    }

    // Hash password
    const hashedPassword = bcrypt.hashSync(password, 10);

    //  Insert user into database (using async/await)
    const insertQuery = `INSERT INTO users (email, fullName, password, isAdmin, mobNo, gender, image) VALUES (?, ?, ?, ?, ?, ?, ?)`;
    
    const [result] = await pool.query(insertQuery, [
      email,
      fullName,
      hashedPassword,
      isAdmin,
      mobNo,
      gender,
      image,
    ]);

    //  SUCCESS - Return response
    return res.status(201).json({
      success: true,
      message: "User created successfully",
      data: {
        id: result.insertId,
        email,
        fullName,
        image,
        isAdmin,
        mobNo,
        gender
      },
    });

  } catch (error) {
    console.error("Server Error:", error);
    
    // Delete uploaded image if any error occurs
    const image = req.file?.filename;
    const imagePath = image ? Path.join("uploads", "users", image) : null;
    
    if (imagePath && fs.existsSync(imagePath)) {
      fs.unlinkSync(imagePath);
    }
    
    return res.status(500).json({
      success: false,
      message: error.message || "Server error",
    });
  }
};

// get all user api 
const getAllUsers = async (req, res) => {
  try {
    const [rows] = await pool.query("SELECT * FROM users");
    res.json(rows);
  } catch (error) {
    console.error("Server Error:", error);
    res.status(500).json({
      success: false,
      message: error.message || "Server error",
    });
  }
};

// delete user API 
const deleteUser = async (req, res) => {
  try {
    const { id } = req.params;
    const [result] = await pool.query("DELETE FROM users WHERE id = ?", [id]);
    if (result.affectedRows === 0) {
      return res.status(404).json({ success: false, message: "User not found" });
    }
    res.json({ success: true, message: "User deleted successfully" });
  } catch (error) {
    console.error("Server Error:", error);
    res.status(500).json({
      success: false,
      message: error.message || "Server error",
    });
  }
};

// change logged in user password 
const changePassword = async (req, res) => {
  try {
    const { userId } = req.user;
    const { oldPassword, newPassword } = req.body;
    const [rows] = await pool.query("SELECT * FROM users WHERE id = ?", [userId]);
    if (rows.length === 0) {
      return res.status(404).json({ success: false, message: "User not found" });
    }
    const user = rows[0];
    if (!bcrypt.compareSync(oldPassword, user.password)) {
      return res.status(401).json({ success: false, message: "Invalid old password" });
    }
    const hashedPassword = bcrypt.hashSync(newPassword, 10);
    await pool.query("UPDATE users SET password = ? WHERE id = ?", [hashedPassword, userId]);
    res.json({ success: true, message: "Password changed successfully" });
  } catch (error) {
    console.error("Server Error:", error);
    res.status(500).json({
      success: false,
      message: error.message || "Server error",
    });
  }
}


// login user api 
const login = async (req, res) => {
  try {
    const { email, password } = req.body;

    const [rows] = await pool.query(
      "SELECT * FROM users WHERE email = ?",
      [email]
    );

    if (rows.length === 0) {
      return res.status(401).json({ success: false, message: "User not found" });
    }

    const user = rows[0];

    if (!bcrypt.compareSync(password, user.password)) {
      return res.status(401).json({ success: false, message: "Invalid password" });
    }

    // Create JWT token
    const token = jwt.sign(
      { 
        email: user.email,
        userId: user.id,
        fullName: user?.fullName
      },
      process.env.JWT_SECRET || '', 
      { expiresIn: '30d' }
    );

    // Send success response with token
    return res.status(200).json({
      success: true,
      message: "Login successful",
      token: token, // Send token in response
      user: {
        id: user.id,
        email: user.email,
        fullName: user.fullName
      }
    });

  } catch (error) {
    console.error("Server Error:", error);
    res.status(500).json({
      success: false,
      message: error.message || "Server error",
    });
  }
};

// getlogged in user details 
const getLoggedInUserDetails = async (req, res) => {
  if (!req.user) {
    return res.status(401).json({
      success: false,
      message: "No user logged in",
    });
  }
  // console.log(req.user.userId, "req.user.userId");
    const [rows] = await pool.query(
      "SELECT * FROM users WHERE id = ?",
      [req.user.userId]
    );

    if (rows.length === 0) {
      return res.status(401).json({ success: false, message: "User not found" });
    }

    const user = rows[0];

    return res.status(200).json({
      success: true,
      message: "User details fetched successfully",
      user: {
        id: user.id,
        email: user.email,
        fullName: user.fullName,
        isAdmin: user.isAdmin,
        mobNo: user.mobNo,
        gender: user.gender,
        image: user.image
      }
    });
}

// log out user api 
const logOutUser = async (req, res) => {
  try {
    res.clearCookie("token");
    return res.status(200).json({ success: true, message: "Logout successful" });
  } catch (error) {
    console.error("Server Error:", error);
    res.status(500).json({
      success: false,
      message: error.message || "Server error",
    });
  }
};

module.exports = { createUser, getAllUsers, login, getLoggedInUserDetails,deleteUser, logOutUser, changePassword };