'use client';

import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';

export default function SurahClient({ surah }) {
  const router = useRouter();
  const [search, setSearch] = useState('');
  const [fontSize, setFontSize] = useState(22);
  const [theme, setTheme] = useState('light'); // 'light' | 'gray'

  useEffect(() => {
    const savedSize = localStorage.getItem('fontSize');
    if (savedSize) setFontSize(Number(savedSize));
    const savedTheme = localStorage.getItem('theme');
    if (savedTheme) setTheme(savedTheme);
  }, []);

  useEffect(() => {
    localStorage.setItem('fontSize', fontSize);
  }, [fontSize]);

  useEffect(() => {
    localStorage.setItem('theme', theme);
  }, [theme]);

  if (!surah || !surah.ayahs) {
    return (
      <div className="text-center py-20 text-red-500">
        Failed to load surah. Please refresh.
      </div>
    );
  }

  const filtered = surah.ayahs.filter((a) =>
    a.text.toLowerCase().includes(search.toLowerCase())
  );

  const bg =
    theme === 'gray' ? 'bg-gray-200 text-gray-900' : 'bg-white text-gray-900';
  const cardBg =
    theme === 'gray'
      ? 'bg-gray-300 border-gray-400'
      : 'bg-gray-50 border-gray-200';
  const inputBg =
    theme === 'gray'
      ? 'bg-gray-100 border-gray-400'
      : 'bg-white border-gray-300';

  return (
    <div className={`min-h-screen ${bg} transition-colors duration-300`}>
      {/* Top Bar */}
      <div className="flex items-center justify-between mb-6 flex-wrap gap-3">
        {/* Back Button */}
        <button
          onClick={() => router.back()}
          className="flex items-center gap-2 bg-emerald-600 hover:bg-emerald-700 text-white px-4 py-2 rounded-lg text-sm font-medium transition"
        >
          ← Back
        </button>

        {/* Surah Title */}
        <div className="text-center flex-1">
          <h1 className="text-2xl font-bold text-emerald-700">
            {surah.englishName}
          </h1>
          <p className="text-sm text-gray-500">
            {surah.englishNameTranslation} · {surah.numberOfAyahs} Ayahs ·{' '}
            {surah.revelationType}
          </p>
          <p className="arabic-text text-3xl mt-1 text-emerald-800">
            {surah.name}
          </p>
        </div>

        {/* Settings */}
        <div className="flex flex-col items-end gap-2">
          {/* Theme Toggle */}
          <div className="flex gap-2">
            <button
              onClick={() => setTheme('light')}
              className={`px-3 py-1 rounded-lg text-xs font-medium border transition ${
                theme === 'light'
                  ? 'bg-emerald-600 text-white border-emerald-600'
                  : 'bg-white text-gray-600 border-gray-300 hover:border-emerald-400'
              }`}
            >
              ☀️ Light
            </button>
            <button
              onClick={() => setTheme('gray')}
              className={`px-3 py-1 rounded-lg text-xs font-medium border transition ${
                theme === 'gray'
                  ? 'bg-gray-500 text-white border-gray-500'
                  : 'bg-white text-gray-600 border-gray-300 hover:border-gray-400'
              }`}
            >
              🌫️ Gray
            </button>
          </div>

          {/* Font Size */}
          <div className="flex items-center gap-2 text-xs text-gray-500">
            <span>A</span>
            <input
              type="range"
              min={16}
              max={40}
              value={fontSize}
              onChange={(e) => setFontSize(Number(e.target.value))}
              className="w-24 accent-emerald-600"
            />
            <span className="text-base font-bold">A</span>
            <span className="font-mono text-emerald-600">{fontSize}px</span>
          </div>
        </div>
      </div>

      {/* Bismillah */}
      {surah.number !== 1 && surah.number !== 9 && (
        <p className="arabic-text text-center text-2xl text-emerald-700 mb-6">
          بِسْمِ اللَّهِ الرَّحْمَٰنِ الرَّحِيمِ
        </p>
      )}

      {/* Search */}
      <input
        type="text"
        placeholder="Search in translation..."
        value={search}
        onChange={(e) => setSearch(e.target.value)}
        className={`w-full border rounded-lg px-4 py-2 mb-6 focus:outline-none focus:ring-2 focus:ring-emerald-400 ${inputBg}`}
      />

      {/* Ayahs */}
      {filtered.length === 0 ? (
        <p className="text-center text-gray-400 py-10">
          No ayahs match your search.
        </p>
      ) : (
        filtered.map((ayah) => (
          <div
            key={ayah.number}
            className={`mb-4 p-5 rounded-xl border shadow-sm ${cardBg}`}
          >
            {/* Ayah Number Badge */}
            <div className="flex justify-between items-center mb-3">
              <span className="bg-emerald-100 text-emerald-700 rounded-full w-8 h-8 flex items-center justify-center text-xs font-bold">
                {ayah.numberInSurah}
              </span>
            </div>

            {/* Arabic Text */}
            <p
              className="arabic-text text-right leading-loose mb-3 text-gray-900"
              style={{ fontSize: `${fontSize}px` }}
            >
              {ayah.text}
            </p>

            {/* Translation */}
            {ayah.translation && (
              <p className="text-sm text-gray-600 border-t pt-2 mt-2 leading-relaxed">
                {ayah.translation}
              </p>
            )}
          </div>
        ))
      )}
    </div>
  );
}
