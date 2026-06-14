export const metadata = {
    title: 'Practice Test - Start',
};

export default function StartTestLayout({ children }) {
    return (
        <div className="fixed inset-0 z-[9999] overflow-y-auto bg-white dark:bg-slate-950">
            {children}
        </div>
    );
}