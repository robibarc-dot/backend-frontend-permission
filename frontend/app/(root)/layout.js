import Header from "../components/frontend/partials/Header";
import Footer from "../components/frontend/partials/Footer";

export default function PublicLayout({ children }) {
    return (
        <div className="relative min-h-screen">
            <div className="absolute inset-x-0 top-0 -z-10 h-[32rem] bg-white" />
            <Header />
            {children}
            <Footer />
        </div>
    );
}
