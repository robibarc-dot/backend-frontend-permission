"use client";

import { useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { useRouter } from "next/navigation";
import { logoutUser } from "@/redux/features/auth/authSlice";
import { LogOut, ChevronDown } from "lucide-react";

const quickStats = [
    { label: "Revenue pulse", value: "$24.8k", tone: "text-emerald-600" },
    { label: "Open approvals", value: "18", tone: "text-amber-700" },
    { label: "Live sessions", value: "342", tone: "text-sky-700" },
];

export default function Header({
    role = "admin",
    title,
    subtitle,
    onMenuClick,
}) {
    const dispatch = useDispatch();
    const router = useRouter();
    const { user } = useSelector((state) => state.auth);
    const [showProfile, setShowProfile] = useState(false);

    const handleLogout = async () => {
        await dispatch(logoutUser());
        router.push("/login");
    };

    const roleLabel = role
        .split("-")
        .map((part) => part.charAt(0).toUpperCase() + part.slice(1))
        .join(" ");

    return (
        <header className="sticky md:hidden top-0 z-30 px-4 pt-4 sm:px-6 lg:px-10">
            <div className="mx-auto w-full max-w-7xl rounded-[30px] border border-white/60 bg-white/72 px-4 py-4 shadow-[0_20px_60px_rgba(116,82,43,0.14)] backdrop-blur sm:px-6">
                <div className="flex flex-col gap-5">
                    <div className="flex items-center justify-between gap-4">
                        <div className="flex min-w-0 items-center gap-3">
                            <button
                                type="button"
                                onClick={onMenuClick}
                                className="inline-flex h-11 w-11 items-center justify-center rounded-2xl border border-amber-200 bg-amber-50 text-amber-700 shadow-sm transition hover:-translate-y-0.5 lg:hidden"
                                aria-label="Open navigation"
                            >
                                <svg
                                    viewBox="0 0 24 24"
                                    className="h-5 w-5"
                                    fill="none"
                                    stroke="currentColor"
                                    strokeWidth="1.8"
                                    strokeLinecap="round"
                                    strokeLinejoin="round"
                                >
                                    <path d="M4 7h16" />
                                    <path d="M4 12h16" />
                                    <path d="M4 17h16" />
                                </svg>
                            </button>
                        </div>

                        <div className="relative">
                            <button
                                type="button"
                                onClick={() => setShowProfile(!showProfile)}
                                className="flex items-center gap-2 rounded-2xl border border-amber-200 bg-amber-50 p-1.5 pr-3 shadow-sm transition hover:bg-amber-100 active:scale-95"
                            >
                                <div className="flex h-8 w-8 items-center justify-center rounded-xl bg-amber-600 text-xs font-bold text-white uppercase">
                                    {user?.name?.charAt(0) || "U"}
                                </div>
                                <ChevronDown size={14} className={`text-amber-700 transition-transform duration-200 ${showProfile ? 'rotate-180' : ''}`} />
                            </button>

                            {showProfile && (
                                <div className="absolute right-0 mt-3 w-56 origin-top-right rounded-[24px] border border-slate-100 bg-white p-2 shadow-2xl ring-1 ring-black/5 focus:outline-none animate-in fade-in zoom-in-95 duration-200">
                                    <div className="px-4 py-3 border-b border-slate-50 mb-1">
                                        <p className="text-[10px] font-black text-slate-400 uppercase tracking-[0.15em]">Signed in as</p>
                                        <p className="mt-0.5 text-sm font-bold text-slate-900 truncate">
                                            {user?.name || "User"}
                                        </p>
                                        <p className="text-[11px] text-slate-500 capitalize font-medium">{roleLabel}</p>
                                    </div>
                                    
                                    <button
                                        type="button"
                                        onClick={handleLogout}
                                        className="flex w-full items-center gap-3 rounded-2xl px-4 py-2.5 text-sm font-bold text-rose-500 transition-colors hover:bg-rose-50"
                                    >
                                        <LogOut size={18} />
                                        <span>Logout</span>
                                    </button>
                                </div>
                            )}
                        </div>
                    </div>
                </div>
            </div>
        </header>
    );
}
