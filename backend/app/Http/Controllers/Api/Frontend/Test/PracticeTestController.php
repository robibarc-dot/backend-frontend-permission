<?php

namespace App\Http\Controllers\Api\Frontend\Test;

use App\Http\Controllers\Controller;
use App\Models\PracticeTest;
use App\Models\PracticeTestQuestion;
use App\Models\TestSection;
use App\Models\PracticeTestSubmission;
use Illuminate\Http\Request;
use Illuminate\Support\Collection;
use Illuminate\Support\Facades\Validator;

class PracticeTestController extends Controller
{
    /**
     * Display student-facing practice tests.
     */
    public function index(Request $request)
    {
        try {
            $query = PracticeTest::query()
                ->with([
                    'testSections.module',
                    'practiceTestQuestions.module',
                    'practiceTestQuestions.question.questionType',
                    'practiceTestQuestions.question.testContext',
                ])
                ->withCount('practiceTestQuestions')
                ->latest();


            // if ($request->filled('category')) {
            //     $query->where('category', $request->category);
            // }

            if ($request->filled('question_type')) {
                $query->where('question_type', $request->question_type);
            }
            if ($request->filled('type')) {
                $query->where('type', $request->type);
            }

            if ($request->filled('search')) {
                $search = $request->search;
                $query->where(function ($innerQuery) use ($search) {
                    $innerQuery->where('title', 'like', "%{$search}%")
                        ->orWhere('slug', 'like', "%{$search}%");
                });
            }

            if ($request->filled('module_id')) {
                $moduleId = $request->integer('module_id');
                $query->where(function ($innerQuery) use ($moduleId) {
                    $innerQuery
                        ->whereHas('testSections', fn ($sectionQuery) => $sectionQuery->where('module_id', $moduleId))
                        ->orWhereHas('practiceTestQuestions', fn ($assignmentQuery) => $assignmentQuery->where('module_id', $moduleId));
                });
            }

            $perPage = min((int) $request->integer('per_page', 12), 50);
            if ($request->boolean('paginate', false)) {
                $practiceTests = $query->paginate($perPage);
                $practiceTests->getCollection()->transform(
                    fn (PracticeTest $practiceTest) => $this->buildPracticeTestListPayload($practiceTest)
                );
            } else {
                $practiceTests = $query->get()
                    ->map(fn (PracticeTest $practiceTest) => $this->buildPracticeTestListPayload($practiceTest))
                    ->values();
            }

            return response()->json([
                'status' => 'success',
                'data' => $practiceTests,
            ]);
        } catch (\Exception $e) {
            return response()->json([
                'status' => 'error',
                'message' => 'Failed to retrieve practice tests.',
                'error' => $e->getMessage(),
            ], 500);
        }
    }

    /**
     * Display one practice test with sections, contexts, and student-safe questions.
     */
    public function show(string $identifier)
    {
        try {
            $practiceTest = $this->findPracticeTest($identifier);
            // dd($practiceTest);
            return response()->json([
                'status' => 'success',
                'data' => $this->buildPracticeTestPayload($practiceTest),
            ]);
        } catch (\Exception $e) {
            return response()->json([
                'status' => 'error',
                'message' => 'Practice test not found.',
                'error' => $e->getMessage(),
            ], 404);
        }
    }

    /**
     * Start returns the same exam payload with a lightweight attempt descriptor.
     */
    public function start(Request $request, string $identifier)
    {
        try {
            $practiceTest = $this->findPracticeTest($identifier);
            $section = $this->resolvePracticeSection($practiceTest, $request->integer('section_id') ?: null);


            return response()->json([
                'status' => 'success',
                'message' => $section ? 'Practice section started.' : 'Practice test started.',
                'data' => [
                    'attempt' => [
                        'practice_test_id' => $practiceTest->id,
                        'section_id' => $section?->id,
                        'started_at' => now()->toISOString(),
                        'duration_mins' => $practiceTest->duration_mins,
                    ],
                    'test' => $this->buildPracticeTestPayload($practiceTest, $section?->id),
                ],
            ]);
        } catch (\Exception $e) {
            return response()->json([
                'status' => 'error',
                'message' => 'Practice test not found.',
                'error' => $e->getMessage(),
            ], 404);
        }
    }

