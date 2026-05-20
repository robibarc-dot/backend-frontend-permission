"use client";

import { useEffect, useMemo, useRef, useState } from "react";
import { useParams, useRouter, useSearchParams } from "next/navigation";
import Link from "next/link";
import {
    AlertCircle,
    CheckCircle2,
    ChevronLeft,
    FileText,
    Image as ImageIcon,
    LayoutList,
    Layers,
    Loader2,
    Plus,
    Save,
    Trash2,
    Type,
} from "lucide-react";
import {
    useCreateQuestionMutation,
    useGetQuestionQuery,
    useUpdateQuestionMutation,
} from "@/redux/features/common/backend/questionApi";
import { useGetQuestionTypesQuery } from "@/redux/features/common/backend/questionTypeApi";
import { useGetModulesQuery } from "@/redux/features/common/backend/moduleApi";
import {
    useGetQuestionGroupQuery,
    useGetQuestionGroupsQuery,
} from "@/redux/features/common/backend/questionGroupApi";
import { useGetTestContextsQuery } from "@/redux/features/common/backend/testContextApi";

const QUESTION_CATEGORIES = {
    OBJECTIVE: [
        "Multiple Choice",
        "True False Not Given",
        "Yes No Not Given",
    ],
    MATCHING: [
        "Matching Headings",
        "Matching Information",
        "Matching Features",
        "Matching Sentence Endings",
    ],
    COMPLETION: [
        "Sentence Completion",
        "Summary Completion",
        "Note Completion",
        "Table Completion",
        "Form Completion",
        "Flowchart Completion",
        "Diagram Labeling",
        "Map Labeling",
        "Short Answer",
    ],
    WRITING_TASK_1: [
        "Line Graph",
        "Bar Chart",
        "Pie Chart",
        "Table Chart",
        "Process Diagram",
        "Map",
        "Mixed Chart",
        "Letter Writing",
    ],
    WRITING_TASK_2: [
        "Opinion Essay",
        "Discussion Essay",
        "Advantages Disadvantages",
        "Problem Solution",
        "Double Question",
        "Agree Disagree",
    ],
};

const EMPTY_FORM = {
    test_context_id: "",
    module_id: "",
    question_type_id: "",
    question_group_id: "",
    type_name: "",
    question_text: "",
    instruction_text: "",
    question_mark: 1,
    sequence_number: 1,
    status: "active",
    image_url: "",
    options: [],
};

function getRequestMessage(requestError, fallback) {
    const validationErrors = requestError?.data?.errors;

    if (validationErrors) {
        return Object.values(validationErrors).flat().join(" ");
    }

    return requestError?.data?.message || fallback;
}

function getQuestionCategory(typeName) {
    for (const [category, names] of Object.entries(QUESTION_CATEGORIES)) {
        if (names.includes(typeName)) {
            return category;
        }
    }

    return "OTHER";
}

function isWritingCategory(category) {
    return category === "WRITING_TASK_1" || category === "WRITING_TASK_2";
}

function shouldShowAssetField(typeName, category) {
    return category === "WRITING_TASK_1" || typeName.includes("Labeling");
}

function getOptionKey(index, category) {
    if (category === "OBJECTIVE") {
        return String.fromCharCode(65 + index);
    }

    return String(index + 1);
}

function getInitialOptionsForType(typeName) {
    const category = getQuestionCategory(typeName);

    if (category === "OBJECTIVE") {
        return [
            { option_key: "A", option_text: "", is_correct: false },
            { option_key: "B", option_text: "", is_correct: false },
        ];
    }

    if (category === "MATCHING" || category === "COMPLETION") {
        return [{ option_key: "1", option_text: "", is_correct: true }];
    }

    return [];
}

function normalizeOptions(options, typeName) {
    const category = getQuestionCategory(typeName);
    const fallback = getInitialOptionsForType(typeName);

    if (!Array.isArray(options) || options.length === 0) {
        return fallback;
    }

    return options.map((option, index) => ({
        option_key: option?.option_key || getOptionKey(index, category),
        option_text: option?.option_text || "",
        is_correct: Boolean(option?.is_correct),
    }));
}

