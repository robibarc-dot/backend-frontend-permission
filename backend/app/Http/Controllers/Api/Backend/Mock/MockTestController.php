<?php

namespace App\Http\Controllers\Api\Backend\Mock;

use App\Http\Controllers\Controller;
use App\Models\MockTest;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Validator;
use Illuminate\Validation\Rule;

class MockTestController extends Controller
{
    /**
     * Display a listing of the mock tests.
     */
    public function index()
    {
        try {
            $mockTests = MockTest::latest()->get();

            return response()->json([
                'status' => 'success',
                'data' => $mockTests
            ], 200);
        } catch (\Exception $e) {
            return response()->json([
                'status' => 'error',
                'message' => 'Failed to retrieve mock tests.',
                'error' => $e->getMessage()
            ], 500);
        }
    }

    /**
     * Store a newly created mock test in storage.
     */
    public function store(Request $request)
    {
        try {
            $validator = Validator::make($request->all(), [
                'title' => 'required|string|max:255|unique:mock_tests,title',
                'duration_mins' => 'required|integer|min:1',
                'category' => 'required|in:academic,general',
                'type' => 'required|in:free,paid',
                'slug' => 'required|string|max:255|unique:mock_tests,slug',
            ]);

            if ($validator->fails()) {
                return response()->json([
                    'status' => 'error',
                    'errors' => $validator->errors()
                ], 422);
            }

            $mockTest = MockTest::create($validator->validated());

            return response()->json([
                'status' => 'success',
                'message' => 'Mock test created successfully.',
                'data' => $mockTest
            ], 201);
        } catch (\Exception $e) {
            return response()->json([
                'status' => 'error',
                'message' => 'Failed to create mock test.',
                'error' => $e->getMessage()
            ], 500);
        }
    }

    /**
     * Display the specified mock test.
     */
    public function show($id)
    {
        try {
            $mockTest = MockTest::findOrFail($id);

            return response()->json([
                'status' => 'success',
                'data' => $mockTest
            ], 200);
        } catch (\Exception $e) {
            return response()->json([
                'status' => 'error',
                'message' => 'Mock test not found.',
                'error' => $e->getMessage()
            ], 404);
        }
    }

    /**
     * Update the specified mock test in storage.
     */
    public function update(Request $request, $id)
    {
        try {
            $mockTest = MockTest::findOrFail($id);

            $validator = Validator::make($request->all(), [
                'title' => [
                    'sometimes',
                    'required',
                    'string',
                    'max:255',
                    Rule::unique('mock_tests', 'title')->ignore($mockTest->id),
                ],
                'duration_mins' => 'sometimes|required|integer|min:1',
                'category' => 'sometimes|required|in:academic,general',
                'type' => 'sometimes|required|in:free,paid',
                'slug' => [
                    'sometimes',
                    'required',
                    'string',
                    'max:255',
                    Rule::unique('mock_tests', 'slug')->ignore($mockTest->id),
                ],
            ]);

            if ($validator->fails()) {
                return response()->json([
                    'status' => 'error',
                    'errors' => $validator->errors()
                ], 422);
            }

            $mockTest->update($validator->validated());

            return response()->json([
                'status' => 'success',
                'message' => 'Mock test updated successfully.',
                'data' => $mockTest
            ], 200);
        } catch (\Exception $e) {
            return response()->json([
                'status' => 'error',
                'message' => 'Failed to update mock test.',
                'error' => $e->getMessage()
            ], 500);
        }
    }

    /**
     * Remove the specified mock test from storage.
     */
    public function destroy($id)
    {
        try {
            $mockTest = MockTest::findOrFail($id);
            $mockTest->delete();

            return response()->json([
                'status' => 'success',
                'message' => 'Mock test deleted successfully.'
            ], 200);
        } catch (\Exception $e) {
            return response()->json([
                'status' => 'error',
                'message' => 'Failed to delete mock test.',
                'error' => $e->getMessage()
            ], 500);
        }
    }
}
