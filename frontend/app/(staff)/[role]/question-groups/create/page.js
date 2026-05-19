"use client";

import { useEffect, useState, useMemo } from "react";
import { useParams, useRouter, useSearchParams } from "next/navigation";
import Link from "next/link";
import { 
    ChevronLeft, Library, Loader2, Save, AlignLeft, Layers, Type, Hash,
    Bold, Italic, List, ListOrdered, Heading1, Heading2, Strikethrough,
    Undo, Redo, Quote
} from "lucide-react";
import { useCreateQuestionGroupMutation } from "@/redux/features/common/backend/questionGroupApi";
import { useGetTestSectionsQuery } from "@/redux/features/common/backend/testSectionApi";
import { useGetQuestionTypesQuery } from "@/redux/features/common/backend/questionTypeApi";
import { useEditor, EditorContent } from "@tiptap/react";
import StarterKit from "@tiptap/starter-kit";

const initialForm = {
    title: "",
    instruction: "",
    test_section_id: "",
    question_type_id: "",
    sort_order: 0,
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
        title: form.title,
        instruction: form.instruction,
        test_section_id: Number(form.test_section_id),
        question_type_id: Number(form.question_type_id),
        sort_order: Number(form.sort_order),
    };
}

const MenuBar = ({ editor }) => {
    if (!editor) return null;

    const btnClass = (active) => `p-2 rounded-lg transition-colors ${active ? 'bg-blue-100 text-blue-600' : 'text-slate-600 hover:bg-slate-100'}`;

    return (
        <div className="flex flex-wrap items-center gap-1 border-b border-slate-200 p-2 bg-slate-50">
            <button type="button" onClick={() => editor.chain().focus().toggleBold().run()} className={btnClass(editor.isActive('bold'))}><Bold size={16} /></button>
            <button type="button" onClick={() => editor.chain().focus().toggleItalic().run()} className={btnClass(editor.isActive('italic'))}><Italic size={16} /></button>
            <button type="button" onClick={() => editor.chain().focus().toggleStrike().run()} className={btnClass(editor.isActive('strike'))}><Strikethrough size={16} /></button>
            
            <div className="w-px h-6 bg-slate-200 mx-1" />
            
            <button type="button" onClick={() => editor.chain().focus().toggleHeading({ level: 1 }).run()} className={btnClass(editor.isActive('heading', { level: 1 }))}><Heading1 size={16} /></button>
            <button type="button" onClick={() => editor.chain().focus().toggleHeading({ level: 2 }).run()} className={btnClass(editor.isActive('heading', { level: 2 }))}><Heading2 size={16} /></button>
            
            <div className="w-px h-6 bg-slate-200 mx-1" />

            <button type="button" onClick={() => editor.chain().focus().toggleBulletList().run()} className={btnClass(editor.isActive('bulletList'))}><List size={16} /></button>
            <button type="button" onClick={() => editor.chain().focus().toggleOrderedList().run()} className={btnClass(editor.isActive('orderedList'))}><ListOrdered size={16} /></button>
            <button type="button" onClick={() => editor.chain().focus().toggleBlockquote().run()} className={btnClass(editor.isActive('blockquote'))}><Quote size={16} /></button>

            <div className="w-px h-6 bg-slate-200 mx-1" />

            <button 
                type="button" 
                onClick={() => editor.chain().focus().undo().run()} 
                disabled={!editor.can().undo()}
                className="p-2 text-slate-600 hover:bg-slate-100 rounded-lg disabled:opacity-30"
            >
                <Undo size={16} />
            </button>
            <button 
                type="button" 
                onClick={() => editor.chain().focus().redo().run()} 
                disabled={!editor.can().redo()}
                className="p-2 text-slate-600 hover:bg-slate-100 rounded-lg disabled:opacity-30"
            >
                <Redo size={16} />
            </button>
        </div>
    );
};

