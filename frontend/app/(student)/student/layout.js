"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { useSelector } from "react-redux";
import { Check, ShieldCheck, X } from "lucide-react";
import { getPrimaryRole, getRoleHomePath, isStaffRole } from "../../../lib/auth";
import { useGetMeQuery } from "../../../redux/features/auth/authSlice";
import { StudentShellProvider } from "../../components/dashboard/student/StudentShellContext";
import StudentHeader from "../../components/dashboard/student/partials/Header";
import StudentSidebar from "../../components/dashboard/student/partials/Sidebar";

const pageTitles = {
    dashboard: "Dashboard",
    "mock-tests": "Mock Tests",
    practice: "Free Practice",
    speaking: "Speaking Lab",
    writing: "Writing Lab",
    resources: "Study Resources",
    vocabulary: "Vocabulary Builder",
    blog: "Expert Blog",
    analytics: "My Analytics",
    pricing: "Upgrade Plan",
    results: "My Results",
    settings: "Settings",
};

function ShellButton({ children, variant = "amber", className = "", ...props }) {
    const styles = {
        amber: "bg-amber-600 text-white hover:bg-amber-700",
        ghost: "border border-black/10 bg-transparent text-gray-600 hover:bg-gray-100 hover:text-gray-950",
    };

    return (
        <button
            type="button"
            className={`inline-flex items-center justify-center gap-2 rounded-[9px] px-4 py-2.5 text-[13px] font-bold transition ${styles[variant]} ${className}`}
            {...props}
        >
            {children}
        </button>
    );
}

function UpgradeModal({ open, onClose, isDark }) {
    if (!open) return null;

    return (
        <div
            className="fixed inset-0 z-[80] flex items-center justify-center bg-black/50 p-4 backdrop-blur-md"
            onMouseDown={(event) => event.target === event.currentTarget && onClose()}
        >
            <div className={`w-full max-w-[480px] rounded-[20px] border p-6 shadow-[0_20px_60px_rgba(0,0,0,0.18)] ${
                isDark ? "border-white/10 bg-[#101827] text-slate-100" : "border-amber-200 bg-white"
            }`}>
                <div className="mb-5 flex items-center justify-between">
                    <h2 className={`font-['Sora',sans-serif] text-lg font-bold ${isDark ? "text-white" : "text-gray-950"}`}>Upgrade to Pro</h2>
                    <button
                        type="button"
                        onClick={onClose}
                        className={`flex h-8 w-8 items-center justify-center rounded-lg border transition ${
                            isDark ? "border-white/10 bg-white/5 text-slate-300 hover:bg-white/10 hover:text-white" : "border-black/10 bg-gray-100 text-gray-500 hover:text-gray-950"
                        }`}
                    >
                        <X size={16} />
                    </button>
                </div>
                <p className={`mb-5 text-[13px] leading-6 ${isDark ? "text-slate-400" : "text-gray-400"}`}>
                    Choose your plan and start scoring higher with unlimited tests, AI feedback, and advanced analytics.
                </p>
                <div className="mb-5 grid gap-3 sm:grid-cols-2">
                    <div className={`rounded-[14px] border-2 border-amber-500 p-4 text-center ${isDark ? "bg-amber-500/10" : "bg-amber-50"}`}>
                        <h3 className="font-['Sora',sans-serif] text-sm font-bold">Monthly</h3>
                        <p className="mt-2 font-['Sora',sans-serif] text-2xl font-black text-amber-700">BDT 999</p>
                        <p className={`text-[11px] ${isDark ? "text-slate-400" : "text-gray-400"}`}>per month</p>
                    </div>
                    <div className={`rounded-[14px] border-2 p-4 text-center ${isDark ? "border-white/10 bg-white/5" : "border-black/10 bg-gray-100"}`}>
                        <h3 className="font-['Sora',sans-serif] text-sm font-bold">Yearly</h3>
                        <p className="mt-2 font-['Sora',sans-serif] text-2xl font-black text-amber-700">BDT 699</p>
                        <p className={`text-[11px] ${isDark ? "text-slate-400" : "text-gray-400"}`}>per month</p>
                    </div>
                </div>
                <div className="mb-5 space-y-2">
                    {[
                        "Unlimited mock tests",
                        "AI Writing feedback",
                        "AI Speaking Lab",
                        "Advanced Analytics",
                        "Full Vocabulary Bank",
                        "PDF score reports",
                    ].map((feature) => (
                        <p key={feature} className={`flex items-center gap-2 text-[13px] ${isDark ? "text-slate-300" : "text-gray-700"}`}>
                            <Check size={15} className="text-red-600" />
                            {feature}
                        </p>
                    ))}
                </div>
                <ShellButton className="w-full py-3" onClick={onClose}>
                    <ShieldCheck size={15} /> Unlock Everything Now
                </ShellButton>
                <p className={`mt-3 text-center text-[11.5px] ${isDark ? "text-slate-400" : "text-gray-400"}`}>
                    Secure payment. Cancel anytime. 7-day money-back guarantee.
                </p>
            </div>
        </div>
    );
}

