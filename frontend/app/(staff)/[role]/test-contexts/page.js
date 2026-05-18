'use client';

import React from 'react';
import Link from 'next/link';
import { useRouter, useParams, useSearchParams } from 'next/navigation';
import { useSelector } from "react-redux";
import { 
    useGetTestContextsQuery, 
    useDeleteTestContextMutation 
} from '@/redux/features/common/backend/testContextApi';
import DynamicDataTable from "../../../components/dashboard/common/DynamicDataTable";
import { 
    FileText, 
    Layers, 
    Loader2, 
    Plus, 
    Edit2, 
    Trash2, 
    ChevronLeft,
    Image as ImageIcon,
    Volume2,
    AlignLeft
} from "lucide-react";
import { getPrimaryRole, getRoleHomePath } from "../../../../lib/auth";

export default function TestContextsListPage() {
    const router = useRouter();
    const searchParams = useSearchParams();
    const { user, roles: userRoles } = useSelector((state) => state.auth);
    const { role } = useParams();
    const resolvedRole = role?.toLowerCase();
    const primaryRole = getPrimaryRole(user, userRoles);

    // Get filters from URL if coming from a specific section
    const testSectionId = searchParams.get('test_section_id');
    const testId = searchParams.get('test_id');

    const { data: contexts, isLoading, isError } = useGetTestContextsQuery({
        test_section_id: testSectionId,
        test_id: testId
    });
    const [deleteContext, { isLoading: isDeleting }] = useDeleteTestContextMutation();

    const handleDelete = async (id) => {
        if (window.confirm('Are you sure you want to delete this test context?')) {
            try {
                await deleteContext(id).unwrap();
            } catch (err) {
                alert('Failed to delete the context');
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
            header: "Test Section",
            key: "test_section",
            render: (item) => (
                <div className="flex items-center gap-3">
                    <div className="p-2 bg-emerald-50 rounded-lg">
                        <Layers size={16} className="text-emerald-600" />
                    </div>
                    <div>
                        <p className="font-bold text-slate-700 tracking-tight">
                            {item.test_section?.title || `Section ID: ${item.test_section_id}`}
                        </p>
                        {item.test_section?.module && (
                            <p className="text-[11px] text-slate-500 font-medium uppercase">
                                {item.test_section.module.title}
                            </p>
                        )}
                    </div>
                </div>
            ),
        },
        {
            header: "Content Preview",
            key: "content",
            render: (item) => (
                <div className="flex flex-col gap-1 max-w-xs">
                    {item.passage_text && (
                        <div className="flex items-center gap-1.5 text-slate-600">
                            <AlignLeft size={14} className="shrink-0" />
                            <span className="text-xs truncate italic">"{item.passage_text.substring(0, 40)}..."</span>
                        </div>
                    )}
                    <div className="flex gap-2">
                        {item.image && (
                            <span className="flex items-center gap-1 text-[10px] font-bold text-blue-600 bg-blue-50 px-2 py-0.5 rounded border border-blue-100">
                                <ImageIcon size={10} /> IMAGE
                            </span>
                        )}
                        {item.audio && (
                            <span className="flex items-center gap-1 text-[10px] font-bold text-purple-600 bg-purple-50 px-2 py-0.5 rounded border border-purple-100">
                                <Volume2 size={10} /> AUDIO
                            </span>
                        )}
                    </div>
                </div>
            ),
        },
        {
            header: "Actions",
            key: "actions",
            align: "right",
            render: (item) => (
                <div className="flex justify-end gap-1">
                    <Link
                        href={`/${resolvedRole}/test-contexts/edit/${item.id}`}
                        className="p-2 text-blue-500 hover:text-blue-700 hover:bg-blue-50 rounded-lg transition-colors"
                        title="Edit Context"
                    >
                        <Edit2 size={18} />
                    </Link>
                    <button
                        onClick={() => handleDelete(item.id)}
                        disabled={isDeleting}
                        className="p-2 text-red-600 hover:text-red-900 hover:bg-red-50 rounded-lg transition-colors disabled:opacity-50"
                        title="Delete Context"
                    >
                        <Trash2 size={18} />
                    </button>
                </div>
            ),
        },
    ];

    if (isLoading) return <div className="flex h-[400px] items-center justify-center"><Loader2 className="animate-spin text-blue-600" /></div>;
    if (isError) return <div className="p-6 text-red-500">Error loading test contexts.</div>;

    return (
        <div className="p-6 max-w-[1600px] mx-auto space-y-6">
            <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
                <div>
                    <h1 className="text-2xl font-black text-slate-800 flex items-center gap-2">
                        <FileText className="text-blue-600" size={28} />
                        Test Contexts
                    </h1>
                    <p className="text-sm text-slate-500 font-medium">Manage passages, images, and audio materials for test sections.</p>
                </div>
                <Link
                    href={`/${resolvedRole}/test-contexts/create${testSectionId ? `?test_section_id=${testSectionId}` : ''}`}
                    className="flex items-center justify-center gap-2 px-5 py-2.5 bg-blue-600 text-white rounded-xl font-bold hover:bg-blue-700 shadow-lg transition-all active:scale-95"
                >
                    <Plus size={20} />
                    Create Context
                </Link>
            </div>

            <DynamicDataTable
                data={contexts || []}
                columns={columns}
                perPage={10}
            />
        </div>
    );
}
