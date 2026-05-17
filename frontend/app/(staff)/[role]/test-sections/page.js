"use client";

import React from "react";
import Link from "next/link";
import { useParams, useRouter, useSearchParams } from "next/navigation";
import { useSelector } from "react-redux";
import DynamicDataTable from "../../../components/dashboard/common/DynamicDataTable";
import { Edit2, FileText, Filter, Hash, Layers, Loader2, Plus, X } from "lucide-react";
import {
    useDeleteTestSectionMutation,
    useGetTestSectionsQuery,
} from "@/redux/features/common/backend/testSectionApi";
import {
    getPrimaryRole,
    getRoleHomePath,
} from "../../../../lib/auth";

function formatTestType(type) {
    return type ? type.charAt(0).toUpperCase() + type.slice(1) : "Unknown";
}

export default function TestSectionsPage() {
    const router = useRouter();
    const searchParams = useSearchParams();
    const { user, roles: userRoles } = useSelector((state) => state.auth);
    const { role } = useParams();
    const resolvedRole = role?.toLowerCase();
    const primaryRole = getPrimaryRole(user, userRoles);

    const initialFilters = React.useMemo(() => ({
        test_type: searchParams.get("test_type") || "",
        test_id: searchParams.get("test_id") || "",
    }), [searchParams]);

    const [filters, setFilters] = React.useState(initialFilters);
    const [appliedFilters, setAppliedFilters] = React.useState(initialFilters);

    React.useEffect(() => {
        setFilters(initialFilters);
        setAppliedFilters(initialFilters);
    }, [initialFilters]);

    const queryParams = React.useMemo(() => {
        const params = {};

        if (appliedFilters.test_type) {
            params.test_type = appliedFilters.test_type;
        }

        if (appliedFilters.test_id) {
            params.test_id = appliedFilters.test_id;
        }

        return params;
    }, [appliedFilters]);

    const { data: sections = [], isLoading, isError } = useGetTestSectionsQuery(queryParams);
    const [deleteSection, { isLoading: isDeleting }] = useDeleteTestSectionMutation();

    React.useEffect(() => {
        if (primaryRole && primaryRole !== resolvedRole) {
            router.replace(getRoleHomePath(primaryRole));
        }
    }, [primaryRole, resolvedRole, router]);

    function updateFilter(field, value) {
        setFilters((current) => ({
            ...current,
            [field]: value,
        }));
    }

    function syncFilterUrl(nextFilters) {
        const params = new URLSearchParams();

        if (nextFilters.test_type) {
            params.set("test_type", nextFilters.test_type);
        }

        if (nextFilters.test_id) {
            params.set("test_id", nextFilters.test_id);
        }

        const queryString = params.toString();
        router.replace(`/${resolvedRole}/test-sections${queryString ? `?${queryString}` : ""}`);
    }

    function handleFilterSubmit(event) {
        event.preventDefault();
        setAppliedFilters(filters);
        syncFilterUrl(filters);
    }

    function clearFilters() {
        const nextFilters = {
            test_type: "",
            test_id: "",
        };

        setFilters(nextFilters);
        setAppliedFilters(nextFilters);
        syncFilterUrl(nextFilters);
    }

    const createLink = React.useMemo(() => {
        const params = new URLSearchParams();
        if (appliedFilters.test_type) params.set("test_type", appliedFilters.test_type);
        if (appliedFilters.test_id) params.set("test_id", appliedFilters.test_id);
        const queryString = params.toString();
        return `/${resolvedRole}/test-sections/create${queryString ? `?${queryString}` : ""}`;
    }, [resolvedRole, appliedFilters]);

    const sectionItems = sections.map((section) => ({
        ...section,
        name: section.title,
        test_label: `${formatTestType(section.test_type)} Test #${section.test_id}`,
        module_title: section.module?.title || `Module #${section.module_id}`,
    }));

    const filterConfigs = [
        { key: "title", label: "Title", type: "text", placeholder: "Search sections..." },
        {
            key: "test_type",
            label: "Test Type",
            type: "select",
            options: [
                { label: "Practice", value: "practice" },
                { label: "Mock", value: "mock" },
            ],
        },
        { key: "test_label", label: "Test", type: "text", placeholder: "Search test id..." },
        { key: "module_title", label: "Module", type: "text", placeholder: "Search module..." },
    ];

    const columns = [
        {
            header: "Section",
            key: "title",
            sortable: true,
            render: (item) => (
                <div className="flex items-center gap-3">
                    <div className="p-2 bg-blue-50 rounded-lg">
                        <FileText size={16} className="text-blue-600" />
                    </div>
                    <div>
                        <p className="font-bold text-slate-700 tracking-tight">{item.title}</p>
                        <p className="text-[11px] text-slate-500">Section #{item.id}</p>
                    </div>
                </div>
            ),
        },
        {
            header: "Test",
            key: "test_label",
            sortable: true,
            render: (item) => (
                <span className="px-2.5 py-1 rounded-md text-[10px] font-black uppercase border bg-slate-50 text-slate-600 border-slate-200">
                    {item.test_label}
                </span>
            ),
        },
        {
            header: "Module",
            key: "module_title",
            sortable: true,
            render: (item) => (
                <div className="flex items-center gap-1.5 text-slate-600">
                    <Layers size={14} />
                    <span className="text-sm font-medium">{item.module_title}</span>
                </div>
            ),
        },
        {
            header: "Order",
            key: "order",
            sortable: true,
            render: (item) => (
                <span className="inline-flex items-center gap-1 rounded-md border border-slate-200 bg-slate-50 px-2 py-1 text-[10px] font-black uppercase text-slate-600">
                    <Hash size={12} />
                    {item.order}
                </span>
            ),
        },
        {
            header: "Actions",
            key: "actions",
            align: "right",
            render: (item) => (
                <Link
                    href={`/${resolvedRole}/test-sections/edit/${item.id}`}
                    className="p-2 text-blue-500 hover:text-blue-700 hover:bg-blue-50 rounded-lg transition-colors inline-block"
                    title="Edit Test Section"
                >
                    <Edit2 size={18} />
                </Link>
            ),
        },
    ];

    const handleDelete = async (item) => {
        await deleteSection(item.id).unwrap();
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
                    Error loading test sections.
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
                        Test Sections
                    </h1>
                    <p className="text-sm text-slate-500 font-medium">Manage sections for practice and mock tests by module and order.</p>
                </div>
                <Link
                    href={createLink}
                    className="flex items-center justify-center gap-2 px-5 py-2.5 bg-blue-600 text-white rounded-xl font-bold hover:bg-blue-700 shadow-lg shadow-blue-200 transition-all active:scale-95"
                >
                    <Plus size={20} />
                    Create Section
                </Link>
            </div>

            <form
                onSubmit={handleFilterSubmit}
                className="flex flex-col gap-4 rounded-2xl border border-slate-200 bg-white p-4 shadow-sm md:flex-row md:items-end"
            >
                <div className="flex-1">
                    <label className="mb-2 block text-sm font-semibold text-slate-700">Test Type</label>
                    <select
                        value={filters.test_type}
                        onChange={(event) => updateFilter("test_type", event.target.value)}
                        className="w-full rounded-xl border border-slate-200 bg-slate-50 px-4 py-2.5 text-sm text-slate-900 outline-none transition focus:border-blue-500 focus:ring-4 focus:ring-blue-100"
                    >
                        <option value="">All test types</option>
                        <option value="practice">Practice</option>
                        <option value="mock">Mock</option>
                    </select>
                </div>
                <div className="flex-1">
                    <label className="mb-2 block text-sm font-semibold text-slate-700">Test ID</label>
                    <input
                        type="number"
                        min="1"
                        value={filters.test_id}
                        onChange={(event) => updateFilter("test_id", event.target.value)}
                        placeholder="Enter test id"
                        className="w-full rounded-xl border border-slate-200 bg-slate-50 px-4 py-2.5 text-sm text-slate-900 outline-none transition focus:border-blue-500 focus:ring-4 focus:ring-blue-100"
                    />
                </div>
                <div className="flex gap-2">
                    <button
                        type="submit"
                        className="inline-flex items-center justify-center gap-2 rounded-xl bg-slate-950 px-4 py-2.5 text-sm font-bold text-white transition hover:bg-slate-800"
                    >
                        <Filter size={16} />
                        Apply
                    </button>
                    <button
                        type="button"
                        onClick={clearFilters}
                        className="inline-flex items-center justify-center gap-2 rounded-xl border border-slate-200 bg-white px-4 py-2.5 text-sm font-bold text-slate-600 transition hover:bg-slate-50"
                    >
                        <X size={16} />
                        Clear
                    </button>
                </div>
            </form>

            <DynamicDataTable
                data={sectionItems}
                columns={columns}
                filterConfigs={filterConfigs}
                onDelete={handleDelete}
                isDeleting={isDeleting}
                perPage={10}
            />
        </div>
    );
}
