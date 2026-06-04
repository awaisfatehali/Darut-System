const express = require("express");
const cors = require("cors");
const ErrorHandler = require("./middleware/error");
const app = express();
const cookieParser = require("cookie-parser");
app.use(cookieParser());


app.use(express.json());
app.use(express.urlencoded({ extended: true }));


app.use(
  cors({
    origin: "https://darut-system.vercel.app",
    credentials: true,
  })
);

// Routes
const user = require("./controller/user");
const depressionAnalysis = require("./controller/despressionAnalysis");

app.use("/api/v2/depression", depressionAnalysis);
app.use("/api/v2/user", user);

// Error Handler
app.use(ErrorHandler);

module.exports = app;
