import './globals.css';
import Providers from "./providers";

export default function RootLayout({ children }) {
    return (
        <html lang="en">
            <body className="min-h-screen bg-[linear-gradient(180deg,_#f7f2e8_0%,_#efe4d3_46%,_#f8f6f1_100%)] text-slate-900">
                <Providers>
                    {children}
                </Providers>
            </body>
        </html>
    );
}