export default function CreateQuestionGroupPage() {
    const router = useRouter();
    const { role } = useParams();
    const searchParams = useSearchParams();
    const resolvedRole = role?.toLowerCase();

    const moduleId = searchParams.get('module_id');    
    const testSectionId = searchParams.get('test_section_id');
    
    const [createQuestionGroup, { isLoading: saving }] = useCreateQuestionGroupMutation();
    const { data: testSections, isLoading: loadingSections } = useGetTestSectionsQuery();
    const { data: questionTypes, isLoading: loadingTypes } = useGetQuestionTypesQuery();

    const [form, setForm] = useState(initialForm);
    const [error, setError] = useState("");
    const [success, setSuccess] = useState("");

    const editor = useEditor({
        extensions: [StarterKit],
        content: form.instruction,
        onUpdate: ({ editor }) => {
            updateField("instruction", editor.getHTML());
        },
        editorProps: {
            attributes: {
                class: "prose prose-sm sm:prose-base focus:outline-none min-h-[160px] p-4 text-slate-900 max-w-none",
            },
        },
    });

    const filteredQuestionTypes = useMemo(() => {
        if (!moduleId || !questionTypes) return questionTypes;
        return questionTypes.filter(type => String(type.module_id) === String(moduleId));
    }, [questionTypes, moduleId]);

    useEffect(() => {
        if (testSectionId) {
            setForm((current) => ({
                ...current,
                test_section_id: testSectionId,
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
            await createQuestionGroup(toPayload(form)).unwrap();
            setSuccess("Question group created successfully.");
            setTimeout(() => router.push(`/${resolvedRole}/question-groups?module_id=${moduleId}&test_section_id=${testSectionId}`), 1500);
        } catch (requestError) {
            setError(getRequestMessage(requestError, "Unable to create question group."));
        }
    }

    return (
        <div className="mx-auto space-y-6">
            <div className="flex items-center justify-between">
                <Link
                    href={`/${resolvedRole}/question-groups?module_id=${moduleId}&test_section_id=${testSectionId}`}
                    className="flex items-center gap-2 text-slate-500 hover:text-slate-800 transition-colors font-medium text-sm"
                >
                    <ChevronLeft size={18} />
                    Back to Question Groups
                </Link>
            </div>

            <form onSubmit={handleSubmit} className="space-y-6">
                <section className="rounded-[26px] bg-[linear-gradient(150deg,_#111827,_#1f2937)] p-8 text-white shadow-xl">
                    <div className="flex items-center gap-3 opacity-80">
                        <Library size={20} className="text-blue-400" />
                        <p className="text-xs uppercase tracking-[0.28em]">New Question Group</p>
                    </div>
                    <h2 className="mt-4 text-3xl font-bold">Create Question Group</h2>
                    <p className="mt-3 text-slate-400 max-w-2xl leading-relaxed">
                        Define a new question group with its title, instructions, and associated details.
                    </p>
                </section>

                <div className="rounded-[26px] border border-slate-200 bg-white p-8 shadow-sm space-y-8">
                    <div className="grid gap-6 md:grid-cols-2">
                        <div>
                            <label htmlFor="title" className="mb-2 block text-sm font-semibold text-slate-700">Title</label>
                            <input
                                type="text"
                                id="title"
                                required
                                value={form.title}
                                onChange={(event) => updateField("title", event.target.value)}
                                className="w-full rounded-2xl border border-slate-200 bg-slate-50 px-4 py-3 text-slate-900 outline-none transition focus:border-blue-500 focus:ring-4 focus:ring-blue-100"
                            />
                        </div>
                        <div className="md:col-span-2">
                            <label htmlFor="instruction" className="mb-2 block text-sm font-semibold text-slate-700 flex items-center gap-2">
                                <AlignLeft size={16} className="text-slate-400" />
                                Instruction
                            </label>
                            <div className="rounded-2xl border border-slate-200 bg-white overflow-hidden focus-within:ring-4 focus-within:ring-blue-100 focus-within:border-blue-500 transition-all">
                                <MenuBar editor={editor} />
                                <EditorContent editor={editor} />
                            </div>
                        </div>
                        <div>
                            <label htmlFor="test_section_id" className="mb-2 block text-sm font-semibold text-slate-700">Test Section</label>
                            <div className="relative">
                                <Layers size={18} className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-400" />
                                <select
                                    id="test_section_id"
                                    required
                                    value={form.test_section_id}
                                    onChange={(event) => updateField("test_section_id", event.target.value)}
                                    className="w-full rounded-2xl border border-slate-200 bg-slate-50 py-3 pl-11 pr-4 text-slate-900 outline-none transition focus:border-blue-500 focus:ring-4 focus:ring-blue-100 appearance-none"
                                >
                                    <option value="">Select Section</option>
                                    {testSections?.map((section) => (
                                        <option key={section.id} value={section.id}>
                                            {section.title} {section.module ? `(${section.module.title})` : ''}
                                        </option>
                                    ))}
                                </select>
                            </div>
                        </div>
                        <div>
                            <label htmlFor="question_type_id" className="mb-2 block text-sm font-semibold text-slate-700">Question Type</label>
                            <div className="relative">
                                <Type size={18} className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-400" />
                                <select
                                    id="question_type_id"
                                    required
                                    value={form.question_type_id}
                                    onChange={(event) => updateField("question_type_id", event.target.value)}
                                    className="w-full rounded-2xl border border-slate-200 bg-slate-50 py-3 pl-11 pr-4 text-slate-900 outline-none transition focus:border-blue-500 focus:ring-4 focus:ring-blue-100 appearance-none"
                                >
                                    <option value="">Select Type</option>
                                    {filteredQuestionTypes?.map((type) => (
                                        <option key={type.id} value={type.id}>
                                            {type.name}
                                        </option>
                                    ))}
                                </select>
                            </div>
                        </div>
                        <div>
                            <label htmlFor="sort_order" className="mb-2 block text-sm font-semibold text-slate-700">Sort Order</label>
                            <div className="relative">
                                <Hash size={18} className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-400" />
                                <input
                                    type="number"
                                    id="sort_order"
                                    min="0"
                                    required
                                    value={form.sort_order}
                                    onChange={(event) => updateField("sort_order", event.target.value)}
                                    className="w-full rounded-2xl border border-slate-200 bg-slate-50 py-3 pl-11 pr-4 text-slate-900 outline-none transition focus:border-blue-500 focus:ring-4 focus:ring-blue-100"
                                />
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
                        {saving ? "Creating..." : "Create Question Group"}
                    </button>
                </div>
            </form>
        </div>
    );
}
