'use client';

import { useState, useEffect, useCallback } from 'react';
import { useRouter } from 'next/navigation';
import { motion, AnimatePresence } from 'framer-motion';
import {
  FiArrowLeft,
  FiSearch,
  FiDownload,
  FiSun,
  FiCloud,
  FiMinus,
  FiPlus,
} from 'react-icons/fi';
import { FaQuran } from 'react-icons/fa';

/* strip Arabic diacritics for matching */
const stripDiacritics = (s) =>
  s.replace(
    /[\u0610-\u061A\u064B-\u065F\u0670\u06D6-\u06DC\u06DF-\u06E4\u06E7\u06E8\u06EA-\u06ED]/g,
    ''
  );

const isArabic = (s) => /[\u0600-\u06FF]/.test(s);
const escRx = (s) => s.replace(/[.*+?^${}()|[\]\\]/g, '\\$&');

function highlight(text, q) {
  if (!q.trim()) return text;
  try {
    return text.replace(
      new RegExp(`(${escRx(q.trim())})`, 'gi'),
      '<mark class="bg-yellow-200 rounded px-0.5">$1</mark>'
    );
  } catch {
    return text;
  }
}

const cardVariants = {
  hidden: { opacity: 0, y: 30 },
  visible: (i) => ({
    opacity: 1,
    y: 0,
    transition: { delay: i * 0.04, duration: 0.4, ease: 'easeOut' },
  }),
};

