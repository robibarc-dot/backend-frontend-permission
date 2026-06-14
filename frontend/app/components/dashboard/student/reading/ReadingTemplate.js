"use client";

import QuestionRenderer from '../../common/QuestionRenderer';

export default function ReadingTemplate({ passage, questions, answers, onAnswerChange }) {
    return (
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 h-full">
            <div className="overflow-y-auto pr-4 border-r border-slate-100 custom-scrollbar">
                <h2 className="text-2xl font-bold mb-4">{passage.title}</h2>
                <div className="prose prose-slate max-w-none text-slate-700 leading-relaxed">
                    {passage.content}
                </div>
            </div>

            <div className="overflow-y-auto space-y-12 pb-20">
                {questions.map((q, index) => (
                    <div key={q.id} className="space-y-4">
                        <div className="flex gap-3">
                            <span className="flex-shrink-0 w-8 h-8 rounded-full bg-blue-600 text-white flex items-center justify-center font-bold">
                                {index + 1}
                            </span>
                            <div className="flex-1">
                                <QuestionRenderer 
                                    question={q}
                                    value={answers[q.id]}
                                    onChange={(val) => onAnswerChange(q.id, val)}
                                />
                            </div>
                        </div>
                    </div>
                ))}
            </div>
        </div>
    );
}
