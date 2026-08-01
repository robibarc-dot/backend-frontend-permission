"use client";

import { useState } from "react";
import Link from "next/link";
import { useParams, useRouter } from "next/navigation";
import { BookPlus, ChevronLeft, Loader2, Plus, Save, Trash2 } from "lucide-react";

import { useCreateCourseMutation } from "@/redux/features/course/backend/courseApi";

const makeFeature = () => ({ icon_type: "document", feature_text: "", sort_order: 0 });
const makeStructure = () => ({ title: "", description: "", badge_icon: "", sort_order: 0 });
const makeCurriculumItem = () => ({ item_name: "", sort_order: 0 });
const makeLevel = () => ({
    level_title: "",
    sub_title: "",
    sort_order: 0,
    curriculum_items: [makeCurriculumItem()],
});

function getRequestMessage(requestError, fallback) {
    const validationErrors = requestError?.data?.errors;
    if (validationErrors) {
        return Object.values(validationErrors).flat().join(" ");
    }
    return requestError?.data?.message || fallback;
}

function buildCoursePayload(form) {
    return {
        ...form,
        price: Number(form.price || 0),
        regular_price: form.regular_price === "" ? null : Number(form.regular_price),
        duration_hours: Number(form.duration_hours || 0),
        duration_minutes: Number(form.duration_minutes || 0),
        features: form.features.map((feature, index) => ({
            ...feature,
            sort_order: Number(feature.sort_order || index),
        })),
        structures: form.structures.map((structure, index) => ({
            ...structure,
            sort_order: Number(structure.sort_order || index),
        })),
        levels: form.levels.map((level, index) => ({
            ...level,
            sort_order: Number(level.sort_order || index),
            curriculum_items: level.curriculum_items.map((item, itemIndex) => ({
                ...item,
                sort_order: Number(item.sort_order || itemIndex),
            })),
        })),
    };
}

