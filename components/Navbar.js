import Link from 'next/link';

export default function Navbar() {
  return (
    <nav className="bg-emerald-700 text-white px-6 py-4 shadow-md">
      <div className="max-w-4xl mx-auto flex items-center justify-between">
        <Link
          href="/"
          className="text-xl font-bold tracking-wide hover:opacity-90"
        >
          🕌 Quran App
        </Link>
        <span className="text-sm opacity-75">Read · Reflect · Remember</span>
      </div>
    </nav>
  );
}
