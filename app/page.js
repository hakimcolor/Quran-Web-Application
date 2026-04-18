'use client';

import { useState, useEffect } from 'react';
import Link from 'next/link';

async function getSurahs() {
  const res = await fetch('https://api.alquran.cloud/v1/surah', {
    next: { revalidate: 86400 },
  });
  const data = await res.json();
  return data.data;
}

export default function Home() {
  const [surahs, setSurahs] = useState([]);
  const [nameSearch, setNameSearch] = useState('');
  const [ayatSearch, setAyatSearch] = useState('');

  useEffect(() => {
    getSurahs().then(setSurahs);
  }, []);

  const filtered = surahs.filter((s) => {
    const matchName =
      s.englishName.toLowerCase().includes(nameSearch.toLowerCase()) ||
      s.name.includes(nameSearch) ||
      s.englishNameTranslation.toLowerCase().includes(nameSearch.toLowerCase());
    const matchAyat =
      ayatSearch === '' || s.numberOfAyahs.toString().includes(ayatSearch);
    return matchName && matchAyat;
  });

  return (
    <div className="min-h-screen bg-linear-to-br from-emerald-50 via-white to-teal-50">
      {/* Hero */}
      <div className="text-center py-10 px-4">
        <h1 className="text-4xl font-extrabold text-emerald-800 tracking-tight">
          القرآن الكريم
        </h1>
        <p className="text-gray-500 mt-2 text-sm tracking-widest uppercase">
          The Holy Quran · 114 Surahs
        </p>
      </div>

      {/* Search Bars */}
      <div className="max-w-4xl mx-auto px-4 mb-8 flex flex-col sm:flex-row gap-3">
        <div className="relative flex-1">
          <span className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400">
            🔍
          </span>
          <input
            type="text"
            placeholder="Search surah name..."
            value={nameSearch}
            onChange={(e) => setNameSearch(e.target.value)}
            className="w-full pl-9 pr-4 py-3 rounded-xl border border-gray-200 bg-white shadow-sm focus:outline-none focus:ring-2 focus:ring-emerald-400 text-sm"
          />
        </div>
        <div className="relative flex-1">
          <span className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400">
            ✏️
          </span>
          <input
            type="text"
            placeholder="Search by ayah count (e.g. 7, 286)..."
            value={ayatSearch}
            onChange={(e) => setAyatSearch(e.target.value)}
            className="w-full pl-9 pr-4 py-3 rounded-xl border border-gray-200 bg-white shadow-sm focus:outline-none focus:ring-2 focus:ring-teal-400 text-sm"
          />
        </div>
      </div>

      {/* Grid */}
      <div className="max-w-4xl mx-auto px-4 pb-12">
        {filtered.length === 0 ? (
          <p className="text-center text-gray-400 py-20">No surahs found.</p>
        ) : (
          <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 gap-4">
            {filtered.map((s) => (
              <Link href={`/surah/${s.number}`} key={s.number}>
                <div className="h-36 flex flex-col justify-between bg-white border border-gray-100 rounded-2xl p-4 shadow-sm hover:shadow-md hover:border-emerald-300 hover:-translate-y-0.5 transition-all duration-200 cursor-pointer">
                  <div className="flex justify-between items-start">
                    <span className="w-7 h-7 flex items-center justify-center bg-emerald-100 text-emerald-700 rounded-full text-xs font-bold">
                      {s.number}
                    </span>
                    <span className="text-xs text-gray-400 bg-gray-100 px-2 py-0.5 rounded-full">
                      {s.numberOfAyahs}
                    </span>
                  </div>
                  <div>
                    <p className="arabic-text text-xl text-emerald-700 text-right leading-snug">
                      {s.name}
                    </p>
                    <p className="text-xs font-semibold text-gray-700 mt-1 truncate">
                      {s.englishName}
                    </p>
                    <p className="text-xs text-gray-400 truncate">
                      {s.englishNameTranslation}
                    </p>
                  </div>
                </div>
              </Link>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}
