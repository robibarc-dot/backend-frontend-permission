"use client";

import { useEffect } from "react";
import { useRouter, useParams } from "next/navigation";
import { useSelector } from "react-redux";
import DashboardLayout from "../../components/dashboard/Layout";

import {
    getPrimaryRole,
    getRoleHomePath,
    isStaffRole,
} from "../../../lib/auth";

export default function StaffRoleLayout({ children }) {
    const router = useRouter();
    const { role } = useParams();
    const { user, roles } = useSelector((state) => state.auth);

    // console.log(params);
    const resolvedRole = role?.toLowerCase();
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

    // We return children directly to avoid the "Double Sidebar" issue.
    // Individual pages in this directory (like role/page.js) wrap themselves in <Layout /> 
    // to provide custom titles and subtitles to the Header component.
    return <DashboardLayout>{children}</DashboardLayout>;
}
