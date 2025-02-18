const mongodb = require('../db/connect');
const ObjectId = require('mongodb').ObjectId;

const getAll = async (req, res) => {
  try {
    const db = mongodb.getDb(); 
    const users = await db.collection("users").find().toArray(); 
    res.setHeader("Content-Type", "application/json");
    res.status(200).json(users);
  } catch (err) {
    console.error("Error fetching users:", err);
    res.status(500).json({ message: "Internal Server Error" });
  }
};

const createUser = async (req, res) => {
  try {
    const { name, email } = req.body;

    // 🛑 Validation: Ensure name and email exist
    if (!name || typeof name !== "string" || name.trim().length === 0) {
      return res.status(400).json({ message: "Name is required and must be a non-empty string." });
    }

    // 🛑 Validation: Ensure email is valid
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!email || !emailRegex.test(email)) {
      return res.status(400).json({ message: "A valid email is required." });
    }

    // ✅ Create user object
    const user = {
      name: name.trim(),
      email: email.trim(),
      createdAt: new Date()
    };

    // ✅ Insert user into MongoDB
    const db = mongodb.getDb();
    const response = await db.collection("users").insertOne(user);

    if (response.acknowledged) {
      res.status(201).json({ message: "User created successfully", userId: response.insertedId });
    } else {
      res.status(500).json({ message: "Failed to create user" });
    }
  } catch (err) {
    console.error("Error creating user:", err);
    res.status(500).json({ message: "Internal Server Error" });
  }
};

module.exports = { getAll, createUser };
