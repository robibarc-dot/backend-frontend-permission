"use client";

import QuestionRenderer from '../../common/QuestionRenderer';
import AudioPlayer from '../../common/AudioPlayer';

export default function ListeningTemplate({ audioUrl, questions, answers, onAnswerChange }) {
    return (
        <div className="max-w-4xl mx-auto space-y-8">
            <div className="sticky top-0 z-10 bg-white/80 backdrop-blur-md p-6 rounded-3xl border border-slate-200 shadow-sm">
                <AudioPlayer src={audioUrl} />
                <p className="mt-2 text-sm text-slate-500 text-center italic">
                    Listen to the recording and answer the questions below.
                </p>
            </div>

            <div className="space-y-10">
                {questions.map((q, index) => (
                    <section key={q.id} className="bg-white p-6 rounded-[26px] border border-slate-100 shadow-sm">
                        <h3 className="text-lg font-semibold text-slate-800 mb-6 flex items-center gap-3">
                            <span className="text-blue-500 text-sm font-mono">Question {index + 1}</span>
                        </h3>
                        <QuestionRenderer 
                            question={q}
                            value={answers[q.id]}
                            onChange={(val) => onAnswerChange(q.id, val)}
                        />
                    </section>
                ))}
            </div>
        </div>
    );
}
