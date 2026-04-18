'use client';

import { useState, useEffect, useRef, useCallback } from 'react';
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

/* helpers */
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

/* card animation variants */
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
  const [fontSize, setFontSize] = useState(24);
  const [theme, setTheme] = useState('light');
  const [scrollPct, setScrollPct] = useState(0);
  const contentRef = useRef(null);

  /* restore settings */
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

  /* scroll progress */
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

  /* filter ayahs */
  const filtered = surah.ayahs.filter((a) => {
    if (!search.trim()) return true;
    if (isArabic(search))
      return stripDiacritics(a.text).includes(stripDiacritics(search.trim()));
    return a.translation?.toLowerCase().includes(search.trim().toLowerCase());
  });

  /* download surah as txt */
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
      <div className="sticky top-0 z-50 backdrop-blur-md bg-white/80 border-b border-gray-100 shadow-sm px-4 py-3">
        <div className="max-w-3xl mx-auto flex items-center gap-2 flex-wrap">
          {/* back */}
          <button
            onClick={() => router.back()}
            className="w-9 h-9 flex items-center justify-center rounded-full bg-emerald-600 hover:bg-emerald-700 cursor-pointer text-white shadow transition shrink-0"
            aria-label="Go back"
          >
            <FiArrowLeft size={16} />
          </button>

          {/* surah info */}
          <div className="flex-1 min-w-0">
            <div className="flex items-center gap-2 flex-wrap">
              <FaQuran className="text-emerald-600" size={14} />
              <span className="text-sm font-bold text-emerald-800">
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

          {/* arabic name */}
          <p className="arabic-text text-xl text-emerald-700 shrink-0">
            {surah.name}
          </p>

          {/* scroll % */}
          <span className="text-xs font-mono bg-emerald-50 text-emerald-600 border border-emerald-200 px-2 py-1 rounded-lg shrink-0">
            {scrollPct}%
          </span>

          {/* theme */}
          <div className="flex gap-1 shrink-0">
            <button
              onClick={() => setTheme('light')}
              className={`w-8 h-8 flex items-center justify-center rounded-lg border transition ${theme === 'light' ? 'bg-emerald-600 text-white border-emerald-600' : 'bg-white text-gray-400 border-gray-200'}`}
            >
              <FiSun size={14} />
            </button>
            <button
              onClick={() => setTheme('gray')}
              className={`w-8 h-8 flex items-center justify-center rounded-lg border transition ${theme === 'gray' ? 'bg-gray-500 text-white border-gray-500' : 'bg-white text-gray-400 border-gray-200'}`}
            >
              <FiCloud size={14} />
            </button>
          </div>

          {/* font size */}
          <div className="flex items-center gap-1 shrink-0">
            <button
              onClick={() => setFontSize((f) => Math.max(16, f - 2))}
              className="w-7 h-7 flex items-center justify-center rounded-lg bg-gray-100 hover:bg-gray-200 text-gray-600 transition"
            >
              <FiMinus size={12} />
            </button>
            <span className="text-xs font-mono w-8 text-center text-gray-600">
              {fontSize}
            </span>
            <button
              onClick={() => setFontSize((f) => Math.min(40, f + 2))}
              className="w-7 h-7 flex items-center justify-center rounded-lg bg-gray-100 hover:bg-gray-200 text-gray-600 transition"
            >
              <FiPlus size={12} />
            </button>
          </div>

          {/* download */}
          <button
            onClick={downloadSurah}
            className="flex items-center gap-1 bg-teal-600 hover:bg-teal-700 text-white text-xs px-3 py-2 cursor-pointer rounded-lg shadow transition shrink-0"
            aria-label="Download surah"
          >
            <FiDownload size={13} />
            <span>Download</span>
          </button>
        </div>

        {/* search */}
        <div className="max-w-3xl mx-auto mt-2 relative">
          <FiSearch
            className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400"
            size={14}
          />
          <input
            type="text"
            dir="auto"
            placeholder="اكتب عربي · Type English to search translation..."
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            className={`w-full pl-9 pr-4 py-2 rounded-xl border text-sm focus:outline-none focus:ring-2 focus:ring-emerald-400 ${t.input}`}
          />
        </div>

        {/* result count */}
        <AnimatePresence>
          {search.trim() && (
            <motion.p
              initial={{ opacity: 0, y: -4 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0 }}
              className="max-w-3xl mx-auto mt-1 text-xs text-gray-400 px-1"
            >
              {filtered.length} ayah{filtered.length !== 1 ? 's' : ''} found ·{' '}
              {isArabic(search)
                ? 'searching Arabic'
                : 'searching English translation'}
            </motion.p>
          )}
        </AnimatePresence>
      </div>

      {/* content */}
      <div ref={contentRef} className="max-w-3xl mx-auto px-4 py-6">
        {/* bismillah */}
        {surah.number !== 1 && surah.number !== 9 && (
          <motion.p
            initial={{ opacity: 0, scale: 0.95 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ duration: 0.5 }}
            className="arabic-text text-center text-3xl text-emerald-700 mb-8 py-4 bg-white/60 rounded-2xl shadow-sm"
          >
            بِسْمِ اللَّهِ الرَّحْمَٰنِ الرَّحِيمِ
          </motion.p>
        )}

        {filtered.length === 0 ? (
          <motion.p
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            className="text-center text-gray-400 py-20"
          >
            No ayahs match your search.
          </motion.p>
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
                className={`rounded-2xl border p-5 shadow-sm cursor-default ${t.card}`}
              >
                {/* ayah number */}
                <div className="flex justify-end mb-3">
                  <span className="w-8 h-8 flex items-center justify-center bg-emerald-100 text-emerald-700 rounded-full text-xs font-bold">
                    {ayah.numberInSurah}
                  </span>
                </div>

                {/* arabic */}
                <p
                  className="arabic-text text-right leading-loose text-gray-900"
                  style={{ fontSize: `${fontSize}px` }}
                  dangerouslySetInnerHTML={{
                    __html: isArabic(search)
                      ? highlight(ayah.text, stripDiacritics(search.trim()))
                      : ayah.text,
                  }}
                />

                {/* translation */}
                {ayah.translation && (
                  <p
                    className="text-sm text-gray-500 mt-3 pt-3 border-t border-gray-100 leading-relaxed"
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