function CourseForm({ form, setForm, saving, submitLabel, onSubmit, error, success, resolvedRole }) {
    function updateField(field, value) {
        setForm((current) => ({ ...current, [field]: value }));
    }

    function updateList(list, index, field, value) {
        setForm((current) => {
            const items = [...current[list]];
            items[index] = { ...items[index], [field]: value };
            return { ...current, [list]: items };
        });
    }

    function addListItem(list, makeItem) {
        setForm((current) => ({
            ...current,
            [list]: [...current[list], { ...makeItem(), sort_order: current[list].length }],
        }));
    }

    function removeListItem(list, index) {
        setForm((current) => ({
            ...current,
            [list]: current[list].filter((_, itemIndex) => itemIndex !== index),
        }));
    }

    function updateCurriculum(levelIndex, itemIndex, field, value) {
        setForm((current) => {
            const levels = [...current.levels];
            const curriculumItems = [...levels[levelIndex].curriculum_items];
            curriculumItems[itemIndex] = { ...curriculumItems[itemIndex], [field]: value };
            levels[levelIndex] = { ...levels[levelIndex], curriculum_items: curriculumItems };
            return { ...current, levels };
        });
    }

    function addCurriculum(levelIndex) {
        setForm((current) => {
            const levels = [...current.levels];
            const curriculumItems = levels[levelIndex].curriculum_items;
            levels[levelIndex] = {
                ...levels[levelIndex],
                curriculum_items: [
                    ...curriculumItems,
                    { ...makeCurriculumItem(), sort_order: curriculumItems.length },
                ],
            };
            return { ...current, levels };
        });
    }

    function removeCurriculum(levelIndex, itemIndex) {
        setForm((current) => {
            const levels = [...current.levels];
            levels[levelIndex] = {
                ...levels[levelIndex],
                curriculum_items: levels[levelIndex].curriculum_items.filter((_, index) => index !== itemIndex),
            };
            return { ...current, levels };
        });
    }

    return (
        <form onSubmit={onSubmit} className="space-y-6">
            <section className="rounded-[26px] bg-[linear-gradient(150deg,_#111827,_#1f2937)] p-8 text-white shadow-xl">
                <div className="flex items-center gap-3 opacity-80">
                    <BookPlus size={20} className="text-amber-400" />
                    <p className="text-xs uppercase tracking-[0.28em]">Course Management</p>
                </div>
                <h2 className="mt-4 text-3xl font-bold">{submitLabel === "Save Course" ? "Create Course" : "Edit Course"}</h2>
                <p className="mt-3 text-slate-400 max-w-2xl leading-relaxed">
                    Configure the course details, pricing, learning outcomes, structure, and curriculum.
                </p>
            </section>

            <div className="rounded-[26px] border border-slate-200 bg-white p-8 shadow-sm space-y-8">
                <div className="grid gap-6 md:grid-cols-2">
                    <Input label="Title" value={form.title} onChange={(value) => updateField("title", value)} required placeholder="IELTS Complete Preparation" />
                    <Input label="Category" value={form.category} onChange={(value) => updateField("category", value)} placeholder="IELTS" />
                    <Input label="Subtitle" value={form.subtitle} onChange={(value) => updateField("subtitle", value)} placeholder="Master all four skills" />
                    <Input label="Slug" value={form.slug} onChange={(value) => updateField("slug", value)} placeholder="ielts-complete-preparation" />
                    <Input label="Price" type="number" value={form.price} onChange={(value) => updateField("price", value)} required min="0" step="0.01" />
                    <Input label="Regular Price" type="number" value={form.regular_price} onChange={(value) => updateField("regular_price", value)} min="0" step="0.01" />
                    <Input label="Duration Hours" type="number" value={form.duration_hours} onChange={(value) => updateField("duration_hours", value)} min="0" />
                    <Input label="Duration Minutes" type="number" value={form.duration_minutes} onChange={(value) => updateField("duration_minutes", value)} min="0" max="59" />
                    <Input label="Thumbnail URL" value={form.thumbnail_url} onChange={(value) => updateField("thumbnail_url", value)} placeholder="https://example.com/course.jpg" />
                    <Input label="Promo Video URL" value={form.promo_video_url} onChange={(value) => updateField("promo_video_url", value)} placeholder="https://example.com/video" />

                    <div className="md:col-span-2">
                        <label className="mb-2 block text-sm font-semibold text-slate-700">Description</label>
                        <textarea
                            value={form.description}
                            onChange={(event) => updateField("description", event.target.value)}
                            rows={4}
                            className="w-full rounded-2xl border border-slate-200 bg-slate-50 px-4 py-3 text-slate-900 outline-none transition focus:border-blue-500 focus:ring-4 focus:ring-blue-100"
                            placeholder="Course overview and benefits..."
                        />
                    </div>

                    <label className="flex items-center gap-3 rounded-2xl border border-slate-200 bg-slate-50 px-4 py-3 text-sm font-semibold text-slate-700">
                        <input
                            type="checkbox"
                            checked={form.is_published}
                            onChange={(event) => updateField("is_published", event.target.checked)}
                            className="h-4 w-4 rounded border-slate-300"
                        />
                        Published
                    </label>
                </div>

                <Repeater title="Features" onAdd={() => addListItem("features", makeFeature)}>
                    {form.features.map((feature, index) => (
                        <div key={index} className="grid gap-4 rounded-2xl border border-slate-200 bg-slate-50 p-5 md:grid-cols-[1fr_2fr_auto]">
                            <Input label="Icon Type" value={feature.icon_type} onChange={(value) => updateList("features", index, "icon_type", value)} />
                            <Input label="Feature Text" value={feature.feature_text} onChange={(value) => updateList("features", index, "feature_text", value)} required />
                            <RemoveButton disabled={form.features.length === 1} onClick={() => removeListItem("features", index)} />
                        </div>
                    ))}
                </Repeater>

                <Repeater title="Course Structure" onAdd={() => addListItem("structures", makeStructure)}>
                    {form.structures.map((structure, index) => (
                        <div key={index} className="space-y-4 rounded-2xl border border-slate-200 bg-slate-50 p-5">
                            <div className="grid gap-4 md:grid-cols-[1fr_1fr_auto]">
                                <Input label="Title" value={structure.title} onChange={(value) => updateList("structures", index, "title", value)} required />
                                <Input label="Badge Icon" value={structure.badge_icon} onChange={(value) => updateList("structures", index, "badge_icon", value)} />
                                <RemoveButton disabled={form.structures.length === 1} onClick={() => removeListItem("structures", index)} />
                            </div>
                            <div>
                                <label className="mb-1.5 block text-xs font-semibold text-slate-600">Description</label>
                                <textarea
                                    required
                                    value={structure.description}
                                    onChange={(event) => updateList("structures", index, "description", event.target.value)}
                                    rows={3}
                                    className="w-full rounded-xl border border-slate-200 bg-white px-4 py-2.5 text-sm text-slate-900 outline-none transition focus:border-blue-500 focus:ring-4 focus:ring-blue-100"
                                />
                            </div>
                        </div>
                    ))}
                </Repeater>

                <Repeater title="Curriculum Levels" onAdd={() => addListItem("levels", makeLevel)}>
                    {form.levels.map((level, levelIndex) => (
                        <div key={levelIndex} className="space-y-4 rounded-2xl border border-slate-200 bg-slate-50 p-5">
                            <div className="grid gap-4 md:grid-cols-[1fr_1fr_auto]">
                                <Input label="Level Title" value={level.level_title} onChange={(value) => updateList("levels", levelIndex, "level_title", value)} required />
                                <Input label="Subtitle" value={level.sub_title} onChange={(value) => updateList("levels", levelIndex, "sub_title", value)} />
                                <RemoveButton disabled={form.levels.length === 1} onClick={() => removeListItem("levels", levelIndex)} />
                            </div>

                            <div className="space-y-3">
                                <div className="flex items-center justify-between">
                                    <h4 className="text-xs font-black uppercase tracking-wider text-slate-500">Curriculum Items</h4>
                                    <button type="button" onClick={() => addCurriculum(levelIndex)} className="flex items-center gap-1 text-xs font-bold text-blue-600">
                                        <Plus size={14} />
                                        Add Item
                                    </button>
                                </div>
                                {level.curriculum_items.map((item, itemIndex) => (
                                    <div key={itemIndex} className="grid gap-3 md:grid-cols-[1fr_auto]">
                                        <Input label="Item Name" value={item.item_name} onChange={(value) => updateCurriculum(levelIndex, itemIndex, "item_name", value)} required />
                                        <RemoveButton disabled={level.curriculum_items.length === 1} onClick={() => removeCurriculum(levelIndex, itemIndex)} />
                                    </div>
                                ))}
                            </div>
                        </div>
                    ))}
                </Repeater>

                {(error || success) && (
                    <div className={`rounded-2xl border px-4 py-3 text-sm font-medium ${error ? "border-red-200 bg-red-50 text-red-700" : "border-emerald-200 bg-emerald-50 text-emerald-700"}`}>
                        {error || success}
                    </div>
                )}

                <div className="flex flex-wrap items-center gap-3">
                    <button type="submit" disabled={saving} className="flex items-center gap-2 rounded-2xl bg-slate-950 px-8 py-3.5 text-sm font-bold text-white shadow-lg transition hover:-translate-y-0.5 disabled:opacity-60">
                        {saving ? <Loader2 className="animate-spin" size={18} /> : <Save size={18} />}
                        {saving ? "Saving..." : submitLabel}
                    </button>
                    <Link href={`/${resolvedRole}/courses`} className="rounded-2xl border border-slate-200 px-5 py-3 text-sm font-bold text-slate-600 hover:bg-slate-50">
                        Cancel
                    </Link>
                </div>
            </div>
        </form>
    );
}

