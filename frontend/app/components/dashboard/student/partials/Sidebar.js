"use client";

import {
    BarChart3,
    BookOpen,
    ClipboardList,
    FileText,
    GraduationCap,
    LayoutDashboard,
    Lock,
    Mic,
    Moon,
    PenLine,
    Settings,
    Sun,
    WalletCards,
    X,
} from "lucide-react";

const mainNav = [
    { id: "dashboard", label: "Dashboard", icon: LayoutDashboard },
    { id: "mock-tests", label: "Mock Tests", icon: ClipboardList, badge: "1 Free" },
    { id: "practice", label: "Practice", icon: PenLine },
    { id: "speaking", label: "Speaking Lab", icon: Mic, locked: true },
    { id: "writing", label: "Writing Lab", icon: FileText },
];

const learningNav = [
    { id: "resources", label: "Study Resources", icon: BookOpen },
    { id: "vocabulary", label: "Vocabulary", icon: GraduationCap, locked: true },
    { id: "blog", label: "Expert Blog", icon: FileText },
];

const progressNav = [
    { id: "analytics", label: "Analytics", icon: BarChart3, locked: true },
    { id: "pricing", label: "Upgrade Plan", icon: WalletCards, badge: "Pro" },
    { id: "results", label: "My Results", icon: ClipboardList },
];

function cx(...classes) {
    return classes.filter(Boolean).join(" ");
}

function initialsFromName(name = "Student") {
    return name
        .split(" ")
        .filter(Boolean)
        .slice(0, 2)
        .map((part) => part[0]?.toUpperCase())
        .join("") || "ST";
}

function NavGroup({ title, items, activePage, isDark, onNavigate }) {
    return (
        <div className="px-2.5 py-2">
            <p
                className={cx(
                    "px-2 pb-1.5 text-[10px] font-bold uppercase tracking-[0.14em]",
                    isDark ? "text-slate-500" : "text-gray-400"
                )}
            >
                {title}
            </p>
            <div className="space-y-0.5">
                {items.map((item) => {
                    const Icon = item.icon;
                    const isActive = activePage === item.id;
                    const navClass = isActive
                        ? isDark
                            ? "bg-red-500/15 font-semibold text-red-200 ring-1 ring-red-400/10"
                            : "bg-red-50 font-semibold text-red-600"
                        : isDark
                            ? "text-slate-300 hover:bg-white/[0.08] hover:text-white"
                            : "text-gray-600 hover:bg-gray-100 hover:text-gray-950";
                    const badgeClass =
                        item.badge === "Pro"
                            ? isDark
                                ? "bg-violet-500/15 text-violet-200 ring-1 ring-violet-400/20"
                                : "bg-violet-50 text-violet-700 ring-1 ring-violet-100"
                            : isDark
                                ? "bg-red-500/20 text-red-100 ring-1 ring-red-400/20"
                                : "bg-red-600 text-white";

                    return (
                        <button
                            key={item.id}
                            type="button"
                            onClick={() => onNavigate(item.id)}
                            className={cx(
                                "group relative flex w-full items-center gap-2.5 rounded-lg px-2.5 py-2 text-left text-[13px] transition",
                                navClass
                            )}
                        >
                            {isActive ? (
                                <span
                                    className={cx(
                                        "absolute left-0 top-1/2 h-4 w-0.5 -translate-y-1/2 rounded-r",
                                        isDark ? "bg-red-300" : "bg-red-600"
                                    )}
                                />
                            ) : null}
                            <Icon size={15} className="shrink-0" />
                            <span className="min-w-0 flex-1 truncate">{item.label}</span>
                            {item.badge ? (
                                <span className={cx("rounded-full px-1.5 py-0.5 text-[10px] font-bold", badgeClass)}>
                                    {item.badge}
                                </span>
                            ) : null}
                            {item.locked ? <Lock size={12} className={isDark ? "text-slate-600" : "text-gray-300"} /> : null}
                        </button>
                    );
                })}
            </div>
        </div>
    );
}

