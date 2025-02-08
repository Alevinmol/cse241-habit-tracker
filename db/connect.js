const dotenv = require("dotenv");
dotenv.config();
const { MongoClient } = require("mongodb");

let _db;

const initDb = (callback) => {
  if (_db) {
    console.log("Database already initialized!");
    return callback(null, _db);
  }

  MongoClient.connect(process.env.MONGODB_URI)
    .then((client) => {
      _db = client.db(process.env.DB_NAME);
      console.log("Connected to database:", _db.databaseName); // Log database name
      callback(null, _db);
    })
    .catch((err) => {
      console.error("Database connection error:", err);
      callback(err);
    });
};


const getDb = () => {
  if (!_db) {
    throw new Error("Database not initialized");
  }
  return _db;
};

module.exports = { initDb, getDb };


