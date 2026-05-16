<?php

namespace App\Http\Controllers\Api\Backend\Common;

use App\Http\Controllers\Controller;
use App\Models\QuestionType;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Validator;
use Illuminate\Validation\Rule;

class QuestionTypeController extends Controller
{
    /**
     * Display a listing of the question types.
     */
    public function index()
    {
        try {
            $questionTypes = QuestionType::with('module')->latest()->get();

            return response()->json([
                'status' => 'success',
                'data' => $questionTypes
            ], 200);
        } catch (\Exception $e) {
            return response()->json([
                'status' => 'error',
                'message' => 'Failed to retrieve question types.',
                'error' => $e->getMessage()
            ], 500);
        }
    }

    /**
     * Store a newly created question type in storage.
     */
    public function store(Request $request)
    {
        try {
            $validator = Validator::make($request->all(), [
                'module_id' => 'required|exists:modules,id',
                'name' => 'required|string|max:255',
                'slug' => 'required|string|max:255|unique:question_types,slug',
                'upload_hints' => 'nullable|string|max:255',
            ]);

            if ($validator->fails()) {
                return response()->json([
                    'status' => 'error',
                    'errors' => $validator->errors()
                ], 422);
            }

            $questionType = QuestionType::create($validator->validated());

            return response()->json([
                'status' => 'success',
                'message' => 'Question type created successfully.',
                'data' => $questionType->load('module')
            ], 201);
        } catch (\Exception $e) {
            return response()->json([
                'status' => 'error',
                'message' => 'Failed to create question type.',
                'error' => $e->getMessage()
            ], 500);
        }
    }

    /**
     * Display the specified question type.
     */
    public function show($id)
    {
        try {
            $questionType = QuestionType::with('module')->findOrFail($id);

            return response()->json([
                'status' => 'success',
                'data' => $questionType
            ], 200);
        } catch (\Exception $e) {
            return response()->json([
                'status' => 'error',
                'message' => 'Question type not found.',
                'error' => $e->getMessage()
            ], 404);
        }
    }

    /**
     * Update the specified question type in storage.
     */
    public function update(Request $request, $id)
    {
        try {
            $questionType = QuestionType::findOrFail($id);

            $validator = Validator::make($request->all(), [
                'module_id' => 'sometimes|required|exists:modules,id',
                'name' => 'sometimes|required|string|max:255',
                'slug' => [
                    'sometimes',
                    'required',
                    'string',
                    'max:255',
                    Rule::unique('question_types', 'slug')->ignore($questionType->id),
                ],
                'upload_hints' => 'nullable|string|max:255',
            ]);

            if ($validator->fails()) {
                return response()->json([
                    'status' => 'error',
                    'errors' => $validator->errors()
                ], 422);
            }

            $questionType->update($validator->validated());

            return response()->json([
                'status' => 'success',
                'message' => 'Question type updated successfully.',
                'data' => $questionType->load('module')
            ], 200);
        } catch (\Exception $e) {
            return response()->json([
                'status' => 'error',
                'message' => 'Failed to update question type.',
                'error' => $e->getMessage()
            ], 500);
        }
    }

    /**
     * Remove the specified question type from storage.
     */
    public function destroy($id)
    {
        try {
            $questionType = QuestionType::findOrFail($id);
            $questionType->delete();

            return response()->json([
                'status' => 'success',
                'message' => 'Question type deleted successfully.'
            ], 200);
        } catch (\Exception $e) {
            return response()->json([
                'status' => 'error',
                'message' => 'Failed to delete question type.',
                'error' => $e->getMessage()
            ], 500);
        }
    }
}
