<?php

namespace App\Http\Controllers\Api\Backend;

use App\Http\Controllers\Controller;
use App\Models\Course\Course;
use Illuminate\Http\Request;
use Illuminate\Http\JsonResponse;
use Illuminate\Support\Facades\DB;
use Illuminate\Support\Facades\Log;
use Illuminate\Support\Str;
use Illuminate\Validation\Rule;

class CourseController extends Controller
{
    private array $relations = [
        'features',
        'structures',
        'levels.curriculumItems',
        'reviews',
        'enrollments.user',
    ];

    public function index(Request $request): JsonResponse
    {
        $query = Course::query()
            ->with(['features', 'structures', 'levels.curriculumItems'])
            ->withCount(['reviews', 'enrollments'])
            ->withAvg('reviews', 'rating');

        if ($request->filled('category')) {
            $query->where('category', $request->query('category'));
        }

        if ($request->has('is_published')) {
            $query->where('is_published', $request->boolean('is_published'));
        }

        if ($request->filled('search')) {
            $search = $request->query('search');
            $query->where(function ($innerQuery) use ($search) {
                $innerQuery->where('title', 'like', "%{$search}%")
                    ->orWhere('subtitle', 'like', "%{$search}%")
                    ->orWhere('slug', 'like', "%{$search}%");
            });
        }

        $perPage = min((int) $request->query('per_page', 15), 100);
        $courses = $query->latest('created_at')->paginate($perPage);

        return response()->json([
            'status' => 'success',
            'data' => $courses,
        ]);
    }

    public function create(): JsonResponse
    {
        return response()->json([
            'status' => 'success',
            'data' => [
                'categories' => Course::query()
                    ->whereNotNull('category')
                    ->distinct()
                    ->orderBy('category')
                    ->pluck('category'),
            ],
        ]);
    }

    public function store(Request $request): JsonResponse
    {
        $validated = $request->validate($this->rules());

        try {
            $course = DB::transaction(function () use ($validated) {
                $validated['slug'] = $validated['slug'] ?? $this->uniqueSlug($validated['title']);

                $course = Course::create($this->coursePayload($validated));
                $this->syncRelatedModels($course, $validated);

                return $course->load($this->relations);
            });

            return response()->json([
                'status' => 'success',
                'message' => 'Course created successfully.',
                'data' => $course,
            ], 201);
        } catch (\Throwable $e) {
            Log::error('Course store failed: ' . $e->getMessage());

            return response()->json([
                'status' => 'error',
                'message' => 'Failed to create course.',
            ], 500);
        }
    }

    public function show(int $id): JsonResponse
    {
        $course = Course::with($this->relations)->find($id);

        if (!$course) {
            return response()->json([
                'status' => 'error',
                'message' => 'Course not found.',
            ], 404);
        }

        return response()->json([
            'status' => 'success',
            'data' => $course,
        ]);
    }

    public function update(Request $request, int $id): JsonResponse
    {
        $course = Course::find($id);

        if (!$course) {
            return response()->json([
                'status' => 'error',
                'message' => 'Course not found.',
            ], 404);
        }

        $validated = $request->validate($this->rules($course->id));

        try {
            DB::transaction(function () use ($course, $validated) {
                $payload = $this->coursePayload($validated);

                if (!empty($payload)) {
                    $course->update($payload);
                }

                $this->syncRelatedModels($course, $validated);
            });

            return response()->json([
                'status' => 'success',
                'message' => 'Course updated successfully.',
                'data' => $course->load($this->relations),
            ]);
        } catch (\Throwable $e) {
            Log::error('Course update failed: ' . $e->getMessage());

            return response()->json([
                'status' => 'error',
                'message' => 'Failed to update course.',
            ], 500);
        }
    }

    public function destroy(int $id): JsonResponse
    {
        $course = Course::find($id);

        if (!$course) {
            return response()->json([
                'status' => 'error',
                'message' => 'Course not found.',
            ], 404);
        }

        $course->delete();

        return response()->json([
            'status' => 'success',
            'message' => 'Course deleted successfully.',
        ]);
    }

