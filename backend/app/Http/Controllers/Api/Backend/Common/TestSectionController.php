<?php

namespace App\Http\Controllers\Api\Backend\Common;

use App\Http\Controllers\Controller;
use App\Models\MockTest;
use App\Models\PracticeTest;
use App\Models\TestSection;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Validator;

class TestSectionController extends Controller
{
    /**
     * Display a listing of test sections.
     */
    public function index(Request $request)
    {
        try {
            $query = TestSection::with('module')
                ->orderBy('test_id')
                ->orderBy('order');

            if ($request->filled('test_id')) {
                $query->where('test_id', $request->test_id);
            }

            if ($request->filled('test_section_id')) {
                $query->where('id', $request->test_section_id);
            }

            if ($request->filled('test_type')) {
                $query->where('test_type', $request->test_type);
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
                'message' => 'Failed to retrieve test sections.',
                'error' => $e->getMessage(),
            ], 500);
        }
    }

    /**
     * Store a newly created test section.
     */
    public function store(Request $request)
    {
        try {
            $validator = Validator::make($request->all(), [
                'test_type' => 'required|in:practice,mock',
                'test_id' => 'required|integer',
                'title' => 'required|string|max:255',
                'module_id' => 'required|integer|exists:modules,id',
                'order' => 'nullable|integer|min:1',
            ]);

            $this->validateTestId($validator);

            if ($validator->fails()) {
                return response()->json([
                    'status' => 'error',
                    'errors' => $validator->errors(),
                ], 422);
            }

            $testSection = TestSection::create($validator->validated())
                ->load('module');

            return response()->json([
                'status' => 'success',
                'message' => 'Test section created successfully.',
                'data' => $testSection,
            ], 201);
        } catch (\Exception $e) {
            return response()->json([
                'status' => 'error',
                'message' => 'Failed to create test section.',
                'error' => $e->getMessage(),
            ], 500);
        }
    }

    /**
     * Display the specified test section.
     */
    public function show($id)
    {
        try {
            $testSection = TestSection::with(['module', 'contexts'])->findOrFail($id);

            return response()->json([
                'status' => 'success',
                'data' => $testSection,
            ], 200);
        } catch (\Exception $e) {
            return response()->json([
                'status' => 'error',
                'message' => 'Test section not found.',
                'error' => $e->getMessage(),
            ], 404);
        }
    }

    /**
     * Update the specified test section.
     */
    public function update(Request $request, $id)
    {
        try {
            $testSection = TestSection::findOrFail($id);

            $validator = Validator::make($request->all(), [
                'test_type' => 'sometimes|required|in:practice,mock',
                'test_id' => 'sometimes|required|integer',
                'title' => 'sometimes|required|string|max:255',
                'module_id' => 'sometimes|required|integer|exists:modules,id',
                'order' => 'sometimes|required|integer|min:1',
            ]);

            $this->validateTestId($validator, $testSection);

            if ($validator->fails()) {
                return response()->json([
                    'status' => 'error',
                    'errors' => $validator->errors(),
                ], 422);
            }

            $testSection->update($validator->validated());
            $testSection->load('module');

            return response()->json([
                'status' => 'success',
                'message' => 'Test section updated successfully.',
                'data' => $testSection,
            ], 200);
        } catch (\Exception $e) {
            return response()->json([
                'status' => 'error',
                'message' => 'Failed to update test section.',
                'error' => $e->getMessage(),
            ], 500);
        }
    }

    /**
     * Remove the specified test section.
     */
    public function destroy($id)
    {
        try {
            $testSection = TestSection::findOrFail($id);
            $testSection->delete();

            return response()->json([
                'status' => 'success',
                'message' => 'Test section deleted successfully.',
            ], 200);
        } catch (\Exception $e) {
            return response()->json([
                'status' => 'error',
                'message' => 'Failed to delete test section.',
                'error' => $e->getMessage(),
            ], 500);
        }
    }

    /**
     * Validate test_id against the table selected by test_type.
     */
    private function validateTestId($validator, ?TestSection $testSection = null)
    {
        $validator->after(function ($validator) use ($testSection) {
            if ($validator->errors()->isNotEmpty()) {
                return;
            }

            $data = $validator->getData();
            $testType = $data['test_type'] ?? $testSection?->test_type;
            $testId = $data['test_id'] ?? $testSection?->test_id;

            if ($testType === 'practice' && ! PracticeTest::whereKey($testId)->exists()) {
                $validator->errors()->add('test_id', 'The selected test id is invalid.');
            }

            if ($testType === 'mock' && ! MockTest::whereKey($testId)->exists()) {
                $validator->errors()->add('test_id', 'The selected test id is invalid.');
            }
        });
    }
}