    /**
     * Return questions for a practice test, optionally filtered by module.
     */
    public function questions(Request $request, string $identifier)
    {
        try {
            $practiceTest = $this->findPracticeTest($identifier);
            $query = $practiceTest->practiceTestQuestions()
                ->with(['module', 'question.options', 'question.questionType', 'question.testContext'])
                ->orderBy('order');

            $this->applyAssignmentFilters($query, $request, $practiceTest);

            $questions = $query->get()
                ->map(fn (PracticeTestQuestion $assignment) => $this->transformAssignment($assignment));

            return response()->json([
                'status' => 'success',
                'data' => $questions,
            ]);
        } catch (\Exception $e) {
            return response()->json([
                'status' => 'error',
                'message' => 'Failed to retrieve practice test questions.',
                'error' => $e->getMessage(),
            ], 500);
        }
    }

    /**
     * Submit answers and return an immediate practice score.
     *
     * Expected answers shape:
     * answers: [{ question_id: 1, answer: "A" }, { question_id: 2, answer: ["A", "C"] }]
     */
    public function submit(Request $request, string $identifier)
    {
        $validator = Validator::make($request->all(), [
            'answers' => 'required|array',
            'answers.*.question_id' => 'required|integer|exists:questions,id',
            'answers.*.answer' => 'nullable',
            'section_id' => 'nullable|integer|exists:test_sections,id',
            'module_id' => 'nullable|integer|exists:modules,id',
        ]);

        if ($validator->fails()) {
            return response()->json([
                'status' => 'error',
                'errors' => $validator->errors(),
            ], 422);
        }

        try {
            $practiceTest = $this->findPracticeTest($identifier);
            $answers = collect($request->input('answers'))
                ->keyBy('question_id');

            $assignments = $practiceTest->practiceTestQuestions()
                ->with(['module', 'question.options', 'question.questionType'])
                ->orderBy('order');

            $this->applyAssignmentFilters($assignments, $request, $practiceTest);
            $assignments = $assignments->get();

            $results = $assignments->map(function (PracticeTestQuestion $assignment) use ($answers) {
                $question = $assignment->question;
                $submitted = data_get($answers->get($question->id), 'answer');
                $correctAnswers = $this->correctAnswersFor($assignment);
                $isCorrect = $this->answersMatch($submitted, $correctAnswers);
                $mark = (int) $question->question_mark;

                return [
                    'question_id' => $question->id,
                    'module' => $assignment->module?->title,
                    'submitted_answer' => $submitted,
                    'correct_answer' => $correctAnswers,
                    'is_correct' => $isCorrect,
                    'mark' => $mark,
                    'awarded_mark' => $isCorrect ? $mark : 0,
                ];
            });

            $totalMarks = $results->sum('mark');
            $awardedMarks = $results->sum('awarded_mark');
            $percentage = $totalMarks > 0 ? round(($awardedMarks / $totalMarks) * 100, 2) : 0;

            $submission = PracticeTestSubmission::create([
                'user_id' => $request->user()?->id,
                'practice_test_id' => $practiceTest->id,
                'test_section_id' => $request->integer('section_id') ?: null,
                'total_questions' => $results->count(),
                'correct_answers' => $results->where('is_correct', true)->count(),
                'total_marks' => $totalMarks,
                'awarded_marks' => $awardedMarks,
                'percentage' => $percentage,
                'results' => $results->values()->toArray(),
                'module_scores' => $this->moduleScores($results),
                'submitted_at' => now(),
            ]);

            return response()->json([
                'status' => 'success',
                'message' => 'Practice test submitted successfully.',
                'data' => $submission,
            ]);
        } catch (\Exception $e) {
            return response()->json([
                'status' => 'error',
                'message' => 'Failed to submit practice test.',
                'error' => $e->getMessage(),
            ], 500);
        }
    }

    public function results(Request $request, string $identifier)
    {
        try {
            $practiceTest = $this->findPracticeTest($identifier);
            $query = PracticeTestSubmission::query()
                ->where('practice_test_id', $practiceTest->id)
                ->orderBy('submitted_at', 'desc');

            if ($request->filled('user_id')) {
                $query->where('user_id', $request->integer('user_id'));
            }

            if ($request->filled('section_id')) {
                $query->where('test_section_id', $request->integer('section_id'));
            }

            $submissions = $query->get();

            return response()->json([
                'status' => 'success',
                'data' => $submissions,
            ]);
        } catch (\Exception $e) {
            return response()->json([
                'status' => 'error',
                'message' => 'Failed to get practice test.',
                'error' => $e->getMessage(),
            ], 500);
        }
    }

