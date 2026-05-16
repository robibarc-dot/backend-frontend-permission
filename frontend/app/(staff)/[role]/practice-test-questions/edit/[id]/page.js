"use client";

import { useEffect, useState } from "react";
import { useParams, useRouter } from "next/navigation";
import Link from "next/link";
import { ChevronLeft, FileQuestion, Hash, Layers, Loader2, Save } from "lucide-react";
import {
    useGetMockTestQuestionQuery,
    useUpdateMockTestQuestionMutation,
} from "@/redux/features/mock/backend/mockTestQuestionApi";

const initialForm = {
    mock_test_id: "",
    question_id: "",
    module_id: "",
    order: 1,
};

function getRequestMessage(requestError, fallback) {
    const validationErrors = requestError?.data?.errors;

    if (validationErrors) {
        return Object.values(validationErrors).flat().join(" ");
    }

    return requestError?.data?.message || fallback;
}

function toPayload(form) {
    return {
        mock_test_id: Number(form.mock_test_id),
        question_id: Number(form.question_id),
        module_id: Number(form.module_id),
        order: Number(form.order),
    };
}

export default function EditPracticeTestQuestionPage() {
    const router = useRouter();
    const { role, id } = useParams();
    const resolvedRole = role?.toLowerCase();

    const { data: assignment, isLoading: fetching } = useGetMockTestQuestionQuery(id);
    const [updateAssignment, { isLoading: saving }] = useUpdateMockTestQuestionMutation();

    const [form, setForm] = useState(initialForm);
    const [error, setError] = useState("");
    const [success, setSuccess] = useState("");

    useEffect(() => {
        if (assignment) {
            setForm({
                mock_test_id: assignment.mock_test_id || "",
                question_id: assignment.question_id || "",
                module_id: assignment.module_id || "",
                order: assignment.order || 1,
            });
        }
    }, [assignment]);

    function updateField(field, value) {
        setForm((current) => ({
            ...current,
            [field]: value,
        }));
    }

    async function handleSubmit(event) {
        event.preventDefault();
        setError("");
        setSuccess("");

        try {
            await updateAssignment({
                id,
                body: toPayload(form),
            }).unwrap();
            setSuccess("Question assignment updated successfully.");
            setTimeout(() => router.push(`/${resolvedRole}/practice-test-questions`), 1500);
        } catch (requestError) {
            setError(getRequestMessage(requestError, "Unable to update question assignment."));
        }
    }

    if (fetching) {
        return (
            <div className="flex h-[400px] flex-col items-center justify-center gap-4 text-slate-500">
                <Loader2 className="animate-spin text-blue-600" size={32} />
                <p className="font-medium">Retrieving question assignment...</p>
            </div>
        );
    }

    return (
        <div className="mx-auto space-y-6">
            <div className="flex items-center justify-between">
                <Link
                    href={`/${resolvedRole}/practice-test-questions`}
                    className="flex items-center gap-2 text-slate-500 hover:text-slate-800 transition-colors font-medium text-sm"
                >
                    <ChevronLeft size={18} />
                    Back to Question Assignments
                </Link>
            </div>

            <form onSubmit={handleSubmit} className="space-y-6">
                <section className="rounded-[26px] bg-[linear-gradient(150deg,_#111827,_#1f2937)] p-8 text-white shadow-xl">
                    <div className="flex items-center gap-3 opacity-80">
                        <FileQuestion size={20} className="text-amber-400" />
                        <p className="text-xs uppercase tracking-[0.28em]">Mock Question Assignment ID: {id}</p>
                    </div>
                    <h2 className="mt-4 text-3xl font-bold">Edit Assignment</h2>
                    <p className="mt-3 text-slate-400 max-w-2xl leading-relaxed">
                        Update the mock test, question, module, or order for this assignment.
                    </p>
                </section>

                <div className="rounded-[26px] border border-slate-200 bg-white p-8 shadow-sm space-y-8">
                    <div className="grid gap-6 md:grid-cols-2">
                        <div>
                            <label className="mb-2 block text-sm font-semibold text-slate-700">Mock Test ID</label>
                            <input
                                type="number"
                                min="1"
                                required
                                value={form.mock_test_id}
                                onChange={(event) => updateField("mock_test_id", event.target.value)}
                                className="w-full rounded-2xl border border-slate-200 bg-slate-50 px-4 py-3 text-slate-900 outline-none transition focus:border-blue-500 focus:ring-4 focus:ring-blue-100"
                            />
                        </div>
                        <div>
                            <label className="mb-2 block text-sm font-semibold text-slate-700">Question ID</label>
                            <input
                                type="number"
                                min="1"
                                required
                                value={form.question_id}
                                onChange={(event) => updateField("question_id", event.target.value)}
                                className="w-full rounded-2xl border border-slate-200 bg-slate-50 px-4 py-3 text-slate-900 outline-none transition focus:border-blue-500 focus:ring-4 focus:ring-blue-100"
                            />
                        </div>
                        <div>
                            <label className="mb-2 block text-sm font-semibold text-slate-700">Module ID</label>
                            <div className="relative">
                                <Layers size={18} className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-400" />
                                <input
                                    type="number"
                                    min="1"
                                    required
                                    value={form.module_id}
                                    onChange={(event) => updateField("module_id", event.target.value)}
                                    className="w-full rounded-2xl border border-slate-200 bg-slate-50 py-3 pl-11 pr-4 text-slate-900 outline-none transition focus:border-blue-500 focus:ring-4 focus:ring-blue-100"
                                />
                            </div>
                        </div>
                        <div>
                            <label className="mb-2 block text-sm font-semibold text-slate-700">Order</label>
                            <div className="relative">
                                <Hash size={18} className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-400" />
                                <input
                                    type="number"
                                    min="1"
                                    required
                                    value={form.order}
                                    onChange={(event) => updateField("order", event.target.value)}
                                    className="w-full rounded-2xl border border-slate-200 bg-slate-50 py-3 pl-11 pr-4 text-slate-900 outline-none transition focus:border-blue-500 focus:ring-4 focus:ring-blue-100"
                                />
                            </div>
                        </div>
                    </div>

                    <div className="rounded-2xl bg-slate-50 p-6 border border-slate-100">
                        <div className="flex items-center gap-2 mb-4">
                            <FileQuestion size={16} className="text-slate-400" />
                            <h3 className="text-sm font-semibold text-slate-700">Assignment Summary</h3>
                        </div>
                        <div className="flex flex-wrap gap-2">
                            <span className="px-2.5 py-1 bg-white border border-slate-200 rounded-lg text-[11px] font-medium text-slate-600">Mock Test: {form.mock_test_id || "Not set"}</span>
                            <span className="px-2.5 py-1 bg-white border border-slate-200 rounded-lg text-[11px] font-medium text-slate-600">Question: {form.question_id || "Not set"}</span>
                            <span className="px-2.5 py-1 bg-white border border-slate-200 rounded-lg text-[11px] font-medium text-slate-600">Module: {form.module_id || "Not set"}</span>
                            <span className="px-2.5 py-1 bg-white border border-slate-200 rounded-lg text-[11px] font-medium text-slate-600">Order: {form.order || 1}</span>
                        </div>
                    </div>

                    {(error || success) && (
                        <div className={`rounded-2xl border px-4 py-3 text-sm font-medium ${error ? "border-red-200 bg-red-50 text-red-700" : "border-emerald-200 bg-emerald-50 text-emerald-700"}`}>
                            {error || success}
                        </div>
                    )}

                    <button type="submit" disabled={saving} className="flex items-center gap-2 rounded-2xl bg-slate-950 px-8 py-3.5 text-sm font-bold text-white shadow-lg transition hover:-translate-y-0.5 disabled:opacity-60">
                        {saving ? <Loader2 className="animate-spin" size={18} /> : <Save size={18} />}
                        {saving ? "Updating..." : "Update Assignment"}
                    </button>
                </div>
            </form>
        </div>
    );
}
