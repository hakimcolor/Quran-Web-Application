'use client';

import { useState, useEffect } from 'react';
import Link from 'next/link';
import Sidebar from '@/components/Sidebar';

export default function SurahClient({ surah }) {
  const [search, setSearch] = useState('');
  const [fontSize, setFontSize] = useState(20);
  const [darkMode, setDarkMode] = useState(false);

  useEffect(() => {
    const saved = localStorage.getItem('fontSize');
    if (saved) setFontSize(Number(saved));
    const savedDark = localStorage.getItem('darkMode');
    if (savedDark) setDarkMode(savedDark === 'true');
  }, []);

  useEffect(() => {
    localStorage.setItem('fontSize', fontSize);
  }, [fontSize]);

  useEffect(() => {
    localStorage.setItem('darkMode', darkMode);
    document.documentElement.classList.toggle('dark', darkMode);
  }, [darkMode]);

  const filtered = surah.ayahs.filter((a) =>
    a.text.toLowerCase().includes(search.toLowerCase())
  );

  return (
    <div className={darkMode ? 'dark' : ''}>
      <div
        className={`min-h-screen ${darkMode ? 'bg-gray-900 text-gray-100' : 'bg-gray-50 text-gray-900'}`}
      >
        {/* Header */}
        <div className="flex items-center justify-between mb-6 flex-wrap gap-3">
          <Link href="/" className="text-emerald-600 hover:underline text-sm">
            ← Back to Surah List
          </Link>
          <div className="text-center">
            <h1 className="text-2xl font-bold text-emerald-700">
              {surah.englishName}
            </h1>
            <p className="text-sm text-gray-500">
              {surah.englishNameTranslation} · {surah.numberOfAyahs} Ayahs ·{' '}
              {surah.revelationType}
            </p>
            <p className="arabic-text text-3xl mt-1">{surah.name}</p>
          </div>
          <Sidebar
            fontSize={fontSize}
            setFontSize={setFontSize}
            darkMode={darkMode}
            setDarkMode={setDarkMode}
          />
        </div>

        {/* Search */}
        <input
          type="text"
          placeholder="Search in translation..."
          value={search}
          onChange={(e) => setSearch(e.target.value)}
          className={`w-full border rounded-lg px-4 py-2 mb-6 focus:outline-none focus:ring-2 focus:ring-emerald-400 ${
            darkMode
              ? 'bg-gray-800 border-gray-600 text-gray-100 placeholder-gray-400'
              : 'bg-white border-gray-300'
          }`}
        />

        {/* Ayahs */}
        {filtered.length === 0 ? (
          <p className="text-center text-gray-400">
            No ayahs match your search.
          </p>
        ) : (
          filtered.map((ayah) => (
            <div
              key={ayah.number}
              className={`mb-4 p-4 rounded-lg border ${
                darkMode
                  ? 'bg-gray-800 border-gray-700'
                  : 'bg-white border-gray-200 shadow-sm'
              }`}
            >
              <p
                className="arabic-text text-right leading-loose mb-2"
                style={{ fontSize: `${fontSize}px` }}
              >
                {ayah.text}
              </p>
              <p className="text-sm text-gray-500">
                <span className="inline-block bg-emerald-100 text-emerald-700 rounded-full px-2 py-0.5 text-xs font-mono mr-2">
                  {surah.number}:{ayah.numberInSurah}
                </span>
              </p>
            </div>
          ))
        )}
      </div>
    </div>
  );
}
