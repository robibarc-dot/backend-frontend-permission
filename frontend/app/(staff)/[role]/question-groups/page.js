'use client';

import React from 'react';
import Link from 'next/link';
import { useRouter, useParams, useSearchParams } from 'next/navigation';
import { useSelector } from "react-redux";
import { 
    useGetQuestionGroupsQuery, 
    useDeleteQuestionGroupMutation 
} from '@/redux/features/common/backend/questionGroupApi';
import DynamicDataTable from "../../../components/dashboard/common/DynamicDataTable";
import { 
    Library, 
    Layers, 
    Loader2, 
    Plus, 
    Edit2, 
    Trash2, 
    AlignLeft,
    Type,
    Hash
} from "lucide-react";
import { getPrimaryRole, getRoleHomePath } from "../../../../lib/auth";

export default function QuestionGroupsListPage() {
    const router = useRouter();
    const searchParams = useSearchParams();
    const { user, roles: userRoles } = useSelector((state) => state.auth);
    const { role } = useParams();
    const resolvedRole = role?.toLowerCase();
    const primaryRole = getPrimaryRole(user, userRoles);

    // Get filters from URL
    const testSectionId = searchParams.get('test_section_id');
    const moduleId = searchParams.get('module_id');

    const { data: groups, isLoading, isError } = useGetQuestionGroupsQuery({
        test_section_id: testSectionId,
    });
    
    const [deleteGroup, { isLoading: isDeleting }] = useDeleteQuestionGroupMutation();

    const handleDelete = async (id) => {
        if (window.confirm('Are you sure you want to delete this question group?')) {
            try {
                await deleteGroup(id).unwrap();
            } catch (err) {
                alert('Failed to delete the question group');
            }
        }
    };

    React.useEffect(() => {
        if (primaryRole && primaryRole !== resolvedRole) {
            router.replace(getRoleHomePath(primaryRole));
        }
    }, [primaryRole, resolvedRole, router]);

    const columns = [
        {
            header: "Group Info",
            key: "title",
            render: (item) => (
                <div className="flex items-center gap-3">
                    <div className="p-2 bg-blue-50 rounded-lg">
                        <Library size={16} className="text-blue-600" />
                    </div>
                    <div className="max-w-xs">
                        <p className="font-bold text-slate-700 tracking-tight truncate">
                            {item.title || "Untitled Group"}
                        </p>
                        <div className="flex items-center gap-1 text-[11px] text-slate-500 font-medium">
                            <AlignLeft size={12} />
                            <span className="truncate italic">
                                {item.instruction?.substring(0, 50)}...
                            </span>
                        </div>
                    </div>
                </div>
            ),
        },
        {
            header: "Test Section",
            key: "test_section",
            render: (item) => (
                <div className="space-y-1">
                    <div className="flex items-center gap-1.5 text-slate-700 font-semibold text-sm">
                        <Layers size={14} className="text-emerald-500" />
                        {item.test_section?.title || `ID: ${item.test_section_id}`}
                    </div>
                    {item.test_section?.module && (
                        <p className="text-[10px] text-slate-400 font-bold uppercase tracking-wider ml-5">
                            {item.test_section.module.title}
                        </p>
                    )}
                </div>
            ),
        },
        {
            header: "Type & Order",
            key: "meta",
            render: (item) => (
                <div className="flex flex-col gap-1">
                    <span className="inline-flex items-center gap-1 text-[10px] font-bold text-purple-600 bg-purple-50 px-2 py-0.5 rounded border border-purple-100 w-fit">
                        <Type size={10} /> {item.question_type?.name || 'Standard'}
                    </span>
                    <span className="inline-flex items-center gap-1 text-[10px] font-bold text-slate-600 bg-slate-50 px-2 py-0.5 rounded border border-slate-200 w-fit">
                        <Hash size={10} /> Order: {item.sort_order || 0}
                    </span>
                </div>
            ),
        },
        {
            header: "Actions",
            key: "actions",
            align: "right",
            render: (item) => (
                <div className="flex justify-end gap-1">
                    <Link href={`/${resolvedRole}/questions?module_id=${moduleId}&question_group_id=${item.id}&question_type_id=${item.question_type_id}}`}
                        className="p-2 text-emerald-500 hover:text-emerald-700 hover:bg-emerald-50 rounded-lg transition-colors inline-block"
                        title="`Manage Question Groups"
                    >
                        <Layers size={18} />
                    </Link>
                    <Link
                        href={`/${resolvedRole}/question-groups/edit/${item.id}`}
                        className="p-2 text-blue-500 hover:text-blue-700 hover:bg-blue-50 rounded-lg transition-colors"
                        title="Edit Group"
                    >
                        <Edit2 size={18} />
                    </Link>
                    <button
                        onClick={() => handleDelete(item.id)}
                        disabled={isDeleting}
                        className="p-2 text-red-600 hover:text-red-900 hover:bg-red-50 rounded-lg transition-colors disabled:opacity-50"
                        title="Delete Group"
                    >
                        <Trash2 size={18} />
                    </button>
                </div>
            ),
        },
    ];

    if (isLoading) return <div className="flex h-[400px] items-center justify-center"><Loader2 className="animate-spin text-blue-600" /></div>;
    if (isError) return <div className="p-6 text-red-500 font-medium">Error loading question groups. Please try again.</div>;

    return (
        <div className="p-6 max-w-[1600px] mx-auto space-y-6">
            <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
                <div>
                    <h1 className="text-2xl font-black text-slate-800 flex items-center gap-2">
                        <Library className="text-blue-600" size={28} />
                        Question Groups
                    </h1>
                    <p className="text-sm text-slate-500 font-medium">Organize questions into groups with specific instructions.</p>
                </div>
                <Link
                    href={`/${resolvedRole}/question-groups/create${testSectionId ? `?test_section_id=${testSectionId}&module_id=${moduleId}` : ''}`}
                    className="flex items-center justify-center gap-2 px-5 py-2.5 bg-blue-600 text-white rounded-xl font-bold hover:bg-blue-700 shadow-lg transition-all active:scale-95"
                >
                    <Plus size={20} />
                    Create Group
                </Link>
            </div>

            <DynamicDataTable
                data={groups || []}
                columns={columns}
                perPage={10}
            />
        </div>
    );
}
