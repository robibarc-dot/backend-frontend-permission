"use client";

import { useState } from "react";
import { useRouter, useParams } from "next/navigation";
import Link from "next/link";
import { ShieldPlus, ChevronLeft, Save, Loader2 } from "lucide-react";
import { 
    useCreateRoleMutation, 
    useGetRolesMetaQuery 
} from "@/redux/features/auth/role/roleApis";

const initialForm = {
    name: "",
    permissions: [],
};

export default function CreateRolePage() {
    const router = useRouter();
    const { role } = useParams();
    const resolvedRole = role?.toLowerCase();

    const { data: meta, isLoading: metaLoading } = useGetRolesMetaQuery();
    const [createRole, { isLoading: saving }] = useCreateRoleMutation();

    const [form, setForm] = useState(initialForm);
    const [error, setError] = useState("");
    const [success, setSuccess] = useState("");

    function togglePermission(permissionName) {
        setForm((current) => ({
            ...current,
            permissions: current.permissions.includes(permissionName)
                ? current.permissions.filter((p) => p !== permissionName)
                : [...current.permissions, permissionName],
        }));
    }

    async function handleSubmit(event) {
        event.preventDefault();
        setError("");
        setSuccess("");

        try {
            await createRole(form).unwrap();
            setSuccess("Role created successfully.");
            setTimeout(() => router.push(`/${resolvedRole}/role`), 1500);
        } catch (requestError) {
            const validationErrors = requestError?.data?.errors;
            setError(validationErrors 
                ? Object.values(validationErrors).flat().join(" ") 
                : (requestError?.data?.message || "Unable to create role.")
            );
        }
    }

    return (
        <div className="mx-auto space-y-6">
            <div className="flex items-center justify-between">
                <Link 
                    href={`/${resolvedRole}/role`}
                    className="flex items-center gap-2 text-slate-500 hover:text-slate-800 transition-colors font-medium text-sm"
                >
                    <ChevronLeft size={18} />
                    Back to Roles
                </Link>
            </div>

            <form onSubmit={handleSubmit} className="space-y-6">
                <section className="rounded-[26px] bg-[linear-gradient(150deg,_#111827,_#1f2937)] p-8 text-white shadow-xl shadow-slate-200">
                    <div className="flex items-center gap-3 opacity-80">
                        <ShieldPlus size={20} className="text-amber-400" />
                        <p className="text-xs uppercase tracking-[0.28em]">Security Configuration</p>
                    </div>
                    <h2 className="mt-4 text-3xl font-bold">Create New Role</h2>
                    <p className="mt-3 text-slate-400 max-w-2xl leading-relaxed">
                        Define a unique role name and assign a bundle of permissions. Roles allow you to manage access levels for multiple users efficiently.
                    </p>
                </section>

                <div className="rounded-[26px] border border-slate-200 bg-white p-8 shadow-sm space-y-8">
                    <div className="max-w-md">
                        <label className="mb-2 block text-sm font-semibold text-slate-700">
                            Role Display Name
                        </label>
                        <input
                            type="text"
                            required
                            value={form.name}
                            onChange={(e) => setForm({ ...form, name: e.target.value })}
                            placeholder="e.g. Department Manager"
                            className="w-full rounded-2xl border border-slate-200 bg-slate-50 px-4 py-3 text-slate-900 outline-none transition focus:border-blue-500 focus:ring-4 focus:ring-blue-100"
                        />
                    </div>

                    <div>
                        <div className="flex flex-col gap-1 mb-6">
                            <h3 className="text-sm font-semibold text-slate-700">Permission Mapping</h3>
                            <p className="text-xs text-slate-500">Select the specific capabilities this role should grant.</p>
                        </div>
                        
                        {metaLoading ? (
                            <div className="flex items-center gap-3 py-10 text-slate-400 justify-center">
                                <Loader2 className="animate-spin" size={20} />
                                <span className="text-sm font-medium">Loading permissions...</span>
                            </div>
                        ) : (
                            <div className="grid gap-3 sm:grid-cols-2 lg:grid-cols-3">
                                {meta?.permissions?.map((perm) => {
                                    const isChecked = form.permissions.includes(perm.name);
                                    return (
                                        <label
                                            key={perm.name}
                                            className={`flex cursor-pointer items-start gap-3 rounded-2xl border p-4 transition-all duration-200 ${
                                                isChecked 
                                                    ? "border-blue-200 bg-blue-50/50 ring-1 ring-blue-100" 
                                                    : "border-slate-100 bg-white hover:border-slate-200"
                                            }`}
                                        >
                                            <input
                                                type="checkbox"
                                                checked={isChecked}
                                                onChange={() => togglePermission(perm.name)}
                                                className="mt-1 h-4 w-4 rounded border-slate-300 text-blue-600 focus:ring-blue-500"
                                            />
                                            <span className={`text-sm font-medium ${isChecked ? 'text-blue-900' : 'text-slate-600'}`}>
                                                {perm.name}
                                            </span>
                                        </label>
                                    );
                                })}
                            </div>
                        )}
                    </div>

                    {(error || success) && (
                        <div className={`rounded-2xl border px-4 py-3 text-sm font-medium ${
                            error ? "border-red-200 bg-red-50 text-red-700" : "border-emerald-200 bg-emerald-50 text-emerald-700"
                        }`}>
                            {error || success}
                        </div>
                    )}

                    <div className="flex items-center gap-4 pt-4">
                        <button
                            type="submit"
                            disabled={saving}
                            className="flex items-center gap-2 rounded-2xl bg-blue-600 px-8 py-3.5 text-sm font-bold text-white shadow-lg shadow-blue-200 transition hover:bg-blue-700 active:scale-95 disabled:opacity-60"
                        >
                            {saving ? <Loader2 className="animate-spin" size={18} /> : <Save size={18} />}
                            {saving ? "Creating Role..." : "Save Role"}
                        </button>
                    </div>
                </div>
            </form>
        </div>
    );
}
