<?php

namespace App\Http\Controllers\Api\Backend\Common;

use App\Http\Controllers\Controller;
use App\Models\Module;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Validator;

class ModuleController extends Controller
{
    /**
     * Display a listing of the modules.
     */
    public function index()
    {
        try {
            $modules = Module::latest()->get();
            return response()->json([
                'status' => 'success',
                'data' => $modules
            ], 200);
        } catch (\Exception $e) {
            return response()->json([
                'status' => 'error',
                'message' => 'Failed to retrieve modules.',
                'error' => $e->getMessage()
            ], 500);
        }
    }

    /**
     * Store a newly created module in storage.
     */
    public function store(Request $request)
    {
        try {
            $validator = Validator::make($request->all(), [
                'title'  => 'required|string|max:255|unique:modules,title',
                'status' => 'nullable|in:active,inactive',
            ]);

            if ($validator->fails()) {
                return response()->json([
                    'status' => 'error',
                    'errors' => $validator->errors()
                ], 422);
            }

            $module = Module::create($request->all());

            return response()->json([
                'status'  => 'success',
                'message' => 'Module created successfully.',
                'data'    => $module
            ], 201);
        } catch (\Exception $e) {
            return response()->json([
                'status'  => 'error',
                'message' => 'Failed to create module.',
                'error'   => $e->getMessage()
            ], 500);
        }
    }

    /**
     * Display the specified module.
     */
    public function show($id)
    {
        try {
            $module = Module::findOrFail($id);
            return response()->json([
                'status' => 'success',
                'data'   => $module
            ], 200);
        } catch (\Exception $e) {
            return response()->json([
                'status'  => 'error',
                'message' => 'Module not found.',
                'error'   => $e->getMessage()
            ], 404);
        }
    }

    /**
     * Update the specified module in storage.
     */
    public function update(Request $request, $id)
    {
        try {
            $module = Module::findOrFail($id);

            $validator = Validator::make($request->all(), [
                'title'  => 'sometimes|required|string|max:255',
                'status' => 'sometimes|required|in:active,inactive',
            ]);

            if ($validator->fails()) {
                return response()->json([
                    'status' => 'error',
                    'errors' => $validator->errors()
                ], 422);
            }

            $module->update($request->all());

            return response()->json([
                'status'  => 'success',
                'message' => 'Module updated successfully.',
                'data'    => $module
            ], 200);
        } catch (\Exception $e) {
            return response()->json([
                'status'  => 'error',
                'message' => 'Failed to update module.',
                'error'   => $e->getMessage()
            ], 500);
        }
    }

    /**
     * Remove the specified module from storage.
     */
    public function destroy($id)
    {
        try {
            $module = Module::findOrFail($id);
            $module->delete();

            return response()->json([
                'status'  => 'success',
                'message' => 'Module deleted successfully.'
            ], 200);
        } catch (\Exception $e) {
            return response()->json([
                'status'  => 'error',
                'message' => 'Failed to delete module.',
                'error'   => $e->getMessage()
            ], 500);
        }
    }
}
