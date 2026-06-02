"use client";

import React from 'react';
import MatchingFeature from './questions/MatchingFeature';
import MapLabeling from './questions/MapLabeling';
import FormCompletion from './questions/FormCompletion';
import FlowchartCompletion from './questions/FlowchartCompletion';
import DiagramLabeling from './questions/DiagramLabeling';
import ShortAnswerFile from './questions/ShortAnswer';
import MultipleChoose from './questions/MultipleChoose';
import SentenceCompletion from './questions/SentenceCompletion';
import NoteCompletion from './questions/NoteCompletion';
import MatchingSentenceEnding from './questions/MatchingSentenceEnding';
import MatchingInformation from './questions/MatchingInformation';
import MatchingHeading from './questions/MatchingHeading';
import YesNoNotGiven from './questions/YesNoNotGiven';
import TrueFalseNotGiven from './questions/TrueFalseNotGiven';
import TableCompletion from './questions/TableCompletion';
import SummaryCompletion from './questions/SummaryCompletion';

// Local implementation of common question types for immediate use
const MultipleChoice = ({ question, value, onChange, disabled }) => {
    const options = question.options || [];
    return (
        <div className="space-y-3">
            <p className="text-slate-700 font-medium mb-4">{question.text}</p>
            <div className="grid gap-2">
                {options.map((option, idx) => (
                    <label 
                        key={idx}
                        className={`flex items-center gap-3 p-4 rounded-xl border-2 transition-all cursor-pointer ${
                            value === option 
                            ? "border-blue-500 bg-blue-50 text-blue-900 shadow-sm" 
                            : "border-slate-100 hover:border-slate-200 bg-white"
                        } ${disabled ? "opacity-60 cursor-not-allowed" : ""}`}
                    >
                        <input 
                            type="radio"
                            name={`question-${question.id}`}
                            value={option}
                            checked={value === option}
                            onChange={() => !disabled && onChange(option)}
                            className="w-4 h-4 text-blue-600 border-slate-300 focus:ring-blue-500"
                            disabled={disabled}
                        />
                        <span className="text-sm font-medium">{option}</span>
                    </label>
                ))}
            </div>
        </div>
    );
};

const ShortAnswer = ({ question, value, onChange, disabled }) => {
    return (
        <div className="space-y-3">
            <p className="text-slate-700 font-medium mb-4">{question.text}</p>
            <input 
                type="text"
                value={value || ""}
                onChange={(e) => !disabled && onChange(e.target.value)}
                placeholder="Type your answer here..."
                className="w-full max-w-md rounded-xl border border-slate-200 bg-slate-50 px-4 py-3 text-slate-900 outline-none transition focus:border-blue-500 focus:ring-4 focus:ring-blue-100 disabled:opacity-60"
                disabled={disabled}
            />
        </div>
    );
};

const TrueFalse = ({ question, value, onChange, disabled }) => {
    const options = ["True", "False"];
    return <MultipleChoice question={{ ...question, options }} value={value} onChange={onChange} disabled={disabled} />;
};

/**
 * Dynamic Question Router
 * Maps question.type to the appropriate component
 */
export default function QuestionRenderer({ question, value, onChange, disabled = false }) {
    if (!question) return null;

    const renderComponent = () => {
        switch (question.type) {
            case 'multiple_choice':
            case 'single_choice':
                return <MultipleChoice question={question} value={value} onChange={onChange} disabled={disabled} />;
            
            case 'short_answer':
            case 'fill_in_the_blanks':
                return <ShortAnswerFile question={question} value={value} onChange={onChange} disabled={disabled} />;

            case 'multiple_choose':
            case 'multiple_selection':
                return <MultipleChoose question={question} value={value} onChange={onChange} disabled={disabled} />;

            case 'sentence_completion':
            case 'sentence_completion_blanks':
                return <SentenceCompletion question={question} value={value} onChange={onChange} disabled={disabled} />;

            case 'note_completion':
                return <NoteCompletion question={question} value={value} onChange={onChange} disabled={disabled} />;

            case 'matching_sentence_ending':
                return <MatchingSentenceEnding question={question} value={value} onChange={onChange} disabled={disabled} />;

            case 'matching_information':
                return <MatchingInformation question={question} value={value} onChange={onChange} disabled={disabled} />;

            case 'matching_heading':
                return <MatchingHeading question={question} value={value} onChange={onChange} disabled={disabled} />;

            case 'yes_no_not_given':
                return <YesNoNotGiven question={question} value={value} onChange={onChange} disabled={disabled} />;

            case 'true_false_not_given':
                return <TrueFalseNotGiven question={question} value={value} onChange={onChange} disabled={disabled} />;

            case 'table_completion':
                return <TableCompletion question={question} value={value} onChange={onChange} disabled={disabled} />;

            case 'summary_completion':
                return <SummaryCompletion question={question} value={value} onChange={onChange} disabled={disabled} />;
            
            case 'true_false':
                return <TrueFalse question={question} value={value} onChange={onChange} disabled={disabled} />;

            case 'matching':
            case 'matching_feature':
                return <MatchingFeature question={question} value={value} onChange={onChange} disabled={disabled} />;

            case 'map_labeling':
            case 'map_label':
                return <MapLabeling question={question} value={value} onChange={onChange} disabled={disabled} />;

            case 'form_completion':
            case 'form_fill':
                return <FormCompletion question={question} value={value} onChange={onChange} disabled={disabled} />;

            case 'flowchart_completion':
            case 'flowchart_fill':
                return <FlowchartCompletion question={question} value={value} onChange={onChange} disabled={disabled} />;

            case 'diagram_labeling':
            case 'diagram_label':
                return <DiagramLabeling question={question} value={value} onChange={onChange} disabled={disabled} />;

            default:
                return (
                    <div className="p-4 rounded-xl border border-amber-200 bg-amber-50 text-amber-700 text-sm">
                        <p className="font-bold">Question type "{question.type}" not yet supported.</p>
                        <pre className="mt-2 text-[10px] opacity-70 overflow-auto">
                            {JSON.stringify(question, null, 2)}
                        </pre>
                    </div>
                );
        }
    };

    return (
        <div className="animate-in fade-in slide-in-from-bottom-2 duration-500">
            {renderComponent()}
        </div>
    );
}