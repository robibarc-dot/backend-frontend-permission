"use client";

import React from 'react';
import { Info } from 'lucide-react';
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
import GroupTitle from './questions/GroupTitle';

/**
 * Group instruction - shown separately when present
 */
function GroupInstruction({ instruction }) {
    if (!instruction) return null;
    return (
        <div className="flex items-start gap-2 rounded-lg border border-indigo-100 bg-indigo-50/50 p-4 dark:border-indigo-900/20 dark:bg-indigo-950/20">
            <Info size={15} className="mt-0.5 shrink-0 text-indigo-500" />
            <div
                className="prose prose-sm max-w-none leading-6 text-slate-600 dark:prose-invert dark:text-slate-300 [&_p]:my-1 [&_ul]:my-1 [&_ol]:my-1 [&_li]:my-0.5"
                dangerouslySetInnerHTML={{ __html: instruction }}
            />
        </div>
    );
}

/**
 * Normalize a raw backend Question model into the format
 * expected by question components.
 */
function normalizeQuestion(rawQuestion) {
    return {
        id: rawQuestion.id,
        type: rawQuestion.questionType?.slug || rawQuestion.question_type_slug || null,
        type_name: rawQuestion.questionType?.name || rawQuestion.question_type_name || null,
        text: rawQuestion.question_text || rawQuestion.text || '',
        question_text: rawQuestion.question_text || rawQuestion.text || '',
        mark: rawQuestion.question_mark ?? rawQuestion.mark ?? 1,
        question_mark: rawQuestion.question_mark ?? rawQuestion.mark ?? 1,
        sequence_number: rawQuestion.sequence_number ?? rawQuestion.sequence ?? 1,
        status: rawQuestion.status || 'active',
        options: (rawQuestion.options || []).map((opt) => ({
            id: opt.id,
            key: opt.option_key || opt.key || '',
            text: opt.option_text || opt.text || '',
            meta: opt.meta || null,
        })),
        questions: rawQuestion.questions || null,
        module: rawQuestion.module || null,
    };
}

function formatLabel(value, fallback = 'General') {
    if (!value) return fallback;
    return String(value)
        .replace(/[_-]/g, ' ')
        .replace(/\b\w/g, (letter) => letter.toUpperCase());
}

/**
 * Extract group-level data for matching/heading question types.
 * For these types, the group's questions collectively form the matching exercise:
 * - Each question's text becomes a left-side item / paragraph
 * - All unique options across questions become right-side items / headings
 */
function extractGroupMatchingData(normalizedQuestions) {
    const leftItems = normalizedQuestions.map((q) => q.question_text || q.text || '');
    const allOptions = [];
    const seen = new Set();
    normalizedQuestions.forEach((q) => {
        (q.options || []).forEach((opt) => {
            const key = opt.key || opt.text || '';
            if (!seen.has(key)) {
                seen.add(key);
                allOptions.push(key);
            }
        });
    });
    return { leftItems, rightItems: allOptions };
}

/**
 * Extract group-level data for True/False/Not Given and Yes/No/Not Given types.
 * Each question in the group has its own text and options.
 */
function extractGroupBooleanData(normalizedQuestions) {
    return normalizedQuestions.map((q) => ({
        id: q.id,
        text: q.question_text || q.text || '',
        options: q.options || [],
        mark: q.mark || q.question_mark || 1,
        sequence_number: q.sequence_number || 1,
    }));
}

/**
 * Renders a question group with its title, instruction, and questions.
 * All questions in the group render inside ONE single card, in serial order.
 * For group-aware types (table_completion, matching_*, true_false_not_given, yes_no_not_given),
 * all questions render as a single group-level component.
 * For individual types, each question renders serially with its number inside the single card.
 */
