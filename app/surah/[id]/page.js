import SurahClient from './SurahClient';

async function getSurah(id) {
  const res = await fetch(`https://api.alquran.cloud/v1/surah/${id}/en.asad`, {
    next: { revalidate: 86400 },
  });
  const data = await res.json();
  return data.data;
}

export default async function SurahPage({ params }) {
  const surah = await getSurah(params.id);
  return <SurahClient surah={surah} />;
}
