"use client";

import { useState, useEffect } from "react";
import { useParams, useRouter, useSearchParams } from "next/navigation";
import Link from "next/link";
import { ChevronLeft, FileText, Hash, Layers, Loader2, Save, Plus } from "lucide-react";
import { 
    useCreateTestSectionMutation 
} from "@/redux/features/common/backend/testSectionApi";
import { useGetMockTestsQuery } from "@/redux/features/mock/backend/mockTestApi";
import { useGetPracticeTestsQuery } from "@/redux/features/practice-test/backend/practiceTestApi";
import { useGetModulesQuery } from "@/redux/features/common/backend/moduleApi";

const initialForm = {
    test_type: "practice",
    test_id: "",
    title: "",
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
        test_type: form.test_type,
        test_id: Number(form.test_id),
        title: form.title.trim(),
        module_id: Number(form.module_id),
        order: Number(form.order),
    };
}

export default function CreateTestSectionPage() {
    const router = useRouter();
    const searchParams = useSearchParams();
    const { role } = useParams();
    const resolvedRole = role?.toLowerCase();

    const [createSection, { isLoading: saving }] = useCreateTestSectionMutation();
    const { data: modules = [], isLoading: loadingModules } = useGetModulesQuery();

    const [form, setForm] = useState(initialForm);
    const [error, setError] = useState("");
    const [success, setSuccess] = useState("");

    const { data: mockTests = [], isLoading: loadingMocks } = useGetMockTestsQuery(undefined, {
        skip: form.test_type !== "mock",
    });
    const { data: practiceTests = [], isLoading: loadingPractices } = useGetPracticeTestsQuery(undefined, {
        skip: form.test_type !== "practice",
    });

    const availableTests = form.test_type === "mock" ? mockTests : practiceTests;
    const isLoadingTests = form.test_type === "mock" ? loadingMocks : loadingPractices;

    // Pre-fill form from URL search parameters
    useEffect(() => {
        const queryTestType = searchParams.get("test_type");
        const queryTestId = searchParams.get("test_id");

        if (queryTestType || queryTestId) {
            setForm((prev) => ({
                ...prev,
                test_type: queryTestType || prev.test_type,
                test_id: queryTestId || prev.test_id,
            }));
        }
    }, [searchParams]);

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
            await createSection({
                ...toPayload(form),
            }).unwrap();
            setSuccess("Test section create successfully.");
            setTimeout(() => router.push(`/${resolvedRole}/test-sections/?test_type=${searchParams.get("test_type")}&test_id=${searchParams.get("test_id")}`), 1500);
        } catch (requestError) {
            setError(getRequestMessage(requestError, "Unable to create test section."));
        }
    }


    return (
        <div className="mx-auto space-y-6">
            <div className="flex items-center justify-between">
                <Link
                    href={`/${resolvedRole}/test-sections/?test_type=${searchParams.get("test_type")}&test_id=${searchParams.get("test_id")}`}
                    className="flex items-center gap-2 text-slate-500 hover:text-slate-800 transition-colors font-medium text-sm"
                >
                    <ChevronLeft size={18} />
                    Back to Test Sections
                </Link>
            </div>

            <form onSubmit={handleSubmit} className="space-y-6">
                <section className="rounded-[26px] bg-[linear-gradient(150deg,_#111827,_#1f2937)] p-8 text-white shadow-xl">
                    <div className="flex items-center gap-3 opacity-80">
                        <Plus size={20} className="text-amber-400" />
                        <p className="text-xs uppercase tracking-[0.28em]">New Section</p>
                    </div>
                    <h2 className="mt-4 text-3xl font-bold">Create Section</h2>
                    <p className="mt-3 text-slate-400 max-w-2xl leading-relaxed">
                        Define a new section for a practice or mock test.
                    </p>
                </section>

                <div className="rounded-[26px] border border-slate-200 bg-white p-8 shadow-sm space-y-8">
                    <div className="grid gap-6 md:grid-cols-2">
                        <div>
                            <label className="mb-2 block text-sm font-semibold text-slate-700">Title</label>
                            <input
                                type="text"
                                required
                                value={form.title}
                                onChange={(event) => updateField("title", event.target.value)}
                                className="w-full rounded-2xl border border-slate-200 bg-slate-50 px-4 py-3 text-slate-900 outline-none transition focus:border-blue-500 focus:ring-4 focus:ring-blue-100"
                            />
                        </div>
                        <div>
                            <label className="mb-2 block text-sm font-semibold text-slate-700">Test Type</label>
                            <select
                                required
                                value={form.test_type}
                                onChange={(event) => updateField("test_type", event.target.value)}
                                className="w-full rounded-2xl border border-slate-200 bg-slate-50 px-4 py-3 text-slate-900 outline-none transition focus:border-blue-500 focus:ring-4 focus:ring-blue-100"
                            >
                                <option value="practice">Practice</option>
                                <option value="mock">Mock</option>
                            </select>
                        </div>
                        <div>
                            <label className="mb-2 block text-sm font-semibold text-slate-700">
                                {form.test_type.charAt(0).toUpperCase() + form.test_type.slice(1)} Test
                            </label>
                            <select
                                required
                                value={form.test_id}
                                onChange={(event) => updateField("test_id", event.target.value)}
                                disabled={isLoadingTests}
                                className="w-full rounded-2xl border border-slate-200 bg-slate-50 px-4 py-3 text-slate-900 outline-none transition focus:border-blue-500 focus:ring-4 focus:ring-blue-100 disabled:opacity-50"
                            >
                                <option value="">{isLoadingTests ? "Loading tests..." : "Select a test"}</option>
                                {availableTests.map((test) => (
                                    <option key={test.id} value={test.id}>
                                        {test.title} (ID: {test.id})
                                    </option>
                                ))}
                            </select>
                        </div>
                        <div>
                            <label className="mb-2 block text-sm font-semibold text-slate-700">Module</label>
                            <div className="relative">
                                <Layers size={18} className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-400" />
                                <select
                                    required
                                    value={form.module_id}
                                    onChange={(event) => updateField("module_id", event.target.value)}
                                    disabled={loadingModules}
                                    className="w-full rounded-2xl border border-slate-200 bg-slate-50 py-3 pl-11 pr-4 text-slate-900 outline-none transition focus:border-blue-500 focus:ring-4 focus:ring-blue-100 disabled:opacity-50"
                                >
                                    <option value="">{loadingModules ? "Loading modules..." : "Select a module"}</option>
                                    {modules.map((module) => (
                                        <option key={module.id} value={module.id}>
                                            {module.title}
                                        </option>
                                    ))}
                                </select>
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
                            <FileText size={16} className="text-slate-400" />
                            <h3 className="text-sm font-semibold text-slate-700">Section Summary</h3>
                        </div>
                        <div className="flex flex-wrap gap-2">
                            <span className="px-2.5 py-1 bg-white border border-slate-200 rounded-lg text-[11px] font-medium text-slate-600">Title: {form.title || "Not set"}</span>
                            <span className="px-2.5 py-1 bg-white border border-slate-200 rounded-lg text-[11px] font-medium text-slate-600">Type: {form.test_type}</span>
                            <span className="px-2.5 py-1 bg-white border border-slate-200 rounded-lg text-[11px] font-medium text-slate-600">Test: {form.test_id || "Not set"}</span>
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
                        {saving ? "Creating..." : "Create Section"}
                    </button>
                </div>
            </form>
        </div>
    );
}