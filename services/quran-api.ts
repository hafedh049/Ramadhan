// Types for Quran API responses
export interface QuranApiSurah {
  number: number
  name: string
  englishName: string
  englishNameTranslation: string
  numberOfAyahs: number
  revelationType: string
}

export interface QuranApiAyah {
  number: number
  text: string
  numberInSurah: number
  juz: number
  page: number
  audio: string
  audioSecondary: string[]
}

export interface QuranApiVerse {
  number: number
  text: string
  translation: string
  transliteration: string
  audio: string
  audiosByReciter: Record<string, string>
}

// List of available reciters
export const reciters = [
  { id: "ar.alafasy", name: "Mishary Rashid Alafasy", language: "Arabic" },
  { id: "ar.abdulbasit", name: "Abdul Basit Abdul Samad", language: "Arabic" },
  { id: "ar.abdurrahmaansudais", name: "Abdurrahmaan As-Sudais", language: "Arabic" },
  { id: "ar.hanirifai", name: "Hani Ar-Rifai", language: "Arabic" },
  { id: "ar.husary", name: "Mahmoud Khalil Al-Husary", language: "Arabic" },
  { id: "ar.minshawi", name: "Mohamed Siddiq Al-Minshawi", language: "Arabic" },
  { id: "ar.muhammadayyoub", name: "Muhammad Ayyoub", language: "Arabic" },
  { id: "ar.muhammadjibreel", name: "Muhammad Jibreel", language: "Arabic" },
  { id: "ar.shaatree", name: "Abu Bakr Ash-Shaatree", language: "Arabic" },
]

// Get all surahs
export const getAllSurahs = async (): Promise<QuranApiSurah[]> => {
  try {
    const response = await fetch("https://api.alquran.cloud/v1/surah")
    const data = await response.json()

    if (data.code === 200 && data.status === "OK") {
      return data.data
    }

    throw new Error("Failed to fetch surahs")
  } catch (error) {
    console.error("Error fetching surahs:", error)
    // Return local data as fallback
    return []
  }
}

// Get ayahs for a specific surah
export const getAyahsForSurah = async (surahNumber: number, reciterId = "ar.alafasy"): Promise<QuranApiVerse[]> => {
  try {
    // Fetch Arabic text
    const arabicResponse = await fetch(`https://api.alquran.cloud/v1/surah/${surahNumber}`)
    const arabicData = await arabicResponse.json()

    // Fetch translation
    const translationResponse = await fetch(`https://api.alquran.cloud/v1/surah/${surahNumber}/en.sahih`)
    const translationData = await translationResponse.json()

    // Fetch transliteration
    const transliterationResponse = await fetch(`https://api.alquran.cloud/v1/surah/${surahNumber}/en.transliteration`)
    const transliterationData = await transliterationResponse.json()

    // Fetch audio
    const audioResponse = await fetch(`https://api.alquran.cloud/v1/surah/${surahNumber}/${reciterId}`)
    const audioData = await audioResponse.json()

    if (
      arabicData.code === 200 &&
      translationData.code === 200 &&
      transliterationData.code === 200 &&
      audioData.code === 200
    ) {
      // Combine the data
      const verses: QuranApiVerse[] = arabicData.data.ayahs.map((ayah: QuranApiAyah, index: number) => {
        // Create a record of audio URLs for different reciters
        const audiosByReciter: Record<string, string> = {}
        reciters.forEach((reciter) => {
          audiosByReciter[reciter.id] =
            `https://cdn.islamic.network/quran/audio/128/${reciter.id.split(".")[1]}/${ayah.number}.mp3`
        })

        return {
          number: ayah.numberInSurah,
          text: ayah.text,
          translation: translationData.data.ayahs[index].text,
          transliteration: transliterationData.data.ayahs[index].text,
          audio: audioData.data.ayahs[index].audio,
          audiosByReciter,
        }
      })

      return verses
    }

    throw new Error("Failed to fetch ayahs")
  } catch (error) {
    console.error(`Error fetching ayahs for surah ${surahNumber}:`, error)
    // Return empty array as fallback
    return []
  }
}

// Get full surah audio URL
export const getSurahAudioUrl = (surahNumber: number, reciterId = "ar.alafasy"): string => {
  return `https://cdn.islamic.network/quran/audio-surah/128/${reciterId.split(".")[1]}/${surahNumber}.mp3`
}

