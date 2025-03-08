export interface Surah {
  id: number
  name: string
  arabicName: string
  englishName: string
  englishNameTranslation: string
  numberOfAyahs: number
  revelationType: string
}

export interface Ayah {
  number: number
  text: string
  translation: string
  transliteration: string
}

export const surahs: Surah[] = [
  {
    id: 1,
    name: "Al-Fatihah",
    arabicName: "الفاتحة",
    englishName: "The Opening",
    englishNameTranslation: "The Opening",
    numberOfAyahs: 7,
    revelationType: "Meccan",
  },
  {
    id: 2,
    name: "Al-Baqarah",
    arabicName: "البقرة",
    englishName: "The Cow",
    englishNameTranslation: "The Cow",
    numberOfAyahs: 286,
    revelationType: "Medinan",
  },
  {
    id: 3,
    name: "Ali 'Imran",
    arabicName: "آل عمران",
    englishName: "The Family of Imran",
    englishNameTranslation: "The Family of Imran",
    numberOfAyahs: 200,
    revelationType: "Medinan",
  },
  {
    id: 4,
    name: "An-Nisa",
    arabicName: "النساء",
    englishName: "The Women",
    englishNameTranslation: "The Women",
    numberOfAyahs: 176,
    revelationType: "Medinan",
  },
  {
    id: 5,
    name: "Al-Ma'idah",
    arabicName: "المائدة",
    englishName: "The Table Spread",
    englishNameTranslation: "The Table",
    numberOfAyahs: 120,
    revelationType: "Medinan",
  },
  {
    id: 6,
    name: "Al-An'am",
    arabicName: "الأنعام",
    englishName: "The Cattle",
    englishNameTranslation: "The Cattle",
    numberOfAyahs: 165,
    revelationType: "Meccan",
  },
  {
    id: 7,
    name: "Al-A'raf",
    arabicName: "الأعراف",
    englishName: "The Heights",
    englishNameTranslation: "The Heights",
    numberOfAyahs: 206,
    revelationType: "Meccan",
  },
  {
    id: 8,
    name: "Al-Anfal",
    arabicName: "الأنفال",
    englishName: "The Spoils of War",
    englishNameTranslation: "The Spoils of War",
    numberOfAyahs: 75,
    revelationType: "Medinan",
  },
  {
    id: 9,
    name: "At-Tawbah",
    arabicName: "التوبة",
    englishName: "The Repentance",
    englishNameTranslation: "The Repentance",
    numberOfAyahs: 129,
    revelationType: "Medinan",
  },
  {
    id: 10,
    name: "Yunus",
    arabicName: "يونس",
    englishName: "Jonah",
    englishNameTranslation: "Jonah",
    numberOfAyahs: 109,
    revelationType: "Meccan",
  },
  {
    id: 11,
    name: "Hud",
    arabicName: "هود",
    englishName: "Hud",
    englishNameTranslation: "Hud",
    numberOfAyahs: 123,
    revelationType: "Meccan",
  },
  {
    id: 12,
    name: "Yusuf",
    arabicName: "يوسف",
    englishName: "Joseph",
    englishNameTranslation: "Joseph",
    numberOfAyahs: 111,
    revelationType: "Meccan",
  },
  {
    id: 13,
    name: "Ar-Ra'd",
    arabicName: "الرعد",
    englishName: "The Thunder",
    englishNameTranslation: "The Thunder",
    numberOfAyahs: 43,
    revelationType: "Medinan",
  },
  {
    id: 14,
    name: "Ibrahim",
    arabicName: "ابراهيم",
    englishName: "Abraham",
    englishNameTranslation: "Abraham",
    numberOfAyahs: 52,
    revelationType: "Meccan",
  },
  {
    id: 15,
    name: "Al-Hijr",
    arabicName: "الحجر",
    englishName: "The Rocky Tract",
    englishNameTranslation: "The Rocky Tract",
    numberOfAyahs: 99,
    revelationType: "Meccan",
  },
]

