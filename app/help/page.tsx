"use client"

import type React from "react"

import { useState, useRef } from "react"
import { motion } from "framer-motion"
import {
  Mail,
  MessageSquare,
  HelpCircle,
  ExternalLink,
  Search,
  Book,
  FileText,
  Settings,
  Bookmark,
  Moon,
  ChevronRight,
  Star,
  Heart,
  Sparkles,
} from "lucide-react"
import { Input } from "@/components/ui/input"
import { Button } from "@/components/ui/button"
import { Accordion, AccordionContent, AccordionItem, AccordionTrigger } from "@/components/ui/accordion"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { useTheme } from "@/providers/theme-provider"
import { AnimatedCard, AnimatedCardContent, AnimatedCardHeader, AnimatedCardTitle } from "@/components/ui/animated-card"

// FAQ data
const faqs = [
  {
    question: "How do I change the app language?",
    answer:
      "You can change the app language in Settings > Language & Translation > App Language. Select your preferred language from the dropdown menu and the app interface will update automatically.",
    category: "settings",
  },
  {
    question: "How do I download surahs for offline reading?",
    answer:
      "To download surahs for offline reading, navigate to the Surah page, select the surah you want to download, and click the download icon in the top right corner. Downloaded surahs will be available even when you're offline.",
    category: "surah",
  },
  {
    question: "Can I listen to Quran recitations?",
    answer:
      "Yes, you can listen to Quran recitations. When viewing a surah, click the play button to start the audio recitation. You can choose different reciters in the Settings > Audio section.",
    category: "surah",
  },
  {
    question: "How do I set prayer time notifications?",
    answer:
      "Prayer time notifications can be configured in Settings > Notifications & Audio > Prayer Time Reminders. You can customize when you receive notifications before each prayer time.",
    category: "settings",
  },
  {
    question: "How do I bookmark verses?",
    answer:
      "To bookmark a verse, click the bookmark icon next to the verse you want to bookmark. You can view all your bookmarks in the Bookmarks section accessible from the sidebar.",
    category: "bookmarks",
  },
  {
    question: "How do I download duas as MP3?",
    answer:
      "When viewing a dua, click the download button in the top right corner. This will download the audio recitation of the dua in MP3 format to your device.",
    category: "dua",
  },
  {
    question: "Can I customize the theme and appearance?",
    answer:
      "Yes, you can customize the app's appearance in Settings > Appearance. You can switch between light and dark themes, adjust font sizes, and more to personalize your reading experience.",
    category: "settings",
  },
  {
    question: "How do I track my reading progress?",
    answer:
      "Your reading progress is automatically tracked as you read. You can view your progress on the Dashboard, which shows which surahs you've read and your overall Quran completion percentage.",
    category: "dashboard",
  },
  {
    question: "What is auto-scroll and how do I use it?",
    answer:
      "Auto-scroll automatically scrolls the page while audio is playing. You can enable this feature in Settings > Reading Preferences > Auto-Scroll. When enabled, the page will scroll automatically during audio playback.",
    category: "settings",
  },
  {
    question: "How do I find a specific surah or dua?",
    answer:
      "Use the search bar at the top of the Surah or Dua pages to find specific content. You can search by name, translation, or keywords related to the content you're looking for.",
    category: "general",
  },
]

// Features data
const features = [
  {
    title: "Quran Reading",
    description: "Read the Quran with translations and transliterations in a beautiful, easy-to-use interface.",
    icon: Book,
    color: "bg-blue-500",
  },
  {
    title: "Dua Collection",
    description: "Access a comprehensive collection of duas for various occasions and needs.",
    icon: FileText,
    color: "bg-green-500",
  },
  {
    title: "Audio Recitations",
    description: "Listen to beautiful recitations of the Quran and duas by renowned reciters.",
    icon: MessageSquare,
    color: "bg-purple-500",
  },
  {
    title: "Bookmarks",
    description: "Save your favorite surahs, ayahs, and duas for quick access later.",
    icon: Bookmark,
    color: "bg-amber-500",
  },
  {
    title: "Dark Mode",
    description: "Comfortable reading experience in any lighting condition with light and dark themes.",
    icon: Moon,
    color: "bg-indigo-500",
  },
  {
    title: "Customization",
    description: "Personalize your experience with font size adjustments, language options, and more.",
    icon: Settings,
    color: "bg-rose-500",
  },
]