function QuestionGroupRenderer({ group, sectionModule, answers, disabled, onAnswer, onFocusChange, globalQuestionIndex }) {
    const groupQuestions = group.questions || [];
    if (!groupQuestions.length) return null;

    const qType = group.question_type?.slug || groupQuestions[0]?.questionType?.slug || null;
    const normalizedQuestions = groupQuestions.map((q) => normalizeQuestion(q));

    // Determine if this is a group-aware type that should render all questions together
    const isGroupAwareType = [
        'table_completion',
        'matching_heading',
        'matching_information',
        'matching_sentence_ending',
        'matching_feature',
        'true_false_not_given',
        'yes_no_not_given',
    ].includes(qType);

    return (
        <div className="space-y-4">
            {/* Group instruction - shown separately when present */}
            <GroupInstruction instruction={group.instruction} />

            {/* Single card for ALL questions in the group */}
            <div className="space-y-4 rounded-xl border border-slate-100 bg-white p-5 shadow-sm dark:border-slate-800 dark:bg-slate-900">
                <p className="text-xs font-bold uppercase tracking-wide text-rose-500">
                    {sectionModule || 'Practice'} / {formatLabel(qType, 'Questions')}
                </p>

                {isGroupAwareType ? (
                    <GroupAwareRenderer
                        type={qType}
                        questions={normalizedQuestions}
                        group={group}
                        answers={answers}
                        disabled={disabled}
                        onAnswer={onAnswer}
                        onFocusChange={onFocusChange}
                        globalQuestionIndex={globalQuestionIndex}
                    />
                ) : (
                    /* Individual question types render each question serially inside the single card */
                    <div className="space-y-6">
                        {normalizedQuestions.map((question, qIdx) => {
                            const globalIdx = globalQuestionIndex ? globalQuestionIndex(question.id) : -1;
                            const questionNumber = globalIdx !== -1 ? globalIdx + 1 : qIdx + 1;

                            return (
                                <div key={question.id} id={`question-${question.id}`} className="border-b border-slate-100 pb-5 last:border-0 last:pb-0">
                                    <div className="flex flex-col gap-2 md:flex-row md:items-start md:justify-between mb-4">
                                        <div className="flex-1">
                                            <h3 className="text-base font-semibold leading-7 text-slate-800 dark:text-slate-100">
                                                <span className="mr-2 text-slate-400">{questionNumber}.</span>
                                                {question.question_text || question.text}
                                            </h3>
                                        </div>
                                        <span className="shrink-0 rounded-md border border-slate-100 bg-slate-50 px-2.5 py-1 text-xs font-semibold text-slate-500 dark:border-slate-700 dark:bg-slate-800 dark:text-slate-300">
                                            {question.mark || question.question_mark} mark
                                            {(question.mark || question.question_mark) === 1 ? '' : 's'}
                                        </span>
                                    </div>

                                    <SingleQuestionRenderer
                                        type={qType}
                                        question={question}
                                        value={answers[question.id]}
                                        disabled={disabled}
                                        onChange={(answer) => onAnswer(question.id, answer)}
                                    />
                                </div>
                            );
                        })}
                    </div>
                )}
            </div>
        </div>
    );
}

/**
 * Helper to check if a cell is blank (used for building position-to-question mapping)
 */
function isBlankCell(cell) {
    if (!cell) return true;
    if (typeof cell === 'object') {
        return cell.isBlank === true || (cell.text === null || cell.text === undefined || cell.text === '');
    }
    return false;
}

/**
 * Renders group-aware question types where all questions in the group
 * are rendered together as a single component.
 * Each question is wrapped with an id for scroll-to navigation.
 */