export default function StudentSidebar({
    activePage,
    isOpen,
    isDark,
    user,
    onClose,
    onNavigate,
    onOpenUpgrade,
    onToggleTheme,
}) {
    const displayName = user?.name || "Rahim Hossain";
    const initials = initialsFromName(displayName);
    const asideClass = cx(
        "fixed inset-y-0 left-0 z-50 flex w-[252px] shrink-0 flex-col border-r shadow-[1px_0_16px_rgba(0,0,0,0.08)] transition-transform duration-300 md:static md:translate-x-0",
        isOpen ? "translate-x-0" : "-translate-x-full",
        isDark
            ? "border-white/10 bg-[#0c1526] text-slate-100 shadow-black/40"
            : "border-black/10 bg-white text-gray-950"
    );

    return (
        <>
            <button
                type="button"
                aria-label="Close student menu"
                onClick={onClose}
                className={`fixed inset-0 z-40 bg-black/50 backdrop-blur-sm transition-opacity md:hidden ${isOpen ? "opacity-100" : "pointer-events-none opacity-0"}`}
            />
            <aside className={asideClass}>
                <div className={cx("flex items-center justify-between border-b px-[18px] py-[18px]", isDark ? "border-white/10" : "border-black/10")}>
                    <button type="button" onClick={() => onNavigate("dashboard")} className="flex items-center gap-2.5 text-left">
                        <span className="flex h-9 w-9 items-center justify-center rounded-[10px] bg-red-600 font-['Sora',sans-serif] text-[11px] font-black tracking-tight text-white">
                            MI
                        </span>
                        <span>
                            <strong className={cx("block font-['Sora',sans-serif] text-[14.5px] leading-tight", isDark ? "text-white" : "text-gray-950")}>
                                MocIELTS
                            </strong>
                            <span className={cx("text-[10.5px]", isDark ? "text-slate-500" : "text-gray-400")}>Student panel</span>
                        </span>
                    </button>
                    <button
                        type="button"
                        onClick={onClose}
                        className={cx(
                            "rounded-lg p-2 transition md:hidden",
                            isDark ? "text-slate-400 hover:bg-white/[0.08] hover:text-white" : "text-gray-400 hover:bg-gray-100"
                        )}
                    >
                        <X size={16} />
                    </button>
                </div>

                <button
                    type="button"
                    onClick={onOpenUpgrade}
                    className={cx(
                        "mx-3 mt-3 rounded-[10px] border px-3 py-2.5 text-left transition",
                        isDark ? "border-amber-400/20 bg-amber-500/10 hover:bg-amber-500/15" : "border-amber-200 bg-amber-50 hover:bg-amber-100"
                    )}
                >
                    <div className="mb-1.5 flex items-center justify-between">
                        <span className={cx("text-[11px] font-black uppercase tracking-[0.08em]", isDark ? "text-amber-200" : "text-amber-700")}>Free Plan</span>
                        <span className="rounded-full bg-amber-600 px-2 py-0.5 text-[10px] font-bold text-white">Upgrade</span>
                    </div>
                    <div className={cx("mb-1.5 h-1 overflow-hidden rounded-full", isDark ? "bg-amber-200/20" : "bg-amber-200/70")}>
                        <div className="h-full w-0 rounded-full bg-amber-600" />
                    </div>
                    <p className={cx("text-[10.5px]", isDark ? "text-amber-200/80" : "text-amber-700")}>0 of 3 free tests used this month</p>
                </button>

                <div className="min-h-0 flex-1 overflow-y-auto py-2 [scrollbar-width:none]">
                    <NavGroup title="Main" items={mainNav} activePage={activePage} isDark={isDark} onNavigate={onNavigate} />
                    <NavGroup title="Learning" items={learningNav} activePage={activePage} isDark={isDark} onNavigate={onNavigate} />
                    <NavGroup title="My Progress" items={progressNav} activePage={activePage} isDark={isDark} onNavigate={onNavigate} />
                    <NavGroup title="Account" items={[{ id: "settings", label: "Settings", icon: Settings }]} activePage={activePage} isDark={isDark} onNavigate={onNavigate} />

                    <div className={cx("mt-2 border-t p-2.5", isDark ? "border-white/10" : "border-black/10")}>
                        <button
                            type="button"
                            onClick={onToggleTheme}
                            className={cx(
                                "mb-1 flex w-full items-center justify-between rounded-[10px] px-2.5 py-2 text-left text-[12.5px] font-semibold transition",
                                isDark ? "text-slate-300 hover:bg-white/[0.08] hover:text-white" : "text-gray-600 hover:bg-gray-100"
                            )}
                        >
                            <span className="flex items-center gap-2">
                                <span className={cx("flex h-8 w-8 items-center justify-center rounded-lg border", isDark ? "border-white/10 bg-white/[0.06]" : "border-black/10 bg-gray-50")}>
                                    {isDark ? <Sun size={14} /> : <Moon size={14} />}
                                </span>
                                {isDark ? "Light Mode" : "Dark Mode"}
                            </span>
                            <span className={`relative h-[21px] w-[38px] rounded-full transition ${isDark ? "bg-red-600" : "bg-gray-200"}`}>
                                <span className={`absolute top-[3px] h-[15px] w-[15px] rounded-full bg-white shadow transition ${isDark ? "left-5" : "left-[3px]"}`} />
                            </span>
                        </button>

                        <div className={cx("flex items-center gap-2.5 rounded-[10px] px-2.5 py-2 transition", isDark ? "hover:bg-white/[0.08]" : "hover:bg-gray-100")}>
                            <span className="flex h-8 w-8 shrink-0 items-center justify-center rounded-full bg-gradient-to-br from-red-600 to-red-400 font-['Sora',sans-serif] text-xs font-bold text-white">
                                {initials}
                            </span>
                            <span className="min-w-0 flex-1">
                                <strong className={cx("block truncate text-[12.5px] font-bold", isDark ? "text-white" : "text-gray-950")}>{displayName}</strong>
                                <span className={cx("block truncate text-[10.5px]", isDark ? "text-slate-500" : "text-gray-400")}>Target: Band 7.5</span>
                            </span>
                            <span className={cx("rounded-full border px-2 py-1 text-[9.5px] font-black", isDark ? "border-white/10 bg-white/[0.06] text-slate-400" : "border-black/10 bg-gray-50 text-gray-400")}>Free</span>
                        </div>
                    </div>
                </div>
            </aside>
        </>
    );
}
