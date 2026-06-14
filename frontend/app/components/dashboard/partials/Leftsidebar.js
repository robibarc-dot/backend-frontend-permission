"use client";

import { useState, useEffect } from "react";
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
    X,
    ChevronDown
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
        { 
            label: "User Management", 
            icon: Users,
            children: [
                { label: "Users", href: `${basePath}/user`, icon: Users, match: 'prefix', badge: "248" },
                { label: "Roles", href: `${basePath}/role`, icon: ShieldCheck, match: 'prefix', badge: "12" },
                { label: "Permissions", href: `${basePath}/permission`, icon: Settings, match: 'prefix', badge: "84" },
            ]
        },
        {
            label: "Mock Management",
            icon: GraduationCap,
            children: [
                { label: "Mock Tests", href: `${basePath}/mock-tests`, icon: FileText, match: 'prefix', badge: "New" },
            ]
        },
        {
            label: "Practice Management",
            icon: BookOpen,
            children: [
                { label: "Practice Tests", href: `${basePath}/practice-tests`, icon: FileText, match: 'prefix', badge: "New" },
            ]
        },
        {
            label: "Common Features",
            icon: Settings,
            children: [
                { label: "Modules", href: `${basePath}/modules`, icon: FileText, match: 'prefix', badge: "New" },
                // { label: "Question Types", href: `${basePath}/question-types`, icon: FileText, match: 'prefix', badge: "New" },
            ]
        },
    ];
}

export default function Leftsidebar({ params, isOpen, onClose }) {
    const pathname = usePathname();
    const router = useRouter();
    const dispatch = useDispatch();
    const { role } = useParams();    
    const navItems = getNavItems(role);

    const [openMenus, setOpenMenus] = useState({});

    const toggleMenu = (label) => {
        setOpenMenus((prev) => ({
            ...prev,
            [label]: !prev[label],
        }));
    };

    useEffect(() => {
        const initialOpen = {};
        navItems.forEach(item => {
            if (item.children) {
                const hasActiveChild = item.children.some(child => 
                    child.href && (child.match === 'prefix' 
                        ? pathname === child.href || pathname.startsWith(`${child.href}/`)
                        : pathname === child.href)
                );
                if (hasActiveChild) {
                    initialOpen[item.label] = true;
                }
            }
        });
        setOpenMenus(prev => ({ ...prev, ...initialOpen }));
    }, [pathname, role]);
    
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
                className={`fixed inset-y-0 left-0 z-40 flex w-[300px] max-w-[calc(100vw-2rem)] flex-col overflow-hidden border-r border-slate-200 bg-white shadow-2xl transition-transform duration-300 lg:sticky lg:top-0 lg:z-10 lg:h-screen lg:translate-x-0 lg:shadow-none ${
                    isOpen ? "translate-x-0" : "-translate-x-full"
                }`}
            >
                <div className="min-h-0 flex-1 overflow-y-auto px-6 py-6 [scrollbar-width:thin] [scrollbar-color:#cbd5e1_transparent]">
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
                    <nav className="space-y-1.5">
                        {navItems.map((item) => {
                            const { label, href, icon: Icon, badge, match, children } = item;

                            if (children) {
                                const isMenuOpen = !!openMenus[label];
                                const hasActiveChild = children.some(child => 
                                    child.href && (child.match === 'prefix' 
                                        ? pathname === child.href || pathname.startsWith(`${child.href}/`)
                                        : pathname === child.href)
                                );

                                return (
                                    <div key={label} className="space-y-1">
                                        <button
                                            type="button"
                                            onClick={() => toggleMenu(label)}
                                            className={`group flex w-full items-center gap-3 rounded-2xl px-4 py-3 text-sm font-medium transition ${
                                                hasActiveChild
                                                    ? "bg-blue-50/50 text-blue-600"
                                                    : "text-slate-500 hover:bg-slate-50 hover:text-slate-800"
                                            }`}
                                        >
                                            <Icon size={18} />
                                            <span className="flex-1 text-left">{label}</span>
                                            <ChevronDown size={16} className={`transition-transform duration-200 ${isMenuOpen ? "rotate-180" : ""}`} />
                                        </button>
                                        
                                        {isMenuOpen && (
                                            <div className="ml-6 space-y-1 border-l border-slate-100 pl-4">
                                                {children.map((child) => {
                                                    const isChildActive = child.href 
                                                        ? child.match === 'prefix'
                                                            ? pathname === child.href || pathname.startsWith(`${child.href}/`)
                                                            : pathname === child.href
                                                        : false;
                                                    
                                                    const ChildIcon = child.icon;

                                                    return (
                                                        <Link
                                                            key={child.label}
                                                            href={child.href}
                                                            onClick={onClose}
                                                            className={`group flex items-center gap-3 rounded-xl px-4 py-2 text-xs font-medium transition ${
                                                                isChildActive
                                                                    ? "text-blue-600 font-semibold"
                                                                    : "text-slate-500 hover:text-slate-800"
                                                            }`}
                                                        >
                                                            {ChildIcon && <ChildIcon size={14} />}
                                                            <span>{child.label}</span>
                                                            {child.badge && (
                                                                <span className={`ml-auto rounded-full px-2 py-0.5 text-[9px] font-semibold uppercase tracking-wider ${
                                                                    isChildActive ? "bg-blue-100 text-blue-700" : "bg-slate-100 text-slate-500"
                                                                }`}>
                                                                    {child.badge}
                                                                </span>
                                                            )}
                                                        </Link>
                                                    );
                                                })}
                                            </div>
                                        )}
                                    </div>
                                );
                            }

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
                </div>
            </aside>
        </>
    );
}
