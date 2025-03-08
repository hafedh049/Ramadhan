export interface Dua {
  id: number
  name: string
  arabicName: string
  category: string
  arabic: string
  transliteration: string
  translation: string
  reference: string
}

export const duaCategories = [
  "Daily",
  "Prayer",
  "Morning & Evening",
  "Food & Drink",
  "Travel",
  "Home",
  "Mosque",
  "Distress",
  "Forgiveness",
  "Protection",
  "Family",
  "Healing",
  "Success",
]

export const duas: Dua[] = [
  {
    id: 1,
    name: "Morning Supplications",
    arabicName: "أذكار الصباح",
    category: "Morning & Evening",
    arabic:
      "أَصْبَحْنَا وَأَصْبَحَ الْمُلْكُ لِلَّهِ، وَالْحَمْدُ لِلَّهِ، لاَ إِلَـهَ إِلاَّ اللهُ وَحْدَهُ لاَ شَرِيْكَ لَهُ، لَهُ الْمُلْكُ وَلَهُ الْحَمْدُ وَهُوَ عَلَى كُلِّ شَيْءٍ قَدِيْرٌ",
    transliteration:
      "Asbahna wa asbahal mulku lillah, walhamdu lillah, la ilaha illallahu wahdahu la sharika lah, lahul mulku walahul hamd, wa huwa 'ala kulli shay'in qadir",
    translation:
      "We have reached the morning and at this very time all sovereignty belongs to Allah. All praise is for Allah. None has the right to be worshipped except Allah, alone, without any partner, to Him belongs all sovereignty and praise and He is over all things omnipotent.",
    reference: "Muslim",
  },
  {
    id: 2,
    name: "Evening Supplications",
    arabicName: "أذكار المساء",
    category: "Morning & Evening",
    arabic:
      "أَمْسَيْنَا وَأَمْسَى الْمُلْكُ للهِ، وَالْحَمْدُ للهِ، لَا إِلَهَ إِلاَّ اللهُ وَحْدَهُ لَا شَرِيكَ لَهُ، لَهُ الْمُلْكُ وَلَهُ الْحَمْدُ، وَهُوَ عَلَى كُلِّ شَيْءٍ قَدِيرٌ",
    transliteration:
      "Amsayna wa amsal mulku lillah, walhamdu lillah, la ilaha illallahu wahdahu la sharika lah, lahul mulku walahul hamd, wa huwa 'ala kulli shay'in qadir",
    translation:
      "We have reached the evening and at this very time all sovereignty belongs to Allah. All praise is for Allah. None has the right to be worshipped except Allah, alone, without any partner, to Him belongs all sovereignty and praise and He is over all things omnipotent.",
    reference: "Muslim",
  },
  {
    id: 3,
    name: "Before Sleep",
    arabicName: "دعاء قبل النوم",
    category: "Daily",
    arabic: "بِاسْمِكَ اللَّهُمَّ أَمُوتُ وَأَحْيَا",
    transliteration: "Bismika Allahumma amootu wa ahya",
    translation: "In Your name, O Allah, I die and I live.",
    reference: "Bukhari",
  },
  {
    id: 4,
    name: "After Prayer",
    arabicName: "دعاء بعد الصلاة",
    category: "Prayer",
    arabic:
      "اللَّهُمَّ إِنِّي أَعُوذُ بِكَ مِنَ الْجُبْنِ، وَأَعُوذُ بِكَ مِنَ الْبُخْلِ، وَأَعُوذُ بِكَ مِنْ أَنْ أُرَدَّ إِلَى أَرْذَلِ الْعُمُرِ، وَأَعُوذُ بِكَ مِنْ فِتْنَةِ الدُّنْيَا، وَأَعُوذُ بِكَ مِنْ عَذَابِ الْقَبْرِ",
    transliteration:
      "Allahumma inni a'udhu bika minal-jubn, wa a'udhu bika minal-bukhl, wa a'udhu bika min an uradda ila ardhalil-'umr, wa a'udhu bika min fitnatid-dunya, wa a'udhu bika min 'adhabil-qabr",
    translation:
      "O Allah, I seek refuge in You from cowardice, and I seek refuge in You from miserliness, and I seek refuge in You from being returned to a feeble age, and I seek refuge in You from the trials of this world, and I seek refuge in You from the punishment of the grave.",
    reference: "Bukhari",
  },
  {
    id: 5,
    name: "Entering Mosque",
    arabicName: "دعاء دخول المسجد",
    category: "Mosque",
    arabic: "اللَّهُمَّ افْتَحْ لِي أَبْوَابَ رَحْمَتِكَ",
    transliteration: "Allahumma iftah li abwaba rahmatik",
    translation: "O Allah, open the gates of Your mercy for me.",
    reference: "Muslim",
  },
  {
    id: 6,
    name: "Leaving Mosque",
    arabicName: "دعاء الخروج من المسجد",
    category: "Mosque",
    arabic: "اللَّهُمَّ إِنِّي أَسْأَلُكَ مِنْ فَضْلِكَ",
    transliteration: "Allahumma inni as'aluka min fadlik",
    translation: "O Allah, I ask You for Your bounty.",
    reference: "Muslim",
  },
  {
    id: 7,
    name: "Before Eating",
    arabicName: "دعاء قبل الطعام",
    category: "Food & Drink",
    arabic: "بِسْمِ اللَّهِ",
    transliteration: "Bismillah",
    translation: "In the name of Allah.",
    reference: "Abu Dawud",
  },
  {
    id: 8,
    name: "After Eating",
    arabicName: "دعاء بعد الطعام",
    category: "Food & Drink",
    arabic: "الْحَمْدُ لِلَّهِ الَّذِي أَطْعَمَنِي هَذَا، وَرَزَقَنِيهِ، مِنْ غَيْرِ حَوْلٍ مِنِّي وَلَا قُوَّةٍ",
    transliteration: "Alhamdu lillahil-ladhi at'amani hadha, wa razaqanihi, min ghayri hawlin minni wa la quwwah",
    translation:
      "All praise is for Allah who has given me this food and provided it for me with no might nor power from myself.",
    reference: "Abu Dawud, Tirmidhi",
  },
  {
    id: 9,
    name: "When Starting a Journey",
    arabicName: "دعاء السفر",
    category: "Travel",
    arabic: "اللَّهُ أَكْبَرُ، اللَّهُ أَكْبَرُ، اللَّهُ أَكْبَرُ، سُبْحَانَ الَّذِي سَخَّرَ لَنَا هَذَا وَمَا كُنَّا لَهُ مُقْرِنِينَ، وَإِنَّا إِلَى رَبِّنَا لَمُنْقَلِبُونَ",
    transliteration:
      "Allahu Akbar, Allahu Akbar, Allahu Akbar, Subhanal-ladhi sakhkhara lana hadha wa ma kunna lahu muqrinin, wa inna ila Rabbina lamunqalibun",
    translation:
      "Allah is the Greatest, Allah is the Greatest, Allah is the Greatest. Glory is to Him Who has provided this for us though we could never have had it by our efforts. Surely, unto our Lord we are returning.",
    reference: "Abu Dawud, Tirmidhi",
  },
  {
    id: 10,
    name: "Entering Home",
    arabicName: "دعاء دخول المنزل",
    category: "Home",
    arabic: "بِسْمِ اللَّهِ وَلَجْنَا، وَبِسْمِ اللَّهِ خَرَجْنَا، وَعَلَى رَبِّنَا تَوَكَّلْنَا",
    transliteration: "Bismillahi walajna, wa bismillahi kharajna, wa 'ala Rabbina tawakkalna",
    translation: "In the name of Allah we enter, in the name of Allah we leave, and upon our Lord we depend.",
    reference: "Abu Dawud",
  },
  {
    id: 11,
    name: "In Times of Distress",
    arabicName: "دعاء الكرب",
    category: "Distress",
    arabic:
      "لَا إِلَهَ إِلَّا اللَّهُ الْعَظِيمُ الْحَلِيمُ، لَا إِلَهَ إِلَّا اللَّهُ رَبُّ الْعَرْشِ الْعَظِيمِ، لَا إِلَهَ إِلَّا اللَّهُ رَبُّ السَّمَاوَاتِ وَرَبُّ الْأَرْضِ وَرَبُّ الْعَرْشِ الْكَرِيمِ",
    transliteration:
      "La ilaha illallahul-'Adhimul-Halim, la ilaha illallahu Rabbul-'Arshil-'Adhim, la ilaha illallahu Rabbus-samawati wa Rabbul-ardi wa Rabbul-'Arshil-Karim",
    translation:
      "There is none worthy of worship but Allah, the Mighty, the Forbearing. There is none worthy of worship but Allah, Lord of the Magnificent Throne. There is none worthy of worship but Allah, Lord of the heavens and Lord of the earth, and Lord of the Noble Throne.",
    reference: "Bukhari, Muslim",
  },
  {
    id: 12,
    name: "Seeking Forgiveness",
    arabicName: "دعاء الاستغفار",
    category: "Forgiveness",
    arabic:
      "اللَّهُمَّ أَنْتَ رَبِّي لَا إِلَهَ إِلَّا أَنْتَ، خَلَقْتَنِي وَأَنَا عَبْدُكَ، وَأَنَا عَلَى عَهْدِكَ وَوَعْدِكَ مَا اسْتَطَعْتُ، أَعُوذُ بِكَ مِنْ شَرِّ مَا صَنَعْتُ، أَبُوءُ لَكَ بِنِعْمَتِكَ عَلَيَّ، وَأَبُوءُ بِذَنْبِي فَاغْفِرْ لِي فَإِنَّهُ لَا يَغْفِرُ الذُّنُوبَ إِلَّا أَنْتَ",
    transliteration:
      "Allahumma anta Rabbi la ilaha illa anta, khalaqtani wa ana abduka, wa ana 'ala ahdika wa wa'dika mastata'tu, a'udhu bika min sharri ma sana'tu, abu'u laka bini'matika 'alayya, wa abu'u bidhanbi faghfir li fa innahu la yaghfirudh-dhunuba illa anta",
    translation:
      "O Allah, You are my Lord, there is none worthy of worship but You. You created me and I am Your slave. I keep my covenant and my pledge to You as far as I am able. I seek refuge in You from the evil of what I have done. I acknowledge Your blessings upon me, and I acknowledge my sins, so forgive me, for there is none who can forgive sins except You.",
    reference: "Bukhari",
  },
  {
    id: 13,
    name: "For Protection",
    arabicName: "دعاء الحفظ",
    category: "Protection",
    arabic: "بِسْمِ اللَّهِ الَّذِي لَا يَضُرُّ مَعَ اسْمِهِ شَيْءٌ فِي الْأَرْضِ وَلَا فِي السَّمَاءِ وَهُوَ السَّمِيعُ الْعَلِيمُ",
    transliteration: "Bismillahil-ladhi la yadurru ma'asmihi shay'un fil-ardi wa la fis-sama'i, wa huwas-Sami'ul-'Alim",
    translation:
      "In the name of Allah, with whose name nothing can cause harm on earth or in the heavens, and He is the All-Hearing, the All-Knowing.",
    reference: "Abu Dawud, Tirmidhi",
  },
  {
    id: 14,
    name: "For Healing",
    arabicName: "دعاء الشفاء",
    category: "Healing",
    arabic: "اللَّهُمَّ رَبَّ النَّاسِ، أَذْهِبِ الْبَاسَ، اشْفِ أَنْتَ الشَّافِي، لَا شِفَاءَ إِلَّا شِفَاؤُكَ، شِفَاءً لَا يُغَادِرُ سَقَمًا",
    transliteration:
      "Allahumma Rabban-nas, adhhibil-ba's, ishfi antash-Shafi, la shifa'a illa shifa'uka, shifa'an la yughadiru saqama",
    translation:
      "O Allah, Lord of mankind, remove the harm and heal, You are the Healer, there is no healing except Your healing, a healing that leaves no illness behind.",
    reference: "Bukhari, Muslim",
  },
  {
    id: 15,
    name: "For Success",
    arabicName: "دعاء النجاح",
    category: "Success",
    arabic: "اللَّهُمَّ لَا سَهْلَ إِلَّا مَا جَعَلْتَهُ سَهْلًا، وَأَنْتَ تَجْعَلُ الْحَزْنَ إِذَا شِئْتَ سَهْلًا",
    transliteration: "Allahumma la sahla illa ma ja'altahu sahla, wa anta taj'alul-hazna idha shi'ta sahla",
    translation: "O Allah, there is no ease except what You make easy, and You make the difficulty easy if You wish.",
    reference: "Ibn Hibban",
  },
]

