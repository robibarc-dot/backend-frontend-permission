<?php

namespace App\Http\Controllers\Api\Backend\Common;

use App\Http\Controllers\Controller;
use App\Models\Question;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\DB;
use Illuminate\Support\Facades\Validator;

class QuestionController extends Controller
{
    /**
     * Display a listing of the questions.
     */
    public function index(Request $request)
    {
        try {
            $query = Question::with(['options', 'module', 'questionType', 'testContext']);

            if ($request->filled('test_context_id')) {
                $query->where('test_context_id', $request->test_context_id);
            }

            if ($request->filled('module_id')) {
                $query->where('module_id', $request->module_id);
            }

            if ($request->filled('question_type_id')) {
                $query->where('question_type_id', $request->question_type_id);
            }

            return response()->json([
                'status' => 'success',
                'data' => $query->latest()->get(),
            ], 200);
        } catch (\Exception $e) {
            return response()->json([
                'status' => 'error',
                'message' => 'Failed to retrieve questions.',
                'error' => $e->getMessage(),
            ], 500);
        }
    }

    /**
     * Store a newly created question with its options.
     */
    public function store(Request $request)
    {
        $validator = Validator::make($request->all(), [
            'test_context_id' => 'required|exists:test_contexts,id',
            'module_id' => 'required|exists:modules,id',
            'question_type_id' => 'required|exists:question_types,id',
            'question_text' => 'required|string',
            'question_mark' => 'required|integer|min:1',
            'sequence_number' => 'nullable|integer|min:1',
            'status' => 'nullable|in:active,inactive',
            'options' => 'required|array|min:1',
            'options.*.option_key' => 'required|string',
            'options.*.option_text' => 'required|string',
            'options.*.is_correct' => 'required|boolean',
            'options.*.meta' => 'nullable|array',
        ]);

        if ($validator->fails()) {
            return response()->json(['status' => 'error', 'errors' => $validator->errors()], 422);
        }

        try {
            $question = DB::transaction(function () use ($request) {
                $question = Question::create($request->only([
                    'test_context_id', 'module_id', 'question_type_id', 
                    'question_text', 'question_mark', 'sequence_number', 'status'
                ]));

                foreach ($request->options as $option) {
                    $question->options()->create($option);
                }

                return $question;
            });

            return response()->json([
                'status' => 'success',
                'message' => 'Question created successfully.',
                'data' => $question->load(['options', 'module', 'questionType']),
            ], 201);
        } catch (\Exception $e) {
            return response()->json(['status' => 'error', 'message' => 'Failed to create question.', 'error' => $e->getMessage()], 500);
        }
    }

    /**
     * Display the specified question.
     */
    public function show($id)
    {
        try {
            $question = Question::with(['options', 'module', 'questionType', 'testContext'])->findOrFail($id);
            return response()->json(['status' => 'success', 'data' => $question], 200);
        } catch (\Exception $e) {
            return response()->json(['status' => 'error', 'message' => 'Question not found.'], 404);
        }
    }

    /**
     * Update the specified question and its options.
     */
    public function update(Request $request, $id)
    {
        try {
            $question = Question::findOrFail($id);
            $validator = Validator::make($request->all(), [
                'test_context_id' => 'sometimes|required|exists:test_contexts,id',
                'module_id' => 'sometimes|required|exists:modules,id',
                'question_type_id' => 'sometimes|required|exists:question_types,id',
                'question_text' => 'sometimes|required|string',
                'question_mark' => 'sometimes|required|integer|min:1',
                'sequence_number' => 'sometimes|required|integer|min:1',
                'status' => 'sometimes|required|in:active,inactive',
                'options' => 'sometimes|required|array|min:1',
                'options.*.option_key' => 'required_with:options|string',
                'options.*.option_text' => 'required_with:options|string',
                'options.*.is_correct' => 'required_with:options|boolean',
                'options.*.meta' => 'nullable|array',
            ]);

            if ($validator->fails()) {
                return response()->json(['status' => 'error', 'errors' => $validator->errors()], 422);
            }

            DB::transaction(function () use ($request, $question) {
                $question->update($request->only([
                    'test_context_id', 'module_id', 'question_type_id', 
                    'question_text', 'question_mark', 'sequence_number', 'status'
                ]));

                if ($request->has('options')) {
                    $question->options()->delete();
                    foreach ($request->options as $option) {
                        $question->options()->create($option);
                    }
                }
            });

            return response()->json([
                'status' => 'success',
                'message' => 'Question updated successfully.',
                'data' => $question->load(['options', 'module', 'questionType']),
            ], 200);
        } catch (\Exception $e) {
            return response()->json(['status' => 'error', 'message' => 'Failed to update question.', 'error' => $e->getMessage()], 500);
        }
    }

    /**
     * Remove the specified question.
     */
    public function destroy($id)
    {
        try {
            $question = Question::findOrFail($id);
            DB::transaction(function () use ($question) {
                $question->options()->delete();
                $question->delete();
            });
            return response()->json(['status' => 'success', 'message' => 'Question deleted successfully.'], 200);
        } catch (\Exception $e) {
            return response()->json(['status' => 'error', 'message' => 'Failed to delete question.'], 500);
        }
    }
}
