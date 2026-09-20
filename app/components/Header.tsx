"use client"
import React from "react";
import { NavTab } from "./EduTranslateApp";

interface HeaderProps {
  activeTab: NavTab;
  onTabChange: (tab: NavTab) => void;
  user?: { name: string; email: string };
  onSignOut?: () => void;
}

export const Header: React.FC<HeaderProps> = ({ activeTab, onTabChange, user, onSignOut }) => {
  const navItems: { id: NavTab; label: string }[] = [
    { id: "input-hub", label: "Input Hub" },
    { id: "dual-language-reader", label: "Dual-Language Reader" },
    { id: "subject-library", label: "Subject Library" },
    { id: "audio-archives", label: "Audio Archives" },
  ];

  return (
    <header className="fixed top-0 left-0 w-full z-50 bg-gradient-to-r from-[#c25e0a] via-[#e8720c] to-[#d46200] text-white shadow-[0_4px_16px_rgba(194,94,10,0.2)]">
      <div className="h-16 max-w-[1280px] mx-auto px-6 md:px-12 flex items-center justify-between gap-6">
        {/* Brand & Nav */}
        <div className="flex items-center gap-6">
          <button
            onClick={() => onTabChange("input-hub")}
            className="flex items-center gap-2.5 text-left group transition-transform focus:outline-none"
          >
            <div className="w-9 h-9 rounded-xl bg-white/15 flex items-center justify-center border border-white/20 shadow-sm group-hover:scale-105 transition-transform">
              <span className="material-symbols-outlined text-[#fde68a] text-[24px]">
                menu_book
              </span>
            </div>
            <div>
              <div className="font-bold text-[18px] tracking-tight text-white font-['Work_Sans',sans-serif] flex items-center gap-1.5">
                EduTranslate <span className="text-[#fde68a] font-serif font-bold">Efik</span>
              </div>
              <div className="text-[10px] text-white/80 font-medium tracking-wider uppercase">Akwa Ibom Heritage</div>
            </div>
          </button>

          {/* Nav Tabs */}
          <nav className="hidden lg:flex items-center gap-1.5 ml-4">
            {navItems.map((item) => {
              const isActive = activeTab === item.id;
              return (
                <button
                  key={item.id}
                  onClick={() => onTabChange(item.id)}
                  aria-current={isActive ? "page" : undefined}
                  className={`px-4 py-2 rounded-lg text-[13px] font-semibold transition-all duration-200 cursor-pointer ${isActive
                    ? "bg-[#fef3c7] text-[#166534] shadow-sm ring-1 ring-[#d4af37]/50"
                    : "text-white/90 hover:bg-white/15 hover:text-white"
                    }`}
                >
                  {item.label}
                </button>
              );
            })}
          </nav>
        </div>

        {/* Right Utility: Offline Badge, Notification & Profile */}
        <div className="flex items-center gap-4">
          <div className="hidden sm:flex items-center gap-2 px-3 py-1 rounded-full bg-black/15 text-[#fef3c7] border border-white/10">
            <span className="w-2 h-2 rounded-full bg-[#22c55e] animate-pulse"></span>
            <span className="text-[12px] font-medium tracking-wide">Offline Ready</span>
          </div>

          <NotificationBell />

          <div className="flex items-center gap-2.5 pl-2 border-l border-white/20">
            <div className="w-8 h-8 rounded-full bg-[#166534] flex items-center justify-center text-white ring-2 ring-[#fde68a]/60 shadow-inner">
              <span className="material-symbols-outlined text-[18px]">person</span>
            </div>
            <div className="hidden md:flex flex-col text-left">
              <span className="text-[12px] font-semibold text-white leading-tight">
                {user?.name ?? "Educator"}
              </span>
              <span className="text-[10px] text-[#fde68a] font-medium leading-tight">Heritage Educator</span>
            </div>
            {onSignOut && (
              <button
                onClick={onSignOut}
                title="Sign out"
                className="ml-1 p-1 rounded-full text-white/80 hover:text-white hover:bg-white/15 transition-colors"
              >
                <span className="material-symbols-outlined text-[18px]">logout</span>
              </button>
            )}
          </div>
        </div>
      </div>

      {/* Akwa Ibom Tricolor Bottom Accent Strip */}
      <div className="h-1 bg-gradient-to-r from-[#166534] via-[#22c55e] to-[#d4af37] w-full" />

      {/* Mobile Nav Tabs Bar */}
      <div className="lg:hidden flex items-center justify-around bg-[#a84d06] px-2 py-1.5 border-t border-white/10 overflow-x-auto">
        {navItems.map((item) => {
          const isActive = activeTab === item.id;
          return (
            <button
              key={item.id}
              onClick={() => onTabChange(item.id)}
              className={`px-3 py-1 rounded-md text-[12px] font-medium whitespace-nowrap transition-colors ${isActive
                ? "bg-[#fef3c7] text-[#166534] font-bold"
                : "text-white/90 hover:text-white"
                }`}
            >
              {item.label}
            </button>
          );
        })}
      </div>
    </header>
  );
};

