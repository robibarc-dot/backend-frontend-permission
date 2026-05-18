'use client';

import React from 'react';
import Link from 'next/link';
import { useRouter, useParams } from 'next/navigation';
import { useSelector } from 'react-redux';
import {
    useGetQuestionTypesQuery,
    useDeleteQuestionTypeMutation,
} from '@/redux/features/common/backend/questionTypeApi';
import DynamicDataTable from '../../../components/dashboard/common/DynamicDataTable';
import { Library, Loader2, Plus, Edit2, Trash2, Type, Layers } from 'lucide-react';
import { getPrimaryRole, getRoleHomePath } from '../../../../lib/auth';

export default function QuestionTypesListPage() {
    const router = useRouter();
    const { user, roles: userRoles } = useSelector((state) => state.auth);
    const { role } = useParams();
    const resolvedRole = role?.toLowerCase();
    const primaryRole = getPrimaryRole(user, userRoles);

    const { data: questionTypes, isLoading, isError } = useGetQuestionTypesQuery();
    const [deleteQuestionType, { isLoading: isDeleting }] = useDeleteQuestionTypeMutation();

    const handleDelete = async (id) => {
        if (window.confirm('Are you sure you want to delete this question type?')) {
            try {
                await deleteQuestionType(id).unwrap();
            } catch (err) {
                alert('Failed to delete the question type');
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
            header: 'Question Type',
            key: 'name',
            render: (item) => (
                <div className="flex items-center gap-3">
                    <div className="p-2 bg-blue-50 rounded-lg">
                        <Type size={16} className="text-blue-600" />
                    </div>
                    <p className="font-bold text-slate-700 tracking-tight truncate">
                        {item.name}
                    </p>
                </div>
            ),
        },
        {
            header: 'Module',
            key: 'module',
            render: (item) => (
                <div className="space-y-1">
                    <div className="flex items-center gap-1.5 text-slate-700 font-semibold text-sm">
                        <Layers size={14} className="text-emerald-500" />
                        {item.module?.title || 'N/A'}
                    </div>
                </div>
            ),
        },
        {
            header: 'Actions',
            key: 'actions',
            align: 'right',
            render: (item) => (
                <div className="flex justify-end gap-1">
                    <Link
                        href={`/${resolvedRole}/question-types/edit/${item.id}`}
                        className="p-2 text-blue-500 hover:text-blue-700 hover:bg-blue-50 rounded-lg transition-colors"
                        title="Edit Question Type"
                    >
                        <Edit2 size={18} />
                    </Link>
                    <button
                        onClick={() => handleDelete(item.id)}
                        disabled={isDeleting}
                        className="p-2 text-red-600 hover:text-red-900 hover:bg-red-50 rounded-lg transition-colors disabled:opacity-50"
                        title="Delete Question Type"
                    >
                        <Trash2 size={18} />
                    </button>
                </div>
            ),
        },
    ];

    if (isLoading)
        return (
            <div className="flex h-[400px] items-center justify-center">
                <Loader2 className="animate-spin text-blue-600" size={32} />
            </div>
        );
    if (isError)
        return (
            <div className="p-6 text-red-500 font-medium">
                Error loading question types. Please try again.
            </div>
        );

    return (
        <div className="p-6 max-w-[1600px] mx-auto space-y-6">
            <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
                <div>
                    <h1 className="text-2xl font-black text-slate-800 flex items-center gap-2">
                        <Type className="text-blue-600" size={28} />
                        Question Types
                    </h1>
                    <p className="text-sm text-slate-500 font-medium">Manage different types of questions.</p>
                </div>
                <Link
                    href={`/${resolvedRole}/question-types/create`}
                    className="flex items-center justify-center gap-2 px-5 py-2.5 bg-blue-600 text-white rounded-xl font-bold hover:bg-blue-700 shadow-lg transition-all active:scale-95"
                >
                    <Plus size={20} />
                    Create Type
                </Link>
            </div>

            <DynamicDataTable data={questionTypes || []} columns={columns} perPage={10} />
        </div>
    );
}
