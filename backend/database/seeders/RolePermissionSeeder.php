<?php

namespace Database\Seeders;

use Illuminate\Database\Seeder;
use Spatie\Permission\Models\Role;
use Spatie\Permission\Models\Permission;

class RolePermissionSeeder extends Seeder
{
    public function run(): void
    {
        $permissions = [
            'student.view',
            'student.create',
            'student.edit',
            'student.delete',
            'user.view',
            'user.create',
            'user.edit',
            'user.delete',
            'role.view',
            'role.create',
            'role.edit',
            'role.delete',
            'permission.view',
            'permission.create',
            'permission.edit',
            'permission.delete',
        ];

        foreach ($permissions as $permissionName) {
            Permission::findOrCreate($permissionName, 'web');
        }

        $superAdmin = Role::findOrCreate('super-admin', 'web');
        $admin = Role::findOrCreate('admin', 'web');
        $teacher = Role::findOrCreate('teacher', 'web');
        $user = Role::findOrCreate('user', 'web');

        $superAdmin->syncPermissions(Permission::all());
        $admin->syncPermissions(Permission::all());

        $teacher->syncPermissions([
            'student.view',
            'student.create',
            'student.edit',
            'user.view',
            'role.view',
            'permission.view',
        ]);

        $user->syncPermissions([
            'student.view',
        ]);
    }
}