    private function rules(?int $courseId = null): array
    {
        $required = $courseId ? 'sometimes|required' : 'required';

        return [
            'category' => 'nullable|string|max:255',
            'title' => "{$required}|string|max:255",
            'subtitle' => 'nullable|string|max:255',
            'slug' => [
                'nullable',
                'string',
                'max:255',
                Rule::unique('courses', 'slug')->ignore($courseId),
            ],
            'description' => 'nullable|string',
            'thumbnail_url' => 'nullable|string|max:500',
            'promo_video_url' => 'nullable|string|max:500',
            'price' => "{$required}|numeric|min:0",
            'regular_price' => 'nullable|numeric|min:0',
            'duration_hours' => 'nullable|integer|min:0',
            'duration_minutes' => 'nullable|integer|min:0|max:59',
            'is_published' => 'sometimes|boolean',

            'features' => 'sometimes|array',
            'features.*.icon_type' => 'nullable|string|max:50',
            'features.*.feature_text' => 'required|string|max:255',
            'features.*.sort_order' => 'nullable|integer|min:0',

            'structures' => 'sometimes|array',
            'structures.*.title' => 'required|string|max:255',
            'structures.*.description' => 'required|string',
            'structures.*.badge_icon' => 'nullable|string|max:50',
            'structures.*.sort_order' => 'nullable|integer|min:0',

            'levels' => 'sometimes|array',
            'levels.*.level_title' => 'required|string|max:255',
            'levels.*.sub_title' => 'nullable|string|max:255',
            'levels.*.sort_order' => 'nullable|integer|min:0',
            'levels.*.curriculum_items' => 'sometimes|array',
            'levels.*.curriculum_items.*.item_name' => 'required|string|max:255',
            'levels.*.curriculum_items.*.sort_order' => 'nullable|integer|min:0',

            'reviews' => 'sometimes|array',
            'reviews.*.user_name' => 'nullable|string|max:100',
            'reviews.*.rating' => 'required|integer|min:1|max:5',
            'reviews.*.comment' => 'nullable|string',

            'enrollments' => 'sometimes|array',
            'enrollments.*.user_id' => 'required|integer|exists:users,id',
            'enrollments.*.amount_paid' => 'required|numeric|min:0',
            'enrollments.*.status' => 'nullable|string|max:50',
            'enrollments.*.enrolled_at' => 'nullable|date',
        ];
    }

    private function coursePayload(array $validated): array
    {
        return collect($validated)->only([
            'category',
            'title',
            'subtitle',
            'slug',
            'description',
            'thumbnail_url',
            'promo_video_url',
            'price',
            'regular_price',
            'duration_hours',
            'duration_minutes',
            'is_published',
        ])->toArray();
    }

    private function syncRelatedModels(Course $course, array $validated): void
    {
        if (array_key_exists('features', $validated)) {
            $course->features()->delete();

            foreach ($validated['features'] as $index => $feature) {
                $course->features()->create([
                    'icon_type' => $feature['icon_type'] ?? 'document',
                    'feature_text' => $feature['feature_text'],
                    'sort_order' => $feature['sort_order'] ?? $index,
                ]);
            }
        }

        if (array_key_exists('structures', $validated)) {
            $course->structures()->delete();

            foreach ($validated['structures'] as $index => $structure) {
                $course->structures()->create([
                    'title' => $structure['title'],
                    'description' => $structure['description'],
                    'badge_icon' => $structure['badge_icon'] ?? null,
                    'sort_order' => $structure['sort_order'] ?? $index,
                ]);
            }
        }

        if (array_key_exists('levels', $validated)) {
            $course->levels()->delete();

            foreach ($validated['levels'] as $index => $levelData) {
                $level = $course->levels()->create([
                    'level_title' => $levelData['level_title'],
                    'sub_title' => $levelData['sub_title'] ?? null,
                    'sort_order' => $levelData['sort_order'] ?? $index,
                ]);

                foreach ($levelData['curriculum_items'] ?? [] as $itemIndex => $item) {
                    $level->curriculumItems()->create([
                        'item_name' => $item['item_name'],
                        'sort_order' => $item['sort_order'] ?? $itemIndex,
                    ]);
                }
            }
        }

        if (array_key_exists('reviews', $validated)) {
            $course->reviews()->delete();

            foreach ($validated['reviews'] as $review) {
                $course->reviews()->create([
                    'user_name' => $review['user_name'] ?? null,
                    'rating' => $review['rating'],
                    'comment' => $review['comment'] ?? null,
                ]);
            }
        }

        if (array_key_exists('enrollments', $validated)) {
            $course->enrollments()->delete();

            foreach ($validated['enrollments'] as $enrollment) {
                $course->enrollments()->create([
                    'user_id' => $enrollment['user_id'],
                    'amount_paid' => $enrollment['amount_paid'],
                    'status' => $enrollment['status'] ?? 'pending',
                    'enrolled_at' => $enrollment['enrolled_at'] ?? now(),
                ]);
            }
        }
    }

    private function uniqueSlug(string $title): string
    {
        $baseSlug = Str::slug($title);
        $slug = $baseSlug;
        $counter = 1;

        while (Course::where('slug', $slug)->exists()) {
            $slug = "{$baseSlug}-{$counter}";
            $counter++;
        }

        return $slug;
    }
}
