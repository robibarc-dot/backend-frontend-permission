"use client";

import { useState, useMemo, useEffect } from "react";
import { useRouter, useParams, useSearchParams } from "next/navigation";
import Link from "next/link";
import { 
    ChevronLeft, 
    Save, 
    Plus, 
    Trash2, 
    Loader2,
    CheckCircle2,
    Type,
    Image as ImageIcon,
    LayoutList,
    PenTool
} from "lucide-react";
import { useCreateQuestionMutation } from "@/redux/features/common/backend/questionApi";
import { useGetQuestionTypesQuery } from "@/redux/features/common/backend/questionTypeApi";
import { useGetModulesQuery } from "@/redux/features/common/backend/moduleApi";
import { useGetQuestionGroupsQuery } from "@/redux/features/common/backend/questionGroupApi";
import { useRef } from "react";

const QUESTION_CATEGORIES = {
    OBJECTIVE: [
        "Multiple Choice", "True False Not Given", "Yes No Not Given"
    ],
    MATCHING: [
        "Matching Headings", "Matching Information", "Matching Features", "Matching Sentence Endings"
    ],
    COMPLETION: [
        "Sentence Completion", "Summary Completion", "Note Completion", "Table Completion", 
        "Form Completion", "Flowchart Completion", "Diagram Labeling", "Map Labeling", "Short Answer"
    ],
    WRITING_TASK_1: [
        "Line Graph", "Bar Chart", "Pie Chart", "Table Chart", "Process Diagram", "Map", "Mixed Chart", "Letter Writing"
    ],
    WRITING_TASK_2: [
        "Opinion Essay", "Discussion Essay", "Advantages Disadvantages", "Problem Solution", "Double Question", "Agree Disagree"
    ]
};

