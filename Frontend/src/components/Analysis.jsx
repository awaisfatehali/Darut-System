import axios from "axios";
import { useState, useRef, useEffect } from "react";
import { useSelector } from "react-redux";
import { toast } from "react-toastify";
import { useNavigate } from "react-router-dom";

export default function DarutChat() {
  const [messages, setMessages] = useState([]);
  const [input, setInput] = useState("");
  const [loading, setLoading] = useState(false);
  const [messageCount, setMessageCount] = useState(0);

  const bottomRef = useRef(null);
  const textareaRef = useRef(null);

  const navigate = useNavigate();
  const { user } = useSelector((state) => state.user);

  const samplePrompts = [
    "Main bohot akela feel kar raha hoon aaj kal",
    "Zindagi mein koi maqsad nahi lagta",
    "Har cheez theek hai, bas thoda tired hoon",
    "Mujhe lagta hai koi mujhe samajhta nahi",
  ];

  useEffect(() => {
    bottomRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [messages, loading]);

  const adjustTextarea = () => {
    const ta = textareaRef.current;

    if (!ta) return;

    ta.style.height = "auto";
    ta.style.height = Math.min(ta.scrollHeight, 160) + "px";
  };

  const HandleLogout = async () => {
    try {
      await axios.get("http://localhost:8000/api/v2/user/logout", {
        withCredentials: true,
      });

      navigate("/");
      window.location.reload();
    } catch (error) {
      toast.error(error.message || "Logout failed");
    }
  };

  const sendMessage = async (text) => {
    const userText = (text || input).trim();

    if (!userText || loading) return;

    const updatedCount = messageCount + 1;

    const userMessage = {
      role: "user",
      content: userText,
    };

    setMessages((prev) => [...prev, userMessage]);

    setMessageCount(updatedCount);

    setInput("");

    if (textareaRef.current) {
      textareaRef.current.style.height = "auto";
    }

    setLoading(true);

    try {
      // MAIN ANALYSIS REQUEST
      const response = await axios.post(
        "http://localhost:8000/api/v2/depression/analyze",
        {
          text: userText,
        },
        {
          withCredentials: true,
        },
      );

      // ML response shape: { prediction: 'Depression', confidence: 0.991 }
      const data = response?.data?.text;

      const assistantMessage = {
        role: "assistant",
        type: "ml",
        content: data,
      };

      // ADD TO CHAT
      setMessages((prev) => [...prev, assistantMessage]);

      // SAVE LOCALLY
      const existingChats =
        JSON.parse(localStorage.getItem("darut_chats")) || [];

      const updatedChats = [...existingChats, userMessage, assistantMessage];

      localStorage.setItem("darut_chats", JSON.stringify(updatedChats));

      // CALL ROUTE AFTER EVERY 5 USER MESSAGES
      if (updatedCount % 5 === 0) {
        const savedChats =
          JSON.parse(localStorage.getItem("darut_chats")) || [];

        // LAST 10 ENTRIES = 5 user + 5 assistant
        const lastTenEntries = savedChats.slice(-10);

        const adviceResponse = await axios.post(
          "http://localhost:8000/api/v2/depression/five-message-analysis",
          {
            chats: lastTenEntries,
          },
          {
            withCredentials: true,
          },
        );

        const adviceData = adviceResponse?.data?.text;

        // INJECT ADVICE CARD AS SPECIAL MESSAGE TYPE
        const adviceMessage = {
          role: "assistant",
          type: "advice",
          content: adviceData,
        };

        setMessages((prev) => [...prev, adviceMessage]);
      }
    } catch (error) {
      toast.error(error.response?.data?.message || "Something went wrong");

      setMessages((prev) => [
        ...prev,
        {
          role: "assistant",
          type: "ml",
          content: { prediction: "Error", confidence: 0 },
        },
      ]);
    } finally {
      setLoading(false);
    }
  };

  const handleKey = (e) => {
    if (e.key === "Enter" && !e.shiftKey) {
      e.preventDefault();
      sendMessage();
    }
  };

  const clearChat = () => {
    setMessages([]);
    setMessageCount(0);
    localStorage.removeItem("darut_chats");
  };

  const getPredictionStyle = (prediction) => {
    if (!prediction) return "bg-gray-500/10 text-gray-400 border-gray-500/20";
    const p = prediction.toLowerCase();
    if (p === "no depression" || p === "no")
      return "bg-green-500/10 text-green-400 border-green-500/20";
    if (p.includes("mild"))
      return "bg-yellow-500/10 text-yellow-400 border-yellow-500/20";
    if (p.includes("moderate"))
      return "bg-orange-500/10 text-orange-400 border-orange-500/20";
    if (p.includes("depression") || p.includes("severe"))
      return "bg-red-500/10 text-red-400 border-red-500/20";
    if (p === "uncertain")
      return "bg-gray-500/10 text-gray-400 border-gray-500/20";
    return "bg-blue-500/10 text-blue-400 border-blue-500/20";
  };

  const renderMarkdown = (text) => {
    if (!text) return null;
    return text.split("\n").map((line, i) => {
      line = line.replace(/\*\*(.*?)\*\*/g, "<strong>$1</strong>");

      line = line.replace(/\*(.*?)\*/g, "<em>$1</em>");

      if (line.startsWith("### "))
        return (
          <h3
            key={i}
            className="text-sm font-bold text-white mt-3 mb-1"
            dangerouslySetInnerHTML={{
              __html: line.slice(4),
            }}
          />
        );

      if (line.startsWith("## "))
        return (
          <h2
            key={i}
            className="text-base font-bold text-white mt-3 mb-1"
            dangerouslySetInnerHTML={{
              __html: line.slice(3),
            }}
          />
        );

      if (line.startsWith("- "))
        return (
          <li
            key={i}
            className="text-sm text-white/80 ml-4 list-disc"
            dangerouslySetInnerHTML={{
              __html: line.slice(2),
            }}
          />
        );

      if (line === "") return <br key={i} />;

      return (
        <p
          key={i}
          className="text-sm text-white/80 leading-relaxed"
          dangerouslySetInnerHTML={{
            __html: line,
          }}
        />
      );
    });
  };

  return (
    <div className="flex h-screen w-full bg-black text-white overflow-hidden font-sans">
      <style>{`
        @keyframes fadeUp {
          from {
            opacity: 0;
            transform: translateY(10px);
          }
          to {
            opacity: 1;
            transform: translateY(0);
          }
        }

        @keyframes blink {
          0%,100% { opacity:.3 }
          50% { opacity:1 }
        }

        .fade-up {
          animation: fadeUp 0.35s ease both;
        }

        .dot {
          width: 7px;
          height: 7px;
          border-radius: 50%;
          background: #1d6cf5;
          animation: blink 1.2s ease infinite;
        }

        .dot:nth-child(2) {
          animation-delay: .2s;
        }

        .dot:nth-child(3) {
          animation-delay: .4s;
        }

        .custom-scroll::-webkit-scrollbar {
          width: 4px;
        }

        .custom-scroll::-webkit-scrollbar-track {
          background: transparent;
        }

        .custom-scroll::-webkit-scrollbar-thumb {
          background: #2a2a2a;
          border-radius: 4px;
        }

        .custom-scroll:hover::-webkit-scrollbar-thumb {
          background: #3f3f3f;
        }

        textarea::-webkit-scrollbar {
          width: 4px;
        }

        textarea::-webkit-scrollbar-thumb {
          background: #2a2a2a;
          border-radius: 4px;
        }
      `}</style>

      {/* SIDEBAR */}
      <div className="hidden md:flex flex-col w-[260px] bg-[#09090b] border-r border-[#1e1e1e] flex-shrink-0 h-full">
        <div className="p-3">
          <button
            onClick={clearChat}
            className="flex items-center gap-2 w-full px-3 py-2.5 text-sm text-white font-medium bg-[#1a1a1a] hover:bg-[#2a2a2a] border border-[#2a2a2a] hover:border-blue-500/30 rounded-lg transition-all"
          >
            <svg
              width="16"
              height="16"
              fill="none"
              stroke="currentColor"
              strokeWidth="2"
              viewBox="0 0 24 24"
            >
              <line x1="12" y1="5" x2="12" y2="19" />
              <line x1="5" y1="12" x2="19" y2="12" />
            </svg>
            New Chat
          </button>
        </div>

        <div className="mt-auto p-3 border-t border-[#1e1e1e]">
          <div className="flex items-center justify-between px-2 py-2 hover:bg-[#1a1a1a] rounded-lg transition-colors cursor-pointer group">
            <div className="flex items-center gap-2 truncate">
              <div className="w-8 h-8 rounded-full bg-blue-600/20 border border-blue-500/30 flex items-center justify-center flex-shrink-0 text-blue-400 font-bold text-xs">
                {user?.name?.charAt(0).toUpperCase() || "U"}
              </div>

              <span className="text-sm font-medium text-white truncate">
                {user?.name || "User"}
              </span>
            </div>

            <button
              onClick={HandleLogout}
              className="text-white/40 hover:text-red-400 transition-colors p-1"
              title="Logout"
            >
              <svg
                width="16"
                height="16"
                fill="none"
                stroke="currentColor"
                strokeWidth="2"
                viewBox="0 0 24 24"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  d="M9 21H5a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2h4M16 17l5-5-5-5M21 12H9"
                />
              </svg>
            </button>
          </div>
        </div>
      </div>

      {/* MAIN CHAT */}
      <div className="flex-1 flex flex-col h-full bg-black relative">
        <header className="flex items-center justify-between px-6 py-3.5 border-b border-[#1a1a1a] bg-black/90 backdrop-blur-sm flex-shrink-0">
          <div className="flex items-center gap-3">
            <span className="font-extrabold text-lg tracking-widest text-white">
              DARUT
            </span>

            <span className="hidden sm:inline-block text-[10px] bg-blue-500/15 text-blue-400 border border-blue-500/20 px-2 py-0.5 rounded-full font-medium tracking-wide">
              Roman Urdu · Analysis
            </span>
          </div>

          <div className="flex items-center gap-1.5">
            <div className="w-1.5 h-1.5 rounded-full bg-green-400 animate-pulse" />

            <span className="text-[11px] text-white/35">Online</span>
          </div>
        </header>

        {/* MESSAGES */}
        <div className="flex-1 overflow-y-auto custom-scroll px-4 py-6 relative">
          <div
            className="pointer-events-none fixed top-0 left-1/2 -translate-x-1/2 w-[600px] h-[300px] rounded-full opacity-5 blur-3xl"
            style={{
              background: "radial-gradient(circle, #1d6cf5, transparent)",
            }}
          />

          {messages.length === 0 ? (
            <div className="h-full flex flex-col items-center justify-center text-center fade-up relative z-10 max-w-2xl mx-auto px-4">
              <div className="w-14 h-14 rounded-2xl bg-[#0d0d0d] border border-[#1e1e1e] flex items-center justify-center mx-auto mb-5 shadow-[0_0_15px_rgba(29,108,245,0.15)]">
                <svg
                  width="26"
                  height="26"
                  fill="none"
                  stroke="#3b82f6"
                  strokeWidth="1.8"
                  viewBox="0 0 24 24"
                >
                  <path d="M21 15a2 2 0 0 1-2 2H7l-4 4V5a2 2 0 0 1 2-2h14a2 2 0 0 1 2 2z" />
                </svg>
              </div>

              <h2 className="text-2xl font-semibold mb-2">
                Hi{" "}
                {user?.name
                  ? user.name.charAt(0).toUpperCase() + user.name.slice(1)
                  : "there"}
                ! How are you feeling{" "}
                <span className="text-blue-500 font-bold">today?</span>
              </h2>

              <p className="text-sm text-white/40 max-w-md leading-relaxed mb-8">
                Share your thoughts in Roman Urdu or English. DARUT will analyze
                your emotional state and provide compassionate insights.
              </p>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 w-full">
                {samplePrompts.map((p, i) => (
                  <button
                    key={i}
                    onClick={() => sendMessage(p)}
                    className="text-left text-xs text-white/60 hover:text-white bg-[#0d0d0d] hover:bg-[#1a1a1a]
                    border border-[#1e1e1e] hover:border-blue-500/30 rounded-xl px-4 py-3.5
                    transition-all leading-relaxed shadow-sm"
                  >
                    "{p}"
                  </button>
                ))}
              </div>
            </div>
          ) : (
            <div className="max-w-3xl mx-auto flex flex-col gap-6 relative z-10 pb-4">
              {messages.map((msg, i) => (
                <div
                  key={i}
                  className={`fade-up flex gap-4 ${
                    msg.role === "user" ? "justify-end" : "justify-start"
                  }`}
                >
                  {/* ADVICE CARD — every 5th message, full width */}
                  {msg.role === "assistant" && msg.type === "advice" ? (
                    <div className="w-full rounded-2xl border border-blue-500/20 bg-blue-500/5 p-4 flex flex-col gap-3">
                      <div className="flex items-center gap-2 flex-wrap">
                        <span className="text-[10px] text-white/40 uppercase tracking-widest font-medium">
                          5-Message Analysis
                        </span>

                        {msg.content?.overall_depression_level && (
                          <span
                            className={`text-xs font-semibold px-2.5 py-1 rounded-full border ${getPredictionStyle(
                              msg.content.overall_depression_level,
                            )}`}
                          >
                            {msg.content.overall_depression_level}
                          </span>
                        )}
                      </div>

                      {msg.content?.explanation && (
                        <div className="flex flex-col gap-1">
                          {renderMarkdown(msg.content.explanation)}
                        </div>
                      )}

                      {msg.content?.suggested_response && (
                        <div className="mt-1 border-l-2 border-blue-500/40 pl-3 text-sm text-white/60 italic">
                          {msg.content.suggested_response}
                        </div>
                      )}
                    </div>
                  ) : (
                    <>
                      {msg.role === "assistant" && (
                        <div className="w-8 h-8 rounded-full bg-[#111] border border-blue-500/30 flex items-center justify-center flex-shrink-0 mt-0.5 text-blue-500 shadow-sm">
                          <svg
                            width="16"
                            height="16"
                            fill="none"
                            stroke="currentColor"
                            strokeWidth="2"
                            viewBox="0 0 24 24"
                          >
                            <path d="M21 15a2 2 0 0 1-2 2H7l-4 4V5a2 2 0 0 1 2-2h14a2 2 0 0 1 2 2z" />
                          </svg>
                        </div>
                      )}

                      <div
                        className={`max-w-[85%] px-4 py-3 ${
                          msg.role === "user"
                            ? "bg-[#1a1a1a] text-white rounded-2xl rounded-tr-sm"
                            : "bg-transparent text-white/90"
                        }`}
                      >
                        {msg.role === "user" ? (
                          <p className="text-[15px] leading-relaxed">
                            {msg.content}
                          </p>
                        ) : (
                          // ML RESPONSE: { prediction, confidence }
                          <div className="flex flex-col gap-3 text-[15px]">
                            <div className="flex items-center gap-2 flex-wrap">
                              <span
                                className={`text-xs font-semibold px-2.5 py-1 rounded-full border ${getPredictionStyle(
                                  msg.content?.prediction,
                                )}`}
                              >
                                {msg.content?.prediction || "Unknown"}
                              </span>

                              <span className="text-xs text-white/40 border border-[#2a2a2a] px-2.5 py-1 rounded-full">
                                Confidence:{" "}
                                {Math.round(
                                  (msg.content?.confidence || 0) * 100,
                                )}
                                %
                              </span>
                            </div>
                          </div>
                        )}
                      </div>
                    </>
                  )}
                </div>
              ))}

              {loading && (
                <div className="fade-up flex gap-4 justify-start">
                  <div className="w-8 h-8 rounded-full bg-[#111] border border-blue-500/30 flex items-center justify-center flex-shrink-0 text-blue-500">
                    <svg
                      width="16"
                      height="16"
                      fill="none"
                      stroke="currentColor"
                      strokeWidth="2"
                      viewBox="0 0 24 24"
                    >
                      <path d="M21 15a2 2 0 0 1-2 2H7l-4 4V5a2 2 0 0 1 2-2h14a2 2 0 0 1 2 2z" />
                    </svg>
                  </div>

                  <div className="px-2 py-3 flex gap-1.5 items-center h-full">
                    <span className="dot" />
                    <span className="dot" />
                    <span className="dot" />
                  </div>
                </div>
              )}

              <div ref={bottomRef} />
            </div>
          )}
        </div>

        {/* INPUT */}
        <div className="px-4 pb-6 pt-2 bg-gradient-to-t from-black via-black to-transparent flex-shrink-0 relative z-20">
          <div className="max-w-3xl mx-auto relative">
            <div
              className="flex items-end gap-2 bg-[#1a1a1a] border border-[#2a2a2a]
              rounded-2xl pl-4 pr-2 py-2 shadow-[0_0_15px_rgba(0,0,0,0.5)]
              focus-within:border-blue-500/50 focus-within:ring-1
              focus-within:ring-blue-500/20 transition-all"
            >
              <textarea
                ref={textareaRef}
                rows={1}
                value={input}
                onChange={(e) => {
                  setInput(e.target.value);
                  adjustTextarea();
                }}
                onKeyDown={handleKey}
                placeholder="Message DARUT..."
                className="flex-1 bg-transparent text-[15px] text-white placeholder:text-white/30 outline-none resize-none leading-relaxed py-2 max-h-[200px] custom-scroll"
              />

              <button
                onClick={() => sendMessage()}
                disabled={!input.trim() || loading}
                className="w-9 h-9 mb-1 rounded-xl bg-blue-600 disabled:bg-[#2a2a2a]
                disabled:text-white/20 text-white hover:bg-blue-700
                flex items-center justify-center flex-shrink-0 transition-all
                disabled:cursor-not-allowed active:scale-95"
              >
                <svg
                  width="16"
                  height="16"
                  fill="none"
                  stroke="currentColor"
                  strokeWidth="2.5"
                  viewBox="0 0 24 24"
                >
                  <line x1="22" y1="2" x2="11" y2="13" />

                  <polygon points="22 2 15 22 11 13 2 9 22 2" />
                </svg>
              </button>
            </div>

            <p className="text-center text-[11px] text-white/30 mt-3">
              DARUT can make mistakes. Consider verifying important information.
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}