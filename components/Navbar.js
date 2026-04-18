import Link from 'next/link';
import { FaQuran } from 'react-icons/fa';

export default function Navbar() {
  return (
    <nav className="sticky top-0 z-50 bg-emerald-700 text-white shadow-md">
      <div className="max-w-4xl mx-auto flex items-center justify-between px-3 py-2 sm:px-6 sm:py-4">
        <Link
          href="/"
          className="flex items-center gap-2 font-bold hover:opacity-90 transition"
        >
          <FaQuran size={16} className="sm:w-5 sm:h-5" />
          <span className="text-sm sm:text-xl">Quran App</span>
        </Link>
        <span className="text-xs sm:text-sm opacity-60 hidden xs:block">
          Read · Reflect · Remember
        </span>
      </div>
    </nav>
  );
}
