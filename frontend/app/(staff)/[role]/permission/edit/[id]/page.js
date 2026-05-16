"use client";

import { useState, useEffect } from "react";
import { useRouter, useParams } from "next/navigation";
import Link from "next/link";
import { useSelector } from "react-redux";
import Layout from "../../../../../components/dashboard/Layout";
import { ShieldPlus, ChevronLeft, Save, Loader2 } from "lucide-react";


import { 
    useGetPermissionQuery,
    useUpdatePermissionMutation, 
    useGetPermissionsMetaQuery 
} from "@/redux/features/auth/permission/permissionApis";

function hasPermission(permissionList, permissionName) {
    return Array.isArray(permissionList) && permissionList.includes(permissionName);
}

export default function EditPermissionPage() {
    const router = useRouter();
    const { role, id } = useParams();
    const { permissions } = useSelector((state) => state.auth);
    const resolvedRole = role?.toLowerCase();

    const { data: permissionData, isLoading: fetching } = useGetPermissionQuery(id);
    const { data: meta, isLoading: metaLoading } = useGetPermissionsMetaQuery();
    const [updatePermission, { isLoading: saving }] = useUpdatePermissionMutation();

    const [form, setForm] = useState({ name: "", roles: [] });
    const [error, setError] = useState("");
    const [success, setSuccess] = useState("");

    const canEditPermissions = hasPermission(permissions, "permission.edit");

    useEffect(() => {
        if (permissionData?.permission) {
            const p = permissionData.permission;
            setForm({
                name: p.name || "",
                roles: Array.isArray(p.roles) ? p.roles : [],
            });
        }
    }, [permissionData]);

    function toggleRole(roleName) {
        setForm((current) => ({
            ...current,
            roles: current.roles.includes(roleName)
                ? current.roles.filter((item) => item !== roleName)
                : [...current.roles, roleName],
        }));
    }

    async function handleSubmit(event) {
        event.preventDefault();
        setError("");
        setSuccess("");

        try {
            await updatePermission({ id, body: form }).unwrap();
            setSuccess("Permission updated successfully.");
            setTimeout(() => router.push(`/${resolvedRole}/permission`), 1500);
        } catch (requestError) {
            const validationErrors = requestError?.data?.errors;
            if (validationErrors) {
                setError(Object.values(validationErrors).flat().join(" "));
            } else {
                setError(requestError?.data?.message || "Unable to update permission.");
            }
        }
    }



    if (fetching) {
        return (
            <div className="py-20 text-center text-slate-500">Retrieving permission data...</div>
        );
    }

    return (
        <div className="mx-auto space-y-6">
            <div className="flex items-center justify-between">
                <Link 
                    href={`/${resolvedRole}/permission`}
                    className="flex items-center gap-2 text-slate-500 hover:text-slate-800 transition-colors font-medium text-sm"
                >
                    <ChevronLeft size={18} />
                    Back to Roles
                </Link>
            </div>
            <form onSubmit={handleSubmit} className="space-y-6">
                <section className="rounded-[26px] bg-[linear-gradient(150deg,_#111827,_#1f2937)] p-6 text-white">
                    <p className="text-xs uppercase tracking-[0.28em] text-amber-200/80">Updating ID: {id}</p>
                    <h2 className="mt-3 text-2xl font-semibold">Update Rules</h2>
                    <p className="mt-3 text-sm leading-7 text-slate-300">
                        Changes to names will reflect across the system immediately. Ensure role mappings remain consistent with staff needs.
                    </p>
                </section>

                <div className="rounded-[26px] border border-slate-200/80 bg-white/92 p-6 shadow-sm">
                    <div>
                        <label className="mb-2 block text-sm font-medium text-slate-700">
                            Permission name
                        </label>
                        <input
                            type="text"
                            required
                            value={form.name}
                            onChange={(e) => setForm({ ...form, name: e.target.value })}
                            className="w-full rounded-2xl border border-slate-200 bg-white px-4 py-3 text-slate-900 outline-none transition focus:border-amber-400 focus:ring-4 focus:ring-amber-100"
                        />
                    </div>

                    <div className="mt-8">
                        <p className="text-sm font-medium text-slate-700">Associated roles</p>
                        <p className="text-xs text-slate-500 mb-4">Toggle role access for this specific permission.</p>
                        
                        {metaLoading ? (
                            <div className="py-4 text-sm text-slate-400">Loading roles...</div>
                        ) : (
                            <div className="grid gap-3 sm:grid-cols-2">
                                {meta?.roles?.map((roleItem) => {
                                    const checked = form.roles.includes(roleItem.name);
                                    return (
                                        <label
                                            key={roleItem.name}
                                            className={`flex cursor-pointer items-center gap-3 rounded-2xl border px-4 py-3 transition ${
                                                checked ? "border-amber-300 bg-amber-50" : "border-slate-200 bg-white"
                                            }`}
                                        >
                                            <input
                                                type="checkbox"
                                                checked={checked}
                                                onChange={() => toggleRole(roleItem.name)}
                                                className="h-4 w-4 rounded border-slate-300 text-amber-600 focus:ring-amber-500"
                                            />
                                            <span className="text-sm font-medium text-slate-900">{roleItem.name}</span>
                                        </label>
                                    );
                                })}
                            </div>
                        )}
                    </div>

                    {error && (
                        <div className="mt-6 rounded-2xl border border-red-200 bg-red-50 px-4 py-3 text-sm text-red-700">
                            {error}
                        </div>
                    )}

                    {success && (
                        <div className="mt-6 rounded-2xl border border-emerald-200 bg-emerald-50 px-4 py-3 text-sm text-emerald-700">
                            {success}
                        </div>
                    )}

                    <div className="mt-8 flex flex-col gap-3 sm:flex-row">
                        <button
                            type="submit"
                            disabled={saving}
                            className="flex-1 rounded-2xl bg-slate-950 px-6 py-3 text-sm font-semibold text-white shadow-lg transition hover:-translate-y-0.5 disabled:opacity-60"
                        >
                            {saving ? "Updating..." : "Update Permission"}
                        </button>
                        <Link
                            href={`/${resolvedRole}/permission`}
                            className="flex-1 rounded-2xl border border-slate-200 bg-white px-6 py-3 text-center text-sm font-semibold text-slate-600 transition hover:bg-slate-50"
                        >
                            Cancel
                        </Link>
                    </div>
                </div>
            </form>
        </div>
    );
}
