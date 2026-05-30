import { useState } from "react";
import Navbar from "./Navbar";
import { Link } from "react-router-dom";
import axios from "axios";
import { toast } from "react-toastify";
import { useNavigate } from "react-router-dom";
import { Backend_url } from "../Server";


export default function Signup() {
  const [showPassword, setShowPassword] = useState(false);
  const [password, setPassword] = useState("");
  const [form, setForm] = useState({ name: "", email: "", password: "" });
  // ✅ NEW: step & OTP state
  const [step, setStep] = useState("signup"); // "signup" | "otp"
  const [otp, setOtp] = useState("");
  const Navigate = useNavigate();
  

  const getStrength = (val) => {
    let score = 0;
    if (val.length >= 8) score++;
    if (/[A-Z]/.test(val)) score++;
    if (/[0-9]/.test(val)) score++;
    if (/[^A-Za-z0-9]/.test(val)) score++;
    return score;
  };

  const strengthScore = getStrength(password);
  const strengthColors = ["bg-red-500", "bg-orange-500", "bg-yellow-400", "bg-green-500"];
  const strengthLabels = ["Weak", "Fair", "Good", "Strong"];
  const strengthColor = password ? strengthColors[strengthScore - 1] : "";
  const strengthLabel = password ? strengthLabels[strengthScore - 1] : "";

  // ✅ Signup → Send OTP
  const handleSubmit = async () => {
    if (!form.name || !form.email || !form.password) {
      alert("Please fill in all fields.");
      return;
    }

    try {
      const res = await axios.post(`${Backend_url}/user/create-user`, form);
      toast.success(res.data.message);
      setStep("otp");
    } catch (error) {
      console.error(error);
      toast.error(error.response?.data?.message || "Something went wrong");
    }
  };

  // ✅ Verify OTP
  const handleVerifyOtp = async () => {
    if (!otp) return toast.error("Enter OTP");

    try {
    const res = await axios.post(`${Backend_url}/user/verify-otp`, {
        email: form.email,
        otp,
      });
      toast.success("Account verified!");
      Navigate("/Analyze")
      
    } catch (error) {
      toast.error(error.response?.data?.message || "Invalid OTP");
    }
  };

  return (
    <>
      <Navbar />
      <div className="min-h-screen bg-black text-white font-sans flex">
        <style>{`
          @keyframes fadeUp { from { opacity: 0; transform: translateY(16px); } to { opacity: 1; transform: translateY(0); } }
          @keyframes fadeIn { from { opacity: 0; } to { opacity: 1; } }
          .fade-up { animation: fadeUp 0.55s ease both; }
          .fade-in { animation: fadeIn 0.8s ease both; }
        `}</style>

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
                { icon: "🧠", title: "AI-Powered Analysis", desc: "Detects emotional patterns in Roman Urdu text" },
                { icon: "🔒", title: "Private & Secure", desc: "Your data stays confidential, always" },
                { icon: "📊", title: "Instant Insights", desc: "Get results in seconds, not days" },
              ].map((f) => (
                <div key={f.title} className="flex items-start gap-3 bg-white/[0.03] border border-white/[0.06] rounded-xl px-4 py-3">
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

        <div className="w-full md:w-1/2 flex items-center justify-center px-8 py-12 relative z-10">
          <div
            className="pointer-events-none fixed top-0 left-0 w-72 h-72 rounded-full opacity-10 blur-3xl"
            style={{ background: "radial-gradient(circle, #1d6cf5, transparent)" }}
          />

          <div className="w-full max-w-xs bg-[#0d0d0d] border border-[#1e1e1e] rounded-xl px-6 py-7 fade-up">
            {/* HEADER */}
            <div className="mb-5">
              <h1 className="text-2xl font-extrabold tracking-tight leading-tight mb-1.5">
                {step === "signup" ? "Join " : "Verify "} <span className="text-blue-500">DARUT</span>
              </h1>
              <p className="text-xs text-white/40 leading-relaxed">
                {step === "signup"
                  ? "Create your account to get personalized insights."
                  : `Enter the OTP sent to ${form.email}`}
              </p>
            </div>

            {/* 🔄 FORM FIELDS */}
            {step === "signup" ? (
              <>
                {/* NAME */}
                <div className="mb-3">
                  <label className="block text-[10px] font-medium uppercase tracking-widest text-white/40 mb-1.5">
                    Full Name
                  </label>
                  <input
                    type="text"
                    placeholder="e.g. Ali Hassan"
                    value={form.name}
                    onChange={(e) => setForm({ ...form, name: e.target.value })}
                    className="w-full bg-[#111] border border-[#1e1e1e] rounded-lg px-3 py-2.5 text-white text-xs
                    placeholder:text-white/20 outline-none focus:border-blue-500 focus:ring-2 focus:ring-blue-500/30 transition-all"
                  />
                </div>

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
                    placeholder:text-white/20 outline-none focus:border-blue-500 focus:ring-2 focus:ring-blue-500/30 transition-all"
                  />
                </div>

                {/* PASSWORD */}
                <div className="mb-1">
                  <label className="block text-[10px] font-medium uppercase tracking-widest text-white/40 mb-1.5">
                    Password
                  </label>
                  <div className="relative">
                    <input
                      type={showPassword ? "text" : "password"}
                      placeholder="Create a strong password"
                      value={form.password}
                      onChange={(e) => {
                        setForm({ ...form, password: e.target.value });
                        setPassword(e.target.value);
                      }}
                      className="w-full bg-[#111] border border-[#1e1e1e] rounded-lg px-3 py-2.5 pr-10 text-white text-xs
                      placeholder:text-white/20 outline-none focus:border-blue-500 focus:ring-2 focus:ring-blue-500/30 transition-all"
                    />
                    <button
                      type="button"
                      onClick={() => setShowPassword(!showPassword)}
                      className="absolute right-3 top-1/2 -translate-y-1/2 text-white/40 hover:text-white transition-colors"
                    >
                      {showPassword ? "Hide" : "Show"}
                    </button>
                  </div>

                  {/* STRENGTH BAR */}
                  <div className="flex gap-1 mt-2">
                    {[1, 2, 3, 4].map((i) => (
                      <span
                        key={i}
                        className={`flex-1 h-0.5 rounded-full transition-all duration-300 ${
                          password && i <= strengthScore ? strengthColor : "bg-[#1e1e1e]"
                        }`}
                      />
                    ))}
                  </div>
                  <p
                    className={`text-[10px] mt-1 h-3.5 transition-all duration-300 ${
                      password ? strengthColors[strengthScore - 1]?.replace("bg-", "text-") : "text-white/40"
                    }`}
                  >
                    {strengthLabel}
                  </p>
                </div>
              </>
            ) : (
              <>
                {/* OTP INPUT */}
                <div className="mb-3">
                  <label className="block text-[10px] font-medium uppercase tracking-widest text-white/40 mb-1.5">
                    Enter OTP
                  </label>
                  <input
                    type="text"
                    placeholder="Enter 6-digit OTP"
                    value={otp}
                    onChange={(e) => setOtp(e.target.value)}
                    className="w-full bg-[#111] border border-[#1e1e1e] rounded-lg px-3 py-2.5 text-white text-xs text-center tracking-widest
                    placeholder:text-white/20 outline-none focus:border-blue-500 focus:ring-2 focus:ring-blue-500/30 transition-all"
                  />
                </div>

                {/* RESEND OTP */}
                <button
                  onClick={handleSubmit}
                  className="text-xs text-blue-500 mt-2"
                >
                  Resend OTP
                </button>
              </>
            )}

            {/* SUBMIT / VERIFY BUTTON */}
            <button
              onClick={step === "signup" ? handleSubmit : handleVerifyOtp}
              className="w-full mt-4 bg-blue-600 hover:bg-blue-700 active:scale-[0.98] text-white font-medium
              text-sm py-2.5 rounded-lg transition-all duration-200 tracking-wide overflow-hidden relative group"
            >
              <span className="relative z-10">
                {step === "signup" ? "Create Account" : "Verify OTP"}
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

            {/* SIGN IN LINK */}
            <p className="text-center text-xs text-white/35">
              Already have an account?{" "}
              <Link to={"/login"} className="text-blue-500 font-medium hover:underline">
                Sign in
              </Link>
            </p>
          </div>
        </div>
      </div>
    </>
  );
}