export default function CreateQuestionPage() {
    const { role } = useParams();
    const searchParams = useSearchParams();
    const router = useRouter();
    const resolvedRole = role?.toLowerCase();

    // Refs to store initial URL parameters to determine if fields should be permanently disabled
    const initialModuleIdFromParamsRef = useRef(searchParams.get('module_id')?.toString());
    const initialQuestionTypeIdFromParamsRef = useRef(searchParams.get('question_type_id')?.toString());
    const initialQuestionGroupIdFromParamsRef = useRef(searchParams.get('question_group_id')?.toString());

    const [backendErrors, setBackendErrors] = useState({});
    const [formData, setFormData] = useState({
        module_id: searchParams.get('module_id')?.toString() || "",
        question_type_id: searchParams.get('question_type_id')?.toString() || "",
        question_group_id: searchParams.get('question_group_id')?.toString() || "",
        type_name: "", // Initialized via selection or useEffect
        question_text: "",
        instruction_text: "",
        question_mark: 1,
        sequence_number: 1,
        status: "active",
        image_url: "",
        options: [
            { option_key: "A", option_text: "", is_correct: false },
            { option_key: "B", option_text: "", is_correct: false },
        ]
    });

    const [createQuestion, { isLoading }] = useCreateQuestionMutation();
    const { data: questionTypes, isLoading: isLoadingTypes } = useGetQuestionTypesQuery();
    const { data: modules, isLoading: isLoadingModules } = useGetModulesQuery();
    // This query hook depends on formData, so it must be called after formData is initialized
    const { data: questionGroups, isLoading: isLoadingGroups } = useGetQuestionGroupsQuery(
        formData.module_id ? { module_id: formData.module_id } : {}
    );

    const currentCategory = useMemo(() => {
        for (const [cat, types] of Object.entries(QUESTION_CATEGORIES)) {
            if (types.includes(formData.type_name)) return cat;
        }
        return "OBJECTIVE";
    }, [formData.type_name]);

    const getInitialOptions = (typeName) => {
        if (QUESTION_CATEGORIES.OBJECTIVE.includes(typeName)) {
            return [
                { option_key: "A", option_text: "", is_correct: false },
                { option_key: "B", option_text: "", is_correct: false }
            ];
        } else if (QUESTION_CATEGORIES.COMPLETION.includes(typeName) || QUESTION_CATEGORIES.MATCHING.includes(typeName)) {
            return [{ option_key: "1", option_text: "", is_correct: true }];
        }
        return [];
    };

    // If question_type_id is provided in URL, update type_name once questionTypes are loaded
    useEffect(() => {
        // This effect runs when questionTypes load or formData.question_type_id changes.
        // It ensures that type_name and module_id are correctly set based on the selected question type,
        // especially when question_type_id comes from URL parameters.
        if (questionTypes && formData.question_type_id) {
            const selectedType = questionTypes.find(t => t.id.toString() === formData.question_type_id.toString());
            if (selectedType) {
                const typeName = selectedType.name;
                setFormData(prev => ({
                    ...prev,
                    type_name: typeName,
                    // If module_id is not fixed by URL param, or if the selected type has a module_id, update it.
                    module_id: initialModuleIdFromParamsRef.current || (selectedType.module_id?.toString() || prev.module_id), // Ensure module_id is string
                    options: getInitialOptions(typeName)
                }));
            }
        }
    }, [questionTypes, formData.question_type_id, initialModuleIdFromParamsRef]); // Added initialModuleIdFromParamsRef to dependencies

    // Group types from backend into categories for the selector
    const categorizedTypes = useMemo(() => {
        if (!questionTypes) return {};
        
        const groups = {
            OBJECTIVE: [],
            MATCHING: [],
            COMPLETION: [],
            WRITING_TASK_1: [],
            WRITING_TASK_2: [],
            OTHER: []
        };

        questionTypes.forEach(type => {
            let assigned = false;
            for (const [cat, names] of Object.entries(QUESTION_CATEGORIES)) {
                if (names.includes(type.name)) {
                    groups[cat].push(type);
                    assigned = true;
                    break;
                }
            }
            if (!assigned) groups.OTHER.push(type);
        });
        return groups;
    }, [questionTypes]);

    const handleInputChange = (e) => {
        const { name, value } = e.target;
        setFormData(prev => ({ ...prev, [name]: value }));
        if (backendErrors[name]) {
            setBackendErrors(prev => {
                const newErrors = { ...prev };
                delete newErrors[name];
                return newErrors;
            });
        }
    };

    const handleTypeChange = (e) => {
        const typeId = e.target.value;
        const selectedType = questionTypes?.find(t => t.id.toString() === typeId);
        if (!selectedType) return;

        const typeName = selectedType.name;
        setFormData(prev => ({ 
            ...prev, 
            question_type_id: typeId, 
            type_name: typeName,
            module_id: initialModuleIdFromParamsRef.current || (selectedType.module_id?.toString() || prev.module_id),
            options: getInitialOptions(typeName) 
        }));
    };

    const handleOptionChange = (index, field, value) => {
        const newOptions = [...formData.options];
        newOptions[index][field] = value;
        
        // Handle single-correct answer logic
        if (field === 'is_correct' && value === true) {
            newOptions.forEach((opt, i) => {
                if (i !== index) opt.is_correct = false;
            });
        }
        
        setFormData(prev => ({ ...prev, options: newOptions }));
    };

    const addOption = () => {
        const isCompletion = currentCategory === "COMPLETION" || currentCategory === "MATCHING";
        const nextKey = isCompletion 
            ? (formData.options.length + 1).toString() 
            : String.fromCharCode(65 + formData.options.length);
        setFormData(prev => ({
            ...prev,
            options: [...prev.options, { option_key: nextKey, option_text: "", is_correct: false }]
        }));
    };

    const removeOption = (index) => {
        if (formData.options.length <= 1) return;
        const newOptions = formData.options.filter((_, i) => i !== index);
        setFormData(prev => ({ ...prev, options: newOptions }));
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        setBackendErrors({});
        try {
            await createQuestion(formData).unwrap();
            router.push(`/${resolvedRole}/questions`);
        } catch (err) {
            if (err.data?.errors) {
                setBackendErrors(err.data.errors);
            }
        }
    };

    return (
        <div className="mx-auto max-w-5xl space-y-6">
            {/* Header */}
            <div className="flex items-center justify-between">
                <div className="flex items-center gap-4">
                    <Link
                        href={`/${resolvedRole}/questions`}
                        className="flex h-10 w-10 items-center justify-center rounded-xl border border-slate-200 bg-white text-slate-600 transition hover:bg-slate-50"
                    >
                        <ChevronLeft size={20} />
                    </Link>
                    <div>
                        <h2 className="text-2xl font-bold text-slate-900">Create Question</h2>
                        <p className="text-sm text-slate-500">Add a new question to the system library</p>
                    </div>
                </div>
            </div>

            <form onSubmit={handleSubmit} className="space-y-6">
                <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
                    {/* Left Column: Question Details */}
                    <div className="lg:col-span-2 space-y-6">
                        <div className="rounded-[26px] border border-slate-200 bg-white p-6 shadow-sm">
                            <div className="flex items-center gap-2 mb-4">
                                <Type size={20} className="text-blue-600" />
                                <h3 className="text-lg font-bold text-slate-900">Content & Instructions</h3>
                            </div>
                            <div className="space-y-4">
                                <div>
                                    <label className="mb-2 block text-sm font-semibold text-slate-700">Instructions (Optional)</label>
                                    <input
                                        type="text"
                                        name="instruction_text"
                                        value={formData.instruction_text}
                                        onChange={handleInputChange}
                                        className="w-full rounded-2xl border border-slate-200 bg-slate-50 px-4 py-3 text-slate-900 outline-none transition focus:border-blue-500"
                                        placeholder="e.g. Write NO MORE THAN TWO WORDS..."
                                    />
                                </div>
                                <div>
                                    <label className="mb-2 block text-sm font-semibold text-slate-700">
                                        {currentCategory.startsWith('WRITING') ? 'Writing Prompt' : 'Question Text'}
                                    </label>
                                    <textarea
                                        name="question_text"
                                        value={formData.question_text}
                                        onChange={handleInputChange}
                                        rows={currentCategory.startsWith('WRITING') ? 8 : 4}
                                        required
                                        className="w-full rounded-2xl border border-slate-200 bg-slate-50 px-4 py-3 text-slate-900 outline-none transition focus:border-blue-500 focus:ring-4 focus:ring-blue-100"
                                        placeholder="Enter the main question content here..."
                                    />
                                    {backendErrors.question_text && (
                                        <p className="mt-1 text-xs text-rose-500">{backendErrors.question_text[0]}</p>
                                    )}
                                </div>

                                {(currentCategory === "WRITING_TASK_1" || formData.type_name.includes("Labeling")) && (
                                    <div>
                                        <label className="mb-2 block text-sm font-semibold text-slate-700">Asset/Image URL</label>
                                        <div className="relative">
                                            <ImageIcon size={18} className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-400" />
                                            <input
                                                type="text"
                                                name="image_url"
                                                value={formData.image_url}
                                                onChange={handleInputChange}
                                                className="w-full rounded-2xl border border-slate-200 bg-slate-50 py-3 pl-11 pr-4 text-slate-900 outline-none transition focus:border-blue-500"
                                                placeholder="https://example.com/chart.png"
                                            />
                                        </div>
                                    </div>
                                )}

                                <div className="pt-4 border-t border-slate-100">
                                    {currentCategory !== "WRITING_TASK_1" && currentCategory !== "WRITING_TASK_2" && (
                                        <div className="flex items-center justify-between mb-4">
                                            <div className="flex items-center gap-2">
                                                <LayoutList size={18} className="text-blue-600" />
                                                <h3 className="text-lg font-bold text-slate-900">
                                                    {currentCategory === "MATCHING" ? "Matching Pairs" : "Answer Keys/Options"}
                                                </h3>
                                            </div>
                                            <button
                                                type="button"
                                                onClick={addOption}
                                                className="flex items-center gap-1.5 text-sm font-bold text-blue-600 hover:text-blue-700"
                                            >
                                                <Plus size={16} />
                                                Add Item
                                            </button>
                                        </div>
                                    )}

                                    <div className="space-y-3">
                                        {formData.options.map((option, index) => (
                                            <div key={index} className="flex items-start gap-3">
                                                <div className="flex-1 flex items-center gap-3 rounded-2xl border border-slate-200 bg-slate-50 p-3">
                                                    <span className="flex h-8 w-8 shrink-0 items-center justify-center rounded-lg bg-white font-bold text-slate-500 shadow-sm">
                                                        {option.option_key}
                                                    </span>
                                                    <input
                                                        type="text"
                                                        value={option.option_text}
                                                        onChange={(e) => handleOptionChange(index, 'option_text', e.target.value)}
                                                        required
                                                        placeholder={currentCategory === "MATCHING" ? "Enter target/matching text..." : "Enter option or answer..."}
                                                        className="flex-1 bg-transparent text-sm outline-none"
                                                    />
                                                    <button
                                                        type="button"
                                                        onClick={() => handleOptionChange(index, 'is_correct', !option.is_correct)}
                                                        className={`flex h-8 items-center gap-2 rounded-lg px-3 transition ${
                                                            option.is_correct 
                                                            ? "bg-emerald-50 text-emerald-600" 
                                                            : "bg-white text-slate-400 hover:text-slate-600"
                                                        } shadow-sm border border-slate-100`}
                                                    >
                                                        <CheckCircle2 size={16} />
                                                        <span className="text-xs font-bold">
                                                            {option.is_correct ? (currentCategory === "MATCHING" ? "Paired" : "Correct") : "Mark Correct"}
                                                        </span>
                                                    </button>
                                                </div>
                                                <button
                                                    type="button"
                                                    onClick={() => removeOption(index)}
                                                    className="mt-3 text-slate-300 hover:text-rose-500 transition"
                                                >
                                                    <Trash2 size={18} />
                                                </button>
                                            </div>
                                        ))}
                                    </div>
                                </div>
                            </div>
                        </div>
                    </div>

                    {/* Right Column: Configuration */}
                    <div className="space-y-6">
                        <div className="rounded-[26px] border border-slate-200 bg-white p-6 shadow-sm">
                            <h3 className="mb-4 text-lg font-bold text-slate-900">Classification</h3>
                            <div className="space-y-4">
                                <div>
                                    <label className="mb-2 block text-sm font-semibold text-slate-700">Question Type</label>
                                    <div className="relative">
                                        <select
                                            value={formData.question_type_id}
                                            onChange={handleTypeChange}
                                            disabled={isLoadingTypes || !!initialQuestionTypeIdFromParamsRef.current}
                                            className="w-full rounded-2xl border border-slate-200 bg-slate-50 px-4 py-3 text-slate-900 outline-none transition focus:border-blue-500 appearance-none disabled:opacity-50"
                                        >
                                            <option value="">Select a type...</option>
                                            {Object.entries(categorizedTypes).map(([category, items]) => items.length > 0 && (
                                                <optgroup key={category} label={category.replace(/_/g, ' ')}>
                                                    {items.map(type => (
                                                        <option key={type.id} value={type.id.toString()}>{type.name}</option>
                                                    ))}
                                                </optgroup>
                                            ))}
                                        </select>
                                    </div>
                                </div>
                                <div>
                                    <label className="mb-2 block text-sm font-semibold text-slate-700">Module</label>
                                    <div className="relative">
                                        <select
                                            name="module_id"
                                            value={formData.module_id}
                                            onChange={handleInputChange}
                                            required
                                            disabled={isLoadingModules || !!initialModuleIdFromParamsRef.current}
                                            className="w-full rounded-2xl border border-slate-200 bg-slate-50 px-4 py-3 text-slate-900 outline-none transition focus:border-blue-500 appearance-none disabled:opacity-50"
                                        >
                                            <option value="">Select a module...</option>
                                            {modules?.map(module => (
                                                <option key={module.id} value={module.id.toString()}>
                                                    {module.name || module.title}
                                                </option>
                                            ))}
                                        </select>
                                    </div>
                                    {backendErrors.module_id && (
                                        <p className="mt-1 text-xs text-rose-500">{backendErrors.module_id[0]}</p>
                                    )}
                                </div>
                                <div>
                                    <label className="mb-2 block text-sm font-semibold text-slate-700">Question Group</label>
                                    <div className="relative">
                                        <select
                                            name="question_group_id"
                                            value={formData.question_group_id}
                                            onChange={handleInputChange}
                                            required
                                            disabled={isLoadingGroups || !!initialQuestionGroupIdFromParamsRef.current}
                                            className="w-full rounded-2xl border border-slate-200 bg-slate-50 px-4 py-3 text-slate-900 outline-none transition focus:border-blue-500 appearance-none disabled:opacity-50"
                                        >
                                            <option value="">Select a group...</option>
                                            {questionGroups?.map(group => (
                                                <option key={group.id} value={group.id.toString()}>
                                                    {group.title}
                                                </option>
                                            ))}
                                        </select>
                                    </div>
                                    {backendErrors.question_group_id && (
                                        <p className="mt-1 text-xs text-rose-500">{backendErrors.question_group_id[0]}</p>
                                    )}
                                </div>
                                <div className="grid grid-cols-2 gap-4">
                                    <div>
                                        <label className="mb-2 block text-sm font-semibold text-slate-700">Marks</label>
                                        <input
                                            type="number"
                                            name="question_mark"
                                            value={formData.question_mark}
                                            onChange={handleInputChange}
                                            min="1"
                                            required
                                            className="w-full rounded-2xl border border-slate-200 bg-slate-50 px-4 py-3 text-slate-900 outline-none transition focus:border-blue-500 focus:ring-4 focus:ring-blue-100"
                                        />
                                    </div>
                                    <div>
                                        <label className="mb-2 block text-sm font-semibold text-slate-700">Sequence</label>
                                        <input
                                            type="number"
                                            name="sequence_number"
                                            value={formData.sequence_number}
                                            onChange={handleInputChange}
                                            min="1"
                                            className="w-full rounded-2xl border border-slate-200 bg-slate-50 px-4 py-3 text-slate-900 outline-none transition focus:border-blue-500 focus:ring-4 focus:ring-blue-100"
                                        />
                                    </div>
                                </div>
                                <div>
                                    <label className="mb-2 block text-sm font-semibold text-slate-700">Status</label>
                                    <select
                                        name="status"
                                        value={formData.status}
                                        onChange={handleInputChange}
                                        className="w-full rounded-2xl border border-slate-200 bg-slate-50 px-4 py-3 text-slate-900 outline-none transition focus:border-blue-500 focus:ring-4 focus:ring-blue-100 appearance-none"
                                    >
                                        <option value="active">Active</option>
                                        <option value="inactive">Inactive</option>
                                    </select>
                                </div>
                            </div>
                        </div>

                        <button
                            type="submit"
                            disabled={isLoading}
                            className="flex w-full items-center justify-center gap-2 rounded-[22px] bg-blue-600 py-4 text-sm font-bold text-white shadow-lg transition hover:bg-blue-700 hover:-translate-y-0.5 disabled:opacity-50 disabled:hover:translate-y-0"
                        >
                            {isLoading ? (
                                <Loader2 className="animate-spin" size={20} />
                            ) : (
                                <Save size={20} />
                            )}
                            {isLoading ? "Processing..." : "Create Question"}
                        </button>
                    </div>
                </div>
            </form>
        </div>
    );
}