    private function findPracticeTest(string $identifier): PracticeTest
    {
        return PracticeTest::where('id', $identifier)
            ->orWhere('slug', $identifier)
            ->firstOrFail();
    }

    private function buildPracticeTestPayload(PracticeTest $practiceTest, ?int $activeSectionId = null): array
    {
        $practiceTest->load([
            'testSections.module',
            'testSections.contexts',
            'practiceTestQuestions.module',
            'practiceTestQuestions.question.options',
            'practiceTestQuestions.question.questionType',
            'practiceTestQuestions.question.testContext',
            'practiceTestQuestions.question.testContext.testSection',
        ]);

        $sections = $this->buildSectionsPayload($practiceTest);
        $selectedSection = $activeSectionId
            ? $sections->firstWhere('id', $activeSectionId)
            : null;

        return [
            'id' => $practiceTest->id,
            'title' => $practiceTest->title,
            'slug' => $practiceTest->slug,
            'duration_mins' => $practiceTest->duration_mins,
            'category' => $practiceTest->category,
            'type' => $practiceTest->type,
            'total_questions' => $practiceTest->practiceTestQuestions->count(),
            'active_section' => $selectedSection,
            'sections' => $sections,
        ];
    }

    private function buildPracticeTestListPayload(PracticeTest $practiceTest): array
    {
        $assignments = $practiceTest->practiceTestQuestions;

        return [
            'id' => $practiceTest->id,
            'title' => $practiceTest->title,
            'slug' => $practiceTest->slug,
            'duration_mins' => $practiceTest->duration_mins,
            'category' => $practiceTest->category,
            'type' => $practiceTest->type,
            'total_questions' => (int) ($practiceTest->practice_test_questions_count ?? $assignments->count()),
            'sections' => $this->buildSectionSummaries($practiceTest),
            'modules' => $this->buildSectionSummaries($practiceTest)
                ->pluck('module')
                ->filter()
                ->unique('id')
                ->values(),
            'question_modules' => $assignments
                ->pluck('module')
                ->filter()
                ->unique('id')
                ->values()
                ->map(fn ($module) => [
                    'id' => $module->id,
                    'title' => $module->title,
                    'slug' => $module->slug ?? null,
                ]),
            'question_types' => $assignments
                ->pluck('question.questionType')
                ->filter()
                ->unique('id')
                ->values()
                ->map(fn ($questionType) => [
                    'id' => $questionType->id,
                    'name' => $questionType->name,
                    'slug' => $questionType->slug,
                ]),
        ];
    }

    private function buildSectionsPayload(PracticeTest $practiceTest): Collection
    {
        $assignments = $practiceTest->practiceTestQuestions->sortBy('order')->values();
        $sections = $practiceTest->testSections->sortBy('order')->values();

        if ($sections->isEmpty()) {
            return $assignments
                ->groupBy('module_id')
                ->map(function (Collection $sectionAssignments) {
                    $first = $sectionAssignments->first();

                    return [
                        'id' => null,
                        'title' => $first->module?->title ?? 'Practice',
                        'order' => null,
                        'module' => $first->module,
                        'total_questions' => $sectionAssignments->count(),
                        'questions' => $sectionAssignments
                            ->map(fn (PracticeTestQuestion $assignment) => $this->transformAssignment($assignment))
                            ->values(),
                    ];
                })
                ->values();
        }

        return $sections
            ->map(function (TestSection $section) use ($assignments) {
                $sectionAssignments = $assignments
                    ->filter(fn (PracticeTestQuestion $assignment) => $this->assignmentBelongsToSection($assignment, $section))
                    ->values();

                return [
                    'id' => $section->id,
                    'title' => $section->title,
                    'order' => $section->order,
                    'module' => $section->module,
                    'total_questions' => $sectionAssignments->count(),
                    'contexts' => $section->contexts,
                    'questions' => $sectionAssignments
                        ->map(fn (PracticeTestQuestion $assignment) => $this->transformAssignment($assignment))
                        ->values(),
                ];
            })
            ->values();
    }

