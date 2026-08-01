import Header from "../components/frontend/partials/Header";
import Footer from "../components/frontend/partials/Footer";

export default function PublicLayout({ children }) {
    return (
        <div className="relative min-h-screen">
            <Header />
            {children}
            <Footer />
        </div>
    );
}
