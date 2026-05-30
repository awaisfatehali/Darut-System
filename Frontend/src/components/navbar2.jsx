<header className="flex items-center justify-between px-6 py-3.5 border-b border-[#1a1a1a] bg-black/90 backdrop-blur-sm flex-shrink-0">
        <div className="flex items-center gap-3">
          <span className="font-extrabold text-lg tracking-widest text-white">
            DARUT
          </span>
          <span className="text-[10px] bg-blue-500/15 text-blue-400 border border-blue-500/20 px-2 py-0.5 rounded-full font-medium tracking-wide">
            Roman Urdu · Analysis
          </span>
        </div>
        <div className="flex items-center gap-3">
          {messages.length > 0 && (
            <button
              onClick={clearChat}
              className="text-xs text-white/40 hover:text-white border border-[#1e1e1e] hover:border-blue-500/30
                rounded-lg py-1.5 px-3 transition-all flex items-center gap-1.5"
            >
              <svg
                width="11"
                height="11"
                fill="none"
                stroke="currentColor"
                strokeWidth="2"
                viewBox="0 0 24 24"
              >
                <line x1="12" y1="5" x2="12" y2="19" />
                <line x1="5" y1="12" x2="19" y2="12" />
              </svg>
              New
            </button>
          )}
          <div className="flex items-center gap-1.5">
            <div className="w-1.5 h-1.5 rounded-full bg-green-400 animate-pulse" />
            <span className="text-[11px] text-white/35">Online</span>
          </div>
          <button
            onClick={HandleLogout}
            class="group relative inline-flex h-9 items-center justify-center overflow-hidden rounded-md bg-blue-600 px-4 font-medium text-neutral-200"
          >
            <span>Logout</span>
            <div class="absolute inset-0 flex h-full w-full justify-center [transform:skew(-12deg)_translateX(-100%)] group-hover:duration-1000 group-hover:[transform:skew(-12deg)_translateX(100%)]">
              <div class="relative h-full w-8 bg-white/20"></div>
            </div>
          </button>
        </div>
      </header>