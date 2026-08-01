<?php

namespace App\Http\Controllers\Api\Frontend;

use App\Http\Controllers\Controller;
use App\Models\Blog;
use Illuminate\Http\JsonResponse;
use Illuminate\Http\Request;

class FrontendBlogController extends Controller
{
    /**
     * Display a listing of active blogs with optional module filtering.
     * GET /api/frontend/blogs
     */
    public function index(Request $request): JsonResponse
    {
        $module_id = $request->query('module_id');

        $query = Blog::with(['sections' => function ($q) {
            $q->where('status', 'active');
        }, 'module'])->where('status', 'active');

        if ($module_id) {
            $query->where('module_id', $module_id);
        }

        $blogs = $query->latest()->paginate(20);

        return response()->json([
            'success' => true,
            'data' => $blogs,
        ], 200);
    }

    /**
     * Display the specified blog with its sections.
     * GET /api/frontend/blogs/{id}
     */
    public function show(int $id): JsonResponse
    {
        $blog = Blog::with(['sections' => function ($q) {
            $q->where('status', 'active');
        }, 'module'])->where('status', 'active')->find($id);

        if (!$blog) {
            return response()->json([
                'success' => false,
                'message' => 'Blog not found.',
            ], 404);
        }

        return response()->json([
            'success' => true,
            'data' => $blog,
        ], 200);
    }
}