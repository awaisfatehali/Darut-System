const express = require("express");
const router = express.Router();
const User = require("../model/user.js");
const sendMail = require("../utils/sendMail");
const catchAsyncErrors = require("../middleware/catchAsyncErrors");
const sendToken = require("../utils/jwtToken");
const ErrorHandler = require("../utils/ErrorHandler");
const { isAuthenticated } = require("../middleware/auth");

// ─── CREATE USER (FAST) ─────────────────────────────────────────────

router.post(
  "/create-user",
  catchAsyncErrors(async (req, res, next) => {
    try {
      const { name, email, password } = req.body;

      // 🔍 Check existing user (indexed query)
      const existingUser = await User.findOne({ email }).lean();
      if (existingUser) {
        return next(new ErrorHandler("User already exists", 400));
      }

      // 🔢 Generate OTP
      const otp = Math.floor(100000 + Math.random() * 900000).toString();

      // 💾 Save user immediately
      const user = await User.create({
        name,
        email,
        password,
        otp,
        otpExpire: Date.now() + 5 * 60 * 1000,
        otpAttempts: 0,
        isVerified: false,
      });

      // ⚡ Send email in background (DO NOT await)
      sendMail({
        email,
        subject: "Verify Your Account",
        message: `Hi ${name},\n\nYour OTP is: ${otp}\n\nExpires in 5 minutes.`,
      }).catch((err) => console.log("Email error:", err));

      res.status(201).json({
        success: true,
        message: "OTP sent. Verify your account.",
      });
    } catch (error) {
      return next(new ErrorHandler(error.message, 500));
    }
  }),
);

//
// ─── VERIFY OTP (FAST + SAFE) ───────────────────────────────────────
//
router.post(
  "/verify-otp",
  catchAsyncErrors(async (req, res, next) => {
    try {
      const { email, otp } = req.body;

      const user = await User.findOne({ email }).select("+password");

      if (!user) {
        return next(new ErrorHandler("User not found", 400));
      }

      if (user.isVerified) {
        return next(new ErrorHandler("Already verified", 400));
      }

      // ⏰ Expired OTP
      if (user.otpExpire < Date.now()) {
        await User.deleteOne({ _id: user._id });
        return next(new ErrorHandler("OTP expired. Register again.", 400));
      }

      // ❌ Wrong OTP
      if (user.otp !== otp) {
        user.otpAttempts += 1;

        // 🗑 Delete after 3 attempts
        if (user.otpAttempts >= 3) {
          await User.deleteOne({ _id: user._id });
          return next(
            new ErrorHandler("Too many attempts. Account deleted.", 400),
          );
        }

        await user.save();

        return next(
          new ErrorHandler(
            `Invalid OTP. Attempts left: ${3 - user.otpAttempts}`,
            400,
          ),
        );
      }

      // ✅ Correct OTP
      user.isVerified = true;
      user.otp = undefined;
      user.otpExpire = undefined;
      user.otpAttempts = 0;

      await user.save();

      sendToken(user, 200, res);
    } catch (error) {
      return next(new ErrorHandler(error.message, 500));
    }
  }),
);

//
// ─── LOGIN (OPTIMIZED) ─────────────────────────────────────────────
//
router.post(
  "/login-user",
  catchAsyncErrors(async (req, res, next) => {
    const { email, password } = req.body;

    if (!email || !password) {
      return next(new ErrorHandler("Please provide all fields!", 400));
    }

    const user = await User.findOne({ email }).select("+password");

    if (!user) {
      return next(new ErrorHandler("User doesn't exist!", 400));
    }

    if (!user.isVerified) {
      return next(new ErrorHandler("Verify your account first", 400));
    }

    const isPasswordValid = await user.comparePassword(password);

    if (!isPasswordValid) {
      return next(new ErrorHandler("Incorrect email or password", 400));
    }

    sendToken(user, 200, res);
  }),
);

