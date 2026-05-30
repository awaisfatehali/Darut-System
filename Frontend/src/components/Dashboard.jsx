import React from "react";
import { Link } from "react-router-dom";
import Navbar from "./Navbar";
import { useNavigate } from "react-router-dom";

const Dashboard = () => {
  const navigate = useNavigate();

  return (
    <>
      <style>{`
        @keyframes fadeUp {
          from { opacity: 0; transform: translateY(24px); }
          to   { opacity: 1; transform: translateY(0); }
        }
        @keyframes fadeIn {
          from { opacity: 0; }
          to   { opacity: 1; }
        }
        @keyframes float {
          0%, 100% { transform: translateY(0px); }
          50%       { transform: translateY(-10px); }
        }
        .fade-up-1 { animation: fadeUp 0.6s ease both 0.1s; }
        .fade-up-2 { animation: fadeUp 0.6s ease both 0.25s; }
        .fade-up-3 { animation: fadeUp 0.6s ease both 0.4s; }
        .fade-up-4 { animation: fadeUp 0.6s ease both 0.55s; }
        .float-card { animation: float 4s ease-in-out infinite; }
        .float-card-2 { animation: float 4s ease-in-out infinite 1s; }
        .float-card-3 { animation: float 4s ease-in-out infinite 2s; }
      `}</style>

      <Navbar />

      <div className="min-h-screen bg-black text-white overflow-hidden">

        {/* bg glows */}
        <div className="pointer-events-none fixed top-0 left-0 w-[500px] h-[500px] rounded-full opacity-10 blur-3xl"
          style={{ background: "radial-gradient(circle, #1d6cf5, transparent)" }} />
        <div className="pointer-events-none fixed bottom-0 right-0 w-96 h-96 rounded-full opacity-10 blur-3xl"
          style={{ background: "radial-gradient(circle, #6a0dad, transparent)" }} />

        <div className="pt-24 min-h-screen flex items-center px-6 md:px-16 lg:px-32 gap-12">

          {/* ── LEFT ── */}
          <div className="w-full md:w-1/2 flex flex-col gap-6 py-16">

            {/* badge */}
            <div className="fade-up-1 inline-flex w-fit items-center gap-2 border border-blue-500/30 bg-blue-500/5 rounded-full px-4 py-1.5">
              <span className="w-1.5 h-1.5 rounded-full bg-blue-400 animate-pulse" />
              <span className="text-xs font-semibold tracking-widest text-blue-400 uppercase">
                Roman Urdu · Mental Health AI
              </span>
            </div>

            {/* heading */}
            <div className="fade-up-2">
              <h1 className="text-5xl lg:text-6xl font-black leading-[1.1] tracking-tight mb-2">
                Welcome to
              </h1>
              <h1 className="text-5xl lg:text-6xl font-black leading-[1.1] tracking-tight">
                <span className="text-blue-500 relative">
                  DARUT
                  <span className="absolute -bottom-1 left-0 w-full h-[3px] bg-blue-500/40 rounded-full" />
                </span>
              </h1>
            </div>

            {/* description */}
            <p className="fade-up-3 text-base text-white/50 leading-relaxed max-w-md">
              Understand your mental health in your own words. Our app detects
              signs of depression from Roman Urdu text, giving you insights into
              your emotional well-being quickly and easily.
            </p>

            {/* CTA buttons */}
            <div className="fade-up-4 flex items-center gap-4 flex-wrap">
              <button
                onClick={() => navigate("/Analyze")}
                className="group relative inline-flex h-11 items-center justify-center overflow-hidden
                  rounded-xl bg-blue-600 hover:bg-blue-700 px-6 font-semibold text-sm
                  text-white tracking-wide transition-all duration-200 active:scale-[0.98]"
              >
                <span className="relative z-10">Start Analyzing</span>
                <span className="absolute inset-0 bg-gradient-to-r from-transparent via-white/10 to-transparent
                  translate-x-[-100%] group-hover:translate-x-[100%] transition-transform duration-500" />
              </button>

              <button
                onClick={() => navigate("/about")}
                className="h-11 px-6 rounded-xl border border-[#2a2a2a] hover:border-blue-500/40
                  text-sm font-semibold text-white/50 hover:text-white transition-all duration-200"
              >
                Learn More →
              </button>
            </div>

            {/* stats row */}
            <div className="fade-up-4 flex items-center gap-6 pt-2 border-t border-[#1a1a1a] mt-2">
              {[
                { value: "95%", label: "Accuracy" },
                { value: "<2s", label: "Response Time" },
                { value: "100%", label: "Private & Secure" },
              ].map((s) => (
                <div key={s.label}>
                  <p className="text-xl font-black text-white">{s.value}</p>
                  <p className="text-[11px] text-white/35 font-medium tracking-wide uppercase">{s.label}</p>
                </div>
              ))}
            </div>
          </div>

          {/* ── RIGHT ── */}
          <div className="hidden md:flex w-1/2 h-full items-center justify-center relative py-16">

            {/* feature cards */}
            <div className="flex flex-col gap-4 w-full max-w-sm">
              {[
                {
                  icon: "🧠",
                  title: "AI-Powered Analysis",
                  desc: "Detects emotional patterns in Roman Urdu text with high accuracy",
                  cls: "float-card",
                  delay: ""
                },
                {
                  icon: "🔒",
                  title: "Private & Secure",
                  desc: "Your data stays confidential — we never store your messages",
                  cls: "float-card-2",
                  ml: "ml-8"
                },
                {
                  icon: "📊",
                  title: "Instant Insights",
                  desc: "Get detailed emotional insights in seconds, not days",
                  cls: "float-card-3",
                  ml: ""
                },
              ].map((f) => (
                <div
                  key={f.title}
                  className={`${f.cls} ${f.ml || ""} flex items-start gap-4
                    bg-[#0d0d0d] border border-[#1e1e1e] hover:border-blue-500/20
                    rounded-2xl px-5 py-4 transition-all duration-300`}
                >
                  <span className="text-2xl mt-0.5">{f.icon}</span>
                  <div>
                    <p className="text-sm font-bold text-white/90 mb-1">{f.title}</p>
                    <p className="text-xs text-white/40 leading-relaxed">{f.desc}</p>
                  </div>
                </div>
              ))}
            </div>
          </div>

        </div>
      </div>
    </>
  );
};

export default Dashboard;