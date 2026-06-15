<?php

namespace App\Http\Controllers\Api\Frontend;

use App\Http\Controllers\Controller;
use Illuminate\Http\Request;
use App\Models\Module;

class CommonController extends Controller
{
    public function getModules()
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
}
