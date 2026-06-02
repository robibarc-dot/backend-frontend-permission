'use client';

import { useEffect, useState, useMemo } from 'react';
import { useParams, useRouter, useSearchParams } from 'next/navigation';
import Link from 'next/link';
import { useSelector } from 'react-redux';
import {
    ChevronLeft,
    Library,
    Loader2,
    Save,
    Layers,
    Type,
    Hash,
    AlignLeft,
} from 'lucide-react';
import {
    useGetQuestionGroupQuery,
    useUpdateQuestionGroupMutation,
} from '@/redux/features/common/backend/questionGroupApi';
import { useGetTestSectionsQuery } from '@/redux/features/common/backend/testSectionApi';
import { useGetQuestionTypesQuery } from '@/redux/features/common/backend/questionTypeApi';
import { getPrimaryRole, getRoleHomePath } from '@/lib/auth';

// Helper function to extract error messages from RTK Query errors
function getRequestMessage(requestError, fallback) {
    const validationErrors = requestError?.data?.errors;

    if (validationErrors) {
        return Object.values(validationErrors).flat().join(' ');
    }

    return requestError?.data?.message || fallback;
}

function toPayload(form) {
    return {
        title: form.title,
        instruction: form.instruction,
        test_section_id: Number(form.test_section_id),
        question_type_id: Number(form.question_type_id),
        sort_order: Number(form.sort_order),
    };
}

const initialForm = {
    test_section_id: '',
    question_type_id: '',
    title: '',
    instruction: '',
    sort_order: 0,
};

