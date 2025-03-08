"use client"

import { useState } from "react"
import { motion, AnimatePresence } from "framer-motion"
import { Star } from "lucide-react"
import { Button } from "@/components/ui/button"

// Collection of Islamic reminders/quotes
const reminders = [
  {
    arabic: "إِنَّمَا الْأَعْمَالُ بِالنِّيَّاتِ",
    transliteration: "Innamal a'malu bin-niyyat",
    translation: "Actions are judged by intentions.",
    source: "Sahih Bukhari",
  },
  {
    arabic: "الدِّينُ النَّصِيحَةُ",
    transliteration: "Ad-dinu nasihah",
    translation: "The religion is sincerity.",
    source: "Sahih Muslim",
  },
  {
    arabic: "لَا ضَرَرَ وَلَا ضِرَارَ",
    transliteration: "La darara wa la dirar",
    translation: "There should be neither harm nor reciprocating harm.",
    source: "Ibn Majah",
  },
  {
    arabic: "مَنْ حَسُنَ إِسْلَامُ الْمَرْءِ تَرْكُهُ مَا لَا يَعْنِيهِ",
    transliteration: "Man hasuna Islamu al-mar'i tarkuhu ma la ya'nihi",
    translation: "Part of the perfection of one's Islam is his leaving that which does not concern him.",
    source: "Tirmidhi",
  },
  {
    arabic: "الْمُسْلِمُ مَنْ سَلِمَ الْمُسْلِمُونَ مِنْ لِسَانِهِ وَيَدِهِ",
    transliteration: "Al-Muslimu man salimal-Muslimuna min lisanihi wa yadihi",
    translation: "A Muslim is the one from whose tongue and hands the Muslims are safe.",
    source: "Sahih Bukhari",
  },
  {
    arabic: "لَا يُؤْمِنُ أَحَدُكُمْ حَتَّى يُحِبَّ لِأَخِيهِ مَا يُحِبُّ لِنَفْسِهِ",
    transliteration: "La yu'minu ahadukum hatta yuhibba li-akhihi ma yuhibbu li-nafsihi",
    translation: "None of you truly believes until he loves for his brother what he loves for himself.",
    source: "Sahih Bukhari",
  },
  {
    arabic: "مَنْ صَامَ رَمَضَانَ إِيمَانًا وَاحْتِسَابًا غُفِرَ لَهُ مَا تَقَدَّمَ مِنْ ذَنْبِهِ",
    transliteration: "Man sama Ramadana imanan wahtisaban, ghufira lahu ma taqaddama min dhanbihi",
    translation:
      "Whoever fasts during Ramadan out of sincere faith and hoping to attain Allah's rewards, then all his past sins will be forgiven.",
    source: "Sahih Bukhari",
  },
  {
    arabic: "الصَّلَوَاتُ الْخَمْسُ، وَالْجُمْعَةُ إِلَى الْجُمْعَةِ، وَرَمَضَانُ إِلَى رَمَضَانَ، مُكَفِّرَاتٌ لِمَا بَيْنَهُنَّ",
    transliteration:
      "As-salawatul-khamsu, wal-Jumu'atu ilal-Jumu'ati, wa Ramadanu ila Ramadana, mukaffiratun lima baynahunna",
    translation:
      "The five daily prayers, from one Friday prayer to the next, and from one Ramadan to the next, are expiation for whatever (sins) are committed in between them.",
    source: "Sahih Muslim",
  },
]

export function IslamicReminders() {
  const [currentReminderIndex, setCurrentReminderIndex] = useState(0)
  const [isAnimating, setIsAnimating] = useState(false)

  const getNextReminder = () => {
    if (isAnimating) return

    setIsAnimating(true)
    setTimeout(() => {
      setCurrentReminderIndex((prevIndex) => (prevIndex + 1) % reminders.length)
      setIsAnimating(false)
    }, 300)
  }

  const currentReminder = reminders[currentReminderIndex]

  return (
    <div className="space-y-4">
      <div className="bg-gradient-to-br from-primary/5 to-primary/10 rounded-lg p-6 mb-4 border border-primary/10 shadow-inner min-h-[200px] flex flex-col items-center justify-center">
        <AnimatePresence mode="wait">
          <motion.div
            key={currentReminderIndex}
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -20 }}
            transition={{ duration: 0.3 }}
            className="text-center"
          >
            <p className="text-2xl font-arabic text-center mb-3">{currentReminder.arabic}</p>
            <p className="text-center text-muted-foreground mb-2">"{currentReminder.transliteration}"</p>
            <p className="text-center font-medium">"{currentReminder.translation}"</p>
            <p className="text-center text-sm text-muted-foreground mt-2">- {currentReminder.source}</p>
          </motion.div>
        </AnimatePresence>
      </div>

      <Button
        variant="outline"
        className="w-full group hover:bg-primary/5"
        onClick={getNextReminder}
        disabled={isAnimating}
      >
        <Star className={`mr-2 h-4 w-4 text-primary ${isAnimating ? "animate-spin" : "group-hover:animate-pulse"}`} />
        Get Another Reminder
      </Button>
    </div>
  )
}

