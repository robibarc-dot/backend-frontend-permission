"use client";

import { useEffect, useState } from "react";
import { useRouter, useParams } from "next/navigation";
import Link from "next/link";
import { ChevronLeft, Clock, FilePenLine, Loader2, Save } from "lucide-react";
import {
    useGetPracticeTestQuery,
    useUpdatePracticeTestMutation,
} from "@/redux/features/practice-test/backend/practiceTestApi";

const initialForm = {
    title: "",
    slug: "",
    duration_mins: 60,
    category: "academic",
    type: "free",
};

function makeSlug(value) {
    return value
        .toLowerCase()
        .trim()
        .replace(/[^a-z0-9]+/g, "-")
        .replace(/^-+|-+$/g, "");
}

function getRequestMessage(requestError, fallback) {
    const validationErrors = requestError?.data?.errors;

    if (validationErrors) {
        return Object.values(validationErrors).flat().join(" ");
    }

    return requestError?.data?.message || fallback;
}

export default function EditPracticeTestPage() {
    const router = useRouter();
    const { role, id } = useParams();
    const resolvedRole = role?.toLowerCase();

    const { data: test, isLoading: fetching } = useGetPracticeTestQuery(id);
    const [updateTest, { isLoading: saving }] = useUpdatePracticeTestMutation();

    const [form, setForm] = useState(initialForm);
    const [error, setError] = useState("");
    const [success, setSuccess] = useState("");

    useEffect(() => {
        if (test) {
            setForm({
                question_type: test.question_type || "easy",
                title: test.title || "",
                slug: test.slug || "",
                duration_mins: test.duration_mins || 60,
                category: test.category || "academic",
                type: test.type || "free",
            });
        }
    }, [test]);

    function updateField(field, value) {
        setForm((current) => ({
            ...current,
            [field]: field === "duration_mins" ? Number(value) : value,
        }));
    }

    function updateTitle(value) {
        setForm((current) => ({
            ...current,
            title: value,
            slug: current.slug ? current.slug : makeSlug(value),
        }));
    }

    async function handleSubmit(event) {
        event.preventDefault();
        setError("");
        setSuccess("");

        try {
            await updateTest({
                id,
                body: {
                    ...form,
                    slug: form.slug || makeSlug(form.title),
                },
            }).unwrap();
            setSuccess("Practice test updated successfully.");
            setTimeout(() => router.push(`/${resolvedRole}/practice-tests`), 1500);
        } catch (requestError) {
            setError(getRequestMessage(requestError, "Unable to update practice test."));
        }
    }

    if (fetching) {
        return (
            <div className="flex h-[400px] flex-col items-center justify-center gap-4 text-slate-500">
                <Loader2 className="animate-spin text-blue-600" size={32} />
                <p className="font-medium">Retrieving practice test...</p>
            </div>
        );
    }

    return (
        <div className="mx-auto space-y-6">
            <div className="flex items-center justify-between">
                <Link
                    href={`/${resolvedRole}/practice-tests`}
                    className="flex items-center gap-2 text-slate-500 hover:text-slate-800 transition-colors font-medium text-sm"
                >
                    <ChevronLeft size={18} />
                    Back to Practice Tests
                </Link>
            </div>

            <form onSubmit={handleSubmit} className="space-y-6">
                <section className="rounded-[26px] bg-[linear-gradient(150deg,_#111827,_#1f2937)] p-8 text-white shadow-xl">
                    <div className="flex items-center gap-3 opacity-80">
                        <FilePenLine size={20} className="text-amber-400" />
                        <p className="text-xs uppercase tracking-[0.28em]">Assessment Update ID: {id}</p>
                    </div>
                    <h2 className="mt-4 text-3xl font-bold">Edit Practice Test</h2>
                    <p className="mt-3 text-slate-400 max-w-2xl leading-relaxed">
                        Update the test identity, availability, category, and timing details.
                    </p>
                </section>

                <div className="rounded-[26px] border border-slate-200 bg-white p-8 shadow-sm space-y-8">
                    <div className="grid gap-6 md:grid-cols-2">
                        <div>
                            <label className="mb-2 block text-sm font-semibold text-slate-700">Question Type</label>
                            <div className="grid gap-3 sm:grid-cols-3">
                                {[
                                    { value: "easy", label: "Easy" },
                                    { value: "medium", label: "Medium" },
                                    { value: "hard", label: "Hard" },
                                ].map((type) => {
                                    const isSelected = form.question_type === type.value;
                                    return (
                                        <label key={type.value} className={`flex cursor-pointer items-center justify-center rounded-2xl border py-3 transition-all duration-200 ${isSelected ? "border-blue-200 bg-blue-50/50 text-blue-700 font-bold" : "border-slate-100 bg-slate-50 text-slate-500"}`}>
                                            <input
                                                type="radio"
                                                name="question_type"
                                                className="hidden"
                                                checked={isSelected}
                                                onChange={() => updateField("question_type", type.value)}
                                            />
                                            <span className="text-sm">{type.label}</span>
                                        </label>
                                    );
                                })}
                            </div>
                        </div>
                        <div>
                            <label className="mb-2 block text-sm font-semibold text-slate-700">Test Title</label>
                            <input
                                type="text"
                                required
                                value={form.title}
                                onChange={(event) => updateTitle(event.target.value)}
                                className="w-full rounded-2xl border border-slate-200 bg-slate-50 px-4 py-3 text-slate-900 outline-none transition focus:border-blue-500 focus:ring-4 focus:ring-blue-100"
                            />
                        </div>
                        <div>
                            <label className="mb-2 block text-sm font-semibold text-slate-700">Slug</label>
                            <input
                                type="text"
                                required
                                value={form.slug}
                                onChange={(event) => updateField("slug", makeSlug(event.target.value))}
                                className="w-full rounded-2xl border border-slate-200 bg-slate-50 px-4 py-3 text-slate-900 outline-none transition focus:border-blue-500 focus:ring-4 focus:ring-blue-100"
                            />
                        </div>
                        <div>
                            <label className="mb-2 block text-sm font-semibold text-slate-700">Duration</label>
                            <div className="relative">
                                <Clock size={18} className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-400" />
                                <input
                                    type="number"
                                    min="1"
                                    required
                                    value={form.duration_mins}
                                    onChange={(event) => updateField("duration_mins", event.target.value)}
                                    className="w-full rounded-2xl border border-slate-200 bg-slate-50 py-3 pl-11 pr-4 text-slate-900 outline-none transition focus:border-blue-500 focus:ring-4 focus:ring-blue-100"
                                />
                            </div>
                        </div>
                        <div>
                            <label className="mb-2 block text-sm font-semibold text-slate-700">Category</label>
                            <select
                                required
                                value={form.category}
                                onChange={(event) => updateField("category", event.target.value)}
                                className="w-full rounded-2xl border border-slate-200 bg-slate-50 px-4 py-3 text-slate-900 outline-none transition focus:border-blue-500 focus:ring-4 focus:ring-blue-100"
                            >
                                <option value="academic">Academic</option>
                                <option value="general">General</option>
                            </select>
                        </div>
                        <div className="md:col-span-2">
                            <label className="mb-2 block text-sm font-semibold text-slate-700">Access Type</label>
                            <div className="grid gap-3 sm:grid-cols-2">
                                {["free", "paid"].map((type) => {
                                    const isSelected = form.type === type;
                                    return (
                                        <label key={type} className={`flex cursor-pointer items-start gap-3 rounded-2xl border p-4 transition-all duration-200 ${isSelected ? "border-blue-200 bg-blue-50/50" : "border-slate-100 bg-white"}`}>
                                            <input
                                                type="radio"
                                                name="type"
                                                checked={isSelected}
                                                onChange={() => updateField("type", type)}
                                                className="mt-1 h-4 w-4 text-blue-600 focus:ring-blue-500"
                                            />
                                            <div>
                                                <p className="text-sm font-bold capitalize text-slate-700">{type}</p>
                                                <p className="text-[11px] text-slate-500">{type === "free" ? "Available without payment" : "Requires paid access"}</p>
                                            </div>
                                        </label>
                                    );
                                })}
                            </div>
                        </div>
                    </div>

                    {(error || success) && (
                        <div className={`rounded-2xl border px-4 py-3 text-sm font-medium ${error ? "border-red-200 bg-red-50 text-red-700" : "border-emerald-200 bg-emerald-50 text-emerald-700"}`}>
                            {error || success}
                        </div>
                    )}

                    <button type="submit" disabled={saving} className="flex items-center gap-2 rounded-2xl bg-slate-950 px-8 py-3.5 text-sm font-bold text-white shadow-lg transition hover:-translate-y-0.5 disabled:opacity-60">
                        {saving ? <Loader2 className="animate-spin" size={18} /> : <Save size={18} />}
                        {saving ? "Updating..." : "Update Practice Test"}
                    </button>
                </div>
            </form>
        </div>
    );
}