export default function EditQuestionGroupPage() {
    const router = useRouter();
    const { role, id } = useParams();
    const searchParams = useSearchParams();
    const moduleId = searchParams.get('module_id');
    const { data: questionTypes, isLoading: isLoadingQuestionTypes } = useGetQuestionTypesQuery();

    const { user, roles: userRoles } = useSelector((state) => state.auth);
    const resolvedRole = role?.toLowerCase();
    const primaryRole = getPrimaryRole(user, userRoles);

    const filteredQuestionTypes = useMemo(() => {
        if (!moduleId || !questionTypes) return questionTypes;
        return questionTypes.filter(type => String(type.module_id) === String(moduleId));
    }, [questionTypes, moduleId]);

    const [form, setForm] = useState(initialForm);
    const [error, setError] = useState('');
    const [success, setSuccess] = useState('');

    const { data: questionGroup, isLoading: fetchingGroup, isError: isErrorFetchingGroup } = useGetQuestionGroupQuery(id);
    const [updateQuestionGroup, { isLoading: isUpdating }] = useUpdateQuestionGroupMutation();
    const { data: testSections, isLoading: isLoadingTestSections, isError: isErrorTestSections } = useGetTestSectionsQuery();

    // Populate form when questionGroup data is fetched
    useEffect(() => {
        if (questionGroup) {
            setForm({
                test_section_id: questionGroup.test_section_id || '',
                question_type_id: questionGroup.question_type_id || '',
                title: questionGroup.title || '',
                instruction: questionGroup.instruction || '',
                sort_order: questionGroup.sort_order || 0,
            });
        }
    }, [questionGroup]);

    // Role-based redirection
    useEffect(() => {
        if (primaryRole && primaryRole !== resolvedRole) {
            router.replace(getRoleHomePath(primaryRole));
        }
    }, [primaryRole, resolvedRole, router]);

    function updateField(field, value) {
        setForm((current) => ({
            ...current,
            [field]: value,
        }));
    }

    async function handleSubmit(event) {
        event.preventDefault();
        setError('');
        setSuccess('');

        try {
            await updateQuestionGroup({ 
                id, 
                body: toPayload(form) 
            }).unwrap();
            setSuccess('Question group updated successfully.');
            setTimeout(() => router.push(`/${resolvedRole}/question-groups`), 1500);
        } catch (requestError) {
            setError(getRequestMessage(requestError, 'Unable to update question group.'));
        }
    }

    if (fetchingGroup || isLoadingTestSections || isLoadingQuestionTypes) {
        return (
            <div className="flex h-[400px] items-center justify-center">
                <Loader2 className="animate-spin text-blue-600" size={32} />
            </div>
        );
    }

    if (isErrorFetchingGroup) {
        return <div className="p-6 text-red-500 font-medium">Error loading question group.</div>;
    }

    if (isErrorTestSections) {
        return <div className="p-6 text-red-500 font-medium">Error loading test sections.</div>;
    }

    return (
        <div className="mx-auto space-y-6 p-6 max-w-[1000px]">
            <div className="flex items-center justify-between">
                <Link
                    href={`/${resolvedRole}/question-groups`}
                    className="flex items-center gap-2 text-slate-500 hover:text-slate-800 transition-colors font-medium text-sm"
                >
                    <ChevronLeft size={18} />
                    Back to Question Groups
                </Link>
            </div>

            <form onSubmit={handleSubmit} className="space-y-6">
                <section className="rounded-[26px] bg-[linear-gradient(150deg,_#111827,_#1f2937)] p-8 text-white shadow-xl">
                    <div className="flex items-center gap-3 opacity-80">
                        <Library size={20} className="text-amber-400" />
                        <p className="text-xs uppercase tracking-[0.28em]">Question Group ID: {id}</p>
                    </div>
                    <h2 className="mt-4 text-3xl font-bold">Edit Question Group</h2>
                    <p className="mt-3 text-slate-400 max-w-2xl leading-relaxed">
                        Modify the details of this question group.
                    </p>
                </section>

                <div className="rounded-[26px] border border-slate-200 bg-white p-8 shadow-sm space-y-8">
                    <div className="grid gap-6 md:grid-cols-2">
                        <div>
                            <label htmlFor="test_section_id" className="mb-2 block text-sm font-semibold text-slate-700">
                                Test Section <span className="text-red-500">*</span>
                            </label>
                            <div className="relative">
                                <Layers size={18} className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-400" />
                                <select
                                    id="test_section_id"
                                    required
                                    value={form.test_section_id}
                                    onChange={(event) => updateField('test_section_id', event.target.value)}
                                    className="w-full rounded-2xl border border-slate-200 bg-slate-50 py-3 pl-11 pr-4 text-slate-900 outline-none transition focus:border-blue-500 focus:ring-4 focus:ring-blue-100 appearance-none"
                                >
                                    <option value="">Select a Test Section</option>
                                    {testSections?.map((section) => (
                                        <option key={section.id} value={section.id}>
                                            {section.title} ({section.module?.title})
                                        </option>
                                    ))}
                                </select>
                            </div>
                        </div>
                        <div>
                            <label htmlFor="question_type_id" className="mb-2 block text-sm font-semibold text-slate-700">
                                Question Type <span className="text-red-500">*</span>
                            </label>
                            <div className="relative">
                                <Type size={18} className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-400" />
                                <select
                                    id="question_type_id"
                                    required
                                    value={form.question_type_id}
                                    onChange={(event) => updateField('question_type_id', event.target.value)}
                                    className="w-full rounded-2xl border border-slate-200 bg-slate-50 py-3 pl-11 pr-4 text-slate-900 outline-none transition focus:border-blue-500 focus:ring-4 focus:ring-blue-100 appearance-none"
                                >
                                    <option value="">Select a Question Type</option>
                                    {filteredQuestionTypes?.map((type) => (
                                        <option key={type.id} value={type.id}>
                                            {type.name}
                                        </option>
                                    ))}
                                </select>
                            </div>
                        </div>
                    </div>

                    <div>
                        <label htmlFor="title" className="mb-2 block text-sm font-semibold text-slate-700">
                            Title (Optional)
                        </label>
                        <input
                            type="text"
                            id="title"
                            value={form.title}
                            onChange={(event) => updateField('title', event.target.value)}
                            className="w-full rounded-2xl border border-slate-200 bg-slate-50 px-4 py-3 text-slate-900 outline-none transition focus:border-blue-500 focus:ring-4 focus:ring-blue-100"
                            maxLength={255}
                        />
                    </div>

                    <div>
                        <label htmlFor="instruction" className="mb-2 block text-sm font-semibold text-slate-700">
                            Instruction <span className="text-red-500">*</span>
                        </label>
                        <textarea
                            id="instruction"
                            required
                            value={form.instruction}
                            onChange={(event) => updateField('instruction', event.target.value)}
                            rows={4}
                            className="w-full rounded-2xl border border-slate-200 bg-slate-50 px-4 py-3 text-slate-900 outline-none transition focus:border-blue-500 focus:ring-4 focus:ring-blue-100"
                        ></textarea>
                    </div>

                    <div>
                        <label htmlFor="sort_order" className="mb-2 block text-sm font-semibold text-slate-700">
                            Sort Order
                        </label>
                        <div className="relative">
                            <Hash size={18} className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-400" />
                            <input
                                type="number"
                                id="sort_order"
                                value={form.sort_order}
                                onChange={(event) => updateField('sort_order', event.target.value)}
                                className="w-full rounded-2xl border border-slate-200 bg-slate-50 py-3 pl-11 pr-4 text-slate-900 outline-none transition focus:border-blue-500 focus:ring-4 focus:ring-blue-100"
                                min="0"
                            />
                        </div>
                    </div>

                    {(error || success) && (
                        <div
                            className={`rounded-2xl border px-4 py-3 text-sm font-medium ${
                                error ? 'border-red-200 bg-red-50 text-red-700' : 'border-emerald-200 bg-emerald-50 text-emerald-700'
                            }`}
                        >
                            {error || success}
                        </div>
                    )}

                    <button
                        type="submit"
                        disabled={isUpdating}
                        className="flex items-center gap-2 rounded-2xl bg-slate-950 px-8 py-3.5 text-sm font-bold text-white shadow-lg transition hover:-translate-y-0.5 disabled:opacity-60"
                    >
                        {isUpdating ? <Loader2 className="animate-spin" size={18} /> : <Save size={18} />}
                        {isUpdating ? 'Updating...' : 'Update Question Group'}
                    </button>
                </div>
            </form>
        </div>
    );
}
