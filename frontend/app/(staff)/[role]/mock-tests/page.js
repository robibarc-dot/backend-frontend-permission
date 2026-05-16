"use client";

import React from "react";
import Link from "next/link";
import { useRouter, useParams } from "next/navigation";
import { useSelector } from "react-redux";
import DynamicDataTable from "../../../components/dashboard/common/DynamicDataTable";
import { Clock, Edit2, FileText, Loader2, Plus } from "lucide-react";
import {
    useDeleteMockTestMutation,
    useGetMockTestsQuery,
} from "@/redux/features/mock/backend/mockTestApi";
import {
    getPrimaryRole,
    getRoleHomePath,
} from "../../../../lib/auth";

export default function MockTestsListPage() {
    const router = useRouter();
    const { user, roles: userRoles } = useSelector((state) => state.auth);
    const { role } = useParams();
    const resolvedRole = role?.toLowerCase();
    const primaryRole = getPrimaryRole(user, userRoles);

    const { data: tests = [], isLoading, isError } = useGetMockTestsQuery();
    const [deleteTest, { isLoading: isDeleting }] = useDeleteMockTestMutation();

    React.useEffect(() => {
        if (primaryRole && primaryRole !== resolvedRole) {
            router.replace(getRoleHomePath(primaryRole));
        }
    }, [primaryRole, resolvedRole, router]);

    const mockTests = tests.map((test) => ({
        ...test,
        name: test.title,
    }));

    const filterConfigs = [
        { key: "title", label: "Title", type: "text", placeholder: "Search mock tests..." },
        {
            key: "category",
            label: "Category",
            type: "select",
            options: [
                { label: "Academic", value: "academic" },
                { label: "General", value: "general" },
            ],
        },
        {
            key: "type",
            label: "Type",
            type: "select",
            options: [
                { label: "Free", value: "free" },
                { label: "Paid", value: "paid" },
            ],
        },
    ];

    const columns = [
        {
            header: "Mock Test",
            key: "title",
            sortable: true,
            render: (item) => (
                <div className="flex items-center gap-3">
                    <div className="p-2 bg-blue-50 rounded-lg">
                        <FileText size={16} className="text-blue-600" />
                    </div>
                    <div>
                        <p className="font-bold text-slate-700 tracking-tight">{item.title}</p>
                        {item.slug && <p className="text-[11px] text-slate-500">{item.slug}</p>}
                    </div>
                </div>
            ),
        },
        {
            header: "Duration",
            key: "duration_mins",
            sortable: true,
            render: (item) => (
                <div className="flex items-center gap-1.5 text-slate-600">
                    <Clock size={14} />
                    <span className="text-sm font-medium">{item.duration_mins} mins</span>
                </div>
            ),
        },
        {
            header: "Category",
            key: "category",
            sortable: true,
            render: (item) => (
                <span className="px-2.5 py-1 rounded-md text-[10px] font-black uppercase border bg-emerald-50 text-emerald-700 border-emerald-100">
                    {item.category}
                </span>
            ),
        },
        {
            header: "Type",
            key: "type",
            sortable: true,
            render: (item) => (
                <span className={`px-2.5 py-1 rounded-md text-[10px] font-black uppercase border ${
                    item.type === "paid"
                        ? "bg-amber-50 text-amber-700 border-amber-100"
                        : "bg-slate-50 text-slate-600 border-slate-200"
                }`}>
                    {item.type}
                </span>
            ),
        },
        {
            header: "Actions",
            key: "actions",
            align: "right",
            render: (item) => (
                <Link
                    href={`/${resolvedRole}/mock-tests/edit/${item.id}`}
                    className="p-2 text-blue-500 hover:text-blue-700 hover:bg-blue-50 rounded-lg transition-colors inline-block"
                    title="Edit Mock Test"
                >
                    <Edit2 size={18} />
                </Link>
            ),
        },
    ];

    const handleDelete = async (item) => {
        await deleteTest(item.id).unwrap();
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
                    Error loading mock tests.
                </div>
            </div>
        );
    }

    return (
        <div className="p-6 max-w-[1600px] mx-auto space-y-6">
            <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
                <div>
                    <h1 className="text-2xl font-black text-slate-800 flex items-center gap-2">
                        <FileText className="text-blue-600" size={28} />
                        Mock Tests
                    </h1>
                    <p className="text-sm text-slate-500 font-medium">Manage mock exam records, timing, categories, and availability.</p>
                </div>
                <Link
                    href={`/${resolvedRole}/mock-tests/create`}
                    className="flex items-center justify-center gap-2 px-5 py-2.5 bg-blue-600 text-white rounded-xl font-bold hover:bg-blue-700 shadow-lg shadow-blue-200 transition-all active:scale-95"
                >
                    <Plus size={20} />
                    Create Mock Test
                </Link>
            </div>

            <DynamicDataTable
                data={mockTests}
                columns={columns}
                filterConfigs={filterConfigs}
                onDelete={handleDelete}
                isDeleting={isDeleting}
                perPage={10}
            />
        </div>
    );
}
