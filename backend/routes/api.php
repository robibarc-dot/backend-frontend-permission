<?php
use App\Http\Controllers\Api\AuthController;
use App\Http\Controllers\Api\Backend\PermissionController;
use App\Http\Controllers\Api\Backend\RoleController;
use App\Http\Controllers\Api\Backend\UserController;
use Illuminate\Support\Facades\Route;

Route::post('/register', [AuthController::class, 'register']);

Route::post('/login', [AuthController::class, 'login']);

Route::middleware('auth:sanctum')->group(function () {
    Route::get('/user', [AuthController::class, 'me']);

    Route::post('/logout', [AuthController::class, 'logout']);

    Route::middleware('permission:user.view')->group(function () {
        Route::get('/backend/users/meta', [UserController::class, 'meta']);
        Route::get('/backend/users', [UserController::class, 'index']);
        Route::get('/backend/users/{user}', [UserController::class, 'show']);
    });

    Route::middleware('permission:user.create')->group(function () {
        Route::post('/backend/users', [UserController::class, 'store']);
    });

    Route::middleware('permission:user.edit')->group(function () {
        Route::put('/backend/users/{user}', [UserController::class, 'update']);
    });

    Route::middleware('permission:role.view')->group(function () {
        Route::get('/backend/roles/meta', [RoleController::class, 'meta']);
        Route::get('/backend/roles', [RoleController::class, 'index']);
        Route::get('/backend/roles/{role}', [RoleController::class, 'show']);
    });

    Route::middleware('permission:role.create')->group(function () {
        Route::post('/backend/roles', [RoleController::class, 'store']);
    });

    Route::middleware('permission:role.edit')->group(function () {
        Route::put('/backend/roles/{role}', [RoleController::class, 'update']);
    });

    Route::middleware('permission:permission.view')->group(function () {
        Route::get('/backend/permissions/meta', [PermissionController::class, 'meta']);
        Route::get('/backend/permissions', [PermissionController::class, 'index']);
        Route::get('/backend/permissions/{permission}', [PermissionController::class, 'show']);
    });

    Route::middleware('permission:permission.create')->group(function () {
        Route::post('/backend/permissions', [PermissionController::class, 'store']);
    });

    Route::middleware('permission:permission.edit')->group(function () {
        Route::put('/backend/permissions/{permission}', [PermissionController::class, 'update']);
    });

    Route::middleware('role:super-admin|admin')->group(function () {
        Route::get('/admin', function () {
            return response()->json([
                'message' => 'Admin Access'
            ]);
        });
    });

    Route::middleware('permission:student.create')->group(function () {
        Route::get('/student-create', function () {
            return response()->json([
                'message' => 'Student Create Permission Granted'
            ]);

        });

    });

});
