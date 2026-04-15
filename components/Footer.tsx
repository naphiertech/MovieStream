import Link from 'next/link';
import { Film } from 'lucide-react';

export function Footer() {
  return (
    <footer className="bg-black text-gray-400 py-12 mt-20 border-t border-gray-800">
      <div className="container mx-auto px-4">
        <div className="flex flex-col md:flex-row justify-between items-center gap-6">
          <div className="flex items-center gap-2 text-white font-bold text-xl">
            <Film size={24} className="text-red-600" />
            <span>Cineby Clone</span>
          </div>
          <div className="flex flex-wrap justify-center gap-6 text-sm">
            <Link href="#" className="hover:text-white transition-colors">Terms of Service</Link>
            <Link href="#" className="hover:text-white transition-colors">Privacy Policy</Link>
            <Link href="#" className="hover:text-white transition-colors">DMCA</Link>
            <Link href="#" className="hover:text-white transition-colors">Contact</Link>
          </div>
        </div>
        <div className="mt-8 text-center text-xs text-gray-600">
          <p>This is a clone built for educational purposes. We do not host any videos on this server.</p>
          <p className="mt-2">&copy; {new Date().getFullYear()} Cineby Clone. All rights reserved.</p>
        </div>
      </div>
    </footer>
  );
}
