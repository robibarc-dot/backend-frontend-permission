"use client";

export default function WritingTemplate({
    task,
    value = "",
    onChange,
    onSubmit,
    disabled = false,
}) {
    const wordsCount = value.trim() ? value.trim().split(/\s+/).length : 0;
    const progress = Math.min(100, Math.round((wordsCount / 250) * 100));

    return (
        <div className="space-y-3.5">
            <div className="rounded-xl border border-black/10 bg-gray-100 p-[18px]">
                <div className="mb-2 flex flex-wrap items-center justify-between gap-2">
                    <p className="text-[11px] font-bold uppercase tracking-[0.12em] text-gray-400">
                        {task?.taskLabel || "Writing Task"}
                    </p>
                    <span className="rounded-md bg-white px-2 py-1 text-[10.5px] font-bold text-gray-500">
                        {wordsCount} words
                    </span>
                </div>
                {task?.instruction ? (
                    <p className="mb-2 text-[12px] font-semibold text-gray-500">{task.instruction}</p>
                ) : null}
                <p className="text-[13px] leading-7 text-gray-600">{task?.prompt}</p>
                {task?.tags?.length ? (
                    <div className="mt-3 flex flex-wrap gap-2">
                        {task.tags.map((tag) => (
                            <span key={tag} className="rounded-md bg-gray-200 px-2 py-1 text-[11px] text-gray-500">
                                {tag}
                            </span>
                        ))}
                    </div>
                ) : null}
            </div>

            <textarea
                value={value}
                onChange={(event) => onChange?.(event.target.value)}
                placeholder="Start writing your essay here..."
                disabled={disabled}
                className="min-h-[320px] w-full resize-y rounded-xl border border-black/10 bg-white p-4 text-[13px] leading-7 text-gray-700 outline-none transition placeholder:text-gray-300 focus:border-red-300 focus:ring-4 focus:ring-red-50 disabled:cursor-not-allowed disabled:opacity-60"
            />

            <div className="flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
                <div className="min-w-0 flex-1">
                    <div className="h-1.5 overflow-hidden rounded-full bg-gray-200">
                        <div className="h-full rounded-full bg-red-600 transition-all" style={{ width: `${progress}%` }} />
                    </div>
                    {wordsCount < 10 ? (
                        <p className="mt-2 text-[11px] text-gray-400">Write at least a few sentences before submitting.</p>
                    ) : (
                        <p className="mt-2 text-[11px] text-gray-400">Aim for at least 250 words in Task 2.</p>
                    )}
                </div>
                {onSubmit ? (
                    <button
                        type="button"
                        onClick={onSubmit}
                        disabled={disabled || wordsCount < 10}
                        className="inline-flex items-center justify-center rounded-[9px] bg-red-600 px-4 py-2.5 text-[13px] font-bold text-white transition hover:bg-red-700 disabled:cursor-not-allowed disabled:bg-gray-300"
                    >
                        Submit for Basic Check
                    </button>
                ) : null}
            </div>
        </div>
    );
}