/* ── Notification Bell (self-contained) ───────────────────── */
const NOTIFICATIONS = [
  {
    id: 1,
    icon: "check_circle",
    iconColor: "text-green-400",
    title: "Translation Complete",
    body: "Civic Education Unit 3 translated to Efik successfully.",
    time: "2 min ago",
  },
  {
    id: 3,
    icon: "info",
    iconColor: "text-blue-300",
    title: "New Subject Available",
    body: "Basic Science curriculum has been added to Subject Library.",
    time: "1 hr ago",
  },
];

const NotificationBell: React.FC = () => {
  const [open, setOpen] = React.useState(false);
  const [hasUnread, setHasUnread] = React.useState(true);
  const ref = React.useRef<HTMLDivElement>(null);

  // Close panel on outside click
  React.useEffect(() => {
    const handler = (e: MouseEvent) => {
      if (ref.current && !ref.current.contains(e.target as Node)) {
        setOpen(false);
      }
    };
    document.addEventListener("mousedown", handler);
    return () => document.removeEventListener("mousedown", handler);
  }, []);

  const handleOpen = () => {
    setOpen((prev) => !prev);
    setHasUnread(false); // mark as read on open
  };

  return (
    <div ref={ref} className="relative">
      <button
        aria-label="Notifications"
        onClick={handleOpen}
        className="flex items-center justify-center p-1.5 rounded-full text-white/80 hover:text-white hover:bg-white/15 transition-colors relative"
      >
        <span className="material-symbols-outlined text-[22px]">notifications</span>
        {hasUnread && (
          <span className="absolute top-1 right-1 w-2.5 h-2.5 rounded-full bg-[#22c55e] border-2 border-[#c25e0a]" />
        )}
      </button>

      {open && (
        <div className="absolute right-0 top-10 w-[320px] bg-white rounded-xl shadow-2xl border border-[#e7e0d3] overflow-hidden z-50">
          {/* Header */}
          <div className="flex items-center justify-between px-4 py-3 border-b border-[#e7e0d3]/60 bg-[#fdfbf7]">
            <span className="text-[14px] font-semibold text-[#1c1917]">Notifications</span>
            <span className="text-[11px] text-[#e8720c] font-medium cursor-pointer hover:underline">
              Mark all read
            </span>
          </div>

          {/* List */}
          <ul className="divide-y divide-gray-50 max-h-[300px] overflow-y-auto">
            {NOTIFICATIONS.map((n) => (
              <li
                key={n.id}
                className="flex items-start gap-3 px-4 py-3 hover:bg-[#fdfbf7] transition-colors cursor-pointer"
              >
                <span className={`material-symbols-outlined text-[20px] mt-0.5 ${n.iconColor}`}>
                  {n.icon}
                </span>
                <div className="flex-1 min-w-0">
                  <p className="text-[13px] font-semibold text-[#1c1917] leading-tight">{n.title}</p>
                  <p className="text-[12px] text-[#44403c] mt-0.5 leading-snug">{n.body}</p>
                  <p className="text-[11px] text-gray-400 mt-1">{n.time}</p>
                </div>
              </li>
            ))}
          </ul>

          {/* Footer */}
          <div className="px-4 py-2.5 border-t border-[#e7e0d3]/60 bg-[#fdfbf7] text-center">
            <span className="text-[12px] text-[#e8720c] font-semibold cursor-pointer hover:underline">
              View all notifications
            </span>
          </div>
        </div>
      )}
    </div>
  );
};
