const { ObjectId } = require("mongodb");
const mongodb = require("../db/connect");

// Validate required fields
const validateHabit = (habit) => {
    const requiredFields = ["name", "description", "category", "frequency", "goal", "userId"];
    
    for (const field of requiredFields) {
      if (!habit[field]) {
        return `Missing required field: ${field}`;
      }
    }
  
    if (!ObjectId.isValid(habit.userId)) {
      return "Invalid userId format";
    }
  
    return null;
};

// ✅ Get all habits
const getAll = async (req, res) => {
  try {
    const db = mongodb.getDb();
    const habits = await db.collection("habits").find().toArray();
    res.setHeader("Content-Type", "application/json");
    res.status(200).json(habits);
  } catch (err) {
    console.error("Error fetching habits:", err);
    res.status(500).json({ message: "Internal Server Error" });
  }
};

// ✅ Create a new habit with user validation
const createHabit = async (req, res) => {
    try {
      const habit = req.body;
  
      // Validate habit fields
      const error = validateHabit(habit);
      if (error) {
        return res.status(400).json({ message: error });
      }
  
      const db = mongodb.getDb();
      
      // Check if userId exists in the users collection
      const userExists = await db.collection("users").findOne({ _id: new ObjectId(habit.userId) });
      if (!userExists) {
        return res.status(400).json({ message: "Invalid userId. User does not exist." });
      }
  
      // Insert habit with valid userId
      const result = await db.collection("habits").insertOne({ ...habit, createdAt: new Date() });
  
      if (result.acknowledged) {
        res.status(201).json({ message: "Habit created successfully", habitId: result.insertedId });
      } else {
        throw new Error("Failed to create habit");
      }
    } catch (err) {
      console.error("Error creating habit:", err);
      res.status(500).json({ message: "Internal Server Error" });
    }
};

// ✅ Update an existing habit
const updateHabit = async (req, res) => {
  try {
    const habitId = req.params.id;
    if (!ObjectId.isValid(habitId)) {
      return res.status(400).json({ message: "Invalid habit ID" });
    }

    const updatedHabit = req.body;
    
    // Validation
    const error = validateHabit(updatedHabit);
    if (error) {
      return res.status(400).json({ message: error });
    }

    const db = mongodb.getDb();
    const result = await db.collection("habits").updateOne(
      { _id: new ObjectId(habitId) },
      { $set: updatedHabit }
    );

    if (result.matchedCount === 0) {
      return res.status(404).json({ message: "Habit not found" });
    }

    res.status(200).json({ message: "Habit updated successfully" });
  } catch (err) {
    console.error("Error updating habit:", err);
    res.status(500).json({ message: "Internal Server Error" });
  }
};

// ✅ Delete a habit
const deleteHabit = async (req, res) => {
  try {
    const habitId = req.params.id;
    if (!ObjectId.isValid(habitId)) {
      return res.status(400).json({ message: "Invalid habit ID" });
    }

    const db = mongodb.getDb();
    const result = await db.collection("habits").deleteOne({ _id: new ObjectId(habitId) });

    if (result.deletedCount === 0) {
      return res.status(404).json({ message: "Habit not found" });
    }

    res.status(200).json({ message: "Habit deleted successfully" });
  } catch (err) {
    console.error("Error deleting habit:", err);
    res.status(500).json({ message: "Internal Server Error" });
  }
};

module.exports = { getAll, createHabit, updateHabit, deleteHabit };