import Link from "next/link";

export default function Footer() {
    return (
    <footer className="w-full bg-[#0D1527] text-gray-400 font-sans">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-16">
        
        {/* Top Section: Brand & Grid Links */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-12 gap-10 lg:gap-8 pb-12">
          
          {/* Brand/Logo Column */}
          <div className="lg:col-span-5 flex flex-col gap-5 max-w-sm">
            <div className="flex items-center gap-3">
              <div className="w-12 h-12 bg-[#1E60FF] rounded-2xl flex items-center justify-center text-white font-bold text-xl tracking-tight shadow-sm">
                CD
              </div>
              <div className="flex flex-col">
                <span className="text-xl font-bold text-white tracking-tight leading-none mb-1">
                  CD IELTS
                </span>
                <span className="text-xs text-gray-500 font-medium tracking-wide">
                  Your Path to IELTS Success
                </span>
              </div>
            </div>
            <p className="text-[15px] leading-relaxed text-gray-400">
              The most comprehensive IELTS preparation platform trusted by 50,000+ students worldwide.
            </p>
          </div>

          {/* Links Columns Container */}
          <div className="lg:col-span-7 grid grid-cols-2 sm:grid-cols-3 gap-8">
            
            {/* Column 1: Product */}
            <div className="flex flex-col gap-4">
              <h3 className="text-white font-bold text-[15px] tracking-wide">Product</h3>
              <ul className="flex flex-col gap-3 text-[15px]">
                <li><a href="#" className="hover:text-white transition-colors">Mock Tests</a></li>
                <li><a href="#" className="hover:text-white transition-colors">Practice</a></li>
                <li><a href="#" className="hover:text-white transition-colors">Resources</a></li>
                <li><a href="#" className="hover:text-white transition-colors">Pricing</a></li>
              </ul>
            </div>

            {/* Column 2: Company */}
            <div className="flex flex-col gap-4">
              <h3 className="text-white font-bold text-[15px] tracking-wide">Company</h3>
              <ul className="flex flex-col gap-3 text-[15px]">
                <li><a href="#" className="hover:text-white transition-colors">About Us</a></li>
                <li><a href="#" className="hover:text-white transition-colors">Blog</a></li>
                <li><a href="#" className="hover:text-white transition-colors">Careers</a></li>
                <li><a href="#" className="hover:text-white transition-colors">Contact</a></li>
              </ul>
            </div>

            {/* Column 3: Legal */}
            <div className="flex flex-col gap-4 col-span-2 sm:col-span-1">
              <h3 className="text-white font-bold text-[15px] tracking-wide">Legal</h3>
              <ul className="flex flex-col gap-3 text-[15px]">
                <li><a href="#" className="hover:text-white transition-colors">Privacy Policy</a></li>
                <li><a href="#" className="hover:text-white transition-colors">Terms of Service</a></li>
                <li><a href="#" className="hover:text-white transition-colors">Cookie Policy</a></li>
              </ul>
            </div>

          </div>
        </div>

        {/* Divider */}
        <div className="border-t border-gray-800/60 w-full" />

        {/* Bottom Section: Copyright & Socials */}
        <div className="pt-8 flex flex-col sm:flex-row items-center justify-between gap-4 text-[14px]">
          <div className="text-gray-500 order-2 sm:order-1">
            &copy; 2026 CD IELTS. All rights reserved.
          </div>
          
          <div className="flex items-center gap-6 text-gray-400 order-1 sm:order-2 flex-wrap justify-center">
            <a href="#" className="hover:text-white transition-colors">Facebook</a>
            <a href="#" className="hover:text-white transition-colors">Twitter</a>
            <a href="#" className="hover:text-white transition-colors">Instagram</a>
            <a href="#" className="hover:text-white transition-colors">LinkedIn</a>
          </div>
        </div>

      </div>
    </footer>
    );
}
