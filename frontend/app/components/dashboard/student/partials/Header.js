"use client";

import { Bell, Menu, Search, Sparkles } from "lucide-react";

function initialsFromName(name = "Student") {
    return name
        .split(" ")
        .filter(Boolean)
        .slice(0, 2)
        .map((part) => part[0]?.toUpperCase())
        .join("") || "ST";
}

export default function StudentHeader({ title, isDark, user, onMenuClick, onOpenUpgrade }) {
    const initials = initialsFromName(user?.name || "Rahim Hossain");

    return (
        <header className={`flex h-[58px] shrink-0 items-center gap-3.5 border-b px-3.5 shadow-[0_1px_8px_rgba(0,0,0,0.05)] md:px-6 ${
            isDark ? "border-white/10 bg-[#0c1526] text-slate-100 shadow-black/30" : "border-black/10 bg-white"
        }`}>
            <button
                type="button"
                aria-label="Open student menu"
                onClick={onMenuClick}
                className={`flex h-9 w-9 shrink-0 items-center justify-center rounded-[9px] border transition md:hidden ${
                    isDark ? "border-white/10 bg-white/5 text-slate-300 hover:bg-white/10 hover:text-white" : "border-black/10 bg-white text-gray-600 hover:bg-gray-100"
                }`}
            >
                <Menu size={18} />
            </button>

            <h1 className={`min-w-0 flex-1 truncate font-['Sora',sans-serif] text-[15px] font-bold ${isDark ? "text-white" : "text-gray-950"}`}>{title}</h1>

            <label className={`hidden w-[200px] items-center gap-2 rounded-lg border px-3 py-1.5 sm:flex ${
                isDark ? "border-white/10 bg-white/5 text-slate-400" : "border-black/10 bg-gray-100 text-gray-400"
            }`}>
                <Search size={14} />
                <input
                    type="search"
                    placeholder="Search resources, tests..."
                    className={`min-w-0 flex-1 bg-transparent text-[12.5px] outline-none placeholder:text-gray-400 ${
                        isDark ? "text-slate-100" : "text-gray-900"
                    }`}
                />
            </label>

            <button
                type="button"
                aria-label="Notifications"
                className={`relative flex h-[34px] w-[34px] shrink-0 items-center justify-center rounded-lg border transition ${
                    isDark ? "border-white/10 bg-white/5 text-slate-300 hover:bg-white/10 hover:text-white" : "border-black/10 bg-gray-100 text-gray-600 hover:bg-gray-200 hover:text-gray-950"
                }`}
            >
                <Bell size={15} />
                <span className="absolute right-1.5 top-1.5 h-1.5 w-1.5 rounded-full border border-white bg-red-600" />
            </button>

            <button
                type="button"
                onClick={onOpenUpgrade}
                className="inline-flex shrink-0 items-center gap-1.5 rounded-lg border border-amber-300 bg-amber-50 px-2.5 py-2 text-xs font-bold text-amber-700 transition hover:bg-amber-100 sm:px-3.5"
            >
                <Sparkles size={14} />
                <span className="hidden sm:inline">Upgrade to Pro</span>
            </button>

            <button type="button" className={`hidden items-center rounded-[9px] p-1.5 transition sm:flex ${isDark ? "hover:bg-white/10" : "hover:bg-gray-100"}`}>
                <span className="flex h-7 w-7 items-center justify-center rounded-full bg-gradient-to-br from-red-600 to-red-400 font-['Sora',sans-serif] text-[11px] font-bold text-white">
                    {initials}
                </span>
            </button>
        </header>
    );
}
