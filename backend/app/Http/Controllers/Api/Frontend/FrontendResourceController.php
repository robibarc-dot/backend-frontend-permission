<?php

namespace App\Http\Controllers\Api\Frontend;

use App\Http\Controllers\Controller;
use App\Models\Resource;
use Illuminate\Http\JsonResponse;
use Illuminate\Http\Request;

class FrontendResourceController extends Controller
{
    /**
     * Display a listing of active resources grouped by module.
     * GET /api/frontend/resources
     */
    public function index(Request $request): JsonResponse
    {
        $module_id = $request->query('module_id');

        $query = Resource::with(['sections' => function ($q) {
            $q->where('status', 'active');
        }, 'module'])->where('status', 'active');

        if ($module_id) {
            $query->where('module_id', $module_id);
        }

        $resources = $query->latest()->paginate(20);

        return response()->json([
            'success' => true,
            'data' => $resources,
        ], 200);
    }

    /**
     * Display the specified resource with its sections.
     * GET /api/frontend/resources/{id}
     */
    public function show(int $id): JsonResponse
    {
        $resource = Resource::with(['sections' => function ($q) {
            $q->where('status', 'active');
        }, 'module'])->where('status', 'active')->find($id);

        if (!$resource) {
            return response()->json([
                'success' => false,
                'message' => 'Resource not found.',
            ], 404);
        }

        return response()->json([
            'success' => true,
            'data' => $resource,
        ], 200);
    }
}