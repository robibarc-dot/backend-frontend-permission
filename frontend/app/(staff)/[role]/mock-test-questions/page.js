"use client";

import React from "react";
import Link from "next/link";
import { useParams, useRouter } from "next/navigation";
import { useSelector } from "react-redux";
import DynamicDataTable from "../../../components/dashboard/common/DynamicDataTable";
import { Edit2, FileQuestion, Hash, Layers, Loader2, Plus } from "lucide-react";
import {
    useDeleteMockTestQuestionMutation,
    useGetMockTestQuestionsQuery,
} from "@/redux/features/mock/backend/mockTestQuestionApi";
import {
    getPrimaryRole,
    getRoleHomePath,
} from "../../../../lib/auth";

function getQuestionLabel(item) {
    if (item.question?.title) {
        return item.question.title;
    }

    if (item.question?.name) {
        return item.question.name;
    }

    return `Question #${item.question_id}`;
}

export default function MockTestQuestionsPage() {
    const router = useRouter();
    const { user, roles: userRoles } = useSelector((state) => state.auth);
    const { role } = useParams();
    const resolvedRole = role?.toLowerCase();
    const primaryRole = getPrimaryRole(user, userRoles);

    const { data: assignments = [], isLoading, isError } = useGetMockTestQuestionsQuery();
    const [deleteAssignment, { isLoading: isDeleting }] = useDeleteMockTestQuestionMutation();

    React.useEffect(() => {
        if (primaryRole && primaryRole !== resolvedRole) {
            router.replace(getRoleHomePath(primaryRole));
        }
    }, [primaryRole, resolvedRole, router]);

    const assignmentItems = assignments.map((assignment) => ({
        ...assignment,
        name: `Mock test question #${assignment.id}`,
        mock_test_title: assignment.mock_test?.title || `Mock Test #${assignment.mock_test_id}`,
        module_title: assignment.module?.title || `Module #${assignment.module_id}`,
        question_label: getQuestionLabel(assignment),
    }));

    const filterConfigs = [
        { key: "mock_test_title", label: "Mock Test", type: "text", placeholder: "Search mock test..." },
        { key: "question_label", label: "Question", type: "text", placeholder: "Search question..." },
        { key: "module_title", label: "Module", type: "text", placeholder: "Search module..." },
    ];

    const columns = [
        {
            header: "Mock Test",
            key: "mock_test_title",
            sortable: true,
            render: (item) => (
                <div className="flex items-center gap-3">
                    <div className="p-2 bg-blue-50 rounded-lg">
                        <FileQuestion size={16} className="text-blue-600" />
                    </div>
                    <div>
                        <p className="font-bold text-slate-700 tracking-tight">{item.mock_test_title}</p>
                        <p className="text-[11px] text-slate-500">Assignment #{item.id}</p>
                    </div>
                </div>
            ),
        },
        {
            header: "Question",
            key: "question_label",
            sortable: true,
            render: (item) => (
                <span className="font-medium text-slate-700">{item.question_label}</span>
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
                    href={`/${resolvedRole}/mock-test-questions/edit?id=${item.id}`}
                    className="p-2 text-blue-500 hover:text-blue-700 hover:bg-blue-50 rounded-lg transition-colors inline-block"
                    title="Edit Question Assignment"
                >
                    <Edit2 size={18} />
                </Link>
            ),
        },
    ];

    const handleDelete = async (item) => {
        await deleteAssignment(item.id).unwrap();
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
                    Error loading mock test question assignments.
                </div>
            </div>
        );
    }

    return (
        <div className="p-6 max-w-[1600px] mx-auto space-y-6">
            <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
                <div>
                    <h1 className="text-2xl font-black text-slate-800 flex items-center gap-2">
                        <FileQuestion className="text-blue-600" size={28} />
                        Mock Test Questions
                    </h1>
                    <p className="text-sm text-slate-500 font-medium">Assign questions to mock tests and control module order.</p>
                </div>
                <Link
                    href={`/${resolvedRole}/mock-test-questions/create`}
                    className="flex items-center justify-center gap-2 px-5 py-2.5 bg-blue-600 text-white rounded-xl font-bold hover:bg-blue-700 shadow-lg shadow-blue-200 transition-all active:scale-95"
                >
                    <Plus size={20} />
                    Assign Question
                </Link>
            </div>

            <DynamicDataTable
                data={assignmentItems}
                columns={columns}
                filterConfigs={filterConfigs}
                onDelete={handleDelete}
                isDeleting={isDeleting}
                perPage={10}
            />
        </div>
    );
}
