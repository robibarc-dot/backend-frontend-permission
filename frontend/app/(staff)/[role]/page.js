"use client";

import { useEffect } from "react";
import { useRouter } from "next/navigation";
import { useSelector } from "react-redux";
import Layout from "../../components/dashboard/Layout";
import {
    getPrimaryRole,
    getRoleHomePath,
    isStaffRole,
} from "../../../lib/auth";

const roleContent = {
    "super-admin": {
        title: "Super admin control center",
        subtitle:
            "Operate the entire platform with unrestricted dashboard access, governance authority, and system-wide visibility.",
        heroTitle: "Full-spectrum oversight for super administrators",
        heroText:
            "Manage every dashboard module, enforce security policy, and step into any operational workflow without access barriers.",
        metrics: [
            { label: "Total modules", value: "All", detail: "No dashboard restrictions" },
            { label: "Security posture", value: "100%", detail: "Global policy authority" },
            { label: "Critical actions", value: "24/7", detail: "Always-ready escalation access" },
        ],
        panelTitle: "Super admin priorities",
        panelItems: [
            "Control all roles and permissions",
            "Review system-wide activity",
            "Handle high-risk escalations",
        ],
    },
    admin: {
        title: "Admin command center",
        subtitle:
            "Coordinate users, permissions, compliance, and platform activity from a single operational workspace.",
        heroTitle: "Operational visibility for administrators",
        heroText:
            "Review access updates, monitor sensitive activity, and keep every team aligned around secure execution.",
        metrics: [
            { label: "Managed users", value: "1,284", detail: "42 invited this month" },
            { label: "Role changes", value: "48", detail: "6 require approval" },
            { label: "Audit score", value: "96%", detail: "Healthy governance posture" },
        ],
        panelTitle: "Admin priorities",
        panelItems: [
            "Approve role requests",
            "Review permission exceptions",
            "Export audit summaries",
        ],
    },
    teacher: {
        title: "Teacher workspace",
        subtitle:
            "Track classes, progress, and academic reporting in a calmer, role-focused teaching dashboard.",
        heroTitle: "Teaching flow with quicker decisions",
        heroText:
            "Keep class performance, attendance trends, and learner support tasks visible without admin-only clutter.",
        metrics: [
            { label: "Active classes", value: "12", detail: "3 starting today" },
            { label: "Pending grading", value: "86", detail: "14 urgent submissions" },
            { label: "Attendance rate", value: "93%", detail: "Stable this week" },
        ],
        panelTitle: "Teacher priorities",
        panelItems: [
            "Review student progress",
            "Publish class updates",
            "Prepare weekly reports",
        ],
    },
};

export default function RoleDashboardPage({ params }) {
    const router = useRouter();
    const { user, roles, permissions } = useSelector((state) => state.auth);
    const resolvedRole = params?.role?.toLowerCase();
    const primaryRole = getPrimaryRole(user, roles);

    useEffect(() => {
        if (primaryRole && isStaffRole(primaryRole) && primaryRole !== resolvedRole) {
            router.replace(getRoleHomePath(primaryRole));
        }
    }, [primaryRole, resolvedRole, router]);

    if (!isStaffRole(resolvedRole)) {
        return (
            <div className="flex min-h-screen items-center justify-center bg-slate-950 px-4 text-white">
                <div className="rounded-[28px] border border-white/10 bg-white/8 p-8 text-center">
                    <p className="text-xs uppercase tracking-[0.35em] text-amber-200/80">
                        Invalid portal
                    </p>
                    <h1 className="mt-3 text-3xl font-semibold">Role not supported here</h1>
                    <p className="mt-3 max-w-md text-sm leading-7 text-slate-300">
                        This dynamic staff route is reserved for <strong>super-admin</strong>, <strong>admin</strong>, and <strong>teacher</strong>.
                        Students use their own separate portal.
                    </p>
                </div>
            </div>
        );
    }

    const content = roleContent[resolvedRole];
    const roleMismatch = primaryRole && primaryRole !== resolvedRole;

    const permissionCount = Array.isArray(permissions) ? permissions.length : 0;

    return (
        <Layout role={resolvedRole} title={content.title} subtitle={content.subtitle}>
            <div className="grid gap-5 lg:grid-cols-[1.3fr_0.9fr]">
                <section className="rounded-[26px] bg-[linear-gradient(145deg,_#1f2937,_#111827)] p-6 text-white shadow-[inset_0_1px_0_rgba(255,255,255,0.08)]">
                    <p className="text-xs uppercase tracking-[0.3em] text-amber-200/80">
                        {resolvedRole} portal
                    </p>
                    <h2 className="mt-3 text-3xl font-semibold leading-tight">
                        {content.heroTitle}
                    </h2>
                    <p className="mt-4 max-w-2xl text-sm leading-7 text-slate-300">
                        {content.heroText}
                    </p>

                    <div className="mt-8 grid gap-4 sm:grid-cols-3">
                        {content.metrics.map((item) => (
                            <div
                                key={item.label}
                                className="rounded-2xl border border-white/10 bg-white/8 p-4"
                            >
                                <p className="text-xs uppercase tracking-[0.22em] text-slate-300">
                                    {item.label}
                                </p>
                                <p className="mt-3 text-2xl font-semibold">{item.value}</p>
                                <p className="mt-1 text-sm text-emerald-300">{item.detail}</p>
                            </div>
                        ))}
                    </div>
                </section>

                <section className="grid gap-5">
                    <div className="rounded-[24px] border border-amber-200/70 bg-white/85 p-5 shadow-[0_10px_40px_rgba(120,84,44,0.08)]">
                        <p className="text-xs uppercase tracking-[0.28em] text-amber-700">
                            Signed in user
                        </p>
                        <h3 className="mt-2 text-2xl font-semibold text-slate-950">
                            {user?.name || "Portal user"}
                        </h3>
                        <p className="mt-2 text-sm text-slate-600">
                            {user?.email || "No email returned from API"}
                        </p>

                        <div className="mt-5 grid gap-3 sm:grid-cols-2">
                            <div className="rounded-2xl bg-slate-100 p-4">
                                <p className="text-xs uppercase tracking-[0.24em] text-slate-500">
                                    Primary role
                                </p>
                                <p className="mt-2 text-lg font-semibold text-slate-900">
                                    {primaryRole || "Unknown"}
                                </p>
                            </div>
                            <div className="rounded-2xl bg-slate-100 p-4">
                                <p className="text-xs uppercase tracking-[0.24em] text-slate-500">
                                    Permissions
                                </p>
                                <p className="mt-2 text-lg font-semibold text-slate-900">
                                    {permissionCount}
                                </p>
                            </div>
                        </div>
                    </div>

                    <div className="rounded-[24px] border border-slate-200/80 bg-white/92 p-5">
                        <p className="text-xs uppercase tracking-[0.28em] text-slate-500">
                            {content.panelTitle}
                        </p>
                        <div className="mt-4 space-y-3">
                            {content.panelItems.map((item) => (
                                <div
                                    key={item}
                                    className="rounded-2xl border border-slate-200 bg-slate-50 px-4 py-3 text-sm text-slate-700"
                                >
                                    {item}
                                </div>
                            ))}
                        </div>
                    </div>
                </section>
            </div>

            {roleMismatch ? (
                <div className="mt-5 rounded-[24px] border border-amber-200 bg-amber-50 px-5 py-4 text-sm text-amber-800">
                    Redirecting this account to the <strong>{primaryRole}</strong> portal.
                </div>
            ) : null}
        </Layout>
    );
}