// Sample ayahs for Al-Fatihah
export const alFatihahAyahs: Ayah[] = [
  {
    number: 1,
    text: "بِسْمِ اللَّهِ الرَّحْمَٰنِ الرَّحِيمِ",
    translation: "In the name of Allah, the Entirely Merciful, the Especially Merciful.",
    transliteration: "Bismillahir rahmanir raheem",
  },
  {
    number: 2,
    text: "الْحَمْدُ لِلَّهِ رَبِّ الْعَالَمِينَ",
    translation: "All praise is due to Allah, Lord of the worlds.",
    transliteration: "Alhamdu lillahi rabbil 'alamin",
  },
  {
    number: 3,
    text: "الرَّحْمَٰنِ الرَّحِيمِ",
    translation: "The Entirely Merciful, the Especially Merciful,",
    transliteration: "Ar-rahmanir-raheem",
  },
  {
    number: 4,
    text: "مَالِكِ يَوْمِ الدِّينِ",
    translation: "Sovereign of the Day of Recompense.",
    transliteration: "Maliki yawmid-deen",
  },
  {
    number: 5,
    text: "إِيَّاكَ نَعْبُدُ وَإِيَّاكَ نَسْتَعِينُ",
    translation: "It is You we worship and You we ask for help.",
    transliteration: "Iyyaka na'budu wa iyyaka nasta'een",
  },
  {
    number: 6,
    text: "اهْدِنَا الصِّرَاطَ الْمُسْتَقِيمَ",
    translation: "Guide us to the straight path -",
    transliteration: "Ihdinas-siratal-mustaqeem",
  },
  {
    number: 7,
    text: "صِرَاطَ الَّذِينَ أَنْعَمْتَ عَلَيْهِمْ غَيْرِ الْمَغْضُوبِ عَلَيْهِمْ وَلَا الضَّالِّينَ",
    translation:
      "The path of those upon whom You have bestowed favor, not of those who have evoked [Your] anger or of those who are astray.",
    transliteration: "Siratal-latheena an'amta 'alayhim, ghayril-maghdubi 'alayhim wa lad-dalleen",
  },
]

// Sample ayahs for Al-Baqarah (first 5)
export const alBaqarahAyahs: Ayah[] = [
  {
    number: 1,
    text: "الم",
    translation: "Alif, Lam, Meem.",
    transliteration: "Alif Lam Meem",
  },
  {
    number: 2,
    text: "ذَٰلِكَ الْكِتَابُ لَا رَيْبَ ۛ فِيهِ ۛ هُدًى لِّلْمُتَّقِينَ",
    translation: "This is the Book about which there is no doubt, a guidance for those conscious of Allah.",
    transliteration: "Thalikal kitabu la rayba feehi hudal lil muttaqeen",
  },
  {
    number: 3,
    text: "الَّذِينَ يُؤْمِنُونَ بِالْغَيْبِ وَيُقِيمُونَ الصَّلَاةَ وَمِمَّا رَزَقْنَاهُمْ يُنفِقُونَ",
    translation: "Who believe in the unseen, establish prayer, and spend out of what We have provided for them.",
    transliteration: "Allatheena yu'minoona bil ghaybi wa yuqeemoona as-salata wa mimma razaqnahum yunfiqoon",
  },
  {
    number: 4,
    text: "وَالَّذِينَ يُؤْمِنُونَ بِمَا أُنزِلَ إِلَيْكَ وَمَا أُنزِلَ مِن قَبْلِكَ وَبِالْآخِرَةِ هُمْ يُوقِنُونَ",
    translation:
      "And who believe in what has been revealed to you, and what was revealed before you, and of the Hereafter they are certain.",
    transliteration: "Wallatheena yu'minoona bima onzila ilayka wa ma onzila min qablika wa bil-akhirati hum yooqinoon",
  },
  {
    number: 5,
    text: "أُولَٰئِكَ عَلَىٰ هُدًى مِّن رَّبِّهِمْ ۖ وَأُولَٰئِكَ هُمُ الْمُفْلِحُونَ",
    translation: "Those are upon guidance from their Lord, and it is those who are the successful.",
    transliteration: "Ola-ika AAala hudan min rabbihim waola-ika humu almuflihoon",
  },
]

// Function to get ayahs for a specific surah
export function getAyahsForSurah(surahId: number): Ayah[] {
  if (surahId === 1) return alFatihahAyahs
  if (surahId === 2) return alBaqarahAyahs
  return []
}

