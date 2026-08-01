export default function GroupTitle({ title, className = "" }) {
    if (!title?.trim()) return null;

    return (
        <h3
            className={`text-lg font-semibold text-slate-900 dark:text-white ${className}`}
        >
            {title}
        </h3>
    );
}