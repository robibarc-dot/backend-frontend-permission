"use client";

import React from "react";
import { useRouter, useParams } from "next/navigation";
import { useSelector } from "react-redux";
import Link from "next/link";
import DynamicDataTable from "../../../components/dashboard/common/DynamicDataTable";
import { User, Plus, Edit2, Loader2, Users } from "lucide-react";
import { useGetUsersQuery } from "@/redux/features/auth/user/userApis";
import {
    getPrimaryRole,
    getRoleHomePath,
} from "../../../../lib/auth";

export default function UserManagementPage() {
    const router = useRouter();
    const { user, roles: userRoles } = useSelector((state) => state.auth);
    const { role } = useParams();
    const resolvedRole = role?.toLowerCase();
    const primaryRole = getPrimaryRole(user, userRoles);

    const { data: apiResponse, isLoading } = useGetUsersQuery();
    const userItems = apiResponse?.users || [];

    React.useEffect(() => {
        if (primaryRole && primaryRole !== resolvedRole) {
            router.replace(getRoleHomePath(primaryRole));
        }
    }, [primaryRole, resolvedRole, router]);

    const filterConfigs = [
        { key: 'name', label: 'Name', type: 'text', placeholder: 'Filter by name...' },
        { key: 'email', label: 'Email', type: 'text', placeholder: 'Filter by email...' }
    ];

    const columns = [
        {
            header: 'User Profile',
            key: 'name',
            sortable: true,
            render: (item) => (
                <div className="flex items-center gap-3">
                    <div className="p-2 bg-slate-100 rounded-lg">
                        <User size={16} className="text-slate-600" />
                    </div>
                    <div>
                        <p className="font-bold text-slate-700 tracking-tight">{item.name}</p>
                        <p className="text-[11px] text-slate-500">{item.email}</p>
                    </div>
                </div>
            )
        },
        {
            header: 'Roles',
            key: 'roles',
            render: (item) => (
                <div className="flex flex-wrap gap-1">
                    {(item.roles || []).map((r) => (
                        <span key={r} className="px-2 py-0.5 rounded-full bg-amber-50 text-amber-700 border border-amber-100 text-[10px] font-bold">
                            {r}
                        </span>
                    ))}
                </div>
            )
        },
        {
            header: 'Effective Permissions',
            key: 'all_permissions',
            render: (item) => (
                <div className="flex flex-wrap gap-1 max-w-xs">
                    {(item.all_permissions || []).slice(0, 3).map((p) => (
                        <span key={p} className="px-2 py-0.5 rounded-md bg-slate-50 text-slate-600 border border-slate-200 text-[9px] font-medium">
                            {p}
                        </span>
                    ))}
                    {item.all_permissions?.length > 3 && (
                        <span className="text-[9px] text-slate-400 font-medium ml-1">+{item.all_permissions.length - 3} more</span>
                    )}
                </div>
            )
        },
        {
            header: 'Actions',
            key: 'actions',
            align: 'right',
            render: (item) => (
                <Link href={`/${resolvedRole}/user/edit/${item.id}`} className="p-2 text-blue-500 hover:text-blue-700 hover:bg-blue-50 rounded-lg transition-colors inline-block">
                    <Edit2 size={18} />
                </Link>
            )
        }
    ];

    if (isLoading) {
        return (
            <div className="flex h-[400px] items-center justify-center">
                <Loader2 className="h-8 w-8 animate-spin text-blue-600" />
            </div>
        );
    }

    return (
        <div className="p-6 max-w-[1600px] mx-auto space-y-6">
            <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
                <div>
                    <h1 className="text-2xl font-black text-slate-800 flex items-center gap-2"><Users className="text-blue-600" size={28} />User Directory</h1>
                    <p className="text-sm text-slate-500 font-medium">Manage identity records and granular access control for all system users.</p>
                </div>
                <Link href={`/${resolvedRole}/user/create`} className="flex items-center justify-center gap-2 px-5 py-2.5 bg-blue-600 text-white rounded-xl font-bold hover:bg-blue-700 shadow-lg shadow-blue-200 transition-all active:scale-95">
                    <Plus size={20} />Create User
                </Link>
            </div>

            <DynamicDataTable data={userItems} columns={columns} filterConfigs={filterConfigs} perPage={10} />
        </div>
    );
}
