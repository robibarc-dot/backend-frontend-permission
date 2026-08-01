<?php

namespace App\Http\Controllers\Api\Backend;

use App\Http\Controllers\Controller;
use App\Models\Blog;
use App\Models\BlogSection;
use Illuminate\Http\Request;
use Illuminate\Http\JsonResponse;
use Illuminate\Support\Facades\DB;
use Illuminate\Support\Facades\Log;
use Illuminate\Support\Facades\File;
use Illuminate\Support\Str;

class BlogController extends Controller
{
    /**
     * Display a paginated listing of blogs with their sections and module.
     * GET /api/backend/blogs
     */
    public function index(Request $request): JsonResponse
    {
        $status = $request->query('status');
        
        $query = Blog::with(['sections' => function($q) {
            $q->where('status', 'active');
        }, 'module']);

        if ($status) {
            $query->where('status', $status);
        }

        if ($request->has('module_id')) {
            $query->where('module_id', $request->query('module_id'));
        }

        $blogs = $query->latest()->paginate(15);

        return response()->json([
            'success' => true,
            'data' => $blogs
        ], 200);
    }

    /**
     * Store a newly created blog and its sections in the database.
     * POST /api/backend/blogs
     */
    public function store(Request $request): JsonResponse
    {
        $validated = $request->validate([
            'module_id' => 'required|integer|exists:modules,id',
            'title' => 'required|string|max:255',
            'banner_img' => 'nullable',
            'short_description' => 'nullable|string',
            'status' => 'string|in:active,inactive',
            'sections' => 'required|array|min:1',
            'sections.*.type' => 'required|in:text,image',
            'sections.*.title' => 'nullable|string|max:255',
            'sections.*.text_content' => 'nullable|string',
            'sections.*.image_url' => 'nullable',
            'sections.*.status' => 'string|in:active,inactive',
        ]);

        try {
            $blog = DB::transaction(function () use ($validated, $request) {
                // 1. Handle banner image upload
                $bannerImgPath = null;
                if ($request->hasFile('banner_img')) {
                    $bannerImgPath = $this->uploadImage($request->file('banner_img'), 'blog');
                }

                // 2. Create the parent blog
                $blog = Blog::create([
                    'module_id' => $validated['module_id'],
                    'title' => $validated['title'],
                    'banner_img' => $bannerImgPath,
                    'short_description' => $validated['short_description'] ?? null,
                    'status' => $validated['status'] ?? 'active',
                ]);

                // 3. Create the child sections
                foreach ($validated['sections'] as $index => $sectionData) {
                    $sectionImagePath = null;
                    $sectionImageKey = 'sections.' . $index . '.image_url';
                    
                    if ($request->hasFile($sectionImageKey)) {
                        $sectionImagePath = $this->uploadImage($request->file($sectionImageKey), 'blog/section');
                    }

                    $blog->sections()->create([
                        'type' => $sectionData['type'],
                        'title' => $sectionData['title'] ?? null,
                        'text_content' => $sectionData['text_content'] ?? null,
                        'image_url' => $sectionImagePath ?? null,
                        'status' => $sectionData['status'] ?? 'active',
                    ]);
                }

                return $blog->load(['sections', 'module']);
            });

            return response()->json([
                'success' => true,
                'message' => 'Blog created successfully.',
                'data' => $blog
            ], 201);

        } catch (\Exception $e) {
            Log::error('Blog store failed: ' . $e->getMessage());
            return response()->json([
                'success' => false,
                'message' => 'Database error encountered during save operational workflow.'
            ], 500);
        }
    }

    /**
     * Display the specified individual blog matching the identifier.
     * GET /api/backend/blogs/{id}
     */
    public function show(int $id): JsonResponse
    {
        $blog = Blog::with(['sections', 'module'])->find($id);

        if (!$blog) {
            return response()->json([
                'success' => false,
                'message' => 'Blog not found.'
            ], 404);
        }

        return response()->json([
            'success' => true,
            'data' => $blog
        ], 200);
    }

