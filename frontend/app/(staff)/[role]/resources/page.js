'use client';

import React from 'react';
import Link from 'next/link';
import { useRouter, useParams } from 'next/navigation';
import { useSelector } from "react-redux";
import {
    useGetResourcesQuery,
    useDeleteResourceMutation
} from '@/redux/features/resource/backend/resourceApi';
import DynamicDataTable from "../../../components/dashboard/common/DynamicDataTable";
import { BookOpen, Edit2, FileText, Layers, Loader2, Plus, Trash2 } from "lucide-react";
import {
    getPrimaryRole,
    getRoleHomePath,
} from "../../../../lib/auth";

export default function ResourcesListPage() {
    const router = useRouter();
    const { user, roles: userRoles } = useSelector((state) => state.auth);
    const { role } = useParams();
    const resolvedRole = role?.toLowerCase();
    const primaryRole = getPrimaryRole(user, userRoles);

    const { data: resources, isLoading, isError } = useGetResourcesQuery();
    const [deleteResource, { isLoading: isDeleting }] = useDeleteResourceMutation();

    const handleDelete = async (id) => {
        if (window.confirm('Are you sure you want to delete this resource?')) {
            try {
                await deleteResource(id).unwrap();
            } catch (err) {
                alert('Failed to delete the resource');
            }
        }
    };

    React.useEffect(() => {
        if (primaryRole && primaryRole !== resolvedRole) {
            router.replace(getRoleHomePath(primaryRole));
        }
    }, [primaryRole, resolvedRole, router]);

    const resourceList = (resources?.data || []).map((resource) => ({
        ...resource,
        name: resource.topic,
    }));

    const filterConfigs = [
        { key: "topic", label: "Topic", type: "text", placeholder: "Search resources..." },
        {
            key: "module",
            label: "Module",
            type: "select",
            options: [
                { label: "Listening", value: "LISTENING" },
                { label: "Reading", value: "READING" },
                { label: "Writing", value: "WRITING" },
                { label: "Speaking", value: "SPEAKING" },
            ],
        },
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
            header: "Resource",
            key: "topic",
            sortable: true,
            render: (item) => (
                <div className="flex items-center gap-3">
                    <div className="p-2 bg-amber-50 rounded-lg">
                        <BookOpen size={16} className="text-amber-600" />
                    </div>
                    <div>
                        <p className="font-bold text-slate-700 tracking-tight">{item.topic}</p>
                        <p className="text-[11px] text-slate-500">{item.module?.title || '-'}</p>
                    </div>
                </div>
            ),
        },
        {
            header: "Module",
            key: "module",
            sortable: true,
            render: (item) => (
                <span className="px-2.5 py-1 rounded-md text-[10px] font-black uppercase border bg-blue-50 text-blue-700 border-blue-100">
                    {item.module?.title || '-'}
                </span>
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
            header: "Sections",
            key: "sections_count",
            sortable: false,
            render: (item) => (
                <div className="flex items-center gap-1.5 text-slate-500">
                    <Layers size={14} />
                    <span className="text-sm font-medium">{item.sections?.length || 0}</span>
                </div>
            ),
        },
        {
            header: "Actions",
            key: "actions",
            align: "right",
            render: (item) => (
                <>
                    <button
                        onClick={() => handleDelete(item.id)}
                        className="p-2 text-red-500 hover:text-red-700 hover:bg-red-50 rounded-lg transition-colors inline-block"
                        title="Delete Resource"
                    >
                        <Trash2 size={18} />
                    </button>
                    <Link
                        href={`/${resolvedRole}/resources/edit/${item.id}`}
                        className="p-2 text-blue-500 hover:text-blue-700 hover:bg-blue-50 rounded-lg transition-colors inline-block"
                        title="Edit Resource"
                    >
                        <Edit2 size={18} />
                    </Link>
                </>
            ),
        },
    ];

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
                    Error loading resources.
                </div>
            </div>
        );
    }

    return (
        <div className="p-6 max-w-[1600px] mx-auto space-y-6">
            <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
                <div>
                    <h1 className="text-2xl font-black text-slate-800 flex items-center gap-2">
                        <FileText className="text-amber-600" size={28} />
                        Resources
                    </h1>
                    <p className="text-sm text-slate-500 font-medium">Manage learning resources, topics, modules, and content sections.</p>
                </div>
                <Link
                    href={`/${resolvedRole}/resources/create`}
                    className="flex items-center justify-center gap-2 px-5 py-2.5 bg-blue-600 text-white rounded-xl font-bold hover:bg-blue-700 shadow-lg shadow-blue-200 transition-all active:scale-95"
                >
                    <Plus size={20} />
                    Create Resource
                </Link>
            </div>

            <DynamicDataTable
                data={resourceList}
                columns={columns}
                filterConfigs={filterConfigs}
                onDelete={handleDelete}
                isDeleting={isDeleting}
                perPage={10}
            />
        </div>
    );
}
