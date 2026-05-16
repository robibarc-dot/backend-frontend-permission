'use client';

import React from 'react';
import { useParams } from 'next/navigation';
import Link from 'next/link';
import DynamicDataTable from '../../../components/dashboard/common/DynamicDataTable';
import { ShieldCheck, Plus, Key, Edit2, Loader2 } from 'lucide-react';
import { 
  useGetPermissionsQuery, 
} from "@/redux/features/auth/permission/permissionApis";

export default function PermissionPage() {
  const { role } = useParams();
  const resolvedRole = role?.toLowerCase();

  const { data: apiResponse, isLoading } = useGetPermissionsQuery();

  const permissions = apiResponse?.permissions || [];

  const filterConfigs = [
    { 
      key: 'name', 
      label: 'Permission Name', 
      type: 'text', 
      placeholder: 'Search permission name...' 
    },
    {
      key: 'guard_name',
      label: 'Guard Type',
      type: 'select',
      options: [
        { label: 'Web', value: 'web' },
        { label: 'API', value: 'api' },
      ]
    },
    {
      key: 'created_at',
      label: 'Created Date',
      type: 'date'
    }
  ];

  const columns = [
    {
      header: 'Permission',
      key: 'name',
      sortable: true,
      render: (item) => (
        <div className="flex items-center gap-3">
          <div className="p-2 bg-blue-50 rounded-lg">
            <Key size={16} className="text-blue-600" />
          </div>
          <span className="font-bold text-slate-700 tracking-tight">{item.name}</span>
        </div>
      )
    },
    {
      header: 'Guard',
      key: 'guard_name',
      sortable: true,
      render: (item) => (
        <span className={`px-2.5 py-1 rounded-md text-[10px] font-black uppercase border ${
          item.guard_name === 'web' 
            ? 'bg-emerald-50 text-emerald-700 border-emerald-100' 
            : 'bg-amber-50 text-amber-700 border-amber-100'
        }`}>
          {item.guard_name}
        </span>
      )
    },
    {
      header: 'Created Date',
      key: 'created_at',
      sortable: true,
    },
    {
      header: 'Actions',
      key: 'actions',
      align: 'right',
      render: (item) => (
        <Link
          href={`/${resolvedRole}/permission/edit/${item.id}`}
          className="p-2 text-blue-500 hover:text-blue-700 hover:bg-blue-50 rounded-lg transition-colors"
          title="Edit Permission"
        >
          <Edit2 size={18} />
        </Link>
      )
    }
  ];


  if (isLoading) {
    return (
      <div className="flex h-[400px] items-center justify-center">
        <Loader2 className="h-8 w-8 animate-spin text-blue-600" />
      </div>
    );
  }

  return (
    <div className="p-6 max-w-[1600px] mx-auto space-y-6">
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl font-black text-slate-800 flex items-center gap-2">
            <ShieldCheck className="text-blue-600" size={28} />
            System Permissions
          </h1>
          <p className="text-sm text-slate-500 font-medium">Manage and configure access control levels for the application.</p>
        </div>
        <Link 
          href={`/${resolvedRole}/permission/create`}
          className="flex items-center justify-center gap-2 px-5 py-2.5 bg-blue-600 text-white rounded-xl font-bold hover:bg-blue-700 shadow-lg shadow-blue-200 transition-all active:scale-95"
        >
          <Plus size={20} />
          Create Permission
        </Link>
      </div>

      <DynamicDataTable
        data={permissions}
        columns={columns}
        filterConfigs={filterConfigs}
        perPage={10}
      />
    </div>
  );
}