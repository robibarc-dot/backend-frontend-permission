<?php

namespace App\Http\Controllers\Api\Backend\Mock;

use App\Http\Controllers\Controller;
use App\Models\MockTestQuestion;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Validator;

class MockTestQuestionController extends Controller
{
    /**
     * Display a listing of mock test question assignments.
     */
    public function index(Request $request)
    {
        try {
            $query = MockTestQuestion::with(['mockTest', 'question', 'module'])
                ->orderBy('mock_test_id')
                ->orderBy('order');

            if ($request->filled('mock_test_id')) {
                $query->where('mock_test_id', $request->mock_test_id);
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
                'message' => 'Failed to retrieve mock test questions.',
                'error' => $e->getMessage(),
            ], 500);
        }
    }

    /**
     * Store a newly created mock test question assignment.
     */
    public function store(Request $request)
    {
        try {
            $validator = Validator::make($request->all(), [
                'mock_test_id' => 'required|integer|exists:mock_tests,id',
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

            $mockTestQuestion = MockTestQuestion::create($validator->validated())
                ->load(['mockTest', 'question', 'module']);

            return response()->json([
                'status' => 'success',
                'message' => 'Mock test question assigned successfully.',
                'data' => $mockTestQuestion,
            ], 201);
        } catch (\Exception $e) {
            return response()->json([
                'status' => 'error',
                'message' => 'Failed to assign mock test question.',
                'error' => $e->getMessage(),
            ], 500);
        }
    }

    /**
     * Display the specified mock test question assignment.
     */
    public function show($id)
    {
        try {
            $mockTestQuestion = MockTestQuestion::with(['mockTest', 'question', 'module'])
                ->findOrFail($id);

            return response()->json([
                'status' => 'success',
                'data' => $mockTestQuestion,
            ], 200);
        } catch (\Exception $e) {
            return response()->json([
                'status' => 'error',
                'message' => 'Mock test question assignment not found.',
                'error' => $e->getMessage(),
            ], 404);
        }
    }

    /**
     * Update the specified mock test question assignment.
     */
    public function update(Request $request, $id)
    {
        try {
            $mockTestQuestion = MockTestQuestion::findOrFail($id);

            $validator = Validator::make($request->all(), [
                'mock_test_id' => 'sometimes|required|integer|exists:mock_tests,id',
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

            $mockTestQuestion->update($validator->validated());
            $mockTestQuestion->load(['mockTest', 'question', 'module']);

            return response()->json([
                'status' => 'success',
                'message' => 'Mock test question assignment updated successfully.',
                'data' => $mockTestQuestion,
            ], 200);
        } catch (\Exception $e) {
            return response()->json([
                'status' => 'error',
                'message' => 'Failed to update mock test question assignment.',
                'error' => $e->getMessage(),
            ], 500);
        }
    }

    /**
     * Remove the specified mock test question assignment.
     */
    public function destroy($id)
    {
        try {
            $mockTestQuestion = MockTestQuestion::findOrFail($id);
            $mockTestQuestion->delete();

            return response()->json([
                'status' => 'success',
                'message' => 'Mock test question assignment deleted successfully.',
            ], 200);
        } catch (\Exception $e) {
            return response()->json([
                'status' => 'error',
                'message' => 'Failed to delete mock test question assignment.',
                'error' => $e->getMessage(),
            ], 500);
        }
    }
}