    /**
     * Update the specified blog and refresh its sections map.
     * PUT/PATCH /api/backend/blogs/{id}
     */
    public function update(Request $request, int $id): JsonResponse
    {
        $blog = Blog::find($id);

        if (!$blog) {
            return response()->json([
                'success' => false,
                'message' => 'Blog not found.'
            ], 404);
        }

        $validated = $request->validate([
            'module_id' => 'sometimes|required|integer|exists:modules,id',
            'title' => 'sometimes|required|string|max:255',
            'banner_img' => 'nullable',
            'short_description' => 'nullable|string',
            'status' => 'string|in:active,inactive',
            'sections' => 'sometimes|array',
            'sections.*.type' => 'required|in:text,image',
            'sections.*.title' => 'nullable|string|max:255',
            'sections.*.text_content' => 'nullable|string',
            'sections.*.image_url' => 'nullable',
            'sections.*.status' => 'string|in:active,inactive',
        ]);

        try {
            DB::transaction(function () use ($blog, $validated, $request) {
                // Update parent metadata if provided
                $updateData = [];
                if (isset($validated['module_id'])) {
                    $updateData['module_id'] = $validated['module_id'];
                }
                if (isset($validated['title'])) {
                    $updateData['title'] = $validated['title'];
                }
                if (isset($validated['short_description'])) {
                    $updateData['short_description'] = $validated['short_description'];
                }
                if (isset($validated['status'])) {
                    $updateData['status'] = $validated['status'];
                }
                
                // Handle banner image upload
                if ($request->hasFile('banner_img')) {
                    // Delete old banner image if exists
                    if ($blog->banner_img) {
                        $this->deleteImage($blog->banner_img);
                    }
                    $updateData['banner_img'] = $this->uploadImage($request->file('banner_img'), 'blog');
                }
                
                if (!empty($updateData)) {
                    $blog->update($updateData);
                }

                // Re-sync sections if updated data array is explicitly passed
                if (isset($validated['sections'])) {
                    // Delete old sections and their images
                    foreach ($blog->sections as $oldSection) {
                        if ($oldSection->image_url) {
                            $this->deleteImage($oldSection->image_url);
                        }
                    }
                    $blog->sections()->delete();

                    foreach ($validated['sections'] as $index => $sectionData) {
                        $sectionImagePath = null;
                        $sectionImageKey = 'sections.' . $index . '.image_url';
                        
                        if ($request->hasFile($sectionImageKey)) {
                            $sectionImagePath = $this->uploadImage($request->file($sectionImageKey), 'blog/section');
                        }

                        $blog->sections()->create([
                            'type' => $sectionData['type'],
                            'title' => $sectionData['title'] ?? null,
                            'text_content' => $sectionData['text_content'] ?? null,
                            'image_url' => $sectionImagePath ?? null,
                            'status' => $sectionData['status'] ?? 'active',
                        ]);
                    }
                }
            });

            return response()->json([
                'success' => true,
                'message' => 'Blog updated successfully.',
                'data' => $blog->load(['sections', 'module'])
            ], 200);

        } catch (\Exception $e) {
            Log::error('Blog update execution error: ' . $e->getMessage());
            return response()->json([
                'success' => false,
                'message' => 'System error updating target dataset indices.'
            ], 500);
        }
    }

    /**
     * Remove the specified blog completely from storage registry.
     * DELETE /api/backend/blogs/{id}
     */
    public function destroy(int $id): JsonResponse
    {
        $blog = Blog::find($id);

        if (!$blog) {
            return response()->json([
                'success' => false,
                'message' => 'Blog not found.'
            ], 404);
        }

        try {
            DB::transaction(function () use ($blog) {
                // Delete banner image if exists
                if ($blog->banner_img) {
                    $this->deleteImage($blog->banner_img);
                }

                // Delete section images
                foreach ($blog->sections as $section) {
                    if ($section->image_url) {
                        $this->deleteImage($section->image_url);
                    }
                }

                $blog->delete();
            });

            return response()->json([
                'success' => true,
                'message' => 'Blog and related sections removed completely.'
            ], 200);

        } catch (\Exception $e) {
            Log::error('Blog delete failed: ' . $e->getMessage());
            return response()->json([
                'success' => false,
                'message' => 'Failed to delete blog.'
            ], 500);
        }
    }

    /**
     * Upload an image file to the specified directory.
     *
     * @param \Illuminate\Http\UploadedFile $file
     * @param string $directory
     * @return string|null
     */
    private function uploadImage($file, string $directory): ?string
    {
        if (!$file) {
            return null;
        }

        $uploadPath = public_path('upload/' . $directory);
        
        // Create directory if it doesn't exist
        if (!File::isDirectory($uploadPath)) {
            File::makeDirectory($uploadPath, 0755, true);
        }

        // Generate unique filename
        $filename = time() . '_' . Str::random(10) . '.' . $file->getClientOriginalExtension();
        
        // Move the file to the upload directory
        $file->move($uploadPath, $filename);

        // Return the relative path for storage in database
        return 'upload/' . $directory . '/' . $filename;
    }

    /**
     * Delete an image file from storage.
     *
     * @param string $imagePath
     * @return void
     */
    private function deleteImage(string $imagePath): void
    {
        $fullPath = public_path($imagePath);
        
        if (File::exists($fullPath)) {
            File::delete($fullPath);
        }
    }
}