//
// ─── GET USER ───────────────────────────────────────────────────────
//
router.get(
  "/getuser",
  isAuthenticated,
  catchAsyncErrors(async (req, res, next) => {
    try {
      const user = await User.findById(req.user.id).lean();

    if (!user) {
      return next(new ErrorHandler("User not found", 400));
    }

    res.status(200).json({ success: true, user });
    } catch (error) {
      return next(new ErrorHandler(error.message,500))
    }
  }),
);

//
// ─── LOGOUT ─────────────────────────────────────────────────────────
//
router.get("/logout", isAuthenticated, (req, res) => {
  res.cookie("token", null, {
    expires: new Date(Date.now()),
    httpOnly: true,
  });

  res.status(200).json({
    success: true,
    message: "Logged out successfully",
  });
});

router.post(
  "/forgot-password",
  catchAsyncErrors(async (req, res, next) => {
    const { email } = req.body;

    if (!email) {
      return next(new ErrorHandler("Email is required", 400));
    }

    const user = await User.findOne({ email });

    if (!user) {
      return next(new ErrorHandler("User not found", 404));
    }

    // 🔢 Generate OTP
    const otp = Math.floor(100000 + Math.random() * 900000).toString();

    // 💾 Store OTP using existing fields
    user.resetPasswordToken = otp;
    user.resetPasswordTime = Date.now() + 5 * 60 * 1000; // 5 min
    user.otpAttempts = 0;

    await user.save();

    try {
      await sendMail({
        email: user.email,
        subject: "Password Reset OTP",
        message: `Your OTP is: ${otp}\nIt expires in 5 minutes.`,
      });

      res.status(200).json({
        success: true,
        message: "OTP sent to email",
      });
    } catch (error) {
      user.resetPasswordToken = undefined;
      user.resetPasswordTime = undefined;
      await user.save();

      return next(new ErrorHandler("Email sending failed", 500));
    }
  }),
);
router.post(
  "/verify-reset-otp",
  catchAsyncErrors(async (req, res, next) => {
    const { email, otp } = req.body;

    const user = await User.findOne({ email });

    if (!user) {
      return next(new ErrorHandler("User not found", 404));
    }

    // ⏰ expiry check
    if (user.resetPasswordTime < Date.now()) {
      user.resetPasswordToken = undefined;
      user.resetPasswordTime = undefined;
      user.otpAttempts = 0;
      await user.save();

      return next(new ErrorHandler("OTP expired", 400));
    }

    // ❌ wrong OTP
    if (user.resetPasswordToken !== otp) {
      user.otpAttempts += 1;

      if (user.otpAttempts >= 3) {
        user.resetPasswordToken = undefined;
        user.resetPasswordTime = undefined;
        user.otpAttempts = 0;
        await user.save();

        return next(new ErrorHandler("Too many attempts", 400));
      }

      await user.save();

      return next(
        new ErrorHandler(
          `Invalid OTP. Attempts left: ${3 - user.otpAttempts}`,
          400,
        ),
      );
    }

    // ✅ OTP verified flag (we reuse same field idea)
    user.resetPasswordToken = "VERIFIED";
    await user.save();

    res.status(200).json({
      success: true,
      message: "OTP verified successfully",
    });
  }),
);
router.put(
  "/reset-password",
  catchAsyncErrors(async (req, res, next) => {
    const { email, password } = req.body;

    const user = await User.findOne({ email }).select("+password");

    if (!user) {
      return next(new ErrorHandler("User not found", 404));
    }

    // 🔐 must be verified first
    if (user.resetPasswordToken !== "VERIFIED") {
      return next(new ErrorHandler("OTP not verified", 400));
    }

    user.password = password;

    // cleanup
    user.resetPasswordToken = undefined;
    user.resetPasswordTime = undefined;
    user.otpAttempts = 0;

    await user.save();

    sendToken(user, 200, res);
  }),
);

module.exports = router;
