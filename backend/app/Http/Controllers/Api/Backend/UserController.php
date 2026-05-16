<?php

namespace App\Http\Controllers\Api\Backend;

use App\Http\Controllers\Controller;
use App\Models\User;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Hash;
use Illuminate\Validation\Rule;
use Spatie\Permission\Models\Permission;
use Spatie\Permission\Models\Role;

class UserController extends Controller
{
    public function index(Request $request)
    {
        $search = trim((string) $request->query('search', ''));

        $users = User::query()
            ->with(['roles:id,name', 'permissions:id,name'])
            ->when($search !== '', function ($query) use ($search) {
                $query->where(function ($innerQuery) use ($search) {
                    $innerQuery
                        ->where('name', 'like', "%{$search}%")
                        ->orWhere('email', 'like', "%{$search}%");
                });
            })
            ->latest()
            ->get()
            ->map(fn (User $user) => $this->formatUser($user));

        return response()->json([
            'users' => $users,
        ]);
    }

    public function show(User $user)
    {
        $user->load(['roles:id,name', 'permissions:id,name']);

        return response()->json([
            'user' => $this->formatUser($user),
        ]);
    }

    public function store(Request $request)
    {
        $validated = $request->validate([
            'name' => ['required', 'string', 'max:255'],
            'email' => ['required', 'email', 'max:255', 'unique:users,email'],
            'password' => ['required', 'string', 'min:6'],
            'roles' => ['required', 'array', 'min:1'],
            'roles.*' => ['string', Rule::exists('roles', 'name')],
            'permissions' => ['nullable', 'array'],
            'permissions.*' => ['string', Rule::exists('permissions', 'name')],
        ]);

        $user = User::create([
            'name' => $validated['name'],
            'email' => $validated['email'],
            'password' => Hash::make($validated['password']),
        ]);

        $user->syncRoles($validated['roles']);
        $user->syncPermissions($validated['permissions'] ?? []);
        $user->load(['roles:id,name', 'permissions:id,name']);

        return response()->json([
            'message' => 'User created successfully.',
            'user' => $this->formatUser($user),
        ], 201);
    }

    public function update(Request $request, User $user)
    {
        $validated = $request->validate([
            'name' => ['required', 'string', 'max:255'],
            'email' => [
                'required',
                'email',
                'max:255',
                Rule::unique('users', 'email')->ignore($user->id),
            ],
            'password' => ['nullable', 'string', 'min:6'],
            'roles' => ['required', 'array', 'min:1'],
            'roles.*' => ['string', Rule::exists('roles', 'name')],
            'permissions' => ['nullable', 'array'],
            'permissions.*' => ['string', Rule::exists('permissions', 'name')],
        ]);

        $user->fill([
            'name' => $validated['name'],
            'email' => $validated['email'],
        ]);

        if (!empty($validated['password'])) {
            $user->password = Hash::make($validated['password']);
        }

        $user->save();
        $user->syncRoles($validated['roles']);
        $user->syncPermissions($validated['permissions'] ?? []);
        $user->load(['roles:id,name', 'permissions:id,name']);

        return response()->json([
            'message' => 'User updated successfully.',
            'user' => $this->formatUser($user),
        ]);
    }

    public function meta()
    {
        return response()->json([
            'roles' => Role::query()
                ->with('permissions:id,name')
                ->orderBy('name')
                ->get()
                ->map(function (Role $role) {
                    return [
                        'id' => $role->id,
                        'name' => $role->name,
                        'permissions' => $role->permissions
                            ->pluck('name')
                            ->values()
                            ->all(),
                    ];
                }),
            'permissions' => Permission::query()
                ->orderBy('name')
                ->get(['id', 'name']),
        ]);
    }

    private function formatUser(User $user): array
    {
        return [
            'id' => $user->id,
            'name' => $user->name,
            'email' => $user->email,
            'created_at' => $user->created_at,
            'updated_at' => $user->updated_at,
            'roles' => $user->roles->pluck('name')->values()->all(),
            'permissions' => $user->permissions->pluck('name')->values()->all(),
            'all_permissions' => $user->getAllPermissions()->pluck('name')->values()->all(),
        ];
    }
}
