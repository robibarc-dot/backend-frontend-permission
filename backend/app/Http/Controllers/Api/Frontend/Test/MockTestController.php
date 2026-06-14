<?php

namespace App\Http\Controllers\Api\Frontend\Test;

use App\Http\Controllers\Controller;
use App\Models\MockTest;
use App\Models\MockTestQuestion;
use Illuminate\Http\Request;
use Illuminate\Support\Collection;
use Illuminate\Support\Facades\Validator;

class MockTestController extends Controller
{
    /**
     * Display student-facing mock tests.
     */
    public function index(Request $request)
    {
        try {
            $query = MockTest::query()
                ->withCount('mockTestQuestions')
                ->latest();

            if ($request->filled('category')) {
                $query->where('category', $request->category);
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
                $query->whereHas('mockTestQuestions', function ($innerQuery) use ($request) {
                    $innerQuery->where('module_id', $request->integer('module_id'));
                });
            }

            $perPage = min((int) $request->integer('per_page', 12), 50);
            $mockTests = $request->boolean('paginate', false)
                ? $query->paginate($perPage)
                : $query->get();

            return response()->json([
                'status' => 'success',
                'data' => $mockTests,
            ]);
        } catch (\Exception $e) {
            return response()->json([
                'status' => 'error',
                'message' => 'Failed to retrieve mock tests.',
                'error' => $e->getMessage(),
            ], 500);
        }
    }

    /**
     * Display one mock test with sections, contexts, and student-safe questions.
     */
    public function show(string $identifier)
    {
        try {
            $mockTest = $this->findMockTest($identifier);

            return response()->json([
                'status' => 'success',
                'data' => $this->buildMockTestPayload($mockTest),
            ]);
        } catch (\Exception $e) {
            return response()->json([
                'status' => 'error',
                'message' => 'Mock test not found.',
                'error' => $e->getMessage(),
            ], 404);
        }
    }

    /**
     * Start returns the exam payload with a lightweight attempt descriptor.
     */
    public function start(string $identifier)
    {
        try {
            $mockTest = $this->findMockTest($identifier);

            return response()->json([
                'status' => 'success',
                'message' => 'Mock test started.',
                'data' => [
                    'attempt' => [
                        'mock_test_id' => $mockTest->id,
                        'started_at' => now()->toISOString(),
                        'duration_mins' => $mockTest->duration_mins,
                    ],
                    'test' => $this->buildMockTestPayload($mockTest),
                ],
            ]);
        } catch (\Exception $e) {
            return response()->json([
                'status' => 'error',
                'message' => 'Mock test not found.',
                'error' => $e->getMessage(),
            ], 404);
        }
    }

    /**
     * Return questions for a mock test, optionally filtered by module.
     */
    public function questions(Request $request, string $identifier)
    {
        try {
            $mockTest = $this->findMockTest($identifier);
            $query = $mockTest->mockTestQuestions()
                ->with(['module', 'question.options', 'question.questionType', 'question.testContext'])
                ->orderBy('order');

            if ($request->filled('module_id')) {
                $query->where('module_id', $request->integer('module_id'));
            }

            $questions = $query->get()
                ->map(fn (MockTestQuestion $assignment) => $this->transformAssignment($assignment));

            return response()->json([
                'status' => 'success',
                'data' => $questions,
            ]);
        } catch (\Exception $e) {
            return response()->json([
                'status' => 'error',
                'message' => 'Failed to retrieve mock test questions.',
                'error' => $e->getMessage(),
            ], 500);
        }
    }

    /**
     * Submit answers and return an immediate mock score.
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
        ]);

        if ($validator->fails()) {
            return response()->json([
                'status' => 'error',
                'errors' => $validator->errors(),
            ], 422);
        }

        try {
            $mockTest = $this->findMockTest($identifier);
            $answers = collect($request->input('answers'))
                ->keyBy('question_id');

            $assignments = $mockTest->mockTestQuestions()
                ->with(['module', 'question.options', 'question.questionType'])
                ->orderBy('order')
                ->get();

            $results = $assignments->map(function (MockTestQuestion $assignment) use ($answers) {
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

            return response()->json([
                'status' => 'success',
                'message' => 'Mock test submitted successfully.',
                'data' => [
                    'mock_test_id' => $mockTest->id,
                    'submitted_at' => now()->toISOString(),
                    'total_questions' => $results->count(),
                    'correct_answers' => $results->where('is_correct', true)->count(),
                    'total_marks' => $totalMarks,
                    'awarded_marks' => $awardedMarks,
                    'percentage' => $totalMarks > 0 ? round(($awardedMarks / $totalMarks) * 100, 2) : 0,
                    'module_scores' => $this->moduleScores($results),
                    'results' => $results->values(),
                ],
            ]);
        } catch (\Exception $e) {
            return response()->json([
                'status' => 'error',
                'message' => 'Failed to submit mock test.',
                'error' => $e->getMessage(),
            ], 500);
        }
    }

    private function findMockTest(string $identifier): MockTest
    {
        return MockTest::where('id', $identifier)
            ->orWhere('slug', $identifier)
            ->firstOrFail();
    }

    private function buildMockTestPayload(MockTest $mockTest): array
    {
        $mockTest->load([
            'mockTestQuestions.module',
            'mockTestQuestions.question.options',
            'mockTestQuestions.question.questionType',
            'mockTestQuestions.question.testContext',
        ]);

        $sections = $mockTest->mockTestQuestions
            ->sortBy('order')
            ->groupBy('module_id')
            ->map(function (Collection $assignments) {
                $first = $assignments->first();

                return [
                    'module' => $first->module,
                    'questions' => $assignments
                        ->map(fn (MockTestQuestion $assignment) => $this->transformAssignment($assignment))
                        ->values(),
                ];
            })
            ->values();

        return [
            'id' => $mockTest->id,
            'title' => $mockTest->title,
            'slug' => $mockTest->slug,
            'duration_mins' => $mockTest->duration_mins,
            'category' => $mockTest->category,
            'type' => $mockTest->type,
            'total_questions' => $mockTest->mockTestQuestions->count(),
            'sections' => $sections,
        ];
    }

    private function transformAssignment(MockTestQuestion $assignment): array
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

    private function correctAnswersFor(MockTestQuestion $assignment): array
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