function GroupAwareRenderer({ type, questions, group, answers, disabled, onAnswer, onFocusChange, globalQuestionIndex }) {
    switch (type) {
        case 'table_completion': {
            const firstQId = questions[0]?.id;
            // Table completion stores its data under the first question's ID key
            const tableValue = firstQId ? (answers[firstQId] || {}) : {};

            // Build a map from cell position "row-col" to question ID
            // This allows the navigator to detect which sub-questions are answered
            const positionToQuestionId = {};
            if (questions.length > 0 && (questions[0]?.columns || questions[0]?.rows)) {
                let qIdx = 0;
                const rows = questions[0].rows || [];
                const cols = questions[0].columns || [];
                rows.forEach((row, ri) => {
                    const cells = row.cells || Array(cols.length).fill(null);
                    cells.forEach((cell, ci) => {
                        if (qIdx < questions.length && isBlankCell(cell)) {
                            positionToQuestionId[`${ri}-${ci}`] = questions[qIdx].id;
                            qIdx++;
                        }
                    });
                });
            }

            return (
                <div id={firstQId ? `question-${firstQId}` : undefined}>
                    <TableCompletion
                        title={group.title || null}
                        question={{
                            groupQuestions: questions,
                            columns: questions[0]?.columns || [],
                            rows: questions[0]?.rows || [],
                            questionIds: questions.map(q => q.id),
                        }}
                        positionToQuestionId={positionToQuestionId}
                        value={tableValue}
                        onChange={(newVal) => {
                            if (firstQId) {
                                // Merge with existing table data to preserve all answers
                                const merged = { ...(answers[firstQId] || {}), ...(newVal || {}) };
                                // Store the merged table data under first question ID for persistence
                                onAnswer(firstQId, merged);
                            }
                        }}
                        onFocusChange={(cellKey) => {
                            // Map cell position to actual question ID
                            const questionId = positionToQuestionId[cellKey];
                            if (questionId && onFocusChange) {
                                onFocusChange(questionId);
                            }
                        }}
                        disabled={disabled}
                    />
                </div>
            );
        }

        case 'matching_information': {
            const { leftItems, rightItems } = extractGroupMatchingData(questions);
            const syntheticQuestion = {
                id: group.id || 'matching-info-group',
                text: group.instruction || '',
                prompts: leftItems,
                options: rightItems,
                leftItems: leftItems,
                rightItems: rightItems,
            };
            return (
                <MatchingInformation
                    question={syntheticQuestion}
                    value={answers}
                    onChange={(newVal) => {
                        onAnswer(`group_${group.id || type}`, newVal);
                    }}
                    disabled={disabled}
                />
            );
        }

        case 'matching_sentence_ending': {
            const { leftItems, rightItems } = extractGroupMatchingData(questions);
            const syntheticQuestion = {
                id: group.id || 'matching-sentence-group',
                text: group.instruction || '',
                beginnings: leftItems,
                endings: rightItems,
                leftItems: leftItems,
                rightItems: rightItems,
            };
            return (
                <MatchingSentenceEnding
                    question={syntheticQuestion}
                    value={answers}
                    onChange={(newVal) => {
                        onAnswer(`group_${group.id || type}`, newVal);
                    }}
                    disabled={disabled}
                />
            );
        }

        case 'matching_feature': {
            const { leftItems, rightItems } = extractGroupMatchingData(questions);
            const syntheticQuestion = {
                id: group.id || 'matching-feature-group',
                text: group.instruction || '',
                leftItems: leftItems,
                rightItems: rightItems,
                options: questions.flatMap((q) => q.options || []),
            };
            return (
                <MatchingFeature
                    question={syntheticQuestion}
                    value={answers}
                    onChange={(newVal) => {
                        onAnswer(`group_${group.id || type}`, newVal);
                    }}
                    disabled={disabled}
                />
            );
        }

        case 'true_false_not_given': {
            const booleanQuestions = extractGroupBooleanData(questions);
            return (
                <div className="space-y-6">
                    {booleanQuestions.map((bq, idx) => {
                        const globalIdx = globalQuestionIndex ? globalQuestionIndex(bq.id) : -1;
                        const questionNumber = globalIdx !== -1 ? globalIdx + 1 : idx + 1;
                        return (
                            <div key={bq.id} id={`question-${bq.id}`} className="border-b border-slate-100 pb-4 last:border-0 last:pb-0">
                                <h3 className="text-base font-semibold leading-7 text-slate-800 dark:text-slate-100 mb-3">
                                    <span className="mr-2 text-slate-400">{questionNumber}.</span>
                                    {bq.text}
                                </h3>
                                <TrueFalseNotGiven
                                    question={{
                                        id: bq.id,
                                        text: bq.text,
                                        options: bq.options,
                                    }}
                                    value={answers[bq.id] || ''}
                                    onChange={(answer) => onAnswer(bq.id, answer)}
                                    disabled={disabled}
                                />
                            </div>
                        );
                    })}
                </div>
            );
        }

        case 'yes_no_not_given': {
            const booleanQuestions = extractGroupBooleanData(questions);
            return (
                <div className="space-y-6">
                    {booleanQuestions.map((bq, idx) => {
                        const globalIdx = globalQuestionIndex ? globalQuestionIndex(bq.id) : -1;
                        const questionNumber = globalIdx !== -1 ? globalIdx + 1 : idx + 1;
                        return (
                            <div key={bq.id} id={`question-${bq.id}`} className="border-b border-slate-100 pb-4 last:border-0 last:pb-0">
                                <h3 className="text-base font-semibold leading-7 text-slate-800 dark:text-slate-100 mb-3">
                                    <span className="mr-2 text-slate-400">{questionNumber}.</span>
                                    {bq.text}
                                </h3>
                                <YesNoNotGiven
                                    question={{
                                        id: bq.id,
                                        text: bq.text,
                                        options: bq.options,
                                    }}
                                    value={answers[bq.id] || ''}
                                    onChange={(answer) => onAnswer(bq.id, answer)}
                                    disabled={disabled}
                                />
                            </div>
                        );
                    })}
                </div>
            );
        }

        default:
            return (
                <div className="p-4 rounded-xl border border-amber-200 bg-amber-50 text-amber-700 text-sm">
                    <p className="font-bold">Question type "{type}" not yet supported for group rendering.</p>
                </div>
            );
    }
}

/**
 * Dynamic Question Router
 * Maps question.type to the appropriate component
 * 
 * Props:
 * - question: single question object
 * - questionGroup: question group object (for group rendering)
 * - value: current answer value
 * - onChange: answer change handler
 * - disabled: whether inputs are disabled
 * - sectionModule: module title for display
 * - globalQuestionIndex: function to get global question index
 */
export default function QuestionRenderer({
    question,
    questionGroup,
    value,
    onChange,
    disabled = false,
    sectionModule,
    globalQuestionIndex,
    onFocusChange,
}) {
    // If a question group is provided, render the group
    if (questionGroup) {
        return (
            <QuestionGroupRenderer
                group={questionGroup}
                sectionModule={sectionModule}
                answers={value || {}}
                disabled={disabled}
                onAnswer={onChange}
                onFocusChange={onFocusChange}
                globalQuestionIndex={globalQuestionIndex}
            />
        );
    }

    // Single question rendering (backward compatible)
    if (!question) return null;

    return (
        <div className="animate-in fade-in slide-in-from-bottom-2 duration-500" id={`question-${question.id}`}>
            <SingleQuestionRenderer
                type={question.question_type?.slug || question.type}
                question={question}
                value={value}
                onChange={onChange}
                disabled={disabled}
            />
        </div>
    );
}

/**
 * Renders a single question using the appropriate component based on type
 */
function SingleQuestionRenderer({ type, question, value, onChange, disabled }) {
    const renderComponent = () => {
        switch (type) {
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
                        <p className="font-bold">Question type "{type}" not yet supported.</p>
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