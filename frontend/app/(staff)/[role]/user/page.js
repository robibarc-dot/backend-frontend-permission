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
    email: "",
    password: "",
    roles: [],
    permissions: [],
};

function hasPermission(permissionList, permissionName) {
    return Array.isArray(permissionList) && permissionList.includes(permissionName);
}

export default function UserManagementPage({ params }) {
    const router = useRouter();
    const { user, roles, permissions } = useSelector((state) => state.auth);
    const resolvedRole = params?.role?.toLowerCase();
    const primaryRole = getPrimaryRole(user, roles);
    const [users, setUsers] = useState([]);
    const [meta, setMeta] = useState({ roles: [], permissions: [] });
    const [form, setForm] = useState(initialForm);
    const [selectedUserId, setSelectedUserId] = useState(null);
    const [search, setSearch] = useState("");
    const [loading, setLoading] = useState(true);
    const [saving, setSaving] = useState(false);
    const [error, setError] = useState("");
    const [success, setSuccess] = useState("");

    const canViewUsers = hasPermission(permissions, "user.view");
    const canCreateUsers = hasPermission(permissions, "user.create");
    const canEditUsers = hasPermission(permissions, "user.edit");

    useEffect(() => {
        if (primaryRole && isStaffRole(primaryRole) && primaryRole !== resolvedRole) {
            router.replace(getRoleHomePath(primaryRole));
        }
    }, [primaryRole, resolvedRole, router]);

    useEffect(() => {
        if (!isStaffRole(resolvedRole) || !canViewUsers) {
            setLoading(false);
            return;
        }

        fetchMetaAndUsers();
    }, [resolvedRole, canViewUsers]);

    async function fetchMetaAndUsers(searchTerm = "") {
        setLoading(true);
        setError("");

        try {
            const [metaResponse, usersResponse] = await Promise.all([
                api.get("/backend/users/meta"),
                api.get("/backend/users", {
                    params: searchTerm ? { search: searchTerm } : {},
                }),
            ]);

            setMeta(metaResponse.data);
            setUsers(usersResponse.data?.users || []);
        } catch (requestError) {
            setError(
                requestError?.response?.data?.message ||
                    "Unable to load user management data."
            );
        } finally {
            setLoading(false);
        }
    }

    function resetForm(nextUser = null) {
        if (!nextUser) {
            setSelectedUserId(null);
            setForm(initialForm);
            return;
        }

        setSelectedUserId(nextUser.id);
        setForm({
            name: nextUser.name || "",
            email: nextUser.email || "",
            password: "",
            roles: Array.isArray(nextUser.roles) ? nextUser.roles : [],
            permissions: Array.isArray(nextUser.permissions)
                ? nextUser.permissions
                : [],
        });
    }

    async function handleSearchSubmit(event) {
        event.preventDefault();
        await fetchMetaAndUsers(search.trim());
    }

    function toggleSelection(field, value) {
        const selectedValues = Array.isArray(form[field]) ? form[field] : [];
        const nextValues = selectedValues.includes(value)
            ? selectedValues.filter((item) => item !== value)
            : [...selectedValues, value];

        setForm((current) => ({
            ...current,
            [field]: nextValues,
        }));
    }

    async function handleSubmit(event) {
        event.preventDefault();

        if (selectedUserId && !canEditUsers) {
            setError("You do not have permission to edit users.");
            return;
        }

        if (!selectedUserId && !canCreateUsers) {
            setError("You do not have permission to create users.");
            return;
        }

        setSaving(true);
        setError("");
        setSuccess("");

        try {
            const payload = {
                name: form.name,
                email: form.email,
                password: form.password,
                roles: form.roles,
                permissions: form.permissions,
            };

            const response = selectedUserId
                ? await api.put(`/backend/users/${selectedUserId}`, payload)
                : await api.post("/backend/users", payload);

            setSuccess(
                response.data?.message ||
                    (selectedUserId
                        ? "User updated successfully."
                        : "User created successfully.")
            );

            resetForm();
            await fetchMetaAndUsers(search.trim());
        } catch (requestError) {
            const validationErrors = requestError?.response?.data?.errors;

            if (validationErrors) {
                const combinedMessages = Object.values(validationErrors)
                    .flat()
                    .join(" ");
                setError(combinedMessages);
            } else {
                setError(
                    requestError?.response?.data?.message ||
                        "Unable to save the user right now."
                );
            }
        } finally {
            setSaving(false);
        }
    }

    const inheritedPermissions = meta.roles
        .filter((roleItem) => form.roles.includes(roleItem.name))
        .flatMap((roleItem) => roleItem.permissions || []);

    const uniqueInheritedPermissions = [...new Set(inheritedPermissions)].sort();

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

    if (!canViewUsers) {
        return (
            <Layout
                role={resolvedRole}
                title="User management"
                subtitle="Review access only where your assigned permissions allow it."
            >
                <div className="rounded-[26px] border border-amber-200 bg-amber-50 px-6 py-8 text-center">
                    <p className="text-xs uppercase tracking-[0.3em] text-amber-700">
                        Access restricted
                    </p>
                    <h2 className="mt-3 text-2xl font-semibold text-slate-900">
                        This account cannot open user management
                    </h2>
                    <p className="mt-3 text-sm leading-7 text-slate-600">
                        The current role does not include the <code>user.view</code> permission.
                    </p>
                </div>
            </Layout>
        );
    }

    return (
        <Layout
            role={resolvedRole}
            title="User management"
            subtitle="Create staff and student accounts, assign roles, and fine-tune direct permissions."
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
                                    User list
                                </h2>
                            </div>

                            <form
                                onSubmit={handleSearchSubmit}
                                className="flex w-full max-w-xl gap-3"
                            >
                                <input
                                    type="text"
                                    value={search}
                                    onChange={(event) => setSearch(event.target.value)}
                                    placeholder="Search by name or email"
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
                                Loading users and access metadata...
                            </div>
                        ) : (
                            <div className="mt-5 overflow-hidden rounded-[22px] border border-slate-200">
                                <div className="overflow-x-auto">
                                    <table className="min-w-full divide-y divide-slate-200 text-sm">
                                        <thead className="bg-slate-50 text-left text-slate-500">
                                            <tr>
                                                <th className="px-4 py-3 font-medium">Name</th>
                                                <th className="px-4 py-3 font-medium">Email</th>
                                                <th className="px-4 py-3 font-medium">Roles</th>
                                                <th className="px-4 py-3 font-medium">
                                                    Effective permissions
                                                </th>
                                                <th className="px-4 py-3 font-medium">Action</th>
                                            </tr>
                                        </thead>
                                        <tbody className="divide-y divide-slate-100 bg-white">
                                            {users.length ? (
                                                users.map((managedUser) => (
                                                    <tr key={managedUser.id} className="align-top">
                                                        <td className="px-4 py-4">
                                                            <p className="font-medium text-slate-900">
                                                                {managedUser.name}
                                                            </p>
                                                        </td>
                                                        <td className="px-4 py-4 text-slate-600">
                                                            {managedUser.email}
                                                        </td>
                                                        <td className="px-4 py-4">
                                                            <div className="flex flex-wrap gap-2">
                                                                {(managedUser.roles || []).map((roleName) => (
                                                                    <span
                                                                        key={roleName}
                                                                        className="rounded-full bg-amber-100 px-3 py-1 text-xs font-medium text-amber-900"
                                                                    >
                                                                        {roleName}
                                                                    </span>
                                                                ))}
                                                            </div>
                                                        </td>
                                                        <td className="px-4 py-4">
                                                            <div className="flex flex-wrap gap-2">
                                                                {(managedUser.all_permissions || []).map(
                                                                    (permissionName) => (
                                                                        <span
                                                                            key={permissionName}
                                                                            className="rounded-full bg-slate-100 px-3 py-1 text-xs text-slate-700"
                                                                        >
                                                                            {permissionName}
                                                                        </span>
                                                                    )
                                                                )}
                                                            </div>
                                                        </td>
                                                        <td className="px-4 py-4">
                                                            <button
                                                                type="button"
                                                                disabled={!canEditUsers}
                                                                onClick={() => resetForm(managedUser)}
                                                                className="rounded-2xl border border-slate-300 px-4 py-2 text-xs font-semibold text-slate-700 transition hover:border-slate-950 hover:text-slate-950 disabled:cursor-not-allowed disabled:opacity-50"
                                                            >
                                                                Edit
                                                            </button>
                                                        </td>
                                                    </tr>
                                                ))
                                            ) : (
                                                <tr>
                                                    <td
                                                        colSpan="5"
                                                        className="px-4 py-10 text-center text-slate-500"
                                                    >
                                                        No users matched this search.
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
                            Access editor
                        </p>
                        <h2 className="mt-3 text-2xl font-semibold">
                            {selectedUserId ? "Edit existing user" : "Create new user"}
                        </h2>
                        <p className="mt-3 text-sm leading-7 text-slate-300">
                            Assign at least one role, then add any direct permissions needed beyond the role defaults.
                        </p>
                    </div>

                    <form
                        onSubmit={handleSubmit}
                        className="rounded-[26px] border border-slate-200/80 bg-white/92 p-5"
                    >
                        <div className="flex items-center justify-between gap-3">
                            <p className="text-xs uppercase tracking-[0.28em] text-slate-500">
                                {selectedUserId ? `Editing #${selectedUserId}` : "New record"}
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

                        <div className="mt-5 space-y-4">
                            <div>
                                <label className="mb-2 block text-sm font-medium text-slate-700">
                                    Name
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
                                    className="w-full rounded-2xl border border-slate-200 bg-white px-4 py-3 text-slate-900 outline-none transition focus:border-amber-400 focus:ring-4 focus:ring-amber-100"
                                />
                            </div>

                            <div>
                                <label className="mb-2 block text-sm font-medium text-slate-700">
                                    Email
                                </label>
                                <input
                                    type="email"
                                    value={form.email}
                                    onChange={(event) =>
                                        setForm((current) => ({
                                            ...current,
                                            email: event.target.value,
                                        }))
                                    }
                                    className="w-full rounded-2xl border border-slate-200 bg-white px-4 py-3 text-slate-900 outline-none transition focus:border-amber-400 focus:ring-4 focus:ring-amber-100"
                                />
                            </div>

                            <div>
                                <label className="mb-2 block text-sm font-medium text-slate-700">
                                    Password {selectedUserId ? "(leave blank to keep current)" : ""}
                                </label>
                                <input
                                    type="password"
                                    value={form.password}
                                    onChange={(event) =>
                                        setForm((current) => ({
                                            ...current,
                                            password: event.target.value,
                                        }))
                                    }
                                    className="w-full rounded-2xl border border-slate-200 bg-white px-4 py-3 text-slate-900 outline-none transition focus:border-amber-400 focus:ring-4 focus:ring-amber-100"
                                />
                            </div>
                        </div>

                        <div className="mt-6">
                            <p className="text-sm font-medium text-slate-700">Roles</p>
                            <div className="mt-3 grid gap-3">
                                {meta.roles.map((roleItem) => {
                                    const checked = form.roles.includes(roleItem.name);

                                    return (
                                        <label
                                            key={roleItem.name}
                                            className={`flex cursor-pointer items-start gap-3 rounded-2xl border px-4 py-3 transition ${
                                                checked
                                                    ? "border-amber-300 bg-amber-50"
                                                    : "border-slate-200 bg-white"
                                            }`}
                                        >
                                            <input
                                                type="checkbox"
                                                checked={checked}
                                                onChange={() => toggleSelection("roles", roleItem.name)}
                                                className="mt-1 h-4 w-4 rounded border-slate-300 text-amber-600 focus:ring-amber-500"
                                            />
                                            <div>
                                                <p className="font-medium text-slate-900">
                                                    {roleItem.name}
                                                </p>
                                                <p className="mt-1 text-sm text-slate-600">
                                                    Grants {roleItem.permissions.length} inherited permission
                                                    {roleItem.permissions.length === 1 ? "" : "s"}.
                                                </p>
                                            </div>
                                        </label>
                                    );
                                })}
                            </div>
                        </div>

                        <div className="mt-6 rounded-[22px] bg-slate-50 p-4">
                            <p className="text-sm font-medium text-slate-800">
                                Inherited from selected roles
                            </p>
                            <div className="mt-3 flex flex-wrap gap-2">
                                {uniqueInheritedPermissions.length ? (
                                    uniqueInheritedPermissions.map((permissionName) => (
                                        <span
                                            key={permissionName}
                                            className="rounded-full bg-slate-900 px-3 py-1 text-xs font-medium text-white"
                                        >
                                            {permissionName}
                                        </span>
                                    ))
                                ) : (
                                    <span className="text-sm text-slate-500">
                                        No inherited permissions yet.
                                    </span>
                                )}
                            </div>
                        </div>

                        <div className="mt-6">
                            <p className="text-sm font-medium text-slate-700">
                                Direct permissions
                            </p>
                            <div className="mt-3 grid gap-3 sm:grid-cols-2">
                                {meta.permissions.map((permissionItem) => {
                                    const checked = form.permissions.includes(permissionItem.name);
                                    const inherited = uniqueInheritedPermissions.includes(
                                        permissionItem.name
                                    );

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
                                                onChange={() =>
                                                    toggleSelection(
                                                        "permissions",
                                                        permissionItem.name
                                                    )
                                                }
                                                className="mt-1 h-4 w-4 rounded border-slate-300 text-emerald-600 focus:ring-emerald-500"
                                            />
                                            <div>
                                                <p className="font-medium text-slate-900">
                                                    {permissionItem.name}
                                                </p>
                                                <p className="mt-1 text-xs text-slate-500">
                                                    {inherited
                                                        ? "Already included through a selected role."
                                                        : "Assigned directly to this user."}
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
                                (!selectedUserId && !canCreateUsers) ||
                                (selectedUserId && !canEditUsers)
                            }
                            className="mt-6 w-full rounded-2xl bg-[linear-gradient(135deg,#111827,#374151)] px-4 py-3 text-sm font-semibold text-white shadow-lg shadow-slate-900/20 transition hover:-translate-y-0.5 disabled:cursor-not-allowed disabled:opacity-60"
                        >
                            {saving
                                ? "Saving user..."
                                : selectedUserId
                                  ? "Update user"
                                  : "Create user"}
                        </button>
                    </form>
                </section>
            </div>
        </Layout>
    );
}
