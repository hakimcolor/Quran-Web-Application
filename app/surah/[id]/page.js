import SurahClient from './SurahClient';

async function getSurah(id) {
  try {
    // Fetch Arabic + English translation in parallel
    const [arabicRes, translationRes] = await Promise.all([
      fetch(`https://api.alquran.cloud/v1/surah/${id}`, { cache: 'no-store' }),
      fetch(`https://api.alquran.cloud/v1/surah/${id}/en.asad`, {
        cache: 'no-store',
      }),
    ]);

    const arabicData = await arabicRes.json();
    const translationData = await translationRes.json();

    const surah = arabicData.data;
    const translations = translationData.data?.ayahs ?? [];

    // Merge translation into each ayah
    surah.ayahs = surah.ayahs.map((ayah, i) => ({
      ...ayah,
      translation: translations[i]?.text ?? '',
    }));

    return surah;
  } catch (e) {
    return null;
  }
}

export default async function SurahPage({ params }) {
  const { id } = await params;
  const surah = await getSurah(id);

  if (!surah || !surah.ayahs) {
    return (
      <div className="text-center py-20 text-red-500">
        Failed to load surah. Please check your internet and refresh.
      </div>
    );
  }

  return <SurahClient surah={surah} />;
}
