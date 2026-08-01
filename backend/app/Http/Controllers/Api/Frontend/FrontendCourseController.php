<?php

namespace App\Http\Controllers\Api\Frontend;

use App\Http\Controllers\Controller;
use App\Models\Course\Course;
use Illuminate\Http\JsonResponse;
use Illuminate\Http\Request;

class FrontendCourseController extends Controller
{
    private array $relations = [
        'features',
        'structures',
        'levels.curriculumItems',
        'reviews',
    ];

    public function index(Request $request): JsonResponse
    {
        $query = Course::query()
            ->with(['features', 'structures', 'levels.curriculumItems'])
            ->withCount(['reviews', 'enrollments'])
            ->withAvg('reviews', 'rating')
            ->where('is_published', true);

        if ($request->filled('category')) {
            $query->where('category', $request->query('category'));
        }

        if ($request->filled('search')) {
            $search = $request->query('search');

            $query->where(function ($innerQuery) use ($search) {
                $innerQuery->where('title', 'like', "%{$search}%")
                    ->orWhere('subtitle', 'like', "%{$search}%")
                    ->orWhere('description', 'like', "%{$search}%");
            });
        }

        $perPage = min((int) $request->query('per_page', 12), 50);
        $courses = $query->latest('created_at')->paginate($perPage);

        return response()->json([
            'success' => true,
            'data' => $courses,
        ], 200);
    }

    public function show(string $identifier): JsonResponse
    {
        $course = Course::query()
            ->with($this->relations)
            ->withCount(['reviews', 'enrollments'])
            ->withAvg('reviews', 'rating')
            ->where('is_published', true)
            ->where(function ($query) use ($identifier) {
                $query->where('slug', $identifier);

                if (is_numeric($identifier)) {
                    $query->orWhere('id', (int) $identifier);
                }
            })
            ->first();

        if (!$course) {
            return response()->json([
                'success' => false,
                'message' => 'Course not found.',
            ], 404);
        }

        return response()->json([
            'success' => true,
            'data' => $course,
        ], 200);
    }
}
