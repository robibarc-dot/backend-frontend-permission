"use client";

import { useState, useEffect } from "react";
import { useParams, useRouter } from "next/navigation";
import Link from "next/link";
import { ChevronLeft, Type, Loader2, Save, Layers, Info, FileText } from "lucide-react";
import { useCreateQuestionTypeMutation } from "@/redux/features/common/backend/questionTypeApi";
import { useGetModulesQuery } from "@/redux/features/common/backend/moduleApi";

const initialForm = {
    name: "",
    slug: "",
    module_id: "",
    upload_hints: "",
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
        name: form.name,
        slug: form.slug,
        module_id: Number(form.module_id),
        upload_hints: form.upload_hints,
    };
}

export default function CreateQuestionTypePage() {
    const router = useRouter();
    const { role } = useParams();
    const resolvedRole = role?.toLowerCase();

    const [createQuestionType, { isLoading: saving }] = useCreateQuestionTypeMutation();
    const { data: modules, isLoading: loadingModules } = useGetModulesQuery();

    const [form, setForm] = useState(initialForm);
    const [error, setError] = useState("");
    const [success, setSuccess] = useState("");

    // Auto-generate slug from name
    useEffect(() => {
        if (form.name) {
            const generatedSlug = form.name
                .toLowerCase()
                .trim()
                .replace(/[^\w\s-]/g, '')
                .replace(/[\s_-]+/g, '-')
                .replace(/^-+|-+$/g, '');
            updateField("slug", generatedSlug);
        }
    }, [form.name]);

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
            await createQuestionType(toPayload(form)).unwrap();
            setSuccess("Question type created successfully.");
            setTimeout(() => router.push(`/${resolvedRole}/question-types`), 1500);
        } catch (requestError) {
            setError(getRequestMessage(requestError, "Unable to create question type."));
        }
    }

    if (loadingModules) {
        return (
            <div className="flex h-[400px] items-center justify-center">
                <Loader2 className="animate-spin text-blue-600" size={32} />
            </div>
        );
    }

    return (
        <div className="mx-auto space-y-6">
            <div className="flex items-center justify-between">
                <Link
                    href={`/${resolvedRole}/question-types`}
                    className="flex items-center gap-2 text-slate-500 hover:text-slate-800 transition-colors font-medium text-sm"
                >
                    <ChevronLeft size={18} />
                    Back to Question Types
                </Link>
            </div>

            <form onSubmit={handleSubmit} className="space-y-6">
                <section className="rounded-[26px] bg-[linear-gradient(150deg,_#111827,_#1f2937)] p-8 text-white shadow-xl">
                    <div className="flex items-center gap-3 opacity-80">
                        <Type size={20} className="text-blue-400" />
                        <p className="text-xs uppercase tracking-[0.28em]">New Question Type</p>
                    </div>
                    <h2 className="mt-4 text-3xl font-bold">Create Question Type</h2>
                    <p className="mt-3 text-slate-400 max-w-2xl leading-relaxed">
                        Define a new question type with its name and associated module.
                    </p>
                </section>

                <div className="rounded-[26px] border border-slate-200 bg-white p-8 shadow-sm space-y-8">
                    <div className="grid gap-6 md:grid-cols-2">
                        <div>
                            <label htmlFor="name" className="mb-2 block text-sm font-semibold text-slate-700">Name</label>
                            <input
                                type="text"
                                id="name"
                                required
                                value={form.name}
                                onChange={(event) => updateField("name", event.target.value)}
                                className="w-full rounded-2xl border border-slate-200 bg-slate-50 px-4 py-3 text-slate-900 outline-none transition focus:border-blue-500 focus:ring-4 focus:ring-blue-100"
                            />
                        </div>
                        <div>
                            <label htmlFor="module_id" className="mb-2 block text-sm font-semibold text-slate-700">Module</label>
                            <div className="relative">
                                <Layers size={18} className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-400" />
                                <select
                                    id="module_id"
                                    required
                                    value={form.module_id}
                                    onChange={(event) => updateField("module_id", event.target.value)}
                                    className="w-full rounded-2xl border border-slate-200 bg-slate-50 py-3 pl-11 pr-4 text-slate-900 outline-none transition focus:border-blue-500 focus:ring-4 focus:ring-blue-100 appearance-none"
                                >
                                    <option value="">Select Module</option>
                                    {modules?.map((module) => (
                                        <option key={module.id} value={module.id}>
                                            {module.title}
                                        </option>
                                    ))}
                                </select>
                            </div>
                        </div>
                        <div>
                            <label htmlFor="slug" className="mb-2 block text-sm font-semibold text-slate-700 flex items-center gap-2">
                                Slug
                                <Info size={14} className="text-slate-400" title="URL-friendly version of the name" />
                            </label>
                            <input
                                type="text"
                                id="slug"
                                required
                                value={form.slug}
                                onChange={(event) => updateField("slug", event.target.value)}
                                className="w-full rounded-2xl border border-slate-200 bg-slate-50 px-4 py-3 text-slate-900 outline-none transition focus:border-blue-500 focus:ring-4 focus:ring-blue-100"
                            />
                        </div>
                    </div>

                    <div>
                        <label htmlFor="upload_hints" className="mb-2 block text-sm font-semibold text-slate-700">Upload Hints</label>
                        <textarea
                            id="upload_hints"
                            rows={4}
                            value={form.upload_hints}
                            onChange={(event) => updateField("upload_hints", event.target.value)}
                            placeholder="Provide instructions for uploading questions of this type..."
                            className="w-full rounded-2xl border border-slate-200 bg-slate-50 px-4 py-3 text-slate-900 outline-none transition focus:border-blue-500 focus:ring-4 focus:ring-blue-100 resize-none"
                        />
                    </div>

                    {(error || success) && (
                        <div className={`rounded-2xl border px-4 py-3 text-sm font-medium ${error ? "border-red-200 bg-red-50 text-red-700" : "border-emerald-200 bg-emerald-50 text-emerald-700"}`}>
                            {error || success}
                        </div>
                    )}

                    <button type="submit" disabled={saving} className="flex items-center gap-2 rounded-2xl bg-slate-950 px-8 py-3.5 text-sm font-bold text-white shadow-lg transition hover:-translate-y-0.5 disabled:opacity-60">
                        {saving ? <Loader2 className="animate-spin" size={18} /> : <Save size={18} />}
                        {saving ? "Creating..." : "Create Question Type"}
                    </button>
                </div>
            </form>
        </div>
    );
}
