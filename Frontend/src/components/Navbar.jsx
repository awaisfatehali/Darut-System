import { useState } from "react";
import { useSelector } from "react-redux";
import { Link, useNavigate } from "react-router-dom";
import { toast } from "react-toastify";
import axios from "axios";
import { Backend_url } from "../Server";

const Navbar = () => {
  const { user } = useSelector((state) => state.user);
  const navigate = useNavigate();
  const [menuOpen, setMenuOpen] = useState(false);

  const handleLogout = async () => {
    try {
      const res = await axios.get(`${Backend_url}v2/user/logout`, {
        withCredentials: true,
      });
      toast.success(res.data.message);
      navigate("/");
      window.location.reload();
    } catch (error) {
      toast.error(error.response?.data?.message || "Logout failed");
    }
  };

  return (
    <header className="shadow-[5px_5px_0px_0px_rgba(109,40,217)] fixed top-0 left-0 w-screen z-50 border-b border-[#1a1a1a] bg-black/90 backdrop-blur-md">

      {/* ── MAIN ROW ── */}
      <div className="h-20 flex items-center justify-between px-6 md:px-16 lg:px-32">

        {/* LEFT — logo */}
        <div className="flex items-center gap-3">
          <Link to="/">
            <span className="font-extrabold text-2xl tracking-widest text-white">DARUT</span>
          </Link>
          <span className="hidden sm:inline text-[10px] bg-blue-500/15 text-blue-400 border border-blue-500/20 px-2 py-0.5 rounded-full font-medium tracking-wide">
            Roman Urdu · Analysis
          </span>
        </div>

        {/* RIGHT — desktop */}
        <div className="hidden md:flex items-center gap-3">
          <div className="flex items-center gap-1.5">
            <div className="w-1.5 h-1.5 rounded-full bg-green-400 animate-pulse" />
            <span className="text-[11px] text-white/35">Online</span>
          </div>

          {user && (
            <span className="text-xs text-white/40">
              {user.name.charAt(0).toUpperCase() + user.name.slice(1)}
            </span>
          )}

          {!user && (
            <Link to="/signup">
              <button className="group relative inline-flex h-12 items-center justify-center overflow-hidden rounded-md bg-blue-600 px-6 font-medium text-neutral-200">
                <span>Get Started</span>
                <div className="absolute inset-0 flex h-full w-full justify-center [transform:skew(-12deg)_translateX(-100%)] group-hover:duration-1000 group-hover:[transform:skew(-12deg)_translateX(100%)]">
                  <div className="relative h-full w-8 bg-white/20" />
                </div>
              </button>
            </Link>
          )}

          {user && (
            <button
              onClick={handleLogout}
              className="group relative inline-flex h-12 items-center justify-center overflow-hidden rounded-md bg-blue-600 px-6 font-medium text-neutral-200"
            >
              <span>Logout</span>
              <div className="absolute inset-0 flex h-full w-full justify-center [transform:skew(-12deg)_translateX(-100%)] group-hover:duration-1000 group-hover:[transform:skew(-12deg)_translateX(100%)]">
                <div className="relative h-full w-8 bg-white/20" />
              </div>
            </button>
          )}
        </div>

        {/* RIGHT — mobile hamburger */}
        <button
          onClick={() => setMenuOpen(!menuOpen)}
          className="md:hidden flex flex-col gap-1.5 p-2 rounded-lg border border-[#1e1e1e] hover:border-blue-500/30 transition-colors"
        >
          <span className={`block w-5 h-0.5 bg-white transition-all duration-300 ${menuOpen ? "rotate-45 translate-y-2" : ""}`} />
          <span className={`block w-5 h-0.5 bg-white transition-all duration-300 ${menuOpen ? "opacity-0" : ""}`} />
          <span className={`block w-5 h-0.5 bg-white transition-all duration-300 ${menuOpen ? "-rotate-45 -translate-y-2" : ""}`} />
        </button>
      </div>

      {/* ── MOBILE DROPDOWN ── */}
      <div className={`md:hidden overflow-hidden transition-all duration-300 ${menuOpen ? "max-h-60 border-t border-[#1a1a1a]" : "max-h-0"}`}>
        <div className="flex flex-col gap-4 px-6 py-5 bg-black/95">

          <div className="flex items-center gap-1.5">
            <div className="w-1.5 h-1.5 rounded-full bg-green-400 animate-pulse" />
            <span className="text-[11px] text-white/35">Online</span>
          </div>

          {user && (
            <span className="text-sm text-white/40 font-medium">
              👤 {user.name.charAt(0).toUpperCase() + user.name.slice(1)}
            </span>
          )}

          {!user && (
            <Link to="/signup" onClick={() => setMenuOpen(false)}>
              <button className="w-full group relative inline-flex h-11 items-center justify-center overflow-hidden rounded-md bg-blue-600 px-6 font-medium text-neutral-200">
                <span>Get Started</span>
                <div className="absolute inset-0 flex h-full w-full justify-center [transform:skew(-12deg)_translateX(-100%)] group-hover:duration-1000 group-hover:[transform:skew(-12deg)_translateX(100%)]">
                  <div className="relative h-full w-8 bg-white/20" />
                </div>
              </button>
            </Link>
          )}

          {user && (
            <button
              onClick={() => { setMenuOpen(false); handleLogout(); }}
              className="w-full group relative inline-flex h-11 items-center justify-center overflow-hidden rounded-md bg-blue-600 px-6 font-medium text-neutral-200"
            >
              <span>Logout</span>
              <div className="absolute inset-0 flex h-full w-full justify-center [transform:skew(-12deg)_translateX(-100%)] group-hover:duration-1000 group-hover:[transform:skew(-12deg)_translateX(100%)]">
                <div className="relative h-full w-8 bg-white/20" />
              </div>
            </button>
          )}
        </div>
      </div>

    </header>
  );
};

export default Navbar;