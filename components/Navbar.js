import Link from 'next/link';
import { FaQuran } from 'react-icons/fa';

export default function Navbar() {
  return (
    <nav className="bg-emerald-700 text-white px-6 py-4 shadow-md">
      <div className="max-w-4xl mx-auto flex items-center justify-between">
        <Link
          href="/"
          className="flex items-center gap-2 text-xl font-bold hover:opacity-90 transition"
        >
          <FaQuran size={20} />
          <span>Quran App</span>
        </Link>
        <span className="text-sm opacity-60">Read · Reflect · Remember</span>
      </div>
    </nav>
  );
}
