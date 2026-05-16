"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { useSelector } from "react-redux";
import Layout from "../../../components/dashboard/Layout";
import api from "../../../../services/api";
import {
    getPrimaryRole,
    getRoleHomePath,
    isStaffRole,
} from "../../../../lib/auth";

const initialForm = {
    name: "",
    permissions: [],
};

function hasPermission(permissionList, permissionName) {
    return Array.isArray(permissionList) && permissionList.includes(permissionName);
}

export default function RoleManagementPage({ params }) {
    const router = useRouter();
    const { user, roles, permissions } = useSelector((state) => state.auth);
    const resolvedRole = params?.role?.toLowerCase();
    const primaryRole = getPrimaryRole(user, roles);
    const [roleItems, setRoleItems] = useState([]);
    const [meta, setMeta] = useState({ permissions: [] });
    const [form, setForm] = useState(initialForm);
    const [selectedRoleId, setSelectedRoleId] = useState(null);
    const [search, setSearch] = useState("");
    const [loading, setLoading] = useState(true);
    const [saving, setSaving] = useState(false);
    const [error, setError] = useState("");
    const [success, setSuccess] = useState("");

    const canViewRoles = hasPermission(permissions, "role.view");
    const canCreateRoles = hasPermission(permissions, "role.create");
    const canEditRoles = hasPermission(permissions, "role.edit");

    useEffect(() => {
        if (primaryRole && isStaffRole(primaryRole) && primaryRole !== resolvedRole) {
            router.replace(getRoleHomePath(primaryRole));
        }
    }, [primaryRole, resolvedRole, router]);

    useEffect(() => {
        if (!isStaffRole(resolvedRole) || !canViewRoles) {
            setLoading(false);
            return;
        }

        fetchMetaAndRoles();
    }, [resolvedRole, canViewRoles]);

    async function fetchMetaAndRoles(searchTerm = "") {
        setLoading(true);
        setError("");

        try {
            const [metaResponse, rolesResponse] = await Promise.all([
                api.get("/backend/roles/meta"),
                api.get("/backend/roles", {
                    params: searchTerm ? { search: searchTerm } : {},
                }),
            ]);

            setMeta(metaResponse.data);
            setRoleItems(rolesResponse.data?.roles || []);
        } catch (requestError) {
            setError(
                requestError?.response?.data?.message ||
                    "Unable to load role management data."
            );
        } finally {
            setLoading(false);
        }
    }

    function resetForm(nextRole = null) {
        if (!nextRole) {
            setSelectedRoleId(null);
            setForm(initialForm);
            return;
        }

        setSelectedRoleId(nextRole.id);
        setForm({
            name: nextRole.name || "",
            permissions: Array.isArray(nextRole.permissions)
                ? nextRole.permissions
                : [],
        });
    }

    async function handleSearchSubmit(event) {
        event.preventDefault();
        await fetchMetaAndRoles(search.trim());
    }

    function togglePermission(permissionName) {
        setForm((current) => ({
            ...current,
            permissions: current.permissions.includes(permissionName)
                ? current.permissions.filter((item) => item !== permissionName)
                : [...current.permissions, permissionName],
        }));
    }

    async function handleSubmit(event) {
        event.preventDefault();

        if (selectedRoleId && !canEditRoles) {
            setError("You do not have permission to edit roles.");
            return;
        }

        if (!selectedRoleId && !canCreateRoles) {
            setError("You do not have permission to create roles.");
            return;
        }

        setSaving(true);
        setError("");
        setSuccess("");

        try {
            const payload = {
                name: form.name,
                permissions: form.permissions,
            };

            const response = selectedRoleId
                ? await api.put(`/backend/roles/${selectedRoleId}`, payload)
                : await api.post("/backend/roles", payload);

            setSuccess(
                response.data?.message ||
                    (selectedRoleId
                        ? "Role updated successfully."
                        : "Role created successfully.")
            );

            resetForm();
            await fetchMetaAndRoles(search.trim());
        } catch (requestError) {
            const validationErrors = requestError?.response?.data?.errors;

            if (validationErrors) {
                setError(Object.values(validationErrors).flat().join(" "));
            } else {
                setError(
                    requestError?.response?.data?.message ||
                        "Unable to save the role right now."
                );
            }
        } finally {
            setSaving(false);
        }
    }

    if (!isStaffRole(resolvedRole)) {
        return (
            <div className="flex min-h-screen items-center justify-center bg-slate-950 px-4 text-white">
                <div className="rounded-[28px] border border-white/10 bg-white/8 p-8 text-center">
                    <p className="text-xs uppercase tracking-[0.35em] text-amber-200/80">
                        Invalid portal
                    </p>
                    <h1 className="mt-3 text-3xl font-semibold">Role not supported here</h1>
                </div>
            </div>
        );
    }

    if (!canViewRoles) {
        return (
            <Layout
                role={resolvedRole}
                title="Role management"
                subtitle="Review access structures only where your assigned permissions allow it."
            >
                <div className="rounded-[26px] border border-amber-200 bg-amber-50 px-6 py-8 text-center">
                    <p className="text-xs uppercase tracking-[0.3em] text-amber-700">
                        Access restricted
                    </p>
                    <h2 className="mt-3 text-2xl font-semibold text-slate-900">
                        This account cannot open role management
                    </h2>
                    <p className="mt-3 text-sm leading-7 text-slate-600">
                        The current role does not include the <code>role.view</code> permission.
                    </p>
                </div>
            </Layout>
        );
    }

    return (
        <Layout
            role={resolvedRole}
            title="Role management"
            subtitle="Design reusable access bundles and connect permissions to each role."
        >
            <div className="grid gap-6 xl:grid-cols-[1.15fr_0.85fr]">
                <section className="space-y-5">
                    <div className="rounded-[26px] border border-slate-200/80 bg-white/92 p-5">
                        <div className="flex flex-col gap-4 lg:flex-row lg:items-center lg:justify-between">
                            <div>
                                <p className="text-xs uppercase tracking-[0.28em] text-slate-500">
                                    Directory
                                </p>
                                <h2 className="mt-2 text-2xl font-semibold text-slate-950">
                                    Role list
                                </h2>
                            </div>

                            <form onSubmit={handleSearchSubmit} className="flex w-full max-w-xl gap-3">
                                <input
                                    type="text"
                                    value={search}
                                    onChange={(event) => setSearch(event.target.value)}
                                    placeholder="Search by role name"
                                    className="w-full rounded-2xl border border-slate-200 bg-white px-4 py-3 text-sm text-slate-900 outline-none transition focus:border-amber-400 focus:ring-4 focus:ring-amber-100"
                                />
                                <button
                                    type="submit"
                                    className="rounded-2xl bg-slate-950 px-5 py-3 text-sm font-semibold text-white"
                                >
                                    Search
                                </button>
                            </form>
                        </div>

                        {loading ? (
                            <div className="mt-5 rounded-2xl bg-slate-100 px-4 py-10 text-center text-sm text-slate-500">
                                Loading roles and permission metadata...
                            </div>
                        ) : (
                            <div className="mt-5 overflow-hidden rounded-[22px] border border-slate-200">
                                <div className="overflow-x-auto">
                                    <table className="min-w-full divide-y divide-slate-200 text-sm">
                                        <thead className="bg-slate-50 text-left text-slate-500">
                                            <tr>
                                                <th className="px-4 py-3 font-medium">Role</th>
                                                <th className="px-4 py-3 font-medium">Users</th>
                                                <th className="px-4 py-3 font-medium">Permissions</th>
                                                <th className="px-4 py-3 font-medium">Action</th>
                                            </tr>
                                        </thead>
                                        <tbody className="divide-y divide-slate-100 bg-white">
                                            {roleItems.length ? (
                                                roleItems.map((roleItem) => (
                                                    <tr key={roleItem.id} className="align-top">
                                                        <td className="px-4 py-4">
                                                            <p className="font-medium text-slate-900">
                                                                {roleItem.name}
                                                            </p>
                                                            <p className="mt-1 text-xs text-slate-500">
                                                                Guard: {roleItem.guard_name}
                                                            </p>
                                                        </td>
                                                        <td className="px-4 py-4 text-slate-600">
                                                            {roleItem.user_count}
                                                        </td>
                                                        <td className="px-4 py-4">
                                                            <div className="flex flex-wrap gap-2">
                                                                {(roleItem.permissions || []).map((permissionName) => (
                                                                    <span
                                                                        key={permissionName}
                                                                        className="rounded-full bg-slate-100 px-3 py-1 text-xs text-slate-700"
                                                                    >
                                                                        {permissionName}
                                                                    </span>
                                                                ))}
                                                            </div>
                                                        </td>
                                                        <td className="px-4 py-4">
                                                            <button
                                                                type="button"
                                                                disabled={!canEditRoles}
                                                                onClick={() => resetForm(roleItem)}
                                                                className="rounded-2xl border border-slate-300 px-4 py-2 text-xs font-semibold text-slate-700 transition hover:border-slate-950 hover:text-slate-950 disabled:cursor-not-allowed disabled:opacity-50"
                                                            >
                                                                Edit
                                                            </button>
                                                        </td>
                                                    </tr>
                                                ))
                                            ) : (
                                                <tr>
                                                    <td colSpan="4" className="px-4 py-10 text-center text-slate-500">
                                                        No roles matched this search.
                                                    </td>
                                                </tr>
                                            )}
                                        </tbody>
                                    </table>
                                </div>
                            </div>
                        )}
                    </div>
                </section>

                <section className="space-y-5">
                    <div className="rounded-[26px] bg-[linear-gradient(150deg,_#111827,_#1f2937)] p-6 text-white">
                        <p className="text-xs uppercase tracking-[0.28em] text-amber-200/80">
                            Role editor
                        </p>
                        <h2 className="mt-3 text-2xl font-semibold">
                            {selectedRoleId ? "Edit existing role" : "Create new role"}
                        </h2>
                        <p className="mt-3 text-sm leading-7 text-slate-300">
                            Keep roles reusable by grouping stable permission sets instead of relying on user-by-user overrides.
                        </p>
                    </div>

                    <form onSubmit={handleSubmit} className="rounded-[26px] border border-slate-200/80 bg-white/92 p-5">
                        <div className="flex items-center justify-between gap-3">
                            <p className="text-xs uppercase tracking-[0.28em] text-slate-500">
                                {selectedRoleId ? `Editing #${selectedRoleId}` : "New record"}
                            </p>
                            <button
                                type="button"
                                onClick={() => {
                                    setSuccess("");
                                    setError("");
                                    resetForm();
                                }}
                                className="text-sm font-medium text-slate-600 transition hover:text-slate-950"
                            >
                                Reset form
                            </button>
                        </div>

                        <div className="mt-5">
                            <label className="mb-2 block text-sm font-medium text-slate-700">
                                Role name
                            </label>
                            <input
                                type="text"
                                value={form.name}
                                onChange={(event) =>
                                    setForm((current) => ({
                                        ...current,
                                        name: event.target.value,
                                    }))
                                }
                                placeholder="Example: supervisor"
                                className="w-full rounded-2xl border border-slate-200 bg-white px-4 py-3 text-slate-900 outline-none transition focus:border-amber-400 focus:ring-4 focus:ring-amber-100"
                            />
                        </div>

                        <div className="mt-6">
                            <p className="text-sm font-medium text-slate-700">Permissions</p>
                            <div className="mt-3 grid gap-3 sm:grid-cols-2">
                                {meta.permissions.map((permissionItem) => {
                                    const checked = form.permissions.includes(permissionItem.name);

                                    return (
                                        <label
                                            key={permissionItem.name}
                                            className={`flex cursor-pointer items-start gap-3 rounded-2xl border px-4 py-3 transition ${
                                                checked
                                                    ? "border-emerald-300 bg-emerald-50"
                                                    : "border-slate-200 bg-white"
                                            }`}
                                        >
                                            <input
                                                type="checkbox"
                                                checked={checked}
                                                onChange={() => togglePermission(permissionItem.name)}
                                                className="mt-1 h-4 w-4 rounded border-slate-300 text-emerald-600 focus:ring-emerald-500"
                                            />
                                            <div>
                                                <p className="font-medium text-slate-900">
                                                    {permissionItem.name}
                                                </p>
                                            </div>
                                        </label>
                                    );
                                })}
                            </div>
                        </div>

                        {error ? (
                            <div className="mt-5 rounded-2xl border border-red-200 bg-red-50 px-4 py-3 text-sm text-red-700">
                                {error}
                            </div>
                        ) : null}

                        {success ? (
                            <div className="mt-5 rounded-2xl border border-emerald-200 bg-emerald-50 px-4 py-3 text-sm text-emerald-700">
                                {success}
                            </div>
                        ) : null}

                        <button
                            type="submit"
                            disabled={
                                saving ||
                                (!selectedRoleId && !canCreateRoles) ||
                                (selectedRoleId && !canEditRoles)
                            }
                            className="mt-6 w-full rounded-2xl bg-[linear-gradient(135deg,#111827,#374151)] px-4 py-3 text-sm font-semibold text-white shadow-lg shadow-slate-900/20 transition hover:-translate-y-0.5 disabled:cursor-not-allowed disabled:opacity-60"
                        >
                            {saving
                                ? "Saving role..."
                                : selectedRoleId
                                  ? "Update role"
                                  : "Create role"}
                        </button>
                    </form>
                </section>
            </div>
        </Layout>
    );
}
