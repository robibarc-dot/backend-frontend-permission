<?php

namespace App\Http\Controllers\Api\Backend;

use App\Http\Controllers\Controller;
use App\Models\Resource;
use Illuminate\Http\Request;
use Illuminate\Http\JsonResponse;
use Illuminate\Support\Facades\DB;
use Illuminate\Support\Facades\Log;

class ResourceController extends Controller
{
    /**
     * Display a paginated listing of resources with their sections and module.
     * GET /api/backend/resources
     */
    public function index(Request $request): JsonResponse
    {
        $status = $request->query('status');
        
        $query = Resource::with(['sections' => function($q) {
            $q->where('status', 'active');
        }, 'module']);

        if ($status) {
            $query->where('status', $status);
        }

        if ($request->has('module_id')) {
            $query->where('module_id', $request->query('module_id'));
        }

        $resources = $query->latest()->paginate(15);

        return response()->json([
            'success' => true,
            'data' => $resources
        ], 200);
    }

    /**
     * Store a newly created resource and its sections in the database.
     * POST /api/backend/resources
     */
    public function store(Request $request): JsonResponse
    {
        $validated = $request->validate([
            'module_id' => 'required|integer|exists:modules,id',
            'topic' => 'required|string|max:100',
            'status' => 'string|in:active,draft',
            'sections' => 'required|array|min:1',
            'sections.*.title' => 'required|string|max:255',
            'sections.*.text_content' => 'required|string',
            'sections.*.image_url' => 'nullable|url|max:255',
            'sections.*.status' => 'string|in:active,draft',
        ]);

        try {
            $resource = DB::transaction(function () use ($validated) {
                // 1. Create the parent resource
                $resource = Resource::create([
                    'module_id' => $validated['module_id'],
                    'topic' => $validated['topic'],
                    'status' => $validated['status'] ?? 'active',
                ]);

                // 2. Create the child sub-sections
                foreach ($validated['sections'] as $sectionData) {
                    $resource->sections()->create([
                        'title' => $sectionData['title'],
                        'text_content' => $sectionData['text_content'],
                        'image_url' => $sectionData['image_url'] ?? null,
                        'status' => $sectionData['status'] ?? 'active',
                    ]);
                }

                return $resource->load(['sections', 'module']);
            });

            return response()->json([
                'success' => true,
                'message' => 'Strategy guide resource created successfully.',
                'data' => $resource
            ], 201);

        } catch (\Exception $e) {
            Log::error('Resource store failed: ' . $e->getMessage());
            return response()->json([
                'success' => false,
                'message' => 'Database error encountered during save operational workflow.'
            ], 500);
        }
    }

    /**
     * Display the specified individual resource matching the identifier.
     * GET /api/backend/resources/{id}
     */
    public function show(int $id): JsonResponse
    {
        $resource = Resource::with(['sections', 'module'])->find($id);

        if (!$resource) {
            return response()->json([
                'success' => false,
                'message' => 'Resource data structure target not found.'
            ], 404);
        }

        return response()->json([
            'success' => true,
            'data' => $resource
        ], 200);
    }

    /**
     * Update the specified resource and refresh its sections map.
     * PUT/PATCH /api/backend/resources/{id}
     */
    public function update(Request $request, int $id): JsonResponse
    {
        $resource = Resource::find($id);

        if (!$resource) {
            return response()->json([
                'success' => false,
                'message' => 'Resource data structure target not found.'
            ], 404);
        }

        $validated = $request->validate([
            'module_id' => 'sometimes|required|integer|exists:modules,id',
            'topic' => 'sometimes|required|string|max:100',
            'status' => 'string|in:active,draft',
            'sections' => 'sometimes|array',
            'sections.*.title' => 'required|string|max:255',
            'sections.*.text_content' => 'required|string',
            'sections.*.image_url' => 'nullable|url|max:255',
            'sections.*.status' => 'string|in:active,draft',
        ]);

        try {
            DB::transaction(function () use ($resource, $validated) {
                // Update parent metadata if provided
                $updateData = [];
                if (isset($validated['module_id'])) {
                    $updateData['module_id'] = $validated['module_id'];
                }
                if (isset($validated['topic'])) {
                    $updateData['topic'] = $validated['topic'];
                }
                if (isset($validated['status'])) {
                    $updateData['status'] = $validated['status'];
                }
                
                if (!empty($updateData)) {
                    $resource->update($updateData);
                }

                // Re-sync sections if updated data array is explicitly passed
                if (isset($validated['sections'])) {
                    // Drop older sections structure cleanly first
                    $resource->sections()->delete();

                    foreach ($validated['sections'] as $sectionData) {
                        $resource->sections()->create([
                            'title' => $sectionData['title'],
                            'text_content' => $sectionData['text_content'],
                            'image_url' => $sectionData['image_url'] ?? null,
                            'status' => $sectionData['status'] ?? 'active',
                        ]);
                    }
                }
            });

            return response()->json([
                'success' => true,
                'message' => 'Resource configuration data refreshed successfully.',
                'data' => $resource->load(['sections', 'module'])
            ], 200);

        } catch (\Exception $e) {
            Log::error('Resource update execution error: ' . $e->getMessage());
            return response()->json([
                'success' => false,
                'message' => 'System error updating target dataset indices.'
            ], 500);
        }
    }

    /**
     * Remove the specified resource completely from storage registry.
     * DELETE /api/backend/resources/{id}
     */
    public function destroy(int $id): JsonResponse
    {
        $resource = Resource::find($id);

        if (!$resource) {
            return response()->json([
                'success' => false,
                'message' => 'Target entity reference structural item not found.'
            ], 404);
        }

        $resource->delete();

        return response()->json([
            'success' => true,
            'message' => 'Resource and related items removed completely.'
        ], 200);
    }
}