"use client";

import { Card, PageIntro } from "./shared";

export default function SettingsPage() {
    return (
        <div>
            <PageIntro title="Settings" subtitle="Manage your account preferences." />
            <Card className="max-w-xl">
                <p className="mb-3 text-[10.5px] font-black uppercase tracking-[0.14em] text-gray-400">Notifications</p>
                {["Daily practice reminder", "New test available", "Exam countdown alerts"].map((item, index) => (
                    <div key={item} className="flex items-center justify-between border-b border-black/10 py-3 last:border-b-0">
                        <div><h3 className="text-[13px] font-bold text-gray-950">{item}</h3><p className="text-[11.5px] text-gray-400">{index === 0 ? "Reminded at 8:00 PM every day" : "Keep me updated"}</p></div>
                        <span className={`relative h-[22px] w-10 rounded-full ${index < 2 ? "bg-red-600" : "bg-gray-200"}`}><span className={`absolute top-[3px] h-4 w-4 rounded-full bg-white transition ${index < 2 ? "left-[21px]" : "left-[3px]"}`} /></span>
                    </div>
                ))}
            </Card>
        </div>
    );
}
