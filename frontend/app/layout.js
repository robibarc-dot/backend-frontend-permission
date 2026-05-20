import './globals.css';
import Providers from "./providers";
import Header from "./components/frontend/partials/Header";
import Footer from "./components/frontend/partials/Footer";

export default function RootLayout({ children }) {
    return (
        <html lang="en">
            <body className="min-h-screen bg-[linear-gradient(180deg,_#f7f2e8_0%,_#efe4d3_46%,_#f8f6f1_100%)] text-slate-900">
                <Providers>
                    <div className="relative min-h-screen">
                        <div className="absolute inset-x-0 top-0 -z-10 h-[32rem] bg-[radial-gradient(circle_at_top,_rgba(182,124,53,0.22),_transparent_42%)]" />
                        <Header />
                        {children}
                        <Footer />
                    </div>
                </Providers>
            </body>
        </html>
    );
}
