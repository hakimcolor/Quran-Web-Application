import SurahClient from './SurahClient';

async function getSurah(id) {
  try {
    const res = await fetch(
      `https://api.alquran.cloud/v1/surah/${id}/en.asad`,
      { cache: 'no-store' }
    );
    const data = await res.json();
    return data.data ?? null;
  } catch (e) {
    return null;
  }
}

export default async function SurahPage({ params }) {
  const surah = await getSurah(params.id);

  if (!surah || !surah.ayahs) {
    return (
      <div className="text-center py-20 text-red-500">
        Failed to load surah. Please check your internet connection and refresh.
      </div>
    );
  }

  return <SurahClient surah={surah} />;
}
