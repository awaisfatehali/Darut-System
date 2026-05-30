import React from "react";
import Navbar from "./Navbar";
import { useNavigate } from "react-router-dom";

const About = () => {
  const navigate = useNavigate();

  return (
    <>
      <style>{`
        @keyframes fadeUp {
          from { opacity: 0; transform: translateY(20px); }
          to   { opacity: 1; transform: translateY(0); }
        }
        @keyframes shimmer {
          from { transform: translateX(-100%) skewX(-12deg); }
          to   { transform: translateX(200%) skewX(-12deg); }
        }
        .f1 { animation: fadeUp 0.5s ease both 0.05s; }
        .f2 { animation: fadeUp 0.5s ease both 0.15s; }
        .f3 { animation: fadeUp 0.5s ease both 0.25s; }
        .bento {
          transition: border-color 0.25s, transform 0.25s;
        }
        .bento:hover {
          border-color: rgba(59,130,246,0.35);
          transform: translateY(-3px);
        }
        .shimmer-btn::after {
          content: '';
          position: absolute;
          inset: 0;
          background: linear-gradient(90deg, transparent, rgba(255,255,255,0.1), transparent);
          transform: translateX(-100%) skewX(-12deg);
        }
        .shimmer-btn:hover::after {
          animation: shimmer 0.6s ease forwards;
        }
        .dot-grid {
          background-image: radial-gradient(circle, #1e1e1e 1px, transparent 1px);
          background-size: 20px 20px;
        }
      `}</style>

      <Navbar />

      <div className="min-h-screen lg:px-28 bg-black text-white overflow-hidden">
        {/* glows */}
        <div
          className="pointer-events-none fixed top-10 right-10 w-96 h-96 rounded-full opacity-10 blur-3xl"
          style={{
            background: "radial-gradient(circle, #1d6cf5, transparent)",
          }}
        />
        <div
          className="pointer-events-none fixed bottom-10 left-10 w-80 h-80 rounded-full opacity-10 blur-3xl"
          style={{
            background: "radial-gradient(circle, #6a0dad, transparent)",
          }}
        />

        <div className="px-4 md:px-6 pt-32 pb-20">
          {/* ── HEADER ── */}
          <div className="f1 mb-10">
            <div className="inline-flex items-center gap-2 border border-blue-500/30 bg-blue-500/5 rounded-full px-4 py-1.5 mb-5">
              <span className="w-1.5 h-1.5 rounded-full bg-blue-400 animate-pulse" />
              <span className="text-xs font-semibold tracking-widest text-blue-400 uppercase">
                Personal Project · 2025
              </span>
            </div>
            <div className="flex items-end justify-between flex-wrap gap-4">
              <h1 className="text-5xl lg:text-6xl font-black tracking-tight">
                Meet the{" "}
                <span className="text-blue-500 relative">
                  Team
                  <span className="absolute -bottom-1 left-0 w-full h-[3px] bg-blue-500/40 rounded-full" />
                </span>
              </h1>
              <p className="text-white/35 text-sm max-w-sm leading-relaxed">
                Built with passion — detecting depression through the power of
                Roman Urdu AI.
              </p>
            </div>
          </div>

          {/* ── BENTO GRID ── */}
          <div className="grid grid-cols-12 gap-4">
            {/* DARUT tag — full width */}
            <div className="f2 bento col-span-12 bg-blue-600/10 border border-blue-500/20 rounded-2xl p-7 flex flex-col justify-between">
              <div className="w-11 h-11 rounded-xl bg-blue-600/20 border border-blue-500/20 flex items-center justify-center mb-4">
                <svg
                  width="18"
                  height="18"
                  fill="none"
                  stroke="#60a5fa"
                  strokeWidth="2"
                  viewBox="0 0 24 24"
                >
                  <path d="M21 15a2 2 0 0 1-2 2H7l-4 4V5a2 2 0 0 1 2-2h14a2 2 0 0 1 2 2z" />
                </svg>
              </div>
              <div>
                <p className="text-3xl font-black text-white">DARUT</p>
                <p className="text-xs text-blue-400/70 mt-1 leading-relaxed">
                  Depression Analysis via Roman Urdu Text
                </p>
              </div>
            </div>

            {/* Awais — full width */}
            <div className="f2 bento col-span-12 bg-[#0a0a0a] border border-[#1e1e1e] rounded-2xl p-7 relative overflow-hidden">
              <div className="absolute left-0 top-0 bottom-0 w-1 bg-blue-500 rounded-l-2xl" />
              <div className="pl-2">
                <div className="w-12 h-12 rounded-xl bg-gradient-to-br from-blue-600/30 to-purple-600/30 border border-blue-500/20 flex items-center justify-center mb-5">
                  <span className="text-sm font-black text-blue-300">AF</span>
                </div>
                <p className="text-[10px] uppercase tracking-widest text-white/25 font-semibold mb-1">
                  Developer
                </p>
                <h3 className="text-lg font-black text-white">
                  Awais Fateh Ali
                </h3>
                <p className="text-xs text-white/35 mt-2 leading-relaxed">
                  For his incredible support and contributions throughout
                  DARUT's development.
                </p>
                <div className="mt-4 pt-4 border-t border-[#1e1e1e]">
                  <span className="text-[10px] bg-blue-500/10 text-blue-400/70 border border-blue-500/15 px-2 py-1 rounded-full">
                    ★ Outstanding Contributor
                  </span>
                </div>
              </div>
            </div>

            {/* Bottom CTA strip */}
            <div className="f3 col-span-12 bg-[#0a0a0a] border border-[#1e1e1e] rounded-2xl p-6 flex items-center justify-between gap-4 flex-wrap">
              <div>
                <p className="text-xs text-white/25 uppercase tracking-widest font-semibold mb-1">
                  Built with
                </p>
                <div className="flex items-center gap-2 flex-wrap">
                  {[
                    "React",
                    "Node.js",
                    "MongoDB",
                    "Python",
                    "FastAPI",
                    "scikit-learn",
                    "TailwindCSS",
                  ].map((t) => (
                    <span
                      key={t}
                      className="text-xs bg-[#111] border border-[#1e1e1e] text-white/40 px-3 py-1 rounded-full"
                    >
                      {t}
                    </span>
                  ))}
                </div>
              </div>
              <button
                onClick={() => navigate("/")}
                className="shimmer-btn group relative inline-flex h-11 items-center justify-center overflow-hidden
                  rounded-xl bg-blue-600 hover:bg-blue-700 px-8 font-bold text-sm
                  text-white tracking-wide transition-all duration-200 active:scale-[0.98]"
              >
                ← Back to Home
              </button>
            </div>
          </div>
        </div>
      </div>
    </>
  );
};

export default About;
