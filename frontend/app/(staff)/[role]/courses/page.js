"use client";

import React from "react";
import Link from "next/link";
import { useParams, useRouter } from "next/navigation";
import { useSelector } from "react-redux";
import { BookOpen, Edit2, Loader2, Plus } from "lucide-react";

import DynamicDataTable from "../../../components/dashboard/common/DynamicDataTable";
import {
    useDeleteCourseMutation,
    useGetCoursesQuery,
} from "@/redux/features/course/backend/courseApi";
import {
    getPrimaryRole,
    getRoleHomePath,
} from "../../../../lib/auth";

function formatPrice(value) {
    const amount = Number(value || 0);
    return new Intl.NumberFormat("en-US", {
        style: "currency",
        currency: "USD",
    }).format(amount);
}

function formatDuration(course) {
    const hours = Number(course.duration_hours || 0);
    const minutes = Number(course.duration_minutes || 0);

    if (!hours && !minutes) {
        return "0 min";
    }

    return `${hours ? `${hours}h` : ""}${hours && minutes ? " " : ""}${minutes ? `${minutes}m` : ""}`;
}

export default function CoursesPage() {
    const router = useRouter();
    const { user, roles: userRoles } = useSelector((state) => state.auth);
    const { role } = useParams();
    const resolvedRole = role?.toLowerCase();
    const primaryRole = getPrimaryRole(user, userRoles);

    const { data: courses, isLoading, isError } = useGetCoursesQuery();
    const [deleteCourse, { isLoading: isDeleting }] = useDeleteCourseMutation();

    React.useEffect(() => {
        if (primaryRole && primaryRole !== resolvedRole) {
            router.replace(getRoleHomePath(primaryRole));
        }
    }, [primaryRole, resolvedRole, router]);

    const courseItems = (courses?.data || []).map((course) => ({
        ...course,
        name: course.title,
        published_label: course.is_published ? "Published" : "Draft",
    }));

    const filterConfigs = [
        { key: "title", label: "Title", type: "text", placeholder: "Search courses..." },
        { key: "category", label: "Category", type: "text", placeholder: "Filter category..." },
        {
            key: "published_label",
            label: "Status",
            type: "select",
            options: [
                { label: "Published", value: "Published" },
                { label: "Draft", value: "Draft" },
            ],
        },
    ];

    const handleDelete = async (item) => {
        await deleteCourse(item.id).unwrap();
    };

    const columns = [
        {
            header: "Course",
            key: "title",
            sortable: true,
            render: (item) => (
                <div className="flex items-center gap-3">
                    <div className="p-2 bg-blue-50 rounded-lg">
                        <BookOpen size={16} className="text-blue-600" />
                    </div>
                    <div>
                        <p className="font-bold text-slate-700 tracking-tight">{item.title}</p>
                        <p className="text-[11px] text-slate-500">{item.category || "Uncategorized"}</p>
                    </div>
                </div>
            ),
        },
        {
            header: "Price",
            key: "price",
            sortable: true,
            render: (item) => (
                <div>
                    <p className="text-sm font-bold text-slate-700">{formatPrice(item.price)}</p>
                    {item.regular_price && (
                        <p className="text-[11px] text-slate-400 line-through">{formatPrice(item.regular_price)}</p>
                    )}
                </div>
            ),
        },
        {
            header: "Duration",
            key: "duration_hours",
            sortable: true,
            render: (item) => <span className="text-sm font-medium text-slate-600">{formatDuration(item)}</span>,
        },
        {
            header: "Content",
            key: "content",
            render: (item) => (
                <span className="text-xs font-semibold text-slate-500">
                    {item.features?.length || 0} features / {item.levels?.length || 0} levels
                </span>
            ),
        },
        {
            header: "Status",
            key: "published_label",
            sortable: true,
            render: (item) => (
                <span className={`px-2.5 py-1 rounded-md text-[10px] font-black uppercase border ${
                    item.is_published
                        ? "bg-emerald-50 text-emerald-700 border-emerald-100"
                        : "bg-slate-50 text-slate-600 border-slate-200"
                }`}>
                    {item.published_label}
                </span>
            ),
        },
        {
            header: "Actions",
            key: "actions",
            align: "right",
            render: (item) => (
                <Link
                    href={`/${resolvedRole}/courses/edit/${item.id}`}
                    className="p-2 text-blue-500 hover:text-blue-700 hover:bg-blue-50 rounded-lg transition-colors inline-block"
                    title="Edit Course"
                >
                    <Edit2 size={18} />
                </Link>
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
                    Error loading courses.
                </div>
            </div>
        );
    }

    return (
        <div className="p-6 max-w-[1600px] mx-auto space-y-6">
            <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
                <div>
                    <h1 className="text-2xl font-black text-slate-800 flex items-center gap-2">
                        <BookOpen className="text-blue-600" size={28} />
                        Courses
                    </h1>
                    <p className="text-sm text-slate-500 font-medium">Manage course pricing, publishing, curriculum, and learning outcomes.</p>
                </div>
                <Link
                    href={`/${resolvedRole}/courses/create`}
                    className="flex items-center justify-center gap-2 px-5 py-2.5 bg-blue-600 text-white rounded-xl font-bold hover:bg-blue-700 shadow-lg shadow-blue-200 transition-all active:scale-95"
                >
                    <Plus size={20} />
                    Create Course
                </Link>
            </div>

            <DynamicDataTable
                data={courseItems}
                columns={columns}
                filterConfigs={filterConfigs}
                onDelete={handleDelete}
                isDeleting={isDeleting}
                perPage={10}
            />
        </div>
    );
}
