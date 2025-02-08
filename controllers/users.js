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
  const user = {
    name: req.body.name,
    email: req.body.email
  };
  const response = await mongodb.getDb().collection('users').insertOne(user);
  if (response.acknowledged) {
    res.status(201).json(response);
  } else {
    res.status(500).json(response.error || 'Some error occurred while creating the contact.');
  }
};

module.exports = { getAll, createUser };
