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

const updateUser = async (req, res) => {
  try {
    const userId = req.params.id;

    // 🛑 Validate userId format
    if (!ObjectId.isValid(userId)) {
      return res.status(400).json({ message: "Invalid user ID format." });
    }

    // 🛑 Validate request body
    const { name, email } = req.body;
    if (!name || typeof name !== "string" || name.trim().length === 0) {
      return res.status(400).json({ message: "Name is required and must be a non-empty string." });
    }

    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!email || !emailRegex.test(email)) {
      return res.status(400).json({ message: "A valid email is required." });
    }

    // ✅ Prepare update object
    const updateFields = {
      $set: {
        name: name.trim(),
        email: email.trim()
      }
    };

    // ✅ Perform update
    const db = mongodb.getDb();
    const response = await db.collection("users").updateOne(
      { _id: new ObjectId(userId) },
      updateFields
    );

    if (response.matchedCount === 0) {
      return res.status(404).json({ message: "User not found." });
    }

    if (response.modifiedCount > 0) {
      return res.status(200).json({ message: "User updated successfully." });
    }

    res.status(200).json({ message: "No changes made to the user." });
  } catch (err) {
    console.error("Error updating user:", err);
    res.status(500).json({ message: "Internal Server Error", error: err.message });
  }
};

const deleteUser = async (req, res) => {
  try {
    const userId = req.params.id;

    // 🛑 Validate userId format
    if (!ObjectId.isValid(userId)) {
      return res.status(400).json({ message: "Invalid user ID format." });
    }

    // ✅ Delete user from MongoDB
    const db = mongodb.getDb();
    const response = await db.collection("users").deleteOne({ _id: new ObjectId(userId) });

    if (response.deletedCount === 0) {
      return res.status(404).json({ message: "User not found." });
    }

    res.status(200).json({ message: "User deleted successfully." });
  } catch (err) {
    console.error("Error deleting user:", err);
    res.status(500).json({ message: "Internal Server Error", error: err.message });
  }
};

module.exports = { getAll, createUser, updateUser, deleteUser };
