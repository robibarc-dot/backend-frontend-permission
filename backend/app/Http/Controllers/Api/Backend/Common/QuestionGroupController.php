<?php

namespace App\Http\Controllers\Api\Backend\Common;

use App\Http\Controllers\Controller;
use App\Models\QuestionGroup;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Validator;

class QuestionGroupController extends Controller
{
    /**
     * Display a listing of the question groups.
     */
    public function index(Request $request)
    {
        try {
            $query = QuestionGroup::with(['testSection.module', 'questionType'])
                ->orderBy('test_section_id')
                ->orderBy('sort_order');

            if ($request->filled('test_section_id')) {
                $query->where('test_section_id', $request->test_section_id);
            }

            if ($request->filled('question_type_id')) {
                $query->where('question_type_id', $request->question_type_id);
            }

            return response()->json([
                'status' => 'success',
                'data' => $query->get(),
            ], 200);
        } catch (\Exception $e) {
            return response()->json([
                'status' => 'error',
                'message' => 'Failed to retrieve question groups.',
                'error' => $e->getMessage(),
            ], 500);
        }
    }

    /**
     * Store a newly created question group.
     */
    public function store(Request $request)
    {
        try {
            $validator = Validator::make($request->all(), [
                'test_section_id' => 'required|integer|exists:test_sections,id',
                'question_type_id' => 'required|integer|exists:question_types,id',
                'title' => 'nullable|string|max:255',
                'instruction' => 'required|string',
                'sort_order' => 'nullable|integer',
            ]);

            if ($validator->fails()) {
                return response()->json([
                    'status' => 'error',
                    'errors' => $validator->errors(),
                ], 422);
            }

            $questionGroup = QuestionGroup::create($validator->validated())
                ->load(['testSection.module', 'questionType']);

            return response()->json([
                'status' => 'success',
                'message' => 'Question group created successfully.',
                'data' => $questionGroup,
            ], 201);
        } catch (\Exception $e) {
            return response()->json([
                'status' => 'error',
                'message' => 'Failed to create question group.',
                'error' => $e->getMessage(),
            ], 500);
        }
    }

    /**
     * Display the specified question group.
     */
    public function show($id)
    {
        try {
            $questionGroup = QuestionGroup::with(['testSection.module', 'questionType'])->findOrFail($id);

            return response()->json([
                'status' => 'success',
                'data' => $questionGroup,
            ], 200);
        } catch (\Exception $e) {
            return response()->json([
                'status' => 'error',
                'message' => 'Question group not found.',
                'error' => $e->getMessage(),
            ], 404);
        }
    }

    /**
     * Update the specified question group.
     */
    public function update(Request $request, $id)
    {
        try {
            $questionGroup = QuestionGroup::findOrFail($id);

            $validator = Validator::make($request->all(), [
                'test_section_id' => 'sometimes|required|integer|exists:test_sections,id',
                'question_type_id' => 'sometimes|required|integer|exists:question_types,id',
                'title' => 'nullable|string|max:255',
                'instruction' => 'sometimes|required|string',
                'sort_order' => 'sometimes|required|integer',
            ]);

            if ($validator->fails()) {
                return response()->json([
                    'status' => 'error',
                    'errors' => $validator->errors(),
                ], 422);
            }

            $questionGroup->update($validator->validated());
            $questionGroup->load(['testSection.module', 'questionType']);

            return response()->json([
                'status' => 'success',
                'message' => 'Question group updated successfully.',
                'data' => $questionGroup,
            ], 200);
        } catch (\Exception $e) {
            return response()->json([
                'status' => 'error',
                'message' => 'Failed to update question group.',
                'error' => $e->getMessage(),
            ], 500);
        }
    }

    /**
     * Remove the specified question group.
     */
    public function destroy($id)
    {
        try {
            $questionGroup = QuestionGroup::findOrFail($id);
            $questionGroup->delete();

            return response()->json([
                'status' => 'success',
                'message' => 'Question group deleted successfully.',
            ], 200);
        } catch (\Exception $e) {
            return response()->json([
                'status' => 'error',
                'message' => 'Failed to delete question group.',
                'error' => $e->getMessage(),
            ], 500);
        }
    }
}
 