    private function buildSectionSummaries(PracticeTest $practiceTest): Collection
    {
        $assignments = $practiceTest->practiceTestQuestions->sortBy('order')->values();
        $sections = $practiceTest->testSections->sortBy('order')->values();

        if ($sections->isEmpty()) {
            return $assignments
                ->groupBy('module_id')
                ->map(function (Collection $sectionAssignments) {
                    $first = $sectionAssignments->first();

                    return [
                        'id' => null,
                        'title' => $first->module?->title ?? 'Practice',
                        'order' => null,
                        'module' => $first->module,
                        'total_questions' => $sectionAssignments->count(),
                    ];
                })
                ->values();
        }

        return $sections
            ->map(fn (TestSection $section) => [
                'id' => $section->id,
                'title' => $section->title,
                'order' => $section->order,
                'module' => $section->module,
                'total_questions' => $assignments
                    ->filter(fn (PracticeTestQuestion $assignment) => $this->assignmentBelongsToSection($assignment, $section))
                    ->count(),
            ])
            ->values();
    }

    private function applyAssignmentFilters($query, Request $request, PracticeTest $practiceTest): void
    {
        if ($request->filled('section_id')) {
            $section = $this->resolvePracticeSection($practiceTest, $request->integer('section_id'));
            $query->whereHas('question.testContext', fn ($contextQuery) => $contextQuery->where('test_section_id', $section->id));

            return;
        }

        if ($request->filled('module_id')) {
            $query->where('module_id', $request->integer('module_id'));
        }
    }

    private function resolvePracticeSection(PracticeTest $practiceTest, ?int $sectionId): ?TestSection
    {
        if (! $sectionId) {
            return null;
        }

        return TestSection::where('test_type', 'practice')
            ->where('test_id', $practiceTest->id)
            ->whereKey($sectionId)
            ->firstOrFail();
    }

    private function assignmentBelongsToSection(PracticeTestQuestion $assignment, TestSection $section): bool
    {
        return (int) $assignment->question?->testContext?->test_section_id === (int) $section->id
            || (
                ! $assignment->question?->testContext?->test_section_id
                && (int) $assignment->module_id === (int) $section->module_id
            );
    }

    private function transformAssignment(PracticeTestQuestion $assignment): array
    {
        $question = $assignment->question;

        return [
            'assignment_id' => $assignment->id,
            'order' => $assignment->order,
            'module' => $assignment->module,
            'context' => $question?->testContext ? [
                'id' => $question->testContext->id,
                'passage_text' => $question->testContext->passage_text,
                'image' => $question->testContext->image,
                'audio' => $question->testContext->audio,
            ] : null,
            'question' => [
                'id' => $question->id,
                'type' => $question->questionType?->slug,
                'type_name' => $question->questionType?->name,
                'text' => $question->question_text,
                'mark' => (int) $question->question_mark,
                'sequence_number' => (int) $question->sequence_number,
                'options' => $question->options
                    ->map(fn ($option) => [
                        'id' => $option->id,
                        'key' => $option->option_key,
                        'text' => $option->option_text,
                        'meta' => $option->meta,
                    ])
                    ->values(),
            ],
        ];
    }

    private function correctAnswersFor(PracticeTestQuestion $assignment): array
    {
        return $assignment->question->options
            ->where('is_correct', true)
            ->map(fn ($option) => $option->option_key ?: $option->option_text)
            ->values()
            ->all();
    }

    private function answersMatch($submitted, array $correctAnswers): bool
    {
        if (empty($correctAnswers)) {
            return false;
        }

        $submittedAnswers = is_array($submitted) ? $submitted : [$submitted];

        $normalize = fn ($value) => strtolower(trim((string) $value));
        $submittedAnswers = collect($submittedAnswers)
            ->filter(fn ($value) => $value !== null && $value !== '')
            ->map($normalize)
            ->sort()
            ->values()
            ->all();
        $correctAnswers = collect($correctAnswers)
            ->map($normalize)
            ->sort()
            ->values()
            ->all();

        return $submittedAnswers === $correctAnswers;
    }

    private function moduleScores(Collection $results): array
    {
        return $results
            ->groupBy('module')
            ->map(function (Collection $items, $module) {
                $totalMarks = $items->sum('mark');
                $awardedMarks = $items->sum('awarded_mark');

                return [
                    'module' => $module ?: 'Unknown',
                    'total_questions' => $items->count(),
                    'correct_answers' => $items->where('is_correct', true)->count(),
                    'total_marks' => $totalMarks,
                    'awarded_marks' => $awardedMarks,
                    'percentage' => $totalMarks > 0 ? round(($awardedMarks / $totalMarks) * 100, 2) : 0,
                ];
            })
            ->values()
            ->all();
    }
}
