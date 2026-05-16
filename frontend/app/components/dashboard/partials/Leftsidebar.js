"use client";

import Link from "next/link";
import { usePathname, useRouter, useParams } from "next/navigation";
import { useDispatch } from "react-redux";
import { logoutUser } from "@/redux/features/auth/authSlice";
import { 
    LayoutDashboard, 
    Users, 
    ShieldCheck, 
    Settings, 
    FileText, 
    BookOpen, 
    Users2, 
    GraduationCap, 
    LogOut, 
    X 
} from "lucide-react";

function getNavItems(role) {
    const basePath = `/${role}`;

    if (role === "teacher") {
        return [
            { label: "Overview", href: basePath, icon: LayoutDashboard, match: 'exact' },
            { label: "Classes", href: `${basePath}/classes`, icon: BookOpen, match: 'prefix', badge: "12" },
            { label: "Students", href: `${basePath}/students`, icon: Users2, match: 'prefix', badge: "248" },
            { label: "Reports", href: `${basePath}/reports`, icon: FileText, match: 'prefix', badge: "New" },
        ];
    }

    return [
        { label: "Overview", href: basePath, icon: LayoutDashboard, match: 'exact' },
        { label: "Users", href: `${basePath}/user`, icon: Users, match: 'prefix', badge: "248" },
        { label: "Roles", href: `${basePath}/role`, icon: ShieldCheck, match: 'prefix', badge: "12" },
        { label: "Permissions", href: `${basePath}/permission`, icon: Settings, match: 'prefix', badge: "84" },
        { label: "Practice Tests", href: `${basePath}/practice-tests`, icon: FileText, match: 'prefix', badge: "New" },
        { label: "Mock Tests", href: `${basePath}/mock-tests`, icon: FileText, match: 'prefix', badge: "New" },
    ];
}

export default function Leftsidebar({ params, isOpen, onClose }) {
    const pathname = usePathname();
    const router = useRouter();
    const dispatch = useDispatch();
    const { role } = useParams();    
    const navItems = getNavItems(role);
    
    const roleLabel = role
        .split("-")
        .map((part) => part.charAt(0).toUpperCase() + part.slice(1))
        .join(" ");

    const handleLogout = async () => {
        await dispatch(logoutUser());
        router.push("/login");
    };

    return (
        <>
            {/* Mobile Overlay */}
            <div
                className={`fixed inset-0 z-30 bg-slate-950/35 backdrop-blur-sm transition duration-300 lg:hidden ${
                    isOpen
                        ? "visible opacity-100"
                        : "invisible opacity-0"
                }`}
                onClick={onClose}
            />

            <aside
                className={`fixed inset-y-0 left-0 z-40 flex w-[300px] max-w-[calc(100vw-2rem)] flex-col border-r border-slate-200 bg-white px-6 py-6 shadow-2xl transition-transform duration-300 lg:sticky lg:top-0 lg:z-10 lg:h-screen lg:translate-x-0 lg:shadow-none ${
                    isOpen ? "translate-x-0" : "-translate-x-full"
                }`}
            >
                {/* Branding Section */}
                <div className="mb-10 flex items-center justify-between gap-3">
                    <div className="flex items-center gap-3">
                        <div className="flex h-12 w-12 items-center justify-center rounded-2xl bg-blue-600 text-white shadow-lg shadow-blue-200">
                            <Link href={`/${role}`}>
                                <GraduationCap size={22} />
                            </Link>
                        </div>
                        <div>
                            <h1 className="text-sm font-bold leading-tight text-slate-900">
                                Kids English
                            </h1>
                            <p className="text-[11px] text-slate-400">{roleLabel} Portal</p>
                        </div>
                    </div>
                    <button
                        type="button"
                        onClick={onClose}
                        className="inline-flex h-10 w-10 items-center justify-center rounded-2xl border border-slate-200 text-slate-500 transition hover:text-slate-800 lg:hidden"
                        aria-label="Close navigation"
                    >
                        <X size={18} />
                    </button>
                </div>

                {/* Navigation Section */}
                <nav className="flex-1 space-y-1.5">
                    {navItems.map(({ label, href, icon: Icon, badge, match }) => {
                        const isActive = href
                            ? match === 'prefix'
                                ? pathname === href || pathname.startsWith(`${href}/`)
                                : pathname === href
                            : false;

                        return (
                            <Link
                                key={label}
                                href={href}
                                onClick={onClose}
                                className={`group flex items-center gap-3 rounded-2xl px-4 py-3 text-sm font-medium transition ${
                                    isActive
                                        ? "bg-blue-50 text-blue-600 shadow-sm"
                                        : "text-slate-500 hover:bg-slate-50 hover:text-slate-800"
                                }`}
                            >
                                <Icon size={18} />
                                <span>{label}</span>
                                {badge && (
                                    <span
                                        className={`ml-auto rounded-full px-2 py-0.5 text-[10px] font-semibold uppercase tracking-wider ${
                                            isActive
                                                ? "bg-blue-100 text-blue-700"
                                                : "bg-slate-100 text-slate-500"
                                        }`}
                                    >
                                        {badge}
                                    </span>
                                )}
                            </Link>
                        );
                    })}
                </nav>

                {/* Footer Section */}
                <div className="mt-8 border-t border-slate-100 pt-6">
                    <button
                        type="button"
                        onClick={handleLogout}
                        className="flex w-full items-center gap-3 rounded-2xl px-4 py-3 text-sm font-medium text-rose-500 transition hover:bg-rose-50"
                    >
                        <LogOut size={18} />
                        <span>Logout</span>
                    </button>
                </div>
            </aside>
        </>
    );
}
