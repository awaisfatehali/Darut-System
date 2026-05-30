// 1️⃣ Load env variables first
require("dotenv").config({ path: __dirname + "/config/.env" });

const app = require("./app.js");
const ConnectDatabase = require("./db/database");

// Uncaught exceptions
process.on("uncaughtException", (err) => {
  console.log(`Uncaught Exception: ${err.message}`);
  process.exit(1);
});

// Connect Database
ConnectDatabase();

// Start server
const server = app.listen(process.env.PORT, () => {
  console.log(`Server running on http://localhost:${process.env.PORT}`);
});

// Handle unhandled promise rejections
process.on("unhandledRejection", (err) => {
  console.log(`Unhandled Rejection: ${err.message}`);
  server.close(() => process.exit(1));
});
