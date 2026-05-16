<?php

namespace App\Http\Controllers\Api\Backend\Practice;

use App\Http\Controllers\Controller;
use App\Models\PracticeTestQuestion;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Validator;

class PracticeTestQuestionController extends Controller
{
    /**
     * Display a listing of practice test question assignments.
     */
    public function index(Request $request)
    {
        try {
            $query = PracticeTestQuestion::with(['practiceTest', 'question', 'module'])
                ->orderBy('practice_test_id')
                ->orderBy('order');

            if ($request->filled('practice_test_id')) {
                $query->where('practice_test_id', $request->practice_test_id);
            }

            if ($request->filled('module_id')) {
                $query->where('module_id', $request->module_id);
            }

            return response()->json([
                'status' => 'success',
                'data' => $query->get(),
            ], 200);
        } catch (\Exception $e) {
            return response()->json([
                'status' => 'error',
                'message' => 'Failed to retrieve practice test questions.',
                'error' => $e->getMessage(),
            ], 500);
        }
    }

    /**
     * Store a newly created practice test question assignment.
     */
    public function store(Request $request)
    {
        try {
            $validator = Validator::make($request->all(), [
                'practice_test_id' => 'required|integer|exists:practice_tests,id',
                'question_id' => 'required|integer|exists:questions,id',
                'order' => 'nullable|integer|min:1',
                'module_id' => 'required|integer|exists:modules,id',
            ]);

            if ($validator->fails()) {
                return response()->json([
                    'status' => 'error',
                    'errors' => $validator->errors(),
                ], 422);
            }

            $practiceTestQuestion = PracticeTestQuestion::create($validator->validated())
                ->load(['practiceTest', 'question', 'module']);

            return response()->json([
                'status' => 'success',
                'message' => 'Practice test question assigned successfully.',
                'data' => $practiceTestQuestion,
            ], 201);
        } catch (\Exception $e) {
            return response()->json([
                'status' => 'error',
                'message' => 'Failed to assign practice test question.',
                'error' => $e->getMessage(),
            ], 500);
        }
    }

    /**
     * Display the specified practice test question assignment.
     */
    public function show($id)
    {
        try {
            $practiceTestQuestion = PracticeTestQuestion::with(['practiceTest', 'question', 'module'])
                ->findOrFail($id);

            return response()->json([
                'status' => 'success',
                'data' => $practiceTestQuestion,
            ], 200);
        } catch (\Exception $e) {
            return response()->json([
                'status' => 'error',
                'message' => 'Practice test question assignment not found.',
                'error' => $e->getMessage(),
            ], 404);
        }
    }

    /**
     * Update the specified practice test question assignment.
     */
    public function update(Request $request, $id)
    {
        try {
            $practiceTestQuestion = PracticeTestQuestion::findOrFail($id);

            $validator = Validator::make($request->all(), [
                'practice_test_id' => 'sometimes|required|integer|exists:practice_tests,id',
                'question_id' => 'sometimes|required|integer|exists:questions,id',
                'order' => 'sometimes|required|integer|min:1',
                'module_id' => 'sometimes|required|integer|exists:modules,id',
            ]);

            if ($validator->fails()) {
                return response()->json([
                    'status' => 'error',
                    'errors' => $validator->errors(),
                ], 422);
            }

            $practiceTestQuestion->update($validator->validated());
            $practiceTestQuestion->load(['practiceTest', 'question', 'module']);

            return response()->json([
                'status' => 'success',
                'message' => 'Practice test question assignment updated successfully.',
                'data' => $practiceTestQuestion,
            ], 200);
        } catch (\Exception $e) {
            return response()->json([
                'status' => 'error',
                'message' => 'Failed to update practice test question assignment.',
                'error' => $e->getMessage(),
            ], 500);
        }
    }

    /**
     * Remove the specified practice test question assignment.
     */
    public function destroy($id)
    {
        try {
            $practiceTestQuestion = PracticeTestQuestion::findOrFail($id);
            $practiceTestQuestion->delete();

            return response()->json([
                'status' => 'success',
                'message' => 'Practice test question assignment deleted successfully.',
            ], 200);
        } catch (\Exception $e) {
            return response()->json([
                'status' => 'error',
                'message' => 'Failed to delete practice test question assignment.',
                'error' => $e->getMessage(),
            ], 500);
        }
    }
}
