<?php

namespace App\Http\Controllers\Api\Backend;

use App\Http\Controllers\Controller;
use Illuminate\Http\Request;
use Illuminate\Validation\Rule;
use Spatie\Permission\Models\Permission;
use Spatie\Permission\Models\Role;

class PermissionController extends Controller
{
    public function index(Request $request)
    {
        $search = trim((string) $request->query('search', ''));

        $permissions = Permission::query()
            ->with('roles:id,name')
            ->when($search !== '', function ($query) use ($search) {
                $query->where('name', 'like', "%{$search}%");
            })
            ->orderBy('name')
            ->get()
            ->map(fn (Permission $permission) => $this->formatPermission($permission));

        return response()->json([
            'permissions' => $permissions,
        ]);
    }

    public function show(Permission $permission)
    {
        $permission->load('roles:id,name');

        return response()->json([
            'permission' => $this->formatPermission($permission),
        ]);
    }

    public function store(Request $request)
    {
        $validated = $request->validate([
            'name' => ['required', 'string', 'max:255', Rule::unique('permissions', 'name')],
            'roles' => ['nullable', 'array'],
            'roles.*' => ['string', Rule::exists('roles', 'name')],
        ]);

        $permission = Permission::create([
            'name' => $validated['name'],
            'guard_name' => 'web',
        ]);

        if (!empty($validated['roles'])) {
            $permission->syncRoles($validated['roles']);
        }

        $permission->load('roles:id,name');

        return response()->json([
            'message' => 'Permission created successfully.',
            'permission' => $this->formatPermission($permission),
        ], 201);
    }

    public function update(Request $request, Permission $permission)
    {
        $validated = $request->validate([
            'name' => [
                'required',
                'string',
                'max:255',
                Rule::unique('permissions', 'name')->ignore($permission->id),
            ],
            'roles' => ['nullable', 'array'],
            'roles.*' => ['string', Rule::exists('roles', 'name')],
        ]);

        $permission->name = $validated['name'];
        $permission->save();
        $permission->syncRoles($validated['roles'] ?? []);
        $permission->load('roles:id,name');

        return response()->json([
            'message' => 'Permission updated successfully.',
            'permission' => $this->formatPermission($permission),
        ]);
    }

    public function meta()
    {
        return response()->json([
            'roles' => Role::query()
                ->orderBy('name')
                ->get(['id', 'name']),
        ]);
    }

    private function formatPermission(Permission $permission): array
    {
        return [
            'id' => $permission->id,
            'name' => $permission->name,
            'guard_name' => $permission->guard_name,
            'created_at' => $permission->created_at,
            'updated_at' => $permission->updated_at,
            'roles' => $permission->roles->pluck('name')->values()->all(),
            'role_count' => $permission->roles->count(),
        ];
    }
}
