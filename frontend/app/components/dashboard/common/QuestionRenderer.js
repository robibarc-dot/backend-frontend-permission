"use client";

import React from 'react';
import MatchingFeature from './questions/MatchingFeature';
import MapLabeling from './questions/MapLabeling';
import FormCompletion from './questions/FormCompletion';
import FlowchartCompletion from './questions/FlowchartCompletion';
import DiagramLabeling from './questions/DiagramLabeling';
import ShortAnswerFile from './questions/ShortAnswer';
import MultipleChoice from './questions/MultipleChoice';
import SingleChoice from './questions/SingleChoice';
import SentenceCompletion from './questions/SentenceCompletion';
import NoteCompletion from './questions/NoteCompletion';
import MatchingSentenceEnding from './questions/MatchingSentenceEnding';
import MatchingInformation from './questions/MatchingInformation';
import MatchingHeading from './questions/MatchingHeading';
import YesNoNotGiven from './questions/YesNoNotGiven';
import TrueFalseNotGiven from './questions/TrueFalseNotGiven';
import TableCompletion from './questions/TableCompletion';
import SummaryCompletion from './questions/SummaryCompletion';

 
/**
 * Dynamic Question Router
 * Maps question.type to the appropriate component
 */
export default function QuestionRenderer({ question, value, onChange, disabled = false }) {
    if (!question) return null;

    const renderComponent = () => {
        switch (question.type) {
            case 'multiple_choice':                
                return <MultipleChoice question={question} value={value} onChange={onChange} disabled={disabled} />;

            case 'single_choice':
                return <SingleChoice question={question} value={value} onChange={onChange} disabled={disabled} />;

            case 'short_answer':                
                return <ShortAnswerFile question={question} value={value} onChange={onChange} disabled={disabled} />;

            case 'sentence_completion':
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
            
            case 'matching_feature':
                return <MatchingFeature question={question} value={value} onChange={onChange} disabled={disabled} />;

            case 'map_labeling':
                return <MapLabeling question={question} value={value} onChange={onChange} disabled={disabled} />;

            case 'form_completion':
                return <FormCompletion question={question} value={value} onChange={onChange} disabled={disabled} />;

            case 'flowchart_completion':
                return <FlowchartCompletion question={question} value={value} onChange={onChange} disabled={disabled} />;

            case 'diagram_labeling':
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