"use client";

import { useState } from "react";
import Link from "next/link";
import { useParams, useSearchParams } from "next/navigation";
import { 
    Plus, 
    Search, 
    Edit, 
    Trash2, 
    Loader2, 
    FileQuestion, 
    ChevronRight,
    AlertCircle,
    MoreHorizontal
} from "lucide-react";
import { 
    useGetQuestionsQuery, 
    useDeleteQuestionMutation 
} from "@/redux/features/common/backend/questionApi";

export default function QuestionsPage() {
    const { role } = useParams();
    const searchParams = useSearchParams();
    const resolvedRole = role?.toLowerCase();
    
    const moduleId = searchParams.get('module_id');
    const questionGroupId = searchParams.get('question_group_id');
    const questionTypeId = searchParams.get('question_type_id');

    const [searchTerm, setSearchTerm] = useState("");
    
    // RTK Query hooks
    const { data: questions, isLoading, isError, refetch } = useGetQuestionsQuery({
        search: searchTerm,
        module_id: moduleId,
        question_group_id: questionGroupId,
        question_type_id: questionTypeId
    });

    const queryString = searchParams.toString();

    const [deleteQuestion, { isLoading: isDeleting }] = useDeleteQuestionMutation();

    const handleDelete = async (id) => {
        if (window.confirm("Are you sure you want to delete this question? This action cannot be undone.")) {
            try {
                await deleteQuestion(id).unwrap();
            } catch (err) {
                alert("Failed to delete the question. Please try again.");
            }
        }
    };

    if (isError) {
        return (
            <div className="flex h-[400px] flex-col items-center justify-center gap-4 text-slate-500">
                <AlertCircle className="text-rose-500" size={40} />
                <p className="font-medium">Error loading questions.</p>
                <button 
                    onClick={() => refetch()}
                    className="text-sm text-blue-600 hover:underline font-semibold"
                >
                    Try again
                </button>
            </div>
        );
    }

    return (
        <div className="mx-auto space-y-6">
            {/* Header Section */}
            <section className="rounded-[26px] bg-[linear-gradient(150deg,_#111827,_#1f2937)] p-8 text-white shadow-xl">
                <div className="flex flex-col md:flex-row md:items-center justify-between gap-6">
                    <div>
                        <div className="flex items-center gap-3 opacity-80">
                            <FileQuestion size={20} className="text-blue-400" />
                            <p className="text-xs uppercase tracking-[0.28em]">Content Repository</p>
                        </div>
                        <h2 className="mt-4 text-3xl font-bold">Question Bank</h2>
                        <p className="mt-3 text-slate-400 max-w-2xl leading-relaxed">
                            Manage your system-wide questions, categorize them by modules, and assign types for the curriculum.
                        </p>
                    </div>
                    <div>
                        <Link
                            href={`/${resolvedRole}/questions/create${queryString ? `?${queryString}` : ""}`}
                            className="flex items-center gap-2 rounded-2xl bg-blue-600 px-6 py-3.5 text-sm font-bold text-white shadow-lg transition hover:bg-blue-700 hover:-translate-y-0.5"
                        >
                            <Plus size={18} />
                            Add New Question
                        </Link>
                    </div>
                </div>
            </section>

            {/* Main Content Card */}
            <div className="rounded-[26px] border border-slate-200 bg-white p-6 shadow-sm">
                {/* Filters/Search Bar */}
                <div className="mb-8 flex flex-col md:flex-row gap-4">
                    <div className="relative flex-1">
                        <Search size={18} className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-400" />
                        <input
                            type="text"
                            placeholder="Search questions by content..."
                            value={searchTerm}
                            onChange={(e) => setSearchTerm(e.target.value)}
                            className="w-full rounded-2xl border border-slate-200 bg-slate-50 py-3 pl-11 pr-4 text-slate-900 outline-none transition focus:border-blue-500 focus:ring-4 focus:ring-blue-100"
                        />
                    </div>
                </div>

                {/* Questions Table */}
                <div className="overflow-x-auto">
                    {isLoading ? (
                        <div className="flex h-64 flex-col items-center justify-center gap-4 text-slate-500">
                            <Loader2 className="animate-spin text-blue-600" size={32} />
                            <p className="font-medium text-sm">Loading question library...</p>
                        </div>
                    ) : questions?.length > 0 ? (
                        <table className="w-full text-left">
                            <thead>
                                <tr className="border-b border-slate-100 text-[11px] font-bold uppercase tracking-wider text-slate-400">
                                    <th className="px-4 py-4">ID</th>
                                    <th className="px-4 py-4">Question Details</th>
                                    <th className="px-4 py-4">Type</th>
                                    <th className="px-4 py-4">Module</th>
                                    <th className="px-4 py-4 text-right">Actions</th>
                                </tr>
                            </thead>
                            <tbody className="divide-y divide-slate-50">
                                {questions.map((question) => (
                                    <tr key={question.id} className="group hover:bg-slate-50/50 transition-colors">
                                        <td className="px-4 py-5 text-sm font-mono text-slate-400">#{question.id}</td>
                                        <td className="px-4 py-5">
                                            <div className="max-w-md">
                                                <p className="text-sm font-semibold text-slate-700 line-clamp-1">
                                                    {question.title || "Untitled Question"}
                                                </p>
                                                <p className="mt-1 text-xs text-slate-500 line-clamp-1">
                                                    {question.content || "No content available..."}
                                                </p>
                                            </div>
                                        </td>
                                        <td className="px-4 py-5">
                                            <span className="inline-flex rounded-lg bg-blue-50 px-2.5 py-1 text-[11px] font-bold uppercase tracking-wide text-blue-700">
                                                {question.type?.name || "Standard"}
                                            </span>
                                        </td>
                                        <td className="px-4 py-5">
                                            <div className="flex items-center gap-2 text-sm text-slate-600">
                                                <span className="h-1.5 w-1.5 rounded-full bg-slate-300"></span>
                                                {question.module?.name || "Unassigned"}
                                            </div>
                                        </td>
                                        <td className="px-4 py-5">
                                            <div className="flex items-center justify-end gap-2">
                                                <Link
                                                    href={`/${resolvedRole}/questions/edit/${question.id}${queryString ? `?${queryString}` : ""}`}
                                                    className="inline-flex h-9 w-9 items-center justify-center rounded-xl border border-slate-200 bg-white text-slate-600 transition hover:border-blue-200 hover:text-blue-600 hover:shadow-sm"
                                                >
                                                    <Edit size={16} />
                                                </Link>
                                                <button
                                                    onClick={() => handleDelete(question.id)}
                                                    disabled={isDeleting}
                                                    className="inline-flex h-9 w-9 items-center justify-center rounded-xl border border-slate-200 bg-white text-rose-500 transition hover:border-rose-200 hover:bg-rose-50 hover:shadow-sm disabled:opacity-50"
                                                >
                                                    <Trash2 size={16} />
                                                </button>
                                            </div>
                                        </td>
                                    </tr>
                                ))}
                            </tbody>
                        </table>
                    ) : (
                        <div className="flex flex-col items-center justify-center py-20 text-center">
                            <div className="flex h-16 w-16 items-center justify-center rounded-2xl bg-slate-50 text-slate-300">
                                <FileQuestion size={32} />
                            </div>
                            <h3 className="mt-4 text-lg font-bold text-slate-900">No questions found</h3>
                            <p className="mt-2 text-sm text-slate-500 max-w-xs">
                                We couldn't find any questions matching your criteria. Try adjusting your search or add a new one.
                            </p>
                            <Link
                                href={`/${resolvedRole}/questions/create`}
                                className="mt-6 text-sm font-bold text-blue-600 hover:text-blue-700"
                            >
                                Create your first question
                            </Link>
                        </div>
                    )}
                </div>
            </div>
        </div>
    );
}
