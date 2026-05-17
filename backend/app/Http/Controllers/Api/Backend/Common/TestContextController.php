<?php

namespace App\Http\Controllers\Api\Backend\Common;

use App\Http\Controllers\Controller;
use App\Models\TestContext;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Validator;

class TestContextController extends Controller
{
    /**
     * Display a listing of test contexts.
     */
    public function index(Request $request)
    {
        try {
            $query = TestContext::with('testSection.module')->latest();

            if ($request->filled('test_section_id')) {
                $query->where('test_section_id', $request->test_section_id);
            }

            if ($request->filled('test_id')) {
                $query->whereHas('testSection', function ($sectionQuery) use ($request) {
                    $sectionQuery->where('test_id', $request->test_id);
                });
            }

            return response()->json([
                'status' => 'success',
                'data' => $query->get(),
            ], 200);
        } catch (\Exception $e) {
            return response()->json([
                'status' => 'error',
                'message' => 'Failed to retrieve test contexts.',
                'error' => $e->getMessage(),
            ], 500);
        }
    }

    /**
     * Store a newly created test context.
     */
    public function store(Request $request)
    {
        try {
            $validator = Validator::make($request->all(), [
                'test_section_id' => 'required|integer|exists:test_sections,id',
                'passage_text' => 'nullable|string',
                'image' => 'nullable|string|max:255',
                'audio' => 'nullable|string|max:255',
            ]);

            if ($validator->fails()) {
                return response()->json([
                    'status' => 'error',
                    'errors' => $validator->errors(),
                ], 422);
            }

            $testContext = TestContext::create($validator->validated())
                ->load('testSection.module');

            return response()->json([
                'status' => 'success',
                'message' => 'Test context created successfully.',
                'data' => $testContext,
            ], 201);
        } catch (\Exception $e) {
            return response()->json([
                'status' => 'error',
                'message' => 'Failed to create test context.',
                'error' => $e->getMessage(),
            ], 500);
        }
    }

    /**
     * Display the specified test context.
     */
    public function show($id)
    {
        try {
            $testContext = TestContext::with('testSection.module')->findOrFail($id);

            return response()->json([
                'status' => 'success',
                'data' => $testContext,
            ], 200);
        } catch (\Exception $e) {
            return response()->json([
                'status' => 'error',
                'message' => 'Test context not found.',
                'error' => $e->getMessage(),
            ], 404);
        }
    }

    /**
     * Update the specified test context.
     */
    public function update(Request $request, $id)
    {
        try {
            $testContext = TestContext::findOrFail($id);

            $validator = Validator::make($request->all(), [
                'test_section_id' => 'sometimes|required|integer|exists:test_sections,id',
                'passage_text' => 'nullable|string',
                'image' => 'nullable|string|max:255',
                'audio' => 'nullable|string|max:255',
            ]);

            if ($validator->fails()) {
                return response()->json([
                    'status' => 'error',
                    'errors' => $validator->errors(),
                ], 422);
            }

            $testContext->update($validator->validated());
            $testContext->load('testSection.module');

            return response()->json([
                'status' => 'success',
                'message' => 'Test context updated successfully.',
                'data' => $testContext,
            ], 200);
        } catch (\Exception $e) {
            return response()->json([
                'status' => 'error',
                'message' => 'Failed to update test context.',
                'error' => $e->getMessage(),
            ], 500);
        }
    }

    /**
     * Remove the specified test context.
     */
    public function destroy($id)
    {
        try {
            $testContext = TestContext::findOrFail($id);
            $testContext->delete();

            return response()->json([
                'status' => 'success',
                'message' => 'Test context deleted successfully.',
            ], 200);
        } catch (\Exception $e) {
            return response()->json([
                'status' => 'error',
                'message' => 'Failed to delete test context.',
                'error' => $e->getMessage(),
            ], 500);
        }
    }
}
