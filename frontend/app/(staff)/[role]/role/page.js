"use client";

import React, { useEffect } from "react";
import { useRouter, useParams } from "next/navigation";
import { useSelector } from "react-redux";
import Link from "next/link";
import DynamicDataTable from "../../../components/dashboard/common/DynamicDataTable";
import { Shield, Plus, Users, Edit2, Loader2, ShieldAlert } from "lucide-react";
import { useGetRolesQuery } from "@/redux/features/auth/role/roleApis";
import {
    getPrimaryRole,
    getRoleHomePath,
} from "../../../../lib/auth";

function hasPermission(permissionList, permissionName) {
    return Array.isArray(permissionList) && permissionList.includes(permissionName);
}

export default function RoleManagementPage() {
    const router = useRouter();
    const { user, roles: userRoles, permissions } = useSelector((state) => state.auth);
    const { role } = useParams();
    const resolvedRole = role?.toLowerCase();
    const primaryRole = getPrimaryRole(user, userRoles);

    const { data: apiResponse, isLoading } = useGetRolesQuery();
    const roleItems = apiResponse?.roles || [];

    const canViewRoles = hasPermission(permissions, "role.view");

    // Security: Redirect if user role doesn't match URL or lacks view permission
    useEffect(() => {
        if (primaryRole && primaryRole !== resolvedRole) {
            router.replace(getRoleHomePath(primaryRole));
        }
    }, [primaryRole, resolvedRole, router]);

    const filterConfigs = [
        { key: 'name', label: 'Role Name', type: 'text', placeholder: 'Search roles...' },
        {
            key: 'guard_name',
            label: 'Guard',
            type: 'select',
            options: [
                { label: 'Web', value: 'web' },
                { label: 'API', value: 'api' },
            ]
        }
    ];

    const columns = [
        {
            header: 'Role',
            key: 'name',
            sortable: true,
            render: (item) => (
                <div className="flex items-center gap-3">
                    <div className="p-2 bg-indigo-50 rounded-lg">
                        <Shield size={16} className="text-indigo-600" />
                    </div>
                    <span className="font-bold text-slate-700 tracking-tight">{item.name}</span>
                </div>
            )
        },
        {
            header: 'Guard',
            key: 'guard_name',
            sortable: true,
            render: (item) => (
                <span className="px-2 py-1 rounded-md text-[10px] font-black uppercase border bg-slate-50 text-slate-600 border-slate-200">
                    {item.guard_name}
                </span>
            )
        },
        {
            header: 'Users',
            key: 'user_count',
            sortable: true,
            render: (item) => (
                <div className="flex items-center gap-1.5 text-slate-600">
                    <Users size={14} />
                    <span className="text-sm font-medium">{item.user_count}</span>
                </div>
            )
        },
        {
            header: 'Actions',
            key: 'actions',
            align: 'right',
            render: (item) => (
                <Link
                    href={`/${resolvedRole}/role/edit/${item.id}`}
                    className="p-2 text-blue-500 hover:text-blue-700 hover:bg-blue-50 rounded-lg transition-colors inline-block"
                    title="Edit Role"
                >
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
                    <h1 className="text-2xl font-black text-slate-800 flex items-center gap-2">
                        <Shield className="text-indigo-600" size={28} />
                        System Roles
                    </h1>
                    <p className="text-sm text-slate-500 font-medium">Design reusable access bundles and connect permissions to each role.</p>
                </div>
                <Link 
                    href={`/${resolvedRole}/role/create`}
                    className="flex items-center justify-center gap-2 px-5 py-2.5 bg-indigo-600 text-white rounded-xl font-bold hover:bg-indigo-700 shadow-lg shadow-indigo-200 transition-all active:scale-95"
                >
                    <Plus size={20} />
                    Create Role
                </Link>
            </div>

            <DynamicDataTable
                data={roleItems}
                columns={columns}
                filterConfigs={filterConfigs}
                perPage={10}
            />
        </div>
    );
}
