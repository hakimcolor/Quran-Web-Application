'use client';

import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';

export default function SurahClient({ surah }) {
  const router = useRouter();
  const [search, setSearch] = useState('');
  const [fontSize, setFontSize] = useState(24);
  const [theme, setTheme] = useState('light');

  useEffect(() => {
    const s = localStorage.getItem('fontSize');
    if (s) setFontSize(Number(s));
    const t = localStorage.getItem('theme');
    if (t) setTheme(t);
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
        Failed to load. Please refresh.
      </div>
    );
  }

  // Strip Arabic diacritics for better matching
  const stripDiacritics = (str) =>
    str.replace(
      /[\u0610-\u061A\u064B-\u065F\u0670\u06D6-\u06DC\u06DF-\u06E4\u06E7\u06E8\u06EA-\u06ED]/g,
      ''
    );

  const filtered = surah.ayahs.filter((a) => {
    if (!search.trim()) return true;
    const q = search.trim().toLowerCase();
    const arabicMatch = stripDiacritics(a.text).includes(stripDiacritics(q));
    const englishMatch =
      a.translation && a.translation.toLowerCase().includes(q);
    return arabicMatch || englishMatch;
  });

  const themes = {
    light: {
      page: 'bg-linear-to-br from-emerald-50 via-white to-teal-50',
      card: 'bg-white border-gray-100',
      input: 'bg-white border-gray-200',
      text: 'text-gray-900',
    },
    gray: {
      page: 'bg-gray-100',
      card: 'bg-gray-200 border-gray-300',
      input: 'bg-gray-200 border-gray-300',
      text: 'text-gray-800',
    },
  };

  const t = themes[theme] || themes.light;

  return (
    <div className={`min-h-screen ${t.page} ${t.text}`}>
      {/* Fixed Top Bar */}
      <div className="sticky top-0 z-50 backdrop-blur-md bg-white/80 border-b border-gray-100 shadow-sm px-4 py-3">
        <div className="max-w-3xl mx-auto flex items-center gap-3 flex-wrap">
          {/* Back Icon Button */}
          <button
            onClick={() => router.back()}
            className="w-9 h-9 flex items-center justify-center rounded-full bg-emerald-600 hover:bg-emerald-700 text-white shadow transition shrink-0"
            aria-label="Go back"
          >
            <svg
              xmlns="http://www.w3.org/2000/svg"
              className="w-4 h-4"
              fill="none"
              viewBox="0 0 24 24"
              stroke="currentColor"
              strokeWidth={2.5}
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                d="M15 19l-7-7 7-7"
              />
            </svg>
          </button>

          {/* Surah Info */}
          <div className="flex-1 min-w-0">
            <div className="flex items-center gap-2 flex-wrap">
              <span className="text-base font-bold text-emerald-800">
                {surah.englishName}
              </span>
              <span className="text-xs text-gray-400">
                {surah.englishNameTranslation}
              </span>
              <span className="text-xs bg-emerald-100 text-emerald-700 px-2 py-0.5 rounded-full">
                {surah.numberOfAyahs} ayahs
              </span>
              <span className="text-xs bg-gray-100 text-gray-500 px-2 py-0.5 rounded-full">
                {surah.revelationType}
              </span>
            </div>
          </div>

          {/* Arabic Name */}
          <p className="arabic-text text-2xl text-emerald-700 shrink-0">
            {surah.name}
          </p>

          {/* Theme Buttons */}
          <div className="flex gap-1 shrink-0">
            {['light', 'gray'].map((th) => (
              <button
                key={th}
                onClick={() => setTheme(th)}
                className={`px-3 py-1 rounded-lg text-xs font-medium border transition ${
                  theme === th
                    ? 'bg-emerald-600 text-white border-emerald-600'
                    : 'bg-white text-gray-500 border-gray-200 hover:border-emerald-300'
                }`}
              >
                {th === 'light' ? '☀️' : '🌫️'}
              </button>
            ))}
          </div>

          {/* Font Size */}
          <div className="flex items-center gap-2 shrink-0">
            <span className="text-xs text-gray-400">A</span>
            <input
              type="range"
              min={16}
              max={40}
              value={fontSize}
              onChange={(e) => setFontSize(Number(e.target.value))}
              className="w-20 accent-emerald-600"
            />
            <span className="text-sm font-bold text-gray-600">A</span>
          </div>
        </div>

        {/* Search Bar */}
        <div className="max-w-3xl mx-auto mt-2 relative">
          <span className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400 text-sm">
            🔍
          </span>
          <input
            type="text"
            placeholder="Search in Arabic or translation..."
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            className={`w-full pl-9 pr-4 py-2 rounded-xl border text-sm focus:outline-none focus:ring-2 focus:ring-emerald-400 ${t.input}`}
          />
        </div>
      </div>

      {/* Content */}
      <div className="max-w-3xl mx-auto px-4 py-6">
        {/* Bismillah */}
        {surah.number !== 1 && surah.number !== 9 && (
          <p className="arabic-text text-center text-3xl text-emerald-700 mb-8 py-4 bg-white/60 rounded-2xl shadow-sm">
            بِسْمِ اللَّهِ الرَّحْمَٰنِ الرَّحِيمِ
          </p>
        )}

        {filtered.length === 0 ? (
          <p className="text-center text-gray-400 py-20">
            No ayahs match your search.
          </p>
        ) : (
          <div className="flex flex-col gap-4">
            {filtered.map((ayah) => (
              <div
                key={ayah.number}
                className={`rounded-2xl border p-5 shadow-sm ${t.card}`}
              >
                {/* Ayah number badge */}
                <div className="flex justify-end mb-3">
                  <span className="w-8 h-8 flex items-center justify-center bg-emerald-100 text-emerald-700 rounded-full text-xs font-bold">
                    {ayah.numberInSurah}
                  </span>
                </div>

                {/* Arabic */}
                <p
                  className="arabic-text text-right leading-loose text-gray-900"
                  style={{ fontSize: `${fontSize}px` }}
                  dangerouslySetInnerHTML={{
                    __html: search.trim()
                      ? stripDiacritics(ayah.text).includes(
                          stripDiacritics(search.trim())
                        )
                        ? ayah.text.replace(
                            new RegExp(
                              `(${search.trim().replace(/[.*+?^${}()|[\]\\]/g, '\\$&')})`,
                              'gi'
                            ),
                            '<mark class="bg-yellow-200 rounded px-0.5">$1</mark>'
                          )
                        : ayah.text
                      : ayah.text,
                  }}
                />

                {/* Translation */}
                {ayah.translation && (
                  <p
                    className="text-sm text-gray-500 mt-3 pt-3 border-t border-gray-100 leading-relaxed"
                    dangerouslySetInnerHTML={{
                      __html: search.trim()
                        ? ayah.translation.replace(
                            new RegExp(
                              `(${search.trim().replace(/[.*+?^${}()|[\]\\]/g, '\\$&')})`,
                              'gi'
                            ),
                            '<mark class="bg-yellow-200 rounded px-0.5">$1</mark>'
                          )
                        : ayah.translation,
                    }}
                  />
                )}
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}
