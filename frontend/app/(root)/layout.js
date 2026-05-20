import Header from "../components/frontend/partials/Header";
import Footer from "../components/frontend/partials/Footer";

export default function PublicLayout({ children }) {
    return (
        <div className="relative min-h-screen">
            <div className="absolute inset-x-0 top-0 -z-10 h-[32rem] bg-[radial-gradient(circle_at_top,_rgba(182,124,53,0.22),_transparent_42%)]" />
            <Header />
            {children}
            <Footer />
        </div>
    );
}
