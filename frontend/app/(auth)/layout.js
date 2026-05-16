export default function AuthLayout({ children }) {
    return (
        <div className="min-h-screen bg-[radial-gradient(circle_at_top,_rgba(180,140,90,0.18),_transparent_28%),linear-gradient(135deg,_#f8f4ec_0%,_#efe3d0_45%,_#ddd0c5_100%)]">
            {children}
        </div>
    );
}
