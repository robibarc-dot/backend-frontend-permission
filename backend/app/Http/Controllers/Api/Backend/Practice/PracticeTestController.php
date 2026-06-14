<?php

namespace App\Http\Controllers\Api\Backend\Practice;

use App\Http\Controllers\Controller;
use App\Models\PracticeTest;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Validator;
use Illuminate\Validation\Rule;

class PracticeTestController extends Controller
{
    /**
     * Display a listing of the practice tests.
     */
    public function index()
    {
        try {
            $practiceTests = PracticeTest::latest()->get();

            return response()->json([
                'status' => 'success',
                'data' => $practiceTests
            ], 200);
        } catch (\Exception $e) {
            return response()->json([
                'status' => 'error',
                'message' => 'Failed to retrieve practice tests.',
                'error' => $e->getMessage()
            ], 500);
        }
    }

    /**
     * Store a newly created practice test in storage.
     */
    public function store(Request $request)
    {
        try {
            $validator = Validator::make($request->all(), [
                'question_type' => 'required|in:easy,medium,hard',
                'title' => 'required|string|max:255|unique:practice_tests,title',
                'duration_mins' => 'required|integer|min:1',
                'category' => 'required|in:academic,general',
                'type' => 'required|in:free,paid',
                'slug' => 'required|string|max:255|unique:practice_tests,slug',
            ]);

            if ($validator->fails()) {
                return response()->json([
                    'status' => 'error',
                    'errors' => $validator->errors()
                ], 422);
            }

            $practiceTest = PracticeTest::create($validator->validated());

            return response()->json([
                'status' => 'success',
                'message' => 'Practice test created successfully.',
                'data' => $practiceTest
            ], 201);
        } catch (\Exception $e) {
            return response()->json([
                'status' => 'error',
                'message' => 'Failed to create practice test.',
                'error' => $e->getMessage()
            ], 500);
        }
    }

    /**
     * Display the specified practice test.
     */
    public function show($id)
    {
        try {
            $practiceTest = PracticeTest::findOrFail($id);

            return response()->json([
                'status' => 'success',
                'data' => $practiceTest
            ], 200);
        } catch (\Exception $e) {
            return response()->json([
                'status' => 'error',
                'message' => 'Practice test not found.',
                'error' => $e->getMessage()
            ], 404);
        }
    }

    /**
     * Update the specified practice test in storage.
     */
    public function update(Request $request, $id)
    {
        try {
            $practiceTest = PracticeTest::findOrFail($id);

            $validator = Validator::make($request->all(), [
                'question_type' => 'sometimes|required|in:easy,medium,hard',
                'title' => [
                    'sometimes',
                    'required',
                    'string',
                    'max:255',
                    Rule::unique('practice_tests', 'title')->ignore($practiceTest->id),
                ],
                'duration_mins' => 'sometimes|required|integer|min:1',
                'category' => 'sometimes|required|in:academic,general',
                'type' => 'sometimes|required|in:free,paid',
                'slug' => [
                    'sometimes',
                    'required',
                    'string',
                    'max:255',
                    Rule::unique('practice_tests', 'slug')->ignore($practiceTest->id),
                ],
            ]);

            if ($validator->fails()) {
                return response()->json([
                    'status' => 'error',
                    'errors' => $validator->errors()
                ], 422);
            }

            $practiceTest->update($validator->validated());

            return response()->json([
                'status' => 'success',
                'message' => 'Practice test updated successfully.',
                'data' => $practiceTest
            ], 200);
        } catch (\Exception $e) {
            return response()->json([
                'status' => 'error',
                'message' => 'Failed to update practice test.',
                'error' => $e->getMessage()
            ], 500);
        }
    }

    /**
     * Remove the specified practice test from storage.
     */
    public function destroy($id)
    {
        try {
            $practiceTest = PracticeTest::findOrFail($id);
            $practiceTest->delete();

            return response()->json([
                'status' => 'success',
                'message' => 'Practice test deleted successfully.'
            ], 200);
        } catch (\Exception $e) {
            return response()->json([
                'status' => 'error',
                'message' => 'Failed to delete practice test.',
                'error' => $e->getMessage()
            ], 500);
        }
    }
}