export default function SurahClient({ surah }) {
  const router = useRouter();
  const [search, setSearch] = useState('');
  const [fontSize, setFontSize] = useState(() =>
    typeof window !== 'undefined'
      ? Number(localStorage.getItem('fontSize') || 24)
      : 24
  );
  const [theme, setTheme] = useState(() =>
    typeof window !== 'undefined'
      ? localStorage.getItem('theme') || 'light'
      : 'light'
  );
  const [scrollPct, setScrollPct] = useState(0);

  /* persist on change */

  useEffect(() => {
    localStorage.setItem('fontSize', fontSize);
  }, [fontSize]);
  useEffect(() => {
    localStorage.setItem('theme', theme);
  }, [theme]);

  /* scroll progress tracker */
  const handleScroll = useCallback(() => {
    const el = document.documentElement;
    const pct = Math.round(
      (el.scrollTop / (el.scrollHeight - el.clientHeight)) * 100
    );
    setScrollPct(isNaN(pct) ? 0 : pct);
  }, []);

  useEffect(() => {
    window.addEventListener('scroll', handleScroll, { passive: true });
    return () => window.removeEventListener('scroll', handleScroll);
  }, [handleScroll]);

  if (!surah?.ayahs)
    return (
      <div className="text-center py-20 text-red-500">
        Failed to load. Please refresh.
      </div>
    );

  /* filter by Arabic or English */
  const filtered = surah.ayahs.filter((a) => {
    if (!search.trim()) return true;
    if (isArabic(search))
      return stripDiacritics(a.text).includes(stripDiacritics(search.trim()));
    return a.translation?.toLowerCase().includes(search.trim().toLowerCase());
  });

  /* download full surah as .txt */
  const downloadSurah = () => {
    const lines = [
      `${surah.englishName} — ${surah.englishNameTranslation}`,
      `Surah ${surah.number} · ${surah.numberOfAyahs} Ayahs · ${surah.revelationType}`,
      '',
      'بِسْمِ اللَّهِ الرَّحْمَٰنِ الرَّحِيمِ',
      '',
    ];
    surah.ayahs.forEach((a) => {
      lines.push(`[${a.numberInSurah}] ${a.text}`);
      if (a.translation) lines.push(`     ${a.translation}`);
      lines.push('');
    });
    const blob = new Blob([lines.join('\n')], {
      type: 'text/plain;charset=utf-8',
    });
    const url = URL.createObjectURL(blob);
    const link = document.createElement('a');
    link.href = url;
    link.download = `${surah.englishName}.txt`;
    link.click();
    URL.revokeObjectURL(url);
  };

  const themes = {
    light: {
      page: 'bg-gradient-to-br from-emerald-50 via-white to-teal-50',
      card: 'bg-white border-gray-100',
      input: 'bg-white border-gray-200',
    },
    gray: {
      page: 'bg-gray-100',
      card: 'bg-gray-200 border-gray-300',
      input: 'bg-gray-200 border-gray-300',
    },
  };
  const t = themes[theme] || themes.light;

  return (
    <div className={`min-h-screen text-gray-900 ${t.page}`}>
      {/* scroll progress bar */}
      <div className="fixed top-0 left-0 w-full h-1 bg-gray-200 z-60">
        <motion.div
          className="h-full bg-emerald-500"
          style={{ width: `${scrollPct}%` }}
          transition={{ ease: 'linear', duration: 0.1 }}
        />
      </div>

      {/* sticky top bar */}
      <div className="sticky top-0 z-50 backdrop-blur-md bg-white/90 border-b border-gray-100 shadow-sm">
        {/* row 1: controls */}
        <div className="max-w-3xl mx-auto flex items-center gap-1.5 px-2 py-2 sm:px-4 sm:py-3 sm:gap-2">
          {/* back */}
          <button
            onClick={() => router.back()}
            aria-label="Go back"
            className="w-8 h-8 sm:w-9 sm:h-9 flex items-center justify-center rounded-full bg-emerald-600 hover:bg-emerald-700 text-white shadow transition shrink-0 cursor-pointer"
          >
            <FiArrowLeft size={15} />
          </button>

          {/* surah info */}
          <div className="flex items-center gap-1.5 flex-1 min-w-0">
            <FaQuran className="text-emerald-600 shrink-0" size={12} />
            <span className="text-xs sm:text-sm font-bold text-emerald-800 truncate">
              {surah.englishName}
            </span>
            <span className="text-xs text-gray-400 hidden sm:inline">
              {surah.englishNameTranslation}
            </span>
            <span className="text-xs bg-emerald-100 text-emerald-700 px-1.5 py-0.5 rounded-full hidden sm:inline">
              {surah.numberOfAyahs}
            </span>
          </div>

          {/* arabic name */}
          <p className="arabic-text text-base sm:text-xl text-emerald-700 shrink-0">
            {surah.name}
          </p>

          {/* scroll % */}
          <span className="text-xs font-mono bg-emerald-50 text-emerald-600 border border-emerald-200 px-1.5 py-0.5 rounded-lg shrink-0">
            {scrollPct}%
          </span>

          {/* theme */}
          <div className="flex gap-1 shrink-0">
            <button
              onClick={() => setTheme('light')}
              aria-label="Light mode"
              className={`w-7 h-7 sm:w-8 sm:h-8 flex items-center justify-center rounded-lg border transition cursor-pointer ${theme === 'light' ? 'bg-emerald-600 text-white border-emerald-600' : 'bg-white text-gray-400 border-gray-200'}`}
            >
              <FiSun size={13} />
            </button>
            <button
              onClick={() => setTheme('gray')}
              aria-label="Gray mode"
              className={`w-7 h-7 sm:w-8 sm:h-8 flex items-center justify-center rounded-lg border transition cursor-pointer ${theme === 'gray' ? 'bg-gray-500 text-white border-gray-500' : 'bg-white text-gray-400 border-gray-200'}`}
            >
              <FiCloud size={13} />
            </button>
          </div>

          {/* font size */}
          <div className="flex items-center gap-0.5 shrink-0">
            <button
              onClick={() => setFontSize((f) => Math.max(16, f - 2))}
              aria-label="Decrease font"
              className="w-6 h-6 sm:w-7 sm:h-7 flex items-center justify-center rounded-lg bg-gray-100 hover:bg-gray-200 text-gray-600 transition cursor-pointer"
            >
              <FiMinus size={11} />
            </button>
            <span className="text-xs font-mono w-6 text-center text-gray-500">
              {fontSize}
            </span>
            <button
              onClick={() => setFontSize((f) => Math.min(40, f + 2))}
              aria-label="Increase font"
              className="w-6 h-6 sm:w-7 sm:h-7 flex items-center justify-center rounded-lg bg-gray-100 hover:bg-gray-200 text-gray-600 transition cursor-pointer"
            >
              <FiPlus size={11} />
            </button>
          </div>

          {/* download */}
          <button
            onClick={downloadSurah}
            aria-label="Download surah"
            className="w-7 h-7 sm:w-auto sm:h-auto sm:px-3 sm:py-1.5 flex items-center justify-center sm:gap-1 bg-teal-600 hover:bg-teal-700 text-white text-xs rounded-lg shadow transition shrink-0 cursor-pointer"
          >
            <FiDownload size={13} />
            <span className="hidden sm:inline">Download</span>
          </button>
        </div>

        {/* row 2: search */}
        <div className="max-w-3xl mx-auto px-2 pb-2 sm:px-4 sm:pb-3 relative">
          <FiSearch
            className="absolute left-5 sm:left-7 top-1/2 -translate-y-1/2 text-gray-400"
            size={13}
          />
          <input
            type="text"
            dir="auto"
            placeholder="اكتب عربي · Type English..."
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            className={`w-full pl-8 pr-3 py-1.5 sm:py-2 rounded-xl border text-xs sm:text-sm focus:outline-none focus:ring-2 focus:ring-emerald-400 ${t.input}`}
          />
        </div>

        {/* result count */}
        <AnimatePresence>
          {search.trim() && (
            <motion.p
              initial={{ opacity: 0, y: -4 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0 }}
              className="max-w-3xl mx-auto px-3 pb-1.5 text-xs text-gray-400"
            >
              {filtered.length} ayah{filtered.length !== 1 ? 's' : ''} ·{' '}
              {isArabic(search) ? 'Arabic' : 'English'}
            </motion.p>
          )}
        </AnimatePresence>
      </div>

      {/* main content */}
      <div className="max-w-3xl mx-auto px-3 sm:px-4 py-6">
        {/* bismillah */}
        {surah.number !== 1 && surah.number !== 9 && (
          <motion.p
            initial={{ opacity: 0, scale: 0.95 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ duration: 0.5 }}
            className="arabic-text text-center text-2xl sm:text-3xl text-emerald-700 mb-8 py-4 bg-white/60 rounded-2xl shadow-sm"
          >
            بِسْمِ اللَّهِ الرَّحْمَٰنِ الرَّحِيمِ
          </motion.p>
        )}

        {filtered.length === 0 ? (
          <p className="text-center text-gray-400 py-20">
            No ayahs match your search.
          </p>
        ) : (
          <div className="flex flex-col gap-4">
            {filtered.map((ayah, i) => (
              <motion.div
                key={ayah.number}
                custom={i}
                variants={cardVariants}
                initial="hidden"
                animate="visible"
                whileHover={{
                  scale: 1.01,
                  boxShadow: '0 4px 20px rgba(0,0,0,0.08)',
                }}
                className={`rounded-2xl border p-4 sm:p-5 shadow-sm ${t.card}`}
              >
                {/* ayah number badge */}
                <div className="flex justify-end mb-3">
                  <span className="w-7 h-7 sm:w-8 sm:h-8 flex items-center justify-center bg-emerald-100 text-emerald-700 rounded-full text-xs font-bold">
                    {ayah.numberInSurah}
                  </span>
                </div>

                {/* arabic text */}
                <p
                  className="arabic-text text-right leading-loose text-gray-900"
                  style={{ fontSize: `${fontSize}px` }}
                  dangerouslySetInnerHTML={{
                    __html: isArabic(search)
                      ? highlight(ayah.text, stripDiacritics(search.trim()))
                      : ayah.text,
                  }}
                />

                {/* english translation */}
                {ayah.translation && (
                  <p
                    className="text-xs sm:text-sm text-gray-500 mt-3 pt-3 border-t border-gray-100 leading-relaxed"
                    dangerouslySetInnerHTML={{
                      __html:
                        !isArabic(search) && search.trim()
                          ? highlight(ayah.translation, search.trim())
                          : ayah.translation,
                    }}
                  />
                )}
              </motion.div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}