function buildPayload(formData, category) {
    const trimmedOptions = formData.options
        .map((option, index) => ({
            option_key: option.option_key || getOptionKey(index, category),
            option_text: option.option_text.trim(),
            is_correct: Boolean(option.is_correct),
        }))
        .filter((option) => option.option_text);

    const options = isWritingCategory(category)
        ? [
            {
                option_key: "1",
                option_text: "Writing response",
                is_correct: true,
                meta: {
                    generated_by_form: true,
                    question_category: category,
                },
            },
        ]
        : trimmedOptions.map((option) => ({
            ...option,
            meta: {
                question_category: category,
            },
        }));

    return {
        test_context_id: Number(formData.test_context_id),
        module_id: Number(formData.module_id),
        question_type_id: Number(formData.question_type_id),
        question_text: formData.question_text.trim(),
        question_mark: Number(formData.question_mark),
        sequence_number: Number(formData.sequence_number) || 1,
        status: formData.status,
        options,
    };
}

export default function QuestionFormPage({ mode, questionId }) {
    const { role } = useParams();
    const searchParams = useSearchParams();
    const router = useRouter();
    const resolvedRole = role?.toLowerCase();
    const queryString = searchParams.toString();

    const initialModuleIdFromParamsRef = useRef(searchParams.get("module_id")?.toString() || "");
    const initialQuestionTypeIdFromParamsRef = useRef(searchParams.get("question_type_id")?.toString() || "");
    const initialQuestionGroupIdFromParamsRef = useRef(searchParams.get("question_group_id")?.toString() || "");
    const initialTestContextIdFromParamsRef = useRef(searchParams.get("test_context_id")?.toString() || "");

    const [formData, setFormData] = useState({
        ...EMPTY_FORM,
        module_id: initialModuleIdFromParamsRef.current,
        question_type_id: initialQuestionTypeIdFromParamsRef.current,
        question_group_id: initialQuestionGroupIdFromParamsRef.current,
        test_context_id: initialTestContextIdFromParamsRef.current,
    });
    const [backendErrors, setBackendErrors] = useState({});
    const [formMessage, setFormMessage] = useState("");

    const isEditMode = mode === "edit";

    const { data: question, isLoading: isLoadingQuestion, isError: isQuestionError } =
        useGetQuestionQuery(questionId, { skip: !isEditMode || !questionId });
    const { data: questionTypes, isLoading: isLoadingTypes } = useGetQuestionTypesQuery();
    const { data: modules, isLoading: isLoadingModules } = useGetModulesQuery();
    const { data: questionGroups, isLoading: isLoadingGroups } = useGetQuestionGroupsQuery(
        formData.question_type_id ? { question_type_id: formData.question_type_id } : {}
    );
    const { data: fixedQuestionGroup } = useGetQuestionGroupQuery(initialQuestionGroupIdFromParamsRef.current, {
        skip: !initialQuestionGroupIdFromParamsRef.current,
    });

    const derivedTestSectionId =
        fixedQuestionGroup?.test_section_id ||
        questionGroups?.find((group) => String(group.id) === String(formData.question_group_id))?.test_section_id ||
        "";

    const { data: testContexts, isLoading: isLoadingContexts } = useGetTestContextsQuery(
        derivedTestSectionId ? { test_section_id: derivedTestSectionId } : {}
    );

    const [createQuestion, { isLoading: isCreating }] = useCreateQuestionMutation();
    const [updateQuestion, { isLoading: isUpdating }] = useUpdateQuestionMutation();

    const currentCategory = useMemo(
        () => getQuestionCategory(formData.type_name),
        [formData.type_name]
    );

    const categorizedTypes = useMemo(() => {
        if (!questionTypes) {
            return {};
        }

        const groups = {
            OBJECTIVE: [],
            MATCHING: [],
            COMPLETION: [],
            WRITING_TASK_1: [],
            WRITING_TASK_2: [],
            OTHER: [],
        };

        questionTypes.forEach((type) => {
            const category = getQuestionCategory(type.name);
            groups[category] = groups[category] || [];
            groups[category].push(type);
        });

        return groups;
    }, [questionTypes]);

    useEffect(() => {
        if (!question) {
            return;
        }

        setFormData((current) => ({
            ...current,
            test_context_id: initialTestContextIdFromParamsRef.current || String(question.test_context_id || ""),
            module_id: initialModuleIdFromParamsRef.current || String(question.module_id || ""),
            question_type_id: initialQuestionTypeIdFromParamsRef.current || String(question.question_type_id || ""),
            question_text: question.question_text || "",
            question_mark: question.question_mark || 1,
            sequence_number: question.sequence_number || 1,
            status: question.status || "active",
            options: normalizeOptions(question.options, question.question_type?.name || ""),
            type_name: question.question_type?.name || "",
        }));
    }, [question]);

    useEffect(() => {
        if (!questionTypes || !formData.question_type_id) {
            return;
        }

        const selectedType = questionTypes.find(
            (type) => String(type.id) === String(formData.question_type_id)
        );

        if (!selectedType) {
            return;
        }

        setFormData((current) => {
            const nextTypeName = selectedType.name;
            const nextModuleId =
                initialModuleIdFromParamsRef.current ||
                String(selectedType.module_id || current.module_id || "");
            const nextOptions =
                current.options.length > 0 ? current.options : getInitialOptionsForType(nextTypeName);

            if (
                current.type_name === nextTypeName &&
                String(current.module_id) === String(nextModuleId) &&
                current.options.length === nextOptions.length
            ) {
                return current;
            }

            return {
                ...current,
                type_name: nextTypeName,
                module_id: nextModuleId,
                options: nextOptions,
            };
        });
    }, [questionTypes, formData.question_type_id]);

    useEffect(() => {
        if (!fixedQuestionGroup) {
            return;
        }

        setFormData((current) => {
            const nextQuestionTypeId =
                initialQuestionTypeIdFromParamsRef.current ||
                String(fixedQuestionGroup.question_type_id || current.question_type_id || "");

            if (String(current.question_type_id) === String(nextQuestionTypeId)) {
                return current;
            }

            return {
                ...current,
                question_type_id: nextQuestionTypeId,
            };
        });
    }, [fixedQuestionGroup]);

    useEffect(() => {
        if (!testContexts?.length || !formData.test_context_id || initialTestContextIdFromParamsRef.current) {
            return;
        }

        const hasSelectedContext = testContexts.some(
            (context) => String(context.id) === String(formData.test_context_id)
        );

        if (!hasSelectedContext) {
            setFormData((current) => ({
                ...current,
                test_context_id: "",
            }));
        }
    }, [testContexts, formData.test_context_id]);

    function clearFieldError(fieldName) {
        if (!backendErrors[fieldName]) {
            return;
        }

        setBackendErrors((current) => {
            const next = { ...current };
            delete next[fieldName];
            return next;
        });
    }

    function updateField(field, value) {
        setFormData((current) => ({
            ...current,
            [field]: value,
        }));
        clearFieldError(field);
        setFormMessage("");
    }

    function handleTypeChange(event) {
        const typeId = event.target.value;
        const selectedType = questionTypes?.find((type) => String(type.id) === String(typeId));

        if (!selectedType) {
            setFormData((current) => ({
                ...current,
                question_type_id: "",
                type_name: "",
                options: [],
            }));
            return;
        }

        updateField("question_type_id", typeId);
        setFormData((current) => ({
            ...current,
            question_type_id: typeId,
            type_name: selectedType.name,
            module_id:
                initialModuleIdFromParamsRef.current ||
                String(selectedType.module_id || current.module_id || ""),
            question_group_id: initialQuestionGroupIdFromParamsRef.current || "",
            options: getInitialOptionsForType(selectedType.name),
        }));
    }

    function handleOptionChange(index, field, value) {
        setFormData((current) => {
            const nextOptions = current.options.map((option, optionIndex) => {
                if (optionIndex !== index) {
                    return option;
                }

                return {
                    ...option,
                    [field]: value,
                };
            });

            if (field === "is_correct" && value === true && currentCategory === "OBJECTIVE") {
                return {
                    ...current,
                    options: nextOptions.map((option, optionIndex) => ({
                        ...option,
                        is_correct: optionIndex === index,
                    })),
                };
            }

            return {
                ...current,
                options: nextOptions,
            };
        });
        setFormMessage("");
    }

    function addOption() {
        setFormData((current) => ({
            ...current,
            options: [
                ...current.options,
                {
                    option_key: getOptionKey(current.options.length, currentCategory),
                    option_text: "",
                    is_correct: currentCategory !== "OBJECTIVE",
                },
            ],
        }));
        setFormMessage("");
    }

    function removeOption(index) {
        const minimumOptionCount = currentCategory === "OBJECTIVE" ? 2 : 1;

        if (formData.options.length <= minimumOptionCount) {
            return;
        }

        setFormData((current) => ({
            ...current,
            options: current.options
                .filter((_, optionIndex) => optionIndex !== index)
                .map((option, optionIndex) => ({
                    ...option,
                    option_key: getOptionKey(optionIndex, currentCategory),
                })),
        }));
        setFormMessage("");
    }

    async function handleSubmit(event) {
        event.preventDefault();
        setBackendErrors({});
        setFormMessage("");

        if (!isWritingCategory(currentCategory)) {
            if (formData.options.length === 0) {
                setFormMessage("Add at least one answer item before saving.");
                return;
            }

            const hasEmptyOptions = formData.options.some((option) => !option.option_text.trim());
            if (hasEmptyOptions) {
                setFormMessage("Each answer item needs text before saving.");
                return;
            }

            if (currentCategory === "OBJECTIVE" && !formData.options.some((option) => option.is_correct)) {
                setFormMessage("Mark one correct option for objective questions.");
                return;
            }
        }

        try {
            const payload = buildPayload(formData, currentCategory);

            if (isEditMode) {
                await updateQuestion({
                    id: questionId,
                    body: payload,
                }).unwrap();
            } else {
                await createQuestion(payload).unwrap();
            }

            router.push(`/${resolvedRole}/questions${queryString ? `?${queryString}` : ""}`);
        } catch (requestError) {
            if (requestError?.data?.errors) {
                setBackendErrors(requestError.data.errors);
            } else {
                setFormMessage(
                    getRequestMessage(
                        requestError,
                        isEditMode ? "Unable to update question." : "Unable to create question."
                    )
                );
            }
        }
    }

    if (isEditMode && isLoadingQuestion) {
        return (
            <div className="flex h-[400px] items-center justify-center">
                <Loader2 className="animate-spin text-blue-600" size={32} />
            </div>
        );
    }

    if (isEditMode && isQuestionError) {
        return (
            <div className="flex h-[400px] flex-col items-center justify-center gap-3 text-slate-500">
                <AlertCircle className="text-rose-500" size={32} />
                <p className="font-medium">Unable to load this question.</p>
            </div>
        );
    }

    const isSubmitting = isCreating || isUpdating;
    const showOptionsEditor = !isWritingCategory(currentCategory);
    const pageTitle = isEditMode ? "Edit Question" : "Create Question";
    const submitLabel = isEditMode ? "Update Question" : "Create Question";

    return (
        <div className="mx-auto max-w-5xl space-y-6">
            <div className="flex items-center justify-between">
                <div className="flex items-center gap-4">
                    <Link
                        href={`/${resolvedRole}/questions${queryString ? `?${queryString}` : ""}`}
                        className="flex h-10 w-10 items-center justify-center rounded-xl border border-slate-200 bg-white text-slate-600 transition hover:bg-slate-50"
                    >
                        <ChevronLeft size={20} />
                    </Link>
                    <div>
                        <h2 className="text-2xl font-bold text-slate-900">{pageTitle}</h2>
                        <p className="text-sm text-slate-500">
                            Manage question content, type-specific answer structure, and context mapping
                        </p>
                    </div>
                </div>
            </div>

            <form onSubmit={handleSubmit} className="space-y-6">
                <div className="grid grid-cols-1 gap-6 lg:grid-cols-3">
                    <div className="space-y-6 lg:col-span-2">
                        <div className="rounded-[26px] border border-slate-200 bg-white p-6 shadow-sm">
                            <div className="mb-4 flex items-center gap-2">
                                <Type size={20} className="text-blue-600" />
                                <h3 className="text-lg font-bold text-slate-900">Content & Answers</h3>
                            </div>

                            <div className="space-y-4">
                                <div>
                                    <label className="mb-2 block text-sm font-semibold text-slate-700">
                                        Instructions (UI only)
                                    </label>
                                    <input
                                        type="text"
                                        name="instruction_text"
                                        value={formData.instruction_text}
                                        onChange={(event) => updateField("instruction_text", event.target.value)}
                                        className="w-full rounded-2xl border border-slate-200 bg-slate-50 px-4 py-3 text-slate-900 outline-none transition focus:border-blue-500"
                                        placeholder="e.g. Write NO MORE THAN TWO WORDS..."
                                    />
                                </div>

                                <div>
                                    <label className="mb-2 block text-sm font-semibold text-slate-700">
                                        {isWritingCategory(currentCategory) ? "Writing Prompt" : "Question Text"}
                                    </label>
                                    <textarea
                                        name="question_text"
                                        value={formData.question_text}
                                        onChange={(event) => updateField("question_text", event.target.value)}
                                        rows={isWritingCategory(currentCategory) ? 8 : 5}
                                        required
                                        className="w-full rounded-2xl border border-slate-200 bg-slate-50 px-4 py-3 text-slate-900 outline-none transition focus:border-blue-500 focus:ring-4 focus:ring-blue-100"
                                        placeholder="Enter the main question content here..."
                                    />
                                    {backendErrors.question_text && (
                                        <p className="mt-1 text-xs text-rose-500">{backendErrors.question_text[0]}</p>
                                    )}
                                </div>

                                {shouldShowAssetField(formData.type_name, currentCategory) && (
                                    <div>
                                        <label className="mb-2 block text-sm font-semibold text-slate-700">
                                            Asset/Image URL (UI only)
                                        </label>
                                        <div className="relative">
                                            <ImageIcon
                                                size={18}
                                                className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-400"
                                            />
                                            <input
                                                type="text"
                                                name="image_url"
                                                value={formData.image_url}
                                                onChange={(event) => updateField("image_url", event.target.value)}
                                                className="w-full rounded-2xl border border-slate-200 bg-slate-50 py-3 pl-11 pr-4 text-slate-900 outline-none transition focus:border-blue-500"
                                                placeholder="https://example.com/asset.png"
                                            />
                                        </div>
                                    </div>
                                )}

                                <div className="border-t border-slate-100 pt-4">
                                    {showOptionsEditor ? (
                                        <>
                                            <div className="mb-4 flex items-center justify-between">
                                                <div className="flex items-center gap-2">
                                                    <LayoutList size={18} className="text-blue-600" />
                                                    <h3 className="text-lg font-bold text-slate-900">
                                                        {currentCategory === "MATCHING" ? "Matching Items" : "Answer Options"}
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

                                            <div className="space-y-3">
                                                {formData.options.map((option, index) => (
                                                    <div key={`${option.option_key}-${index}`} className="flex items-start gap-3">
                                                        <div className="flex flex-1 items-center gap-3 rounded-2xl border border-slate-200 bg-slate-50 p-3">
                                                            <span className="flex h-8 w-8 shrink-0 items-center justify-center rounded-lg bg-white font-bold text-slate-500 shadow-sm">
                                                                {option.option_key}
                                                            </span>
                                                            <input
                                                                type="text"
                                                                value={option.option_text}
                                                                onChange={(event) =>
                                                                    handleOptionChange(index, "option_text", event.target.value)
                                                                }
                                                                required
                                                                placeholder={
                                                                    currentCategory === "MATCHING"
                                                                        ? "Enter matching text..."
                                                                        : "Enter answer text..."
                                                                }
                                                                className="flex-1 bg-transparent text-sm outline-none"
                                                            />
                                                            <button
                                                                type="button"
                                                                onClick={() =>
                                                                    handleOptionChange(index, "is_correct", !option.is_correct)
                                                                }
                                                                className={`flex h-8 items-center gap-2 rounded-lg border border-slate-100 px-3 shadow-sm transition ${
                                                                    option.is_correct
                                                                        ? "bg-emerald-50 text-emerald-600"
                                                                        : "bg-white text-slate-400 hover:text-slate-600"
                                                                }`}
                                                            >
                                                                <CheckCircle2 size={16} />
                                                                <span className="text-xs font-bold">
                                                                    {option.is_correct ? "Selected" : "Mark Correct"}
                                                                </span>
                                                            </button>
                                                        </div>
                                                        <button
                                                            type="button"
                                                            onClick={() => removeOption(index)}
                                                            className="mt-3 text-slate-300 transition hover:text-rose-500"
                                                        >
                                                            <Trash2 size={18} />
                                                        </button>
                                                    </div>
                                                ))}
                                            </div>
                                        </>
                                    ) : (
                                        <div className="rounded-2xl border border-dashed border-slate-200 bg-slate-50 p-4 text-sm text-slate-500">
                                            Writing question types do not need manual answer options in this form.
                                            A placeholder answer record will be submitted automatically for the current backend.
                                        </div>
                                    )}
                                </div>
                            </div>
                        </div>
                    </div>

                    <div className="space-y-6">
                        <div className="rounded-[26px] border border-slate-200 bg-white p-6 shadow-sm">
                            <h3 className="mb-4 text-lg font-bold text-slate-900">Classification</h3>
                            <div className="space-y-4">
                                <div>
                                    <label className="mb-2 block text-sm font-semibold text-slate-700">
                                        Question Type
                                    </label>
                                    <select
                                        value={formData.question_type_id}
                                        onChange={handleTypeChange}
                                        required
                                        disabled={isLoadingTypes || !!initialQuestionTypeIdFromParamsRef.current}
                                        className="w-full appearance-none rounded-2xl border border-slate-200 bg-slate-50 px-4 py-3 text-slate-900 outline-none transition focus:border-blue-500 disabled:opacity-50"
                                    >
                                        <option value="">Select a type...</option>
                                        {Object.entries(categorizedTypes).map(([category, items]) =>
                                            items?.length ? (
                                                <optgroup key={category} label={category.replace(/_/g, " ")}>
                                                    {items.map((type) => (
                                                        <option key={type.id} value={String(type.id)}>
                                                            {type.name}
                                                        </option>
                                                    ))}
                                                </optgroup>
                                            ) : null
                                        )}
                                    </select>
                                    {backendErrors.question_type_id && (
                                        <p className="mt-1 text-xs text-rose-500">{backendErrors.question_type_id[0]}</p>
                                    )}
                                </div>

                                <div>
                                    <label className="mb-2 block text-sm font-semibold text-slate-700">Module</label>
                                    <select
                                        name="module_id"
                                        value={formData.module_id}
                                        onChange={(event) => updateField("module_id", event.target.value)}
                                        required
                                        disabled={isLoadingModules || !!initialModuleIdFromParamsRef.current}
                                        className="w-full appearance-none rounded-2xl border border-slate-200 bg-slate-50 px-4 py-3 text-slate-900 outline-none transition focus:border-blue-500 disabled:opacity-50"
                                    >
                                        <option value="">Select a module...</option>
                                        {modules?.map((module) => (
                                            <option key={module.id} value={String(module.id)}>
                                                {module.name || module.title}
                                            </option>
                                        ))}
                                    </select>
                                    {backendErrors.module_id && (
                                        <p className="mt-1 text-xs text-rose-500">{backendErrors.module_id[0]}</p>
                                    )}
                                </div>

                                <div>
                                    <label className="mb-2 block text-sm font-semibold text-slate-700">
                                        Question Group
                                    </label>
                                    <select
                                        name="question_group_id"
                                        value={formData.question_group_id}
                                        onChange={(event) => updateField("question_group_id", event.target.value)}
                                        disabled={isLoadingGroups || !!initialQuestionGroupIdFromParamsRef.current}
                                        className="w-full appearance-none rounded-2xl border border-slate-200 bg-slate-50 px-4 py-3 text-slate-900 outline-none transition focus:border-blue-500 disabled:opacity-50"
                                    >
                                        <option value="">Select a group...</option>
                                        {questionGroups?.map((group) => (
                                            <option key={group.id} value={String(group.id)}>
                                                {group.title || `Group #${group.id}`}
                                            </option>
                                        ))}
                                    </select>
                                </div>

                                <div>
                                    <label className="mb-2 block text-sm font-semibold text-slate-700">
                                        Test Context
                                    </label>
                                    <div className="relative">
                                        <Layers
                                            size={18}
                                            className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-400"
                                        />
                                        <select
                                            name="test_context_id"
                                            value={formData.test_context_id}
                                            onChange={(event) => updateField("test_context_id", event.target.value)}
                                            required
                                            disabled={isLoadingContexts || !!initialTestContextIdFromParamsRef.current}
                                            className="w-full appearance-none rounded-2xl border border-slate-200 bg-slate-50 py-3 pl-11 pr-4 text-slate-900 outline-none transition focus:border-blue-500 disabled:opacity-50"
                                        >
                                            <option value="">Select a test context...</option>
                                            {testContexts?.map((context) => (
                                                <option key={context.id} value={String(context.id)}>
                                                    {context.test_section?.title
                                                        ? `${context.test_section.title} - Context #${context.id}`
                                                        : `Context #${context.id}`}
                                                </option>
                                            ))}
                                        </select>
                                    </div>
                                    {backendErrors.test_context_id && (
                                        <p className="mt-1 text-xs text-rose-500">{backendErrors.test_context_id[0]}</p>
                                    )}
                                </div>

                                <div className="grid grid-cols-2 gap-4">
                                    <div>
                                        <label className="mb-2 block text-sm font-semibold text-slate-700">Marks</label>
                                        <input
                                            type="number"
                                            name="question_mark"
                                            value={formData.question_mark}
                                            onChange={(event) => updateField("question_mark", event.target.value)}
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
                                            onChange={(event) => updateField("sequence_number", event.target.value)}
                                            min="1"
                                            required
                                            className="w-full rounded-2xl border border-slate-200 bg-slate-50 px-4 py-3 text-slate-900 outline-none transition focus:border-blue-500 focus:ring-4 focus:ring-blue-100"
                                        />
                                    </div>
                                </div>

                                <div>
                                    <label className="mb-2 block text-sm font-semibold text-slate-700">Status</label>
                                    <select
                                        name="status"
                                        value={formData.status}
                                        onChange={(event) => updateField("status", event.target.value)}
                                        className="w-full appearance-none rounded-2xl border border-slate-200 bg-slate-50 px-4 py-3 text-slate-900 outline-none transition focus:border-blue-500 focus:ring-4 focus:ring-blue-100"
                                    >
                                        <option value="active">Active</option>
                                        <option value="inactive">Inactive</option>
                                    </select>
                                </div>
                            </div>
                        </div>

                        {formMessage && (
                            <div className="rounded-2xl border border-amber-200 bg-amber-50 px-4 py-3 text-sm font-medium text-amber-700">
                                {formMessage}
                            </div>
                        )}

                        <div className="rounded-[26px] border border-slate-200 bg-white p-5 shadow-sm">
                            <div className="flex items-start gap-3 text-sm text-slate-500">
                                <FileText className="mt-0.5 text-slate-400" size={18} />
                                <p>
                                    `instruction_text`, `image_url`, and `question_group_id` are managed in this UI,
                                    but the current question API only persists the core question fields plus options.
                                </p>
                            </div>
                        </div>

                        <button
                            type="submit"
                            disabled={isSubmitting}
                            className="flex w-full items-center justify-center gap-2 rounded-[22px] bg-blue-600 py-4 text-sm font-bold text-white shadow-lg transition hover:bg-blue-700 hover:-translate-y-0.5 disabled:opacity-50 disabled:hover:translate-y-0"
                        >
                            {isSubmitting ? (
                                <Loader2 className="animate-spin" size={20} />
                            ) : (
                                <Save size={20} />
                            )}
                            {isSubmitting ? "Processing..." : submitLabel}
                        </button>
                    </div>
                </div>
            </form>
        </div>
    );
}
