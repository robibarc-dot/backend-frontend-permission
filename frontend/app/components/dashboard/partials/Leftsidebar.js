"use client";

import Link from "next/link";
import { usePathname, useSearchParams } from "next/navigation";

const supportLinks = [
    "Audit activity logs",
    "Team access review",
    "Security checklist",
];

function NavIcon({ active }) {
    return (
        <span
            className={`flex h-10 w-10 items-center justify-center rounded-2xl border transition ${
                active
                    ? "border-white/20 bg-white/15 text-white"
                    : "border-amber-100/20 bg-white/8 text-amber-100"
            }`}
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
                <path d="M4 19h16" />
                <path d="M4 12h10" />
                <path d="M4 5h16" />
            </svg>
        </span>
    );
}

function getNavItems(role) {
    const basePath = `/${role}`;

    if (role === "teacher") {
        return [
            { label: "Overview", href: basePath, key: "overview", badge: "Home" },
            { label: "Classes", href: `${basePath}?tab=classes`, key: "classes", badge: "12" },
            { label: "Students", href: `${basePath}?tab=students`, key: "students", badge: "248" },
            { label: "Reports", href: `${basePath}?tab=reports`, key: "reports", badge: "New" },
        ];
    }

    return [
        { label: "Overview", href: basePath, key: "overview", badge: "Home" },
        { label: "Users", href: `${basePath}/user`, key: "users", badge: "248" },
        { label: "Roles", href: `${basePath}/role`, key: "roles", badge: "12" },
        {
            label: "Permissions",
            href: `${basePath}/permission`,
            key: "permissions",
            badge: "84",
        },
        { label: "Reports", href: `${basePath}?tab=reports`, key: "reports", badge: "New" },
    ];
}

export default function Leftsidebar({ role = "admin", isOpen, onClose }) {
    const pathname = usePathname();
    const searchParams = useSearchParams();
    const activeTab = searchParams.get("tab") || "overview";
    const navItems = getNavItems(role);
    const roleLabel = role
        .split("-")
        .map((part) => part.charAt(0).toUpperCase() + part.slice(1))
        .join(" ");

    return (
        <>
            <div
                className={`fixed inset-0 z-30 bg-slate-950/45 backdrop-blur-sm transition lg:hidden ${
                    isOpen
                        ? "pointer-events-auto opacity-100"
                        : "pointer-events-none opacity-0"
                }`}
                onClick={onClose}
            />

            <aside
                className={`fixed inset-y-0 left-0 z-40 flex w-80 max-w-[88vw] flex-col border-r border-white/10 bg-[linear-gradient(180deg,#1f2937_0%,#111827_56%,#0f172a_100%)] p-5 text-white shadow-[0_25px_80px_rgba(15,23,42,0.45)] transition-transform duration-300 lg:translate-x-0 ${
                    isOpen ? "translate-x-0" : "-translate-x-full"
                }`}
            >
                <div className="flex items-center justify-between">
                    <div>
                        <p className="text-xs uppercase tracking-[0.35em] text-amber-200/70">
                            Permission project
                        </p>
                        <h2 className="mt-2 text-2xl font-semibold tracking-tight">
                            {roleLabel} Suite
                        </h2>
                    </div>

                    <button
                        type="button"
                        onClick={onClose}
                        className="inline-flex h-10 w-10 items-center justify-center rounded-2xl border border-white/10 bg-white/8 text-amber-50 transition hover:bg-white/12 lg:hidden"
                        aria-label="Close navigation"
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
                            <path d="m6 6 12 12" />
                            <path d="M18 6 6 18" />
                        </svg>
                    </button>
                </div>

                <div className="mt-6 rounded-[26px] border border-white/10 bg-white/8 p-4">
                    <p className="text-sm text-slate-300">
                        Elegant access management with a faster path to users, roles, and audit-ready visibility.
                    </p>

                    <div className="mt-5 grid grid-cols-2 gap-3">
                        <div className="rounded-2xl bg-white/10 p-3">
                            <p className="text-[11px] uppercase tracking-[0.25em] text-slate-300">
                                Teams
                            </p>
                            <p className="mt-2 text-xl font-semibold">08</p>
                        </div>
                        <div className="rounded-2xl bg-white/10 p-3">
                            <p className="text-[11px] uppercase tracking-[0.25em] text-slate-300">
                                Policies
                            </p>
                            <p className="mt-2 text-xl font-semibold">31</p>
                        </div>
                    </div>
                </div>

                <nav className="mt-8 flex-1 space-y-2">
                    {navItems.map((item) => {
                        const isActive =
                            item.key === "overview"
                                ? pathname === `/${role}` && activeTab === "overview"
                                : item.key === "users"
                                  ? pathname === `/${role}/user`
                                : item.key === "roles"
                                  ? pathname === `/${role}/role`
                                : item.key === "permissions"
                                  ? pathname === `/${role}/permission`
                                : activeTab === item.key;

                        return (
                            <Link
                                key={item.label}
                                href={item.href}
                                onClick={onClose}
                                className={`group flex items-center gap-3 rounded-[22px] px-3 py-3 transition ${
                                    isActive
                                        ? "bg-[linear-gradient(135deg,rgba(245,158,11,0.28),rgba(255,255,255,0.10))] shadow-[inset_0_1px_0_rgba(255,255,255,0.08)]"
                                        : "hover:bg-white/8"
                                }`}
                            >
                                <NavIcon active={isActive} />

                                <div className="min-w-0 flex-1">
                                    <p className="font-medium text-white">
                                        {item.label}
                                    </p>
                                    <p className="text-sm text-slate-300">
                                        Manage {item.label.toLowerCase()}
                                    </p>
                                </div>

                                <span
                                    className={`rounded-full px-2.5 py-1 text-xs font-semibold ${
                                        isActive
                                            ? "bg-white text-slate-900"
                                            : "bg-white/10 text-amber-100"
                                    }`}
                                >
                                    {item.badge}
                                </span>
                            </Link>
                        );
                    })}
                </nav>

                <div className="rounded-[26px] border border-amber-200/10 bg-white/6 p-4">
                    <p className="text-xs uppercase tracking-[0.28em] text-amber-200/70">
                        Focus list
                    </p>
                    <div className="mt-4 space-y-3">
                        {supportLinks.map((item) => (
                            <div
                                key={item}
                                className="flex items-center gap-3 rounded-2xl bg-white/6 px-3 py-2.5 text-sm text-slate-200"
                            >
                                <span className="h-2.5 w-2.5 rounded-full bg-amber-300" />
                                {item}
                            </div>
                        ))}
                    </div>
                </div>
            </aside>
        </>
    );
}
