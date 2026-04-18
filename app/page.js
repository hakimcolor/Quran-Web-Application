'use client';

import { useState, useEffect } from 'react';
import Link from 'next/link';
import { motion, AnimatePresence } from 'framer-motion';
import { FiSearch } from 'react-icons/fi';
import { FaQuran } from 'react-icons/fa';
import { MdOutlineEditNote } from 'react-icons/md';
import { HiArrowUp } from 'react-icons/hi';

async function getSurahs() {
  const res = await fetch('https://api.alquran.cloud/v1/surah', {
    next: { revalidate: 86400 },
  });
  const data = await res.json();
  return data.data;
}

const cardVariants = {
  hidden: { opacity: 0, y: 20 },
  visible: (i) => ({
    opacity: 1,
    y: 0,
    transition: { delay: i * 0.03, duration: 0.35, ease: 'easeOut' },
  }),
};

export default function Home() {
  const [surahs, setSurahs] = useState([]);
  const [nameSearch, setNameSearch] = useState('');
  const [ayatSearch, setAyatSearch] = useState('');
  const [showTop, setShowTop] = useState(false);

  useEffect(() => {
    getSurahs().then(setSurahs);
  }, []);

  useEffect(() => {
    const onScroll = () => setShowTop(window.scrollY > 300);
    window.addEventListener('scroll', onScroll, { passive: true });
    return () => window.removeEventListener('scroll', onScroll);
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
      {/* sticky search bar — sits just below the sticky navbar (top-16) */}
      <div className="sticky top-16 z-40 bg-white/90 backdrop-blur-md border-b border-gray-100 shadow-sm px-4 py-3">
        <div className="max-w-4xl mx-auto flex flex-col sm:flex-row gap-3">
          <div className="relative flex-1">
            <FiSearch
              className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400"
              size={15}
            />
            <input
              type="text"
              placeholder="Search surah name..."
              value={nameSearch}
              onChange={(e) => setNameSearch(e.target.value)}
              className="w-full pl-9 pr-4 py-2.5 rounded-xl border border-gray-200 bg-white focus:outline-none focus:ring-2 focus:ring-emerald-400 text-sm"
            />
          </div>
          <div className="relative flex-1">
            <MdOutlineEditNote
              className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400"
              size={18}
            />
            <input
              type="text"
              placeholder="Search by ayah count (e.g. 7, 286)..."
              value={ayatSearch}
              onChange={(e) => setAyatSearch(e.target.value)}
              className="w-full pl-9 pr-4 py-2.5 rounded-xl border border-gray-200 bg-white focus:outline-none focus:ring-2 focus:ring-teal-400 text-sm"
            />
          </div>
        </div>
      </div>

      {/* hero */}
      <motion.div
        initial={{ opacity: 0, y: -20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.6 }}
        className="text-center py-8 px-4"
      >
        <div className="flex justify-center mb-3">
          <FaQuran className="text-emerald-600" size={40} />
        </div>
        <h1 className="text-4xl font-extrabold text-emerald-800 tracking-tight">
          القرآن الكريم
        </h1>
        <p className="text-gray-400 mt-2 text-sm tracking-widest uppercase">
          The Holy Quran · 114 Surahs
        </p>
      </motion.div>

      {/* surah grid */}
      <div className="max-w-4xl mx-auto px-4 pb-20">
        {filtered.length === 0 ? (
          <p className="text-center text-gray-400 py-20">No surahs found.</p>
        ) : (
          <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 gap-4">
            {filtered.map((s, i) => (
              <motion.div
                key={s.number}
                custom={i}
                variants={cardVariants}
                initial="hidden"
                animate="visible"
                whileHover={{
                  scale: 1.03,
                  boxShadow: '0 6px 24px rgba(0,0,0,0.10)',
                }}
                whileTap={{ scale: 0.97 }}
              >
                <Link href={`/surah/${s.number}`}>
                  <div className="h-36 flex flex-col justify-between bg-white border border-gray-100 rounded-2xl p-4 shadow-sm hover:border-emerald-300 transition-all duration-200 cursor-pointer">
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
              </motion.div>
            ))}
          </div>
        )}
      </div>

      {/* scroll to top — appears after 300px scroll */}
      <AnimatePresence>
        {showTop && (
          <motion.button
            initial={{ opacity: 0, scale: 0.5 }}
            animate={{ opacity: 1, scale: 1 }}
            exit={{ opacity: 0, scale: 0.5 }}
            onClick={() => window.scrollTo({ top: 0, behavior: 'smooth' })}
            className="fixed bottom-6 right-6 w-11 h-11 flex items-center justify-center bg-emerald-600 hover:bg-emerald-700 text-white rounded-full shadow-lg z-50 transition"
            aria-label="Scroll to top"
          >
            <HiArrowUp size={18} />
          </motion.button>
        )}
      </AnimatePresence>
    </div>
  );
}
