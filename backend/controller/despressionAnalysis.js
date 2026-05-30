const express = require("express");
const router = express.Router();
const catchAsyncErrors = require("../middleware/catchAsyncErrors");
const ErrorHandler = require("../utils/ErrorHandler");
const { isAuthenticated } = require("../middleware/auth");
const DepressionAnalysis = require("../utils/DepressionAnal");
const GetAdvice = require("../utils/GeminiAdvice");

router.post(
  "/analyze",
  isAuthenticated,
  catchAsyncErrors(async (req, res, next) => {
    try {
      const { text } = req.body;
      const result = await DepressionAnalysis(text);
      res.status(200).json({
        success: true,
        message: "Analysis completed",
        text: result,
      });
    } catch (error) {
      return next(new ErrorHandler(error.message, 500));
    }
  }),
);

router.post(
  "/five-message-analysis",
  isAuthenticated,
  catchAsyncErrors(async (req, res, next) => {
    try {
      const { chats } = req.body;
      const result = await GetAdvice(chats);
      res.status(200).json({
        success: true,
        message: "Analysis completed",
        text: result,
      });
    } catch (error) {
      return next(new ErrorHandler(error.message, 500));
    }
  }),
);
module.exports = router;
