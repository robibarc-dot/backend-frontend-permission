<?php
use App\Http\Controllers\Api\AuthController;
use App\Http\Controllers\Api\Backend\PermissionController;
use App\Http\Controllers\Api\Backend\RoleController;
use App\Http\Controllers\Api\Backend\UserController;
use App\Http\Controllers\Api\Backend\Common\{
    ModuleController,
    TestContextController,
    TestSectionController,
    QuestionTypeController,
    QuestionGroupController,
    QuestionController,
};
use App\Http\Controllers\Api\Backend\Practice\{
    PracticeTestController,
    PracticeTestQuestionController
};
use App\Http\Controllers\Api\Backend\Mock\{
    MockTestController,
    MockTestQuestionController
};
use App\Http\Controllers\Api\Frontend\Test\MockTestController as FrontendMockTestController;
use App\Http\Controllers\Api\Frontend\Test\PracticeTestController as FrontendPracticeTestController;
use App\Http\Controllers\Api\Frontend\CommonController;
use Illuminate\Support\Facades\Route;


Route::post('/register', [AuthController::class, 'register']);

Route::post('/login', [AuthController::class, 'login']);

Route::middleware('auth:sanctum')->group(function () {
    Route::get('/user', [AuthController::class, 'me']);

    Route::post('/logout', [AuthController::class, 'logout']);

    Route::prefix('frontend/practice-tests')->controller(FrontendPracticeTestController::class)->group(function () {
        Route::get('/', 'index')->name('frontend.practice-tests.index');
        Route::get('/{identifier}', 'show')->name('frontend.practice-tests.show');
        Route::post('/{identifier}/start', 'start')->name('frontend.practice-tests.start');
        Route::get('/{identifier}/questions', 'questions')->name('frontend.practice-tests.questions');
        Route::post('/{identifier}/submit', 'submit')->name('frontend.practice-tests.submit');
        Route::get('/{identifier}/results', 'results')->name('frontend.practice-tests.results');
    });

    Route::prefix('frontend/mock-tests')->controller(FrontendMockTestController::class)->group(function () {
        Route::get('/', 'index')->name('frontend.mock-tests.index');
        Route::get('/{identifier}', 'show')->name('frontend.mock-tests.show');
        Route::post('/{identifier}/start', 'start')->name('frontend.mock-tests.start');
        Route::get('/{identifier}/questions', 'questions')->name('frontend.mock-tests.questions');
        Route::post('/{identifier}/submit', 'submit')->name('frontend.mock-tests.submit');
    });

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

        Route::prefix('module')->controller(ModuleController::class)->group(function () {
            Route::get('/', 'index')->name('module.index');
            Route::get('/create', 'create')->name('module.create');
            Route::post('/store', 'store')->name('module.store');
            Route::get('/show/{id}', 'show')->name('module.edit');
            Route::put('/update/{id}', 'update')->name('module.update');
            Route::delete('/destroy/{id}', 'destroy')->name('module.delete');
        });
        Route::prefix('practice-test')->controller(PracticeTestController::class)->group(function () {
            Route::get('/', 'index')->name('practice-test.index');
            Route::get('/create', 'create')->name('practice-test.create');
            Route::post('/store', 'store')->name('practice-test.store');
            Route::get('/show/{id}', 'show')->name('practice-test.edit');
            Route::put('/update/{id}', 'update')->name('practice-test.update');
            Route::delete('/destroy/{id}', 'destroy')->name('practice-test.delete');
        });
        Route::prefix('practice-test-question')->controller(PracticeTestQuestionController::class)->group(function () {
            Route::get('/', 'index')->name('practice-test-question.index');
            Route::get('/create', 'create')->name('practice-test-question.create');
            Route::post('/store', 'store')->name('practice-test-question.store');
            Route::get('/show/{id}', 'show')->name('practice-test-question.edit');
            Route::put('/update/{id}', 'update')->name('practice-test-question.update');
            Route::delete('/destroy/{id}', 'destroy')->name('practice-test-question.delete');
        });
        Route::prefix('mock-test')->controller(MockTestController::class)->group(function () {
            Route::get('/', 'index')->name('mock-test.index');
            Route::get('/create', 'create')->name('mock-test.create');
            Route::post('/store', 'store')->name('mock-test.store');
            Route::get('/show/{id}', 'show')->name('mock-test.edit');
            Route::put('/update/{id}', 'update')->name('mock-test.update');
            Route::delete('/destroy/{id}', 'destroy')->name('mock-test.delete');
        });

        Route::prefix('mock-test-question')->controller(MockTestQuestionController::class)->group(function () {
            Route::get('/', 'index')->name('mock-test-question.index');
            Route::get('/create', 'create')->name('mock-test-question.create');
            Route::post('/store', 'store')->name('mock-test-question.store');
            Route::get('/show/{id}', 'show')->name('mock-test-question.edit');
            Route::put('/update/{id}', 'update')->name('mock-test-question.update');
            Route::delete('/destroy/{id}', 'destroy')->name('mock-test-question.delete');
        });

        Route::prefix('test-section')->controller(TestSectionController::class)->group(function () {
            Route::get('/', 'index')->name('test-section.index');
            Route::post('/store', 'store')->name('test-section.store');
            Route::get('/show/{id}', 'show')->name('test-section.edit');
            Route::put('/update/{id}', 'update')->name('test-section.update');
            Route::delete('/destroy/{id}', 'destroy')->name('test-section.delete');
        });

        Route::prefix('test-context')->controller(TestContextController::class)->group(function () {
            Route::get('/', 'index')->name('test-context.index');
            Route::post('/store', 'store')->name('test-context.store');
            Route::get('/show/{id}', 'show')->name('test-context.edit');
            Route::put('/update/{id}', 'update')->name('test-context.update');
            Route::delete('/destroy/{id}', 'destroy')->name('test-context.delete');
        });
        Route::prefix('question-type')->controller(QuestionTypeController::class)->group(function () {
            Route::get('/', 'index')->name('question-type.index');
            Route::post('/store', 'store')->name('question-type.store');
            Route::get('/show/{id}', 'show')->name('question-type.edit');
            Route::put('/update/{id}', 'update')->name('question-type.update');
            Route::delete('/destroy/{id}', 'destroy')->name('question-type.delete');
        });
        Route::prefix('question-group')->controller(QuestionGroupController::class)->group(function () {
            Route::get('/', 'index')->name('question-group.index');
            Route::post('/store', 'store')->name('question-group.store');
            Route::get('/show/{id}', 'show')->name('question-group.edit');
            Route::put('/update/{id}', 'update')->name('question-group.update');
            Route::delete('/destroy/{id}', 'destroy')->name('question-group.delete');
        });
        Route::prefix('question')->controller(QuestionController::class)->group(function () {
            Route::get('/', 'index')->name('question.index');
            Route::post('/store', 'store')->name('question.store');
            Route::get('/show/{id}', 'show')->name('question.edit');
            Route::put('/update/{id}', 'update')->name('question.update');
            Route::delete('/destroy/{id}', 'destroy')->name('question.delete');
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


// common apis
Route::prefix('frontend')->group(function () {
    Route::get('get-modules', [CommonController::class, 'getModules']);
});