// Testimonials data
const testimonials = [
  {
    name: "Ahmed K.",
    text: "Ramdhane has transformed my daily Quran reading experience. The interface is beautiful and the features are exactly what I needed.",
    avatar: "A",
    rating: 5,
  },
  {
    name: "Fatima S.",
    text: "I love the dua collection and how easy it is to find and bookmark my favorites. The audio quality is excellent too!",
    avatar: "F",
    rating: 5,
  },
  {
    name: "Omar J.",
    text: "The dark mode and font size options make reading so comfortable. This is now my go-to app for Quran and duas.",
    avatar: "O",
    rating: 4,
  },
]

export default function HelpPage() {
  const [searchQuery, setSearchQuery] = useState("")
  const [activeCategory, setActiveCategory] = useState<string | null>(null)
  const [activeTab, setActiveTab] = useState("all")
  const { theme } = useTheme()
  const featuresRef = useRef<HTMLDivElement>(null)

  const scrollToFeatures = () => {
    featuresRef.current?.scrollIntoView({ behavior: "smooth" })
  }

  const filteredFaqs = faqs.filter((faq) => {
    const matchesSearch =
      faq.question.toLowerCase().includes(searchQuery.toLowerCase()) ||
      faq.answer.toLowerCase().includes(searchQuery.toLowerCase())

    const matchesCategory = activeCategory ? faq.category === activeCategory : true
    const matchesTab = activeTab === "all" ? true : faq.category === activeTab

    return matchesSearch && matchesCategory && matchesTab
  })

  return (
    <div className="p-6 max-w-6xl mx-auto">
      {/* Hero Section */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5 }}
        className="relative overflow-hidden rounded-3xl bg-gradient-to-br from-primary/20 to-primary/5 p-8 mb-12 border"
      >
        <div className="absolute inset-0 bg-grid-pattern opacity-5" />
        <div className="relative z-10">
          <div className="flex flex-col md:flex-row items-center justify-between gap-8">
            <div className="text-center md:text-left">
              <h1 className="text-4xl md:text-5xl font-bold mb-4">Welcome to Ramdhane Help Center</h1>
              <p className="text-xl text-muted-foreground mb-6 max-w-2xl">
                Find answers to common questions, explore features, and get the most out of your Ramdhane experience.
              </p>
              <div className="flex flex-col sm:flex-row gap-4 justify-center md:justify-start">
                <Button size="lg" onClick={scrollToFeatures}>
                  Explore Features
                  <ChevronRight className="ml-2 h-4 w-4" />
                </Button>
                <Button size="lg" variant="outline">
                  Watch Tutorial
                  <ExternalLink className="ml-2 h-4 w-4" />
                </Button>
              </div>
            </div>
            <div className="hidden md:block">
              <div className="relative">
                <motion.div
                  initial={{ scale: 0.8, opacity: 0 }}
                  animate={{ scale: 1, opacity: 1 }}
                  transition={{ delay: 0.3, duration: 0.5 }}
                  className="w-64 h-64 rounded-full bg-primary/20 flex items-center justify-center"
                >
                  <HelpCircle className="h-32 w-32 text-primary/60" />
                </motion.div>
                <motion.div
                  animate={{
                    y: [0, -10, 0],
                    rotate: [0, 5, 0, -5, 0],
                  }}
                  transition={{
                    repeat: Number.POSITIVE_INFINITY,
                    duration: 5,
                    ease: "easeInOut",
                  }}
                  className="absolute top-0 right-0"
                >
                  <Sparkles className="h-8 w-8 text-primary" />
                </motion.div>
                <motion.div
                  animate={{
                    y: [0, 10, 0],
                    rotate: [0, -5, 0, 5, 0],
                  }}
                  transition={{
                    repeat: Number.POSITIVE_INFINITY,
                    duration: 4,
                    ease: "easeInOut",
                    delay: 1,
                  }}
                  className="absolute bottom-0 left-0"
                >
                  <Star className="h-8 w-8 text-amber-500" />
                </motion.div>
              </div>
            </div>
          </div>
        </div>
      </motion.div>

      {/* Search Section */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.3, delay: 0.1 }}
        className="relative mb-12"
      >
        <div className="max-w-2xl mx-auto">
          <div className="relative">
            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-muted-foreground h-5 w-5" />
            <Input
              placeholder="Search for help..."
              className="pl-10 py-6 text-lg rounded-xl"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
            />
          </div>
          <div className="flex flex-wrap gap-2 mt-4 justify-center">
            <Badge
              variant={activeCategory === null ? "default" : "outline"}
              className="cursor-pointer px-3 py-1 text-sm"
              onClick={() => setActiveCategory(null)}
            >
              All Topics
            </Badge>
            {Array.from(new Set(faqs.map((faq) => faq.category))).map((category) => (
              <Badge
                key={category}
                variant={activeCategory === category ? "default" : "outline"}
                className="cursor-pointer px-3 py-1 text-sm"
                onClick={() => setActiveCategory(category)}
              >
                {category.charAt(0).toUpperCase() + category.slice(1)}
              </Badge>
            ))}
          </div>
        </div>
      </motion.div>

      {/* Features Section */}
      <motion.div
        ref={featuresRef}
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.3, delay: 0.2 }}
        className="mb-16"
      >
        <div className="text-center mb-10">
          <h2 className="text-3xl font-bold mb-4">Key Features</h2>
          <p className="text-muted-foreground max-w-2xl mx-auto">
            Discover all the powerful features that make Ramdhane the perfect companion for your spiritual journey.
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {features.map((feature, index) => (
            <motion.div
              key={feature.title}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.3, delay: 0.1 + index * 0.1 }}
            >
              <AnimatedCard>
                <AnimatedCardHeader className="pb-2">
                  <div
                    className={`w-12 h-12 rounded-lg ${feature.color} flex items-center justify-center text-white mb-4`}
                  >
                    <feature.icon className="h-6 w-6" />
                  </div>
                  <AnimatedCardTitle className="text-xl">{feature.title}</AnimatedCardTitle>
                </AnimatedCardHeader>
                <AnimatedCardContent>
                  <p className="text-muted-foreground">{feature.description}</p>
                </AnimatedCardContent>
              </AnimatedCard>
            </motion.div>
          ))}
        </div>
      </motion.div>

      {/* Testimonials Section */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.3, delay: 0.3 }}
        className="mb-16"
      >
        <div className="text-center mb-10">
          <h2 className="text-3xl font-bold mb-4">What Users Say</h2>
          <p className="text-muted-foreground max-w-2xl mx-auto">
            Join thousands of satisfied users who have enhanced their spiritual journey with Ramdhane.
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          {testimonials.map((testimonial, index) => (
            <motion.div
              key={testimonial.name}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.3, delay: 0.1 + index * 0.1 }}
              className="h-full"
            >
              <AnimatedCard className="h-full">
                <AnimatedCardHeader>
                  <div className="flex items-center gap-3">
                    <div className="w-10 h-10 rounded-full bg-primary/20 text-primary flex items-center justify-center font-bold">
                      {testimonial.avatar}
                    </div>
                    <div>
                      <AnimatedCardTitle className="text-lg">{testimonial.name}</AnimatedCardTitle>
                      <div className="flex mt-1">
                        {Array(5)
                          .fill(0)
                          .map((_, i) => (
                            <Star
                              key={i}
                              className={`h-4 w-4 ${i < testimonial.rating ? "text-amber-500 fill-amber-500" : "text-muted-foreground"}`}
                            />
                          ))}
                      </div>
                    </div>
                  </div>
                </AnimatedCardHeader>
                <AnimatedCardContent>
                  <p className="text-muted-foreground italic">"{testimonial.text}"</p>
                </AnimatedCardContent>
              </AnimatedCard>
            </motion.div>
          ))}
        </div>
      </motion.div>

      {/* FAQ Section */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.3, delay: 0.4 }}
        className="mb-16"
      >
        <div className="text-center mb-10">
          <h2 className="text-3xl font-bold mb-4">Frequently Asked Questions</h2>
          <p className="text-muted-foreground max-w-2xl mx-auto">
            Find answers to the most common questions about using Ramdhane.
          </p>
        </div>

        <Tabs defaultValue="all" value={activeTab} onValueChange={setActiveTab} className="w-full max-w-4xl mx-auto">
          <TabsList className="grid w-full grid-cols-5 mb-8">
            <TabsTrigger value="all">All Questions</TabsTrigger>
            <TabsTrigger value="surah">Surah & Quran</TabsTrigger>
            <TabsTrigger value="dua">Duas</TabsTrigger>
            <TabsTrigger value="settings">Settings</TabsTrigger>
            <TabsTrigger value="bookmarks">Bookmarks</TabsTrigger>
          </TabsList>

          <TabsContent value={activeTab} className="space-y-4">
            <Accordion type="single" collapsible className="w-full">
              {filteredFaqs.map((faq, index) => (
                <AccordionItem
                  key={index}
                  value={`item-${index}`}
                  className="border rounded-lg px-2 mb-4 overflow-hidden"
                >
                  <AccordionTrigger className="text-left py-4 hover:no-underline">
                    <div className="flex items-start gap-3">
                      <div className="w-6 h-6 rounded-full bg-primary/10 text-primary flex items-center justify-center mt-0.5">
                        <HelpCircle className="h-3.5 w-3.5" />
                      </div>
                      <span className="font-medium">{faq.question}</span>
                    </div>
                  </AccordionTrigger>
                  <AccordionContent className="pl-9 pb-4">
                    <p className="text-muted-foreground">{faq.answer}</p>
                  </AccordionContent>
                </AccordionItem>
              ))}
            </Accordion>

            {filteredFaqs.length === 0 && (
              <div className="text-center py-10 border rounded-lg">
                <HelpCircle className="h-12 w-12 mx-auto text-muted-foreground mb-4" />
                <h3 className="text-lg font-medium mb-2">No results found</h3>
                <p className="text-muted-foreground max-w-md mx-auto">
                  Try searching with different keywords or select a different category
                </p>
              </div>
            )}
          </TabsContent>
        </Tabs>
      </motion.div>

      {/* Contact Section */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.3, delay: 0.5 }}
        className="mb-8"
      >
        <div className="text-center mb-10">
          <h2 className="text-3xl font-bold mb-4">Still Need Help?</h2>
          <p className="text-muted-foreground max-w-2xl mx-auto">
            Our support team is ready to assist you with any questions or issues you may have.
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 max-w-4xl mx-auto">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.3, delay: 0.6 }}
          >
            <AnimatedCard>
              <AnimatedCardHeader className="pb-3">
                <div className="w-12 h-12 rounded-full bg-primary/10 text-primary flex items-center justify-center mb-4">
                  <MessageSquare className="h-6 w-6" />
                </div>
                <AnimatedCardTitle className="flex items-center">Contact Support</AnimatedCardTitle>
              </AnimatedCardHeader>
              <AnimatedCardContent>
                <p className="text-sm text-muted-foreground mb-4">
                  Need personalized help? Our support team is ready to assist you.
                </p>
                <Button className="w-full">
                  <MessageSquare className="h-4 w-4 mr-2" />
                  Start Chat
                </Button>
              </AnimatedCardContent>
            </AnimatedCard>
          </motion.div>

          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.3, delay: 0.7 }}
          >
            <AnimatedCard>
              <AnimatedCardHeader className="pb-3">
                <div className="w-12 h-12 rounded-full bg-primary/10 text-primary flex items-center justify-center mb-4">
                  <Mail className="h-6 w-6" />
                </div>
                <AnimatedCardTitle className="flex items-center">Email Support</AnimatedCardTitle>
              </AnimatedCardHeader>
              <AnimatedCardContent>
                <p className="text-sm text-muted-foreground mb-4">
                  Send us an email and we'll get back to you within 24 hours.
                </p>
                <Button variant="outline" className="w-full">
                  <Mail className="h-4 w-4 mr-2" />
                  support@ramdhane.com
                </Button>
              </AnimatedCardContent>
            </AnimatedCard>
          </motion.div>

          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.3, delay: 0.8 }}
          >
            <AnimatedCard>
              <AnimatedCardHeader className="pb-3">
                <div className="w-12 h-12 rounded-full bg-primary/10 text-primary flex items-center justify-center mb-4">
                  <ExternalLink className="h-6 w-6" />
                </div>
                <AnimatedCardTitle className="flex items-center">Video Tutorials</AnimatedCardTitle>
              </AnimatedCardHeader>
              <AnimatedCardContent>
                <p className="text-sm text-muted-foreground mb-4">
                  Watch our video tutorials to learn how to use all features.
                </p>
                <Button variant="secondary" className="w-full">
                  <ExternalLink className="h-4 w-4 mr-2" />
                  Watch Tutorials
                </Button>
              </AnimatedCardContent>
            </AnimatedCard>
          </motion.div>
        </div>
      </motion.div>

      {/* Footer */}
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ duration: 0.5, delay: 0.9 }}
        className="text-center mt-16 pt-8 border-t"
      >
        <p className="text-muted-foreground">
          Ramdhane © {new Date().getFullYear()} • Made with <Heart className="inline-block h-4 w-4 text-red-500" /> for
          the Muslim community
        </p>
      </motion.div>
    </div>
  )
}

// Missing Badge component
function Badge({
  variant = "default",
  className,
  children,
  ...props
}: {
  variant?: "default" | "outline"
  className?: string
  children: React.ReactNode
  onClick?: () => void
}) {
  return (
    <span
      className={`inline-flex items-center rounded-full px-2.5 py-0.5 text-xs font-semibold transition-colors focus:outline-none focus:ring-2 focus:ring-ring focus:ring-offset-2 ${
        variant === "default"
          ? "bg-primary text-primary-foreground"
          : "border border-input bg-background hover:bg-muted"
      } ${className}`}
      {...props}
    >
      {children}
    </span>
  )
}

