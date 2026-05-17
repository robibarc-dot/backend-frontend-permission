"use client";

import React from "react";
import Link from "next/link";
import { useParams, useRouter } from "next/navigation";
import { useSelector } from "react-redux";
import DynamicDataTable from "../../../components/dashboard/common/DynamicDataTable";
import { Edit2, Layers, Loader2, Plus } from "lucide-react";
import {
    useDeleteModuleMutation,
    useGetModulesQuery,
} from "@/redux/features/common/backend/moduleApi";
import {
    getPrimaryRole,
    getRoleHomePath,
} from "../../../../lib/auth";

export default function ModulesPage() {
    const router = useRouter();
    const { user, roles: userRoles } = useSelector((state) => state.auth);
    const { role } = useParams();
    const resolvedRole = role?.toLowerCase();
    const primaryRole = getPrimaryRole(user, userRoles);

    const { data: modules = [], isLoading, isError } = useGetModulesQuery();
    const [deleteModule, { isLoading: isDeleting }] = useDeleteModuleMutation();

    React.useEffect(() => {
        if (primaryRole && primaryRole !== resolvedRole) {
            router.replace(getRoleHomePath(primaryRole));
        }
    }, [primaryRole, resolvedRole, router]);

    const moduleItems = modules.map((module) => ({
        ...module,
        name: module.title,
    }));

    const filterConfigs = [
        { key: "title", label: "Title", type: "text", placeholder: "Search modules..." },
        {
            key: "status",
            label: "Status",
            type: "select",
            options: [
                { label: "Active", value: "active" },
                { label: "Inactive", value: "inactive" },
            ],
        },
    ];

    const columns = [
        {
            header: "Module",
            key: "title",
            sortable: true,
            render: (item) => (
                <div className="flex items-center gap-3">
                    <div className="p-2 bg-blue-50 rounded-lg">
                        <Layers size={16} className="text-blue-600" />
                    </div>
                    <div>
                        <p className="font-bold text-slate-700 tracking-tight">{item.title}</p>
                        <p className="text-[11px] text-slate-500">Module #{item.id}</p>
                    </div>
                </div>
            ),
        },
        {
            header: "Status",
            key: "status",
            sortable: true,
            render: (item) => (
                <span className={`px-2.5 py-1 rounded-md text-[10px] font-black uppercase border ${
                    item.status === "active"
                        ? "bg-emerald-50 text-emerald-700 border-emerald-100"
                        : "bg-slate-50 text-slate-600 border-slate-200"
                }`}>
                    {item.status}
                </span>
            ),
        },
        {
            header: "Actions",
            key: "actions",
            align: "right",
            render: (item) => (
                <Link
                    href={`/${resolvedRole}/modules/edit/${item.id}`}
                    className="p-2 text-blue-500 hover:text-blue-700 hover:bg-blue-50 rounded-lg transition-colors inline-block"
                    title="Edit Module"
                >
                    <Edit2 size={18} />
                </Link>
            ),
        },
    ];

    const handleDelete = async (item) => {
        await deleteModule(item.id).unwrap();
    };

    if (isLoading) {
        return (
            <div className="flex h-[400px] items-center justify-center">
                <Loader2 className="h-8 w-8 animate-spin text-blue-600" />
            </div>
        );
    }

    if (isError) {
        return (
            <div className="p-6 max-w-[1600px] mx-auto">
                <div className="rounded-xl border border-rose-100 bg-rose-50 px-4 py-3 text-sm font-medium text-rose-700">
                    Error loading modules.
                </div>
            </div>
        );
    }

    return (
        <div className="p-6 max-w-[1600px] mx-auto space-y-6">
            <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
                <div>
                    <h1 className="text-2xl font-black text-slate-800 flex items-center gap-2">
                        <Layers className="text-blue-600" size={28} />
                        Modules
                    </h1>
                    <p className="text-sm text-slate-500 font-medium">Manage course modules (Listening, Reading, Writing, Speaking).</p>
                </div>
                <Link
                    href={`/${resolvedRole}/modules/create`}
                    className="flex items-center justify-center gap-2 px-5 py-2.5 bg-blue-600 text-white rounded-xl font-bold hover:bg-blue-700 shadow-lg shadow-blue-200 transition-all active:scale-95"
                >
                    <Plus size={20} />
                    Create Module
                </Link>
            </div>

            <DynamicDataTable
                data={moduleItems}
                columns={columns}
                filterConfigs={filterConfigs}
                onDelete={handleDelete}
                isDeleting={isDeleting}
                perPage={10}
            />
        </div>
    );
}
