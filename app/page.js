import Link from 'next/link';

async function getSurahs() {
  const res = await fetch('https://api.alquran.cloud/v1/surah', {
    next: { revalidate: 86400 },
  });
  const data = await res.json();
  return data.data;
}

export default async function Home() {
  const surahs = await getSurahs();

  return (
    <div>
      <h1 className="text-3xl font-bold text-center mb-6 text-emerald-700">
        القرآن الكريم — The Holy Quran
      </h1>
      <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-3">
        {surahs.map((s) => (
          <Link href={`/surah/${s.number}`} key={s.number}>
            <div className="border border-emerald-200 bg-white rounded-lg p-4 hover:shadow-md hover:border-emerald-400 transition cursor-pointer flex justify-between items-center">
              <div>
                <span className="text-xs text-gray-400 font-mono">
                  {s.number}.
                </span>
                <h2 className="font-semibold text-gray-800">{s.englishName}</h2>
                <p className="text-xs text-gray-500">
                  {s.englishNameTranslation} · {s.numberOfAyahs} ayahs
                </p>
              </div>
              <p className="arabic-text text-2xl text-emerald-700">{s.name}</p>
            </div>
          </Link>
        ))}
      </div>
    </div>
  );
}