export default function StudentLayout({ children }) {
    const router = useRouter();
    const { token, user, roles } = useSelector((state) => state.auth);
    const [activePage, setActivePage] = useState("dashboard");
    const [sidebarOpen, setSidebarOpen] = useState(false);
    const [upgradeOpen, setUpgradeOpen] = useState(false);
    const [isDark, setIsDark] = useState(false);

    const { isLoading, isFetching } = useGetMeQuery(undefined, {
        skip: !token || Boolean(user),
    });

    const primaryRole = getPrimaryRole(user, roles);
    const isResolvingUser = token && !user && (isLoading || isFetching);
    const pageTitle = pageTitles[activePage] || "Dashboard";

    useEffect(() => {
        if (!token || isResolvingUser || !primaryRole) {
            return;
        }

        if (isStaffRole(primaryRole)) {
            router.replace(getRoleHomePath(primaryRole));
        }
    }, [isResolvingUser, primaryRole, router, token]);

    useEffect(() => {
        const openUpgrade = () => setUpgradeOpen(true);

        window.addEventListener("student:open-upgrade", openUpgrade);
        return () => window.removeEventListener("student:open-upgrade", openUpgrade);
    }, []);

    useEffect(() => {
        const syncActivePageFromUrl = () => {
            const tab = new URLSearchParams(window.location.search).get("tab");
            setActivePage(tab || "dashboard");
        };

        syncActivePageFromUrl();
        window.addEventListener("popstate", syncActivePageFromUrl);

        return () => window.removeEventListener("popstate", syncActivePageFromUrl);
    }, []);

    const navigate = (page) => {
        setActivePage(page);
        router.push(page === "dashboard" ? "/student" : `/student?tab=${page}`);
        setSidebarOpen(false);
    };

    if (isResolvingUser) {
        return (
            <div className="flex min-h-screen items-center justify-center bg-[#f4f6fa] px-4">
                <div className="rounded-2xl border border-black/10 bg-white px-6 py-5 text-center shadow-sm">
                    <div className="mx-auto mb-3 h-8 w-8 animate-spin rounded-full border-2 border-red-100 border-t-red-600" />
                    <p className="font-['Sora',sans-serif] text-sm font-bold text-gray-950">
                        Loading student panel
                    </p>
                    <p className="mt-1 text-xs text-gray-400">
                        Preparing your IELTS workspace.
                    </p>
                </div>
            </div>
        );
    }

    return (
        <div className={`student-dashboard ${isDark ? "student-dark bg-[#080e1c] text-slate-100" : "bg-[#f4f6fa] text-gray-950"} flex h-screen overflow-hidden font-['DM_Sans',sans-serif]`}>
            <style jsx global>{`
                @import url('https://fonts.googleapis.com/css2?family=Sora:wght@400;500;600;700;800;900&family=DM+Sans:opsz,wght@9..40,400;9..40,500;9..40,600;9..40,700&display=swap');

                .student-dark .student-content [class*="bg-white"] {
                    background-color: #111827 !important;
                }

                .student-dark .student-content [class*="bg-gray-50"],
                .student-dark .student-content [class*="bg-gray-100"] {
                    background-color: #172033 !important;
                }

                .student-dark .student-content [class*="bg-red-50"] {
                    background-color: rgba(220, 38, 38, 0.12) !important;
                }

                .student-dark .student-content [class*="bg-amber-50"] {
                    background-color: rgba(217, 119, 6, 0.14) !important;
                }

                .student-dark .student-content [class*="bg-blue-50"] {
                    background-color: rgba(37, 99, 235, 0.14) !important;
                }

                .student-dark .student-content [class*="bg-emerald-50"] {
                    background-color: rgba(5, 150, 105, 0.14) !important;
                }

                .student-dark .student-content [class*="bg-violet-50"] {
                    background-color: rgba(124, 58, 237, 0.14) !important;
                }

                .student-dark .student-content [class*="text-gray-950"],
                .student-dark .student-content [class*="text-gray-900"],
                .student-dark .student-content [class*="text-gray-800"],
                .student-dark .student-content [class*="text-black"] {
                    color: #f8fafc !important;
                }

                .student-dark .student-content [class*="text-gray-700"],
                .student-dark .student-content [class*="text-gray-600"] {
                    color: #cbd5e1 !important;
                }

                .student-dark .student-content [class*="text-gray-500"],
                .student-dark .student-content [class*="text-gray-400"] {
                    color: #94a3b8 !important;
                }

                .student-dark .student-content [class*="border-black/10"],
                .student-dark .student-content [class*="border-gray-"],
                .student-dark .student-content [class*="border-slate-"] {
                    border-color: rgba(255, 255, 255, 0.1) !important;
                }

                .student-dark .student-content input,
                .student-dark .student-content textarea,
                .student-dark .student-content select {
                    background-color: #0f172a !important;
                    border-color: rgba(255, 255, 255, 0.12) !important;
                    color: #f8fafc !important;
                }

                .student-dark .student-content input::placeholder,
                .student-dark .student-content textarea::placeholder {
                    color: #64748b !important;
                }
            `}</style>

            <StudentShellProvider
                value={{
                    activePage,
                    isDark,
                    navigate,
                    openUpgrade: () => setUpgradeOpen(true),
                    toggleTheme: () => setIsDark((value) => !value),
                }}
            >
                <StudentSidebar
                    activePage={activePage}
                    isOpen={sidebarOpen}
                    isDark={isDark}
                    user={user}
                    onClose={() => setSidebarOpen(false)}
                    onNavigate={navigate}
                    onOpenUpgrade={() => setUpgradeOpen(true)}
                    onToggleTheme={() => setIsDark((value) => !value)}
                />

                <main className="flex min-w-0 flex-1 flex-col overflow-hidden">
                    <StudentHeader
                        title={pageTitle}
                        isDark={isDark}
                        user={user}
                        onMenuClick={() => setSidebarOpen(true)}
                        onOpenUpgrade={() => setUpgradeOpen(true)}
                    />
                    <section className="student-content min-h-0 flex-1 overflow-y-auto p-4 md:p-[26px]">
                        {children}
                    </section>
                </main>
            </StudentShellProvider>

            <UpgradeModal open={upgradeOpen} isDark={isDark} onClose={() => setUpgradeOpen(false)} />
        </div>
    );
}
