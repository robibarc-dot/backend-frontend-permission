"use client";

import { useEffect } from "react";
import { useRouter } from "next/navigation";
import { useSelector } from "react-redux";
import { getPrimaryRole, getRoleHomePath } from "../../lib/auth";

export default function DashboardRedirectPage() {
    const router = useRouter();
    const { user, roles } = useSelector((state) => state.auth);

    useEffect(() => {
        const role = getPrimaryRole(user, roles);
        router.replace(getRoleHomePath(role));
    }, [router, roles, user]);

    return (
        <div className="flex min-h-screen items-center justify-center bg-slate-950 text-white">
            <p className="text-sm uppercase tracking-[0.28em] text-slate-300">
                Redirecting to your portal...
            </p>
        </div>
    );
}
