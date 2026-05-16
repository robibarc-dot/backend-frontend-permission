"use client";

import { useState, useEffect } from "react";
import { useRouter, useParams } from "next/navigation";
import Link from "next/link";
import { UserCog, ChevronLeft, Save, Loader2, ShieldCheck } from "lucide-react";

import { 
    useGetUserQuery,
    useUpdateUserMutation, 
    useGetUsersMetaQuery 
} from "@/redux/features/auth/user/userApis";

export default function EditUserPage() {
    const router = useRouter();
    const { role, id } = useParams();
    const resolvedRole = role?.toLowerCase();

    const { data: userData, isLoading: fetching } = useGetUserQuery(id);
    const { data: meta, isLoading: metaLoading } = useGetUsersMetaQuery();
    const [updateUser, { isLoading: saving }] = useUpdateUserMutation();

    const [form, setForm] = useState({ name: "", email: "", password: "", roles: [], permissions: [] });
    const [error, setError] = useState("");
    const [success, setSuccess] = useState("");

    useEffect(() => {
        if (userData?.user) {
            const u = userData.user;
            setForm({
                name: u.name || "",
                email: u.email || "",
                password: "",
                roles: Array.isArray(u.roles) ? u.roles : [],
                permissions: Array.isArray(u.permissions) ? u.permissions : [],
            });
        }
    }, [userData]);

    function toggleSelection(field, value) {
        setForm((current) => {
            const currentValues = Array.isArray(current[field]) ? current[field] : [];
            return {
                ...current,
                [field]: currentValues.includes(value)
                    ? currentValues.filter((item) => item !== value)
                    : [...currentValues, value],
            };
        });
    }

    async function handleSubmit(event) {
        event.preventDefault();
        setError("");
        setSuccess("");

        try {
            await updateUser({ id, body: form }).unwrap();
            setSuccess("User updated successfully.");
            setTimeout(() => router.push(`/${resolvedRole}/user`), 1500);
        } catch (requestError) {
            const validationErrors = requestError?.data?.errors;
            if (validationErrors) {
                setError(Object.values(validationErrors).flat().join(" "));
            } else {
                setError(requestError?.data?.message || "Unable to update user.");
            }
        }
    }

    const inheritedPermissions = (meta?.roles || [])
        .filter((r) => form.roles.includes(r.name))
        .flatMap((r) => r.permissions || []);

    const uniqueInheritedPermissions = [...new Set(inheritedPermissions)].sort();

    if (fetching) {
        return (
            <div className="flex h-[400px] flex-col items-center justify-center gap-4 text-slate-500">
                <Loader2 className="animate-spin text-blue-600" size={32} />
                <p className="font-medium">Retrieving user profile...</p>
            </div>
        );
    }

    return (
        <div className="mx-auto space-y-6">
            <div className="flex items-center justify-between">
                <Link 
                    href={`/${resolvedRole}/user`}
                    className="flex items-center gap-2 text-slate-500 hover:text-slate-800 transition-colors font-medium text-sm"
                >
                    <ChevronLeft size={18} />
                    Back to Users
                </Link>
            </div>

            <form onSubmit={handleSubmit} className="space-y-6">
                <section className="rounded-[26px] bg-[linear-gradient(150deg,_#111827,_#1f2937)] p-8 text-white shadow-xl">
                    <div className="flex items-center gap-3 opacity-80">
                        <UserCog size={20} className="text-amber-400" />
                        <p className="text-xs uppercase tracking-[0.28em]">Profile Update ID: {id}</p>
                    </div>
                    <h2 className="mt-4 text-3xl font-bold">Edit User Access</h2>
                    <p className="mt-3 text-slate-400 max-w-2xl leading-relaxed">
                        Modify personal information and adjust the user's role assignments or direct permissions.
                    </p>
                </section>

                <div className="rounded-[26px] border border-slate-200 bg-white p-8 shadow-sm space-y-8">
                    <div className="grid gap-6 md:grid-cols-2">
                        <div>
                            <label className="mb-2 block text-sm font-semibold text-slate-700">Full Name</label>
                            <input
                                type="text"
                                required
                                value={form.name}
                                onChange={(e) => setForm({ ...form, name: e.target.value })}
                                className="w-full rounded-2xl border border-slate-200 bg-slate-50 px-4 py-3 text-slate-900 outline-none transition focus:border-blue-500 focus:ring-4 focus:ring-blue-100"
                            />
                        </div>
                        <div>
                            <label className="mb-2 block text-sm font-semibold text-slate-700">Email Address</label>
                            <input
                                type="email"
                                required
                                value={form.email}
                                onChange={(e) => setForm({ ...form, email: e.target.value })}
                                className="w-full rounded-2xl border border-slate-200 bg-slate-50 px-4 py-3 text-slate-900 outline-none transition focus:border-blue-500 focus:ring-4 focus:ring-blue-100"
                            />
                        </div>
                        <div className="md:col-span-2">
                            <label className="mb-2 block text-sm font-semibold text-slate-700">Password <span className="text-slate-400 font-normal">(leave blank to keep current)</span></label>
                            <input
                                type="password"
                                value={form.password}
                                onChange={(e) => setForm({ ...form, password: e.target.value })}
                                className="w-full rounded-2xl border border-slate-200 bg-slate-50 px-4 py-3 text-slate-900 outline-none transition focus:border-blue-500 focus:ring-4 focus:ring-blue-100"
                            />
                        </div>
                    </div>

                    <div>
                        <h3 className="text-sm font-semibold text-slate-700 mb-6">Assigned Roles</h3>
                        {metaLoading ? (
                             <div className="flex items-center gap-3 py-10 text-slate-400 justify-center"><Loader2 className="animate-spin" size={20} /></div>
                        ) : (
                            <div className="grid gap-3 sm:grid-cols-2 lg:grid-cols-3">
                                {meta?.roles?.map((roleItem) => {
                                    const isChecked = form.roles.includes(roleItem.name);
                                    return (
                                        <label key={roleItem.name} className={`flex cursor-pointer items-start gap-3 rounded-2xl border p-4 transition-all duration-200 ${isChecked ? "border-amber-200 bg-amber-50/50" : "border-slate-100 bg-white"}`}>
                                            <input type="checkbox" checked={isChecked} onChange={() => toggleSelection("roles", roleItem.name)} className="mt-1 h-4 w-4 rounded text-amber-600 focus:ring-amber-500" />
                                            <div>
                                                <p className="text-sm font-bold text-slate-700">{roleItem.name}</p>
                                                <p className="text-[11px] text-slate-500">{roleItem.permissions?.length || 0} permissions</p>
                                            </div>
                                        </label>
                                    );
                                })}
                            </div>
                        )}
                    </div>

                    <div className="rounded-2xl bg-slate-50 p-6 border border-slate-100">
                        <div className="flex items-center gap-2 mb-4"><ShieldCheck size={16} className="text-slate-400" /><h3 className="text-sm font-semibold text-slate-700">Inherited Permissions</h3></div>
                        <div className="flex flex-wrap gap-2">
                            {uniqueInheritedPermissions.length > 0 ? uniqueInheritedPermissions.map((perm) => (
                                <span key={perm} className="px-2.5 py-1 bg-white border border-slate-200 rounded-lg text-[11px] font-medium text-slate-600">{perm}</span>
                            )) : <p className="text-xs text-slate-400 italic">No permissions inherited from roles.</p>}
                        </div>
                    </div>

                    <div>
                        <h3 className="text-sm font-semibold text-slate-700 mb-6">Override Direct Permissions</h3>
                        {metaLoading ? (
                             <div className="flex items-center gap-3 py-10 text-slate-400 justify-center"><Loader2 className="animate-spin" size={20} /></div>
                        ) : (
                            <div className="grid gap-3 sm:grid-cols-2 lg:grid-cols-3">
                                {meta?.permissions?.map((perm) => {
                                    const isChecked = form.permissions.includes(perm.name);
                                    const isInherited = uniqueInheritedPermissions.includes(perm.name);
                                    return (
                                        <label key={perm.name} className={`flex cursor-pointer items-start gap-3 rounded-2xl border p-4 transition-all duration-200 ${isChecked ? "border-blue-200 bg-blue-50/50" : "border-slate-100 bg-white"}`}>
                                            <input type="checkbox" checked={isChecked} onChange={() => toggleSelection("permissions", perm.name)} className="mt-1 h-4 w-4 rounded text-blue-600 focus:ring-blue-500" />
                                            <div><p className="text-sm font-medium text-slate-700">{perm.name}</p>{isInherited && <span className="text-[10px] text-emerald-600 font-semibold uppercase">Already Inherited</span>}</div>
                                        </label>
                                    );
                                })}
                            </div>
                        )}
                    </div>

                    {(error || success) && (
                        <div className={`rounded-2xl border px-4 py-3 text-sm font-medium ${error ? "border-red-200 bg-red-50 text-red-700" : "border-emerald-200 bg-emerald-50 text-emerald-700"}`}>{error || success}</div>
                    )}
                    <button type="submit" disabled={saving} className="flex items-center gap-2 rounded-2xl bg-slate-950 px-8 py-3.5 text-sm font-bold text-white shadow-lg transition hover:-translate-y-0.5 disabled:opacity-60">{saving ? <Loader2 className="animate-spin" size={18} /> : <Save size={18} />}{saving ? "Updating..." : "Update User"}</button>
                </div>
            </form>
        </div>
    );
}