import { useState } from "react";
import { Link, Navigate } from "react-router-dom";
import Navbar from "./Navbar";
import axios from "axios";
import { useDispatch, useSelector } from "react-redux";
import { toast } from "react-toastify";
import { useNavigate } from "react-router-dom";
import { Backend_url } from "../Server";

export default function DarutLogin() {
  const [showPassword, setShowPassword] = useState(false);
  const [showNewPassword, setShowNewPassword] = useState(false);
  const [form, setForm] = useState({ email: "", password: "" });
  const [isForgot, setIsForgot] = useState(false);
  // "email" | "otp" | "newPassword"
  const [forgotStage, setForgotStage] = useState("email");
  const [otp, setOtp] = useState("");
  const [newPassword, setNewPassword] = useState("");
  const dispatch = useDispatch();
  const navigate = useNavigate();

  const resetForgotFlow = () => {
    setIsForgot(false);
    setForgotStage("email");
    setOtp("");
    setNewPassword("");
  };

  // Stage 1 → send OTP to email
  const handleSendOtp = async () => {
    if (!form.email || form.email.trim() === "") {
      toast.error("Please enter your email");
      return;
    }
    try {
      const res = await axios.post(
        `${Backend_url}/v2/user/forgot-password`,
        { email: form.email }
      );
      if (res.data.success) {
        toast.success("OTP sent to your email");
        setForgotStage("otp");
      } else {
        toast.error(res.data.message || "Failed to send OTP");
      }
    } catch (error) {
      toast.error(error.response?.data?.message || "Server error");
    }
  };

  // Stage 2 → verify OTP
  const handleVerifyOtp = async () => {
    if (!otp || otp.trim() === "") {
      toast.error("Please enter the OTP");
      return;
    }
    try {
      const res = await axios.post(
        `${Backend_url}/user/verify-reset-otp`,
        { email: form.email, otp }
      );
      if (res.data.success) {
        toast.success("OTP verified");
        setForgotStage("newPassword");
      } else {
        toast.error(res.data.message || "Invalid OTP");
      }
    } catch (error) {
      toast.error(error.response?.data?.message || "Server error");
    }
  };

  // Stage 3 → set new password
  const handleResetPassword = async () => {
    if (!newPassword || newPassword.trim() === "") {
      toast.error("Please enter a new password");
      return;
    }
    try {
      const res = await axios.put(
        `${Backend_url}/user/reset-password`,
        { email: form.email,password:newPassword }
      );
      if (res.data.success) {
        toast.success("Password reset successfully!");
        resetForgotFlow();
      } else {
        toast.error(res.data.message || "Failed to reset password");
      }
    } catch (error) {
      toast.error(error.response?.data?.message || "Server error");
    }
  };

  const handleSubmit = async () => {
    if (!form.email || !form.password) {
      toast.error("Please fill in all fields.");
      return;
    }
    try {
      const res = await axios.post(
        `${Backend_url}/user/login-user`,
        form,
        { withCredentials: true }
      );
      if (res.data.success) {
        dispatch({ type: "LoadUserSuccess", payload: res.data.user });
        toast.success("Login Successfully!");
        navigate("/Analyze");
      }
    } catch (error) {
      toast.error(error.response?.data?.message || "Login failed");
    }
  };

  // Derived helpers
  const forgotLabel = {
    email: "Enter Email to Recover your Password!",
    otp: "Enter the OTP sent to your email.",
    newPassword: "Enter your new password.",
  }[forgotStage];

  const forgotButtonLabel = {
    email: "Send OTP",
    otp: "Verify OTP",
    newPassword: "Reset Password",
  }[forgotStage];

  const handleForgotAction = {
    email: handleSendOtp,
    otp: handleVerifyOtp,
    newPassword: handleResetPassword,
  }[forgotStage];

  return (
    <>
      <Navbar />
      <div className="min-h-screen bg-black text-white font-sans flex">
        <style>{`
        @keyframes fadeUp {
          from { opacity: 0; transform: translateY(16px); }
          to   { opacity: 1; transform: translateY(0); }
        }
        @keyframes fadeIn {
          from { opacity: 0; }
          to   { opacity: 1; }
        }
        .fade-up { animation: fadeUp 0.55s ease both; }
        .fade-in { animation: fadeIn 0.8s ease both; }
      `}</style>

        {/* ── LEFT: FORM PANEL ── */}
        <div className="w-full md:w-1/2 flex items-center justify-center px-8 py-12 relative z-10">
          {/* blue glow */}
          <div
            className="pointer-events-none fixed top-0 left-0 w-72 h-72 rounded-full opacity-10 blur-3xl"
            style={{ background: "radial-gradient(circle, #1d6cf5, transparent)" }}
          />

          <div className="w-full max-w-xs bg-[#0d0d0d] border border-[#1e1e1e] rounded-xl px-6 py-7 fade-up">
            {/* HEADER */}
            <div className="mb-6">
              <h1 className="text-2xl font-extrabold tracking-tight leading-tight mb-1.5">
                Sign in to <span className="text-blue-500">DARUT</span>
              </h1>
              {!isForgot ? (
                <p className="text-xs text-white/40 leading-relaxed">
                  Welcome back. Enter your credentials to continue.
                </p>
              ) : (
                <p className="text-xs text-white/40 leading-relaxed">
                  {forgotLabel}
                </p>
              )}
            </div>

            {/* ── NORMAL LOGIN FIELDS ── */}
            {!isForgot && (
              <>
                {/* EMAIL */}
                <div className="mb-3">
                  <label className="block text-[10px] font-medium uppercase tracking-widest text-white/40 mb-1.5">
                    Email Address
                  </label>
                  <input
                    type="email"
                    placeholder="you@example.com"
                    value={form.email}
                    onChange={(e) => setForm({ ...form, email: e.target.value })}
                    className="w-full bg-[#111] border border-[#1e1e1e] rounded-lg px-3 py-2.5 text-white text-xs
                    placeholder:text-white/20 outline-none focus:border-blue-500
                    focus:ring-2 focus:ring-blue-500/30 transition-all"
                  />
                </div>

                {/* PASSWORD */}
                <div className="mb-1">
                  <div className="flex items-center justify-between mb-1.5">
                    <label className="block text-[10px] font-medium uppercase tracking-widest text-white/40">
                      Password
                    </label>
                    <button
                      type="button"
                      onClick={() => setIsForgot(true)}
                      className="text-[10px] text-blue-500 hover:underline font-medium"
                    >
                      Forgot password?
                    </button>
                  </div>
                  <div className="relative">
                    <input
                      type={showPassword ? "text" : "password"}
                      placeholder="Enter your password"
                      value={form.password}
                      onChange={(e) => setForm({ ...form, password: e.target.value })}
                      className="w-full bg-[#111] border border-[#1e1e1e] rounded-lg px-3 py-2.5 pr-10 text-white text-xs
                      placeholder:text-white/20 outline-none focus:border-blue-500
                      focus:ring-2 focus:ring-blue-500/30 transition-all"
                    />
                    <button
                      type="button"
                      onClick={() => setShowPassword(!showPassword)}
                      className="absolute right-3 top-1/2 -translate-y-1/2 text-white/40 hover:text-white transition-colors"
                    >
                      {showPassword ? (
                        <svg width="15" height="15" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24">
                          <path d="M17.94 17.94A10.07 10.07 0 0 1 12 20c-7 0-11-8-11-8a18.45 18.45 0 0 1 5.06-5.94" />
                          <path d="M9.9 4.24A9.12 9.12 0 0 1 12 4c7 0 11 8 11 8a18.5 18.5 0 0 1-2.16 3.19" />
                          <line x1="1" y1="1" x2="23" y2="23" />
                        </svg>
                      ) : (
                        <svg width="15" height="15" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24">
                          <path d="M1 12s4-8 11-8 11 8 11 8-4 8-11 8-11-8-11-8z" />
                          <circle cx="12" cy="12" r="3" />
                        </svg>
                      )}
                    </button>
                  </div>
                </div>
              </>
            )}

            {/* ── FORGOT PASSWORD FLOW ── */}
            {isForgot && (
              <>
                {/* Stage: email */}
                {forgotStage === "email" && (
                  <div className="mb-3">
                    <label className="block text-[10px] font-medium uppercase tracking-widest text-white/40 mb-1.5">
                      Email Address
                    </label>
                    <input
                      type="email"
                      placeholder="you@example.com"
                      value={form.email}
                      onChange={(e) => setForm({ ...form, email: e.target.value })}
                      className="w-full bg-[#111] border border-[#1e1e1e] rounded-lg px-3 py-2.5 text-white text-xs
                      placeholder:text-white/20 outline-none focus:border-blue-500
                      focus:ring-2 focus:ring-blue-500/30 transition-all"
                    />
                  </div>
                )}

                {/* Stage: otp */}
                {forgotStage === "otp" && (
                  <div className="mb-3">
                    <label className="block text-[10px] font-medium uppercase tracking-widest text-white/40 mb-1.5">
                      One-Time Password
                    </label>
                    <input
                      type="text"
                      placeholder="Enter OTP"
                      value={otp}
                      onChange={(e) => setOtp(e.target.value)}
                      className="w-full bg-[#111] border border-[#1e1e1e] rounded-lg px-3 py-2.5 text-white text-xs
                      placeholder:text-white/20 outline-none focus:border-blue-500
                      focus:ring-2 focus:ring-blue-500/30 transition-all tracking-[0.3em] text-center"
                    />
                  </div>
                )}

                {/* Stage: newPassword */}
                {forgotStage === "newPassword" && (
                  <div className="mb-3">
                    <label className="block text-[10px] font-medium uppercase tracking-widest text-white/40 mb-1.5">
                      New Password
                    </label>
                    <div className="relative">
                      <input
                        type={showNewPassword ? "text" : "password"}
                        placeholder="Enter new password"
                        value={newPassword}
                        onChange={(e) => setNewPassword(e.target.value)}
                        className="w-full bg-[#111] border border-[#1e1e1e] rounded-lg px-3 py-2.5 pr-10 text-white text-xs
                        placeholder:text-white/20 outline-none focus:border-blue-500
                        focus:ring-2 focus:ring-blue-500/30 transition-all"
                      />
                      <button
                        type="button"
                        onClick={() => setShowNewPassword(!showNewPassword)}
                        className="absolute right-3 top-1/2 -translate-y-1/2 text-white/40 hover:text-white transition-colors"
                      >
                        {showNewPassword ? (
                          <svg width="15" height="15" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24">
                            <path d="M17.94 17.94A10.07 10.07 0 0 1 12 20c-7 0-11-8-11-8a18.45 18.45 0 0 1 5.06-5.94" />
                            <path d="M9.9 4.24A9.12 9.12 0 0 1 12 4c7 0 11 8 11 8a18.5 18.5 0 0 1-2.16 3.19" />
                            <line x1="1" y1="1" x2="23" y2="23" />
                          </svg>
                        ) : (
                          <svg width="15" height="15" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24">
                            <path d="M1 12s4-8 11-8 11 8 11 8-4 8-11 8-11-8-11-8z" />
                            <circle cx="12" cy="12" r="3" />
                          </svg>
                        )}
                      </button>
                    </div>
                  </div>
                )}

                {/* Back to Sign In */}
                <div className="mb-1 flex justify-end">
                  <button
                    type="button"
                    onClick={resetForgotFlow}
                    className="text-[10px] text-blue-500 hover:underline font-medium"
                  >
                    Back to Sign In
                  </button>
                </div>
              </>
            )}

            {/* REMEMBER ME — only on normal login */}
            {!isForgot && (
              <label className="flex items-center gap-2 mt-4 cursor-pointer group">
                <input
                  type="checkbox"
                  className="w-3.5 h-3.5 rounded border border-[#1e1e1e] bg-[#111] accent-blue-600 cursor-pointer"
                />
                <span className="text-xs text-white/40 group-hover:text-white/60 transition-colors">
                  Remember me
                </span>
              </label>
            )}

            {/* SUBMIT */}
            <button
              onClick={isForgot ? handleForgotAction : handleSubmit}
              className="w-full mt-5 bg-blue-600 hover:bg-blue-700 active:scale-[0.98] text-white font-medium
              text-sm py-2.5 rounded-lg transition-all duration-200 tracking-wide overflow-hidden relative group"
            >
              <span className="relative z-10">
                {isForgot ? forgotButtonLabel : "Sign In"}
              </span>
              <span
                className="absolute inset-0 bg-gradient-to-r from-transparent via-white/10 to-transparent
              translate-x-[-100%] group-hover:translate-x-[100%] transition-transform duration-500"
              />
            </button>

            {/* DIVIDER */}
            <div className="flex items-center gap-2 my-4">
              <span className="flex-1 h-px bg-[#1e1e1e]" />
              <span className="text-[10px] text-white/30">or</span>
              <span className="flex-1 h-px bg-[#1e1e1e]" />
            </div>

            {/* SIGN UP LINK */}
            <p className="text-center text-xs text-white/35">
              Don't have an account?{" "}
              <Link to={"/signup"} className="text-blue-500 font-medium hover:underline">
                Sign up
              </Link>
            </p>
          </div>
        </div>

        {/* ── RIGHT: WELCOME BACK PANEL ── */}
        <div className="hidden md:flex w-1/2 flex-col items-center justify-center px-16 relative overflow-hidden fade-in">
          {/* purple glow */}
          <div
            className="pointer-events-none absolute bottom-0 right-0 w-96 h-96 rounded-full opacity-15 blur-3xl"
            style={{ background: "radial-gradient(circle, #6a0dad, transparent)" }}
          />
          {/* blue glow */}
          <div
            className="pointer-events-none absolute top-10 right-20 w-64 h-64 rounded-full opacity-10 blur-3xl"
            style={{ background: "radial-gradient(circle, #1d6cf5, transparent)" }}
          />

          <div className="relative z-10 max-w-sm text-center">
            <h2 className="text-4xl font-extrabold leading-tight mb-5">
              Welcome to <span className="text-blue-500">DARUT</span>
            </h2>

            <p className="text-sm text-white/50 leading-relaxed mb-10">
              Understand your mental health in your own words. Our app detects
              signs of depression from Roman Urdu text, giving you insights into
              your emotional well-being quickly and easily.
            </p>

            {/* FEATURE PILLS */}
            <div className="flex flex-col gap-3 text-left">
              {[
                {
                  icon: "🧠",
                  title: "AI-Powered Analysis",
                  desc: "Detects emotional patterns in Roman Urdu text",
                },
                {
                  icon: "🔒",
                  title: "Private & Secure",
                  desc: "Your data stays confidential, always",
                },
                {
                  icon: "📊",
                  title: "Instant Insights",
                  desc: "Get results in seconds, not days",
                },
              ].map((f) => (
                <div
                  key={f.title}
                  className="flex items-start gap-3 bg-white/[0.03] border border-white/[0.06] rounded-xl px-4 py-3"
                >
                  <span className="text-lg mt-0.5">{f.icon}</span>
                  <div>
                    <p className="text-sm font-semibold text-white/90">{f.title}</p>
                    <p className="text-xs text-white/40 mt-0.5">{f.desc}</p>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>
    </>
  );
}