function Input({ label, value, onChange, type = "text", required = false, ...props }) {
    return (
        <div>
            <label className="mb-2 block text-sm font-semibold text-slate-700">{label}</label>
            <input
                type={type}
                required={required}
                value={value}
                onChange={(event) => onChange(event.target.value)}
                className="w-full rounded-2xl border border-slate-200 bg-slate-50 px-4 py-3 text-slate-900 outline-none transition focus:border-blue-500 focus:ring-4 focus:ring-blue-100"
                {...props}
            />
        </div>
    );
}

function Repeater({ title, onAdd, children }) {
    return (
        <div className="space-y-4">
            <div className="flex items-center justify-between">
                <h3 className="text-sm font-semibold text-slate-700">{title}</h3>
                <button type="button" onClick={onAdd} className="flex items-center gap-1.5 text-sm font-medium text-blue-600 hover:text-blue-800 transition-colors">
                    <Plus size={16} />
                    Add
                </button>
            </div>
            <div className="space-y-4">{children}</div>
        </div>
    );
}

function RemoveButton({ disabled, onClick }) {
    return (
        <button
            type="button"
            disabled={disabled}
            onClick={onClick}
            className="self-end justify-self-start rounded-xl p-2 text-red-500 transition-colors hover:bg-red-50 hover:text-red-700 disabled:cursor-not-allowed disabled:opacity-40"
            title="Remove"
        >
            <Trash2 size={18} />
        </button>
    );
}

export default function CreateCoursePage() {
    const router = useRouter();
    const { role } = useParams();
    const resolvedRole = role?.toLowerCase();
    const [createCourse, { isLoading: saving }] = useCreateCourseMutation();
    const [form, setForm] = useState({
        category: "",
        title: "",
        subtitle: "",
        slug: "",
        description: "",
        thumbnail_url: "",
        promo_video_url: "",
        price: "",
        regular_price: "",
        duration_hours: 0,
        duration_minutes: 0,
        is_published: false,
        features: [makeFeature()],
        structures: [makeStructure()],
        levels: [makeLevel()],
    });
    const [error, setError] = useState("");
    const [success, setSuccess] = useState("");

    async function handleSubmit(event) {
        event.preventDefault();
        setError("");
        setSuccess("");

        try {
            await createCourse(buildCoursePayload(form)).unwrap();
            setSuccess("Course created successfully.");
            setTimeout(() => router.push(`/${resolvedRole}/courses`), 1200);
        } catch (requestError) {
            setError(getRequestMessage(requestError, "Unable to create course."));
        }
    }

    return (
        <div className="mx-auto space-y-6">
            <Link href={`/${resolvedRole}/courses`} className="flex items-center gap-2 text-slate-500 hover:text-slate-800 transition-colors font-medium text-sm">
                <ChevronLeft size={18} />
                Back to Courses
            </Link>
            <CourseForm
                form={form}
                setForm={setForm}
                saving={saving}
                submitLabel="Save Course"
                onSubmit={handleSubmit}
                error={error}
                success={success}
                resolvedRole={resolvedRole}
            />
        </div>
    );
}
