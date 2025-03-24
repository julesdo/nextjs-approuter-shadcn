"use client"

import type React from "react"

import { useState } from "react"
import { motion, AnimatePresence } from "framer-motion"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Card, CardContent } from "@/components/ui/card"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import {
  Loader2,
  ArrowRight,
  Globe,
  Lightbulb,
  Target,
  BarChart4,
  Users,
  Database,
  AlertTriangle,
  Activity,
  History,
} from "lucide-react"
import UxScore from "@/components/ux-score"
import RecommendationCard from "@/components/recommendation-card"
import PremiumUpsell from "@/components/premium-upsell"
import ValuePropositionAnalysis from "@/components/value-proposition-analysis"
import MarketAnalysis from "@/components/market-analysis"
import MarketDataCharts from "@/components/market-data-charts"
import DataSources from "@/components/data-sources"
import ExportPdfButton from "@/components/export-pdf-button"
import HeuristicAnalysis from "@/components/heuristic-analysis"
import UserJourneyMap from "@/components/user-journey-map"
import SavedAnalyses from "@/components/saved-analyses"
import UsageLimit from "@/components/usage-limit"
import { type SavedAnalysis, storageService } from "@/lib/storage-service"
import ContactForm from "@/components/contact-form"

interface AnalysisResult {
  uxScore: number
  detailedScores?: {
    clarity: number
    navigation: number
    accessibility: number
    performance: number
    mobileExperience: number
  }
  recommendations: {
    title: string
    description: string
    impact: "high" | "medium" | "low"
  }[]
  valueProposition: {
    current: string
    strength: string
    weakness: string
    improvement: string
    competitorComparison: string
  }
  marketAnalysis: {
    positioning: string
    competitors: string[]
    competitorDetails: {
      name: string
      url: string
      strengths: string
      weaknesses: string
      marketShare: number
    }[]
    trends: string[]
    conversionRate: {
      estimated: number
      industryAverage: number
      potential: number
      competitorAverage: number
    }
  }
  marketData: {
    industryGrowth: number
    userEngagement: number
    marketSize: number
    marketSizeUnit: string
    customerAcquisitionCost: {
      estimated: number
      industryAverage: number
      competitorAverage: number
    }
    keyMetrics: {
      name: string
      value: number
      benchmark: number
      unit: string
      source: string
    }[]
    sources: string[]
  }
  heuristicAnalysis?: {
    summary: {
      strengths: number
      improvements: number
      criticalIssues: number
    }
    principles: {
      principle: string
      status: "success" | "warning" | "error"
      description: string
      score: number
      details: string
      recommendations: string
    }[]
  }
  userJourney?: {
    journeySteps: {
      stage: string
      touchpoint: string
      userGoal: string
      userEmotion: "positive" | "neutral" | "negative"
      frictionPoints: string[]
      opportunities: string[]
    }[]
    criticalPoints: string[]
  }
}

// Données de démonstration pour les tests
const demoData: AnalysisResult = {
  uxScore: 72,
  detailedScores: {
    clarity: 65,
    navigation: 70,
    accessibility: 75,
    performance: 80,
    mobileExperience: 60,
  },
  recommendations: [
    {
      title: "Améliorer la clarté de la proposition de valeur",
      description:
        "La proposition de valeur actuelle manque de clarté. Rendez-la plus concise et visible en haut de la page d'accueil. Utilisez un langage simple et direct qui explique clairement les bénéfices pour l'utilisateur.",
      impact: "high",
    },
    {
      title: "Optimiser les appels à l'action",
      description:
        "Les CTA actuels ne sont pas assez visibles. Utilisez des couleurs contrastantes, augmentez leur taille et utilisez des textes plus incitatifs comme 'Commencer gratuitement' au lieu de 'S'inscrire'.",
      impact: "medium",
    },
    {
      title: "Simplifier la navigation",
      description:
        "La structure de navigation est complexe. Réduisez le nombre d'options dans le menu principal et utilisez une hiérarchie plus claire. Regroupez les éléments similaires et utilisez des sous-menus pour les options secondaires.",
      impact: "medium",
    },
  ],
  valueProposition: {
    current:
      "Votre proposition de valeur actuelle met l'accent sur les fonctionnalités plutôt que sur les bénéfices pour l'utilisateur.",
    strength: "Vous mentionnez clairement les caractéristiques techniques de votre produit/service.",
    weakness:
      "Le message ne communique pas efficacement comment votre solution résout les problèmes spécifiques de vos clients.",
    improvement:
      "Reformulez votre proposition en mettant l'accent sur les bénéfices concrets pour l'utilisateur. Utilisez la formule 'Nous aidons [cible] à [résoudre problème] grâce à [solution unique]'.",
    competitorComparison:
      "Vos concurrents ont des propositions de valeur plus orientées bénéfices et émotions, ce qui peut créer une connexion plus forte avec les visiteurs.",
  },
  marketAnalysis: {
    positioning:
      "Votre site se positionne dans le segment intermédiaire du marché, avec un accent sur la qualité et la fiabilité plutôt que sur le prix bas.",
    competitors: ["Concurrent A", "Concurrent B", "Concurrent C"],
    competitorDetails: [
      {
        name: "Concurrent A",
        url: "https://concurrenta.com",
        strengths:
          "Interface utilisateur intuitive et design moderne. Proposition de valeur claire dès la page d'accueil.",
        weaknesses: "Offre moins complète que la vôtre. Temps de chargement plus lent sur mobile.",
        marketShare: 35,
      },
      {
        name: "Concurrent B",
        url: "https://concurrentb.com",
        strengths: "Forte présence sur les réseaux sociaux. Excellente stratégie de contenu avec blog très actif.",
        weaknesses:
          "Navigation complexe. Processus d'inscription en plusieurs étapes qui peut décourager les utilisateurs.",
        marketShare: 25,
      },
      {
        name: "Concurrent C",
        url: "https://concurrentc.com",
        strengths: "Positionnement premium avec des témoignages clients très visibles. Excellente optimisation mobile.",
        weaknesses: "Prix plus élevés. Moins de fonctionnalités pour les utilisateurs débutants.",
        marketShare: 15,
      },
    ],
    trends: [
      "Augmentation de l'utilisation mobile (+18% cette année)",
      "Demande croissante pour des solutions personnalisables",
      "Importance grandissante de la confidentialité des données",
    ],
    conversionRate: {
      estimated: 2.3,
      industryAverage: 2.8,
      potential: 4.5,
      competitorAverage: 3.1,
    },
  },
  marketData: {
    industryGrowth: 7.5,
    userEngagement: 62,
    marketSize: 4.2,
    marketSizeUnit: "milliards €",
    customerAcquisitionCost: {
      estimated: 75,
      industryAverage: 65,
      competitorAverage: 60,
    },
    keyMetrics: [
      {
        name: "Taux de conversion moyen",
        value: 2.3,
        benchmark: 2.8,
        unit: "%",
        source: "Études sectorielles 2023",
      },
      {
        name: "Taux de rebond",
        value: 58,
        benchmark: 52,
        unit: "%",
        source: "Analyse comparative du secteur",
      },
      {
        name: "Valeur client moyenne",
        value: 320,
        benchmark: 280,
        unit: "€",
        source: "Rapport industrie Q2 2023",
      },
    ],
    sources: [
      "Rapport sectoriel 2023 - Cabinet d'analyse XYZ",
      "Étude comparative des sites web du secteur - Université de Marketing Digital",
      "Données agrégées de performance web - Google Analytics Benchmark",
    ],
  },
  heuristicAnalysis: {
    summary: {
      strengths: 5,
      improvements: 4,
      criticalIssues: 1,
    },
    principles: [
      {
        principle: "Visibilité de l'état du système",
        status: "success",
        score: 8,
        description: "L'état du système est généralement bien visible",
        details:
          "Les utilisateurs peuvent voir clairement les options disponibles et les actions en cours. Le système fournit un retour visuel approprié pour la plupart des interactions.",
        recommendations:
          "Ajouter des indicateurs de chargement pour les actions qui prennent du temps. Améliorer le feedback visuel pour les formulaires longs.",
      },
      {
        principle: "Correspondance entre le système et le monde réel",
        status: "warning",
        score: 6.5,
        description: "Le langage utilisé est en grande partie compréhensible",
        details:
          "Le site utilise un langage généralement compréhensible, mais certains termes techniques pourraient être simplifiés. Les métaphores visuelles sont parfois incohérentes avec les attentes des utilisateurs.",
        recommendations:
          "Simplifier la terminologie, surtout dans les sections techniques. Utiliser des métaphores visuelles plus intuitives et cohérentes avec les conventions du web.",
      },
      {
        principle: "Contrôle et liberté de l'utilisateur",
        status: "warning",
        score: 6,
        description: "Les utilisateurs ont un certain contrôle sur leurs actions",
        details:
          "Le site offre des options pour annuler certaines actions, mais pas toutes. Les utilisateurs peuvent parfois se sentir piégés dans un processus sans possibilité de retour en arrière.",
        recommendations:
          "Ajouter des options 'Annuler' et 'Retour' plus visibles. Permettre aux utilisateurs de sauvegarder leur progression dans les formulaires longs.",
      },
    ],
    heuristicScores: {
      visibility: 8,
      realWorldMatch: 6.5,
      userControl: 6,
      consistency: 8.5,
      errorPrevention: 5.5,
      recognition: 7.5,
      flexibility: 7,
      aesthetics: 8,
      errorRecovery: 5,
      help: 4,
    },
  },
  userJourney: {
    journeySteps: [
      {
        stage: "Découverte",
        touchpoint: "Page d'accueil",
        userGoal: "Comprendre rapidement l'offre et ses bénéfices",
        userEmotion: "neutral",
        frictionPoints: ["Proposition de valeur pas assez visible", "Trop d'informations concurrentes"],
        opportunities: ["Simplifier le message principal", "Ajouter une vidéo explicative courte"],
      },
      {
        stage: "Considération",
        touchpoint: "Page de fonctionnalités",
        userGoal: "Évaluer si le produit répond à ses besoins",
        userEmotion: "positive",
        frictionPoints: ["Navigation entre les fonctionnalités peu intuitive"],
        opportunities: ["Ajouter des cas d'usage concrets", "Améliorer la comparaison des offres"],
      },
      {
        stage: "Décision",
        touchpoint: "Page de tarification",
        userGoal: "Comprendre les options et choisir la plus adaptée",
        userEmotion: "negative",
        frictionPoints: ["Structure de prix complexe", "Avantages des différentes offres pas assez clairs"],
        opportunities: ["Simplifier la grille tarifaire", "Ajouter un guide de sélection interactif"],
      },
    ],
    criticalPoints: [
      "La transition entre la découverte et la considération manque de fluidité",
      "Le processus d'inscription demande trop d'informations trop tôt",
      "Les utilisateurs mobiles abandonnent souvent à l'étape de paiement",
    ],
  },
}

export default function Home() {
  const [url, setUrl] = useState("")
  const [isAnalyzing, setIsAnalyzing] = useState(false)
  const [analysisStage, setAnalysisStage] = useState<string | null>(null)
  const [result, setResult] = useState<AnalysisResult | null>(null)
  const [error, setError] = useState<string | null>(null)
  const [activeTab, setActiveTab] = useState("ux")
  const [useDemoData, setUseDemoData] = useState(false)
  const [showHistory, setShowHistory] = useState(false)

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()

    if (!url) {
      setError("Veuillez entrer une URL valide")
      return
    }

    // Vérifier la limite d'utilisation
    const { canAnalyze } = storageService.checkUsageLimit()
    if (!canAnalyze && !useDemoData) {
      setError("Vous avez atteint votre limite quotidienne d'analyses. Utilisez le mode démo ou revenez demain.")
      return
    }

    try {
      setIsAnalyzing(true)
      setError(null)
      setActiveTab("ux")
      setShowHistory(false)

      // Validate URL format
      try {
        new URL(url)
      } catch (urlError) {
        throw new Error("L'URL saisie n'est pas valide. Veuillez entrer une URL complète (ex: https://example.com)")
      }

      // Simulate the different stages of analysis
      const stages = [
        "Analyse du site web...",
        "Recherche des concurrents...",
        "Collecte des données de marché...",
        "Analyse UX heuristique...",
        "Analyse du parcours utilisateur...",
        "Génération de l'analyse complète...",
      ]

      for (const stage of stages) {
        setAnalysisStage(stage)
        // Wait a bit between stages to show progress
        await new Promise((resolve) => setTimeout(resolve, 1000))
      }

      // Si l'option de démo est activée, utiliser les données de démo
      if (useDemoData) {
        setResult(demoData)
        return
      }

      try {
        // Utiliser fetch avec l'option text() au lieu de json() pour gérer les erreurs de parsing
        const response = await fetch("/api/analyse", {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify({ url }),
        })

        // Récupérer le texte brut de la réponse
        const responseText = await response.text()

        // Vérifier si la réponse est un JSON valide
        let data
        try {
          data = JSON.parse(responseText)
        } catch (parseError) {
          console.error("Erreur de parsing JSON:", parseError)
          console.error("Réponse brute:", responseText.substring(0, 200))

          // Si la réponse contient "Internal Server Error", c'est une erreur serveur
          if (responseText.includes("Internal Server Error") || !response.ok) {
            throw new Error(`Erreur serveur: ${response.status}. Veuillez réessayer plus tard.`)
          } else {
            throw new Error("La réponse du serveur n'est pas un JSON valide. Veuillez réessayer.")
          }
        }

        // Vérifier si la réponse contient une erreur
        if (data.error) {
          throw new Error(data.error)
        }

        // Vérifier que la réponse contient les données attendues
        if (!data.uxScore || !data.recommendations || !data.valueProposition) {
          console.error("Données incomplètes:", data)
          throw new Error("La réponse de l'API est incomplète ou mal formatée")
        }

        // Incrémenter le compteur d'utilisation
        storageService.incrementUsage()

        // Sauvegarder l'analyse
        storageService.saveAnalysis(url, data)

        setResult(data)
      } catch (fetchError) {
        console.error("Fetch error:", fetchError)

        // En cas d'erreur, utiliser les données de démo
        console.log("Utilisation des données de démo suite à une erreur")
        setResult(demoData)

        // Sauvegarder quand même l'analyse avec les données de démo
        storageService.saveAnalysis(url, demoData)

        // Afficher un message d'erreur mais continuer avec les données de démo
        setError(
          `Note: Utilisation de données de démonstration suite à une erreur: ${fetchError instanceof Error ? fetchError.message : "Erreur inconnue"}`,
        )
      }
    } catch (err) {
      if (err instanceof Error) {
        setError(err.message)
      } else {
        setError("Une erreur est survenue lors de l'analyse. Veuillez réessayer.")
      }
      console.error("Submit error:", err)
    } finally {
      setIsAnalyzing(false)
      setAnalysisStage(null)
    }
  }

  const handleSelectSavedAnalysis = (analysis: SavedAnalysis) => {
    setUrl(analysis.url)
    setResult(analysis.result)
    setShowHistory(false)
  }

  const fadeIn = {
    hidden: { opacity: 0, y: 20 },
    visible: { opacity: 1, y: 0 },
  }

  // Fonction pour créer un nom de fichier sécurisé à partir de l'URL
  const getSafeFileName = (urlString: string) => {
    try {
      const domain = new URL(urlString).hostname.replace("www.", "")
      return `rapport-${domain.replace(/[^a-z0-9]/gi, "-")}`
    } catch {
      return "rapport-analyse"
    }
  }

  return (
    <main className="min-h-screen bg-hyppe-background p-4 md:p-8">
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5 }}
        className="max-w-6xl mx-auto"
      >
        <header className="flex flex-col md:flex-row justify-between items-center mb-8 md:mb-12">
          <div className="flex items-center gap-2 mb-4 md:mb-0">
            <motion.h1
              className="text-3xl md:text-4xl font-bold text-black ml-2"
              initial={{ opacity: 0, scale: 0.9 }}
              animate={{ opacity: 1, scale: 1 }}
              transition={{ duration: 0.5 }}
            >
              Scoriz
            </motion.h1>
            by{" "}
            <img src="/logo.png" alt="Hyppe" className="h-8 w-auto ml-2" />
          </div>
          <motion.div
            className="flex space-x-2"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 0.3 }}
          >
            <Button variant="outline" className="flex items-center gap-2" onClick={() => setShowHistory(!showHistory)}>
              <History className="h-4 w-4" />
              <span>Historique</span>
            </Button>
            <ContactForm />
          </motion.div>
        </header>

        <motion.p
          className="text-lg md:text-xl text-gray-700 max-w-3xl mx-auto text-center mb-8"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ duration: 0.5, delay: 0.2 }}
        >
          Scoriz génère une analyse stratégique qui révèle le potentiel de votre business.
        </motion.p>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
          <div className="md:col-span-2">
            <Card className="bg-white/50 backdrop-blur-sm border border-gray-200 shadow-sm">
              <CardContent className="p-6">
                <form onSubmit={handleSubmit} className="space-y-4">
                  <div className="flex flex-col gap-4">
                    <div className="flex-1">
                      <Input
                        type="url"
                        placeholder="https://votre-site.com"
                        value={url}
                        onChange={(e) => setUrl(e.target.value)}
                        className="w-full h-12 text-lg bg-white border-gray-300"
                        disabled={isAnalyzing}
                      />
                      <div className="flex items-center mt-2">
                        <input
                          type="checkbox"
                          id="useDemoData"
                          checked={useDemoData}
                          onChange={(e) => setUseDemoData(e.target.checked)}
                          className="mr-2"
                        />
                        <label htmlFor="useDemoData" className="text-sm text-gray-600">
                          Utiliser des données de démonstration (pour tester sans API)
                        </label>
                      </div>
                      {error && (
                        <div className="flex items-center gap-2 text-red-500 text-sm mt-2">
                          <AlertTriangle className="h-4 w-4" />
                          <p>{error}</p>
                        </div>
                      )}
                    </div>
                    <Button
                      type="submit"
                      className="h-12 px-6 text-lg bg-hyppe-lime hover:bg-hyppe-lime/90 text-black"
                      disabled={isAnalyzing}
                    >
                      {isAnalyzing ? (
                        <>
                          <Loader2 className="mr-2 h-5 w-5 animate-spin" />
                          Analyse en cours...
                        </>
                      ) : (
                        <>
                          Analyser ma page
                          <ArrowRight className="ml-2 h-5 w-5" />
                        </>
                      )}
                    </Button>
                  </div>
                </form>
              </CardContent>
            </Card>
          </div>

          <div className="md:col-span-1">
            <UsageLimit />
          </div>
        </div>

        <AnimatePresence>
          {showHistory && (
            <motion.div
              initial={{ opacity: 0, height: 0 }}
              animate={{ opacity: 1, height: "auto" }}
              exit={{ opacity: 0, height: 0 }}
              className="mb-8 overflow-hidden"
            >
              <SavedAnalyses onSelectAnalysis={handleSelectSavedAnalysis} />
            </motion.div>
          )}
        </AnimatePresence>

        {isAnalyzing && (
          <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="text-center py-12">
            <div className="relative">
              <motion.div
                animate={{
                  scale: [1, 1.1, 1],
                  rotate: [0, 0, 0],
                }}
                transition={{
                  duration: 2,
                  repeat: Number.POSITIVE_INFINITY,
                  repeatType: "loop",
                }}
              >
                <Loader2 className="h-16 w-16 animate-spin mx-auto mb-6 text-hyppe-purple" />
              </motion.div>
              <motion.div
                className="absolute inset-0 rounded-full"
                animate={{
                  boxShadow: ["0 0 0 0 rgba(149, 102, 255, 0.4)", "0 0 0 20px rgba(149, 102, 255, 0)"],
                }}
                transition={{
                  duration: 1.5,
                  repeat: Number.POSITIVE_INFINITY,
                  repeatType: "loop",
                }}
              />
            </div>
            <motion.p
              className="text-xl font-medium text-gray-800"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ delay: 0.3 }}
            >
              {analysisStage || "Analyse approfondie en cours..."}
            </motion.p>
            <motion.div
              className="max-w-md mx-auto mt-4 space-y-2"
              initial="hidden"
              animate="visible"
              variants={{
                visible: {
                  transition: {
                    staggerChildren: 0.3,
                  },
                },
              }}
            >
              {analysisStage === "Analyse du site web..." && (
                <motion.div variants={fadeIn} className="flex items-center justify-center gap-2 text-hyppe-purple">
                  <Globe className="h-5 w-5" />
                  <span>Extraction du contenu et détermination du secteur...</span>
                </motion.div>
              )}

              {analysisStage === "Recherche des concurrents..." && (
                <motion.div variants={fadeIn} className="flex items-center justify-center gap-2 text-hyppe-purple">
                  <Users className="h-5 w-5" />
                  <span>Identification des concurrents principaux...</span>
                </motion.div>
              )}

              {analysisStage === "Collecte des données de marché..." && (
                <motion.div variants={fadeIn} className="flex items-center justify-center gap-2 text-hyppe-purple">
                  <Database className="h-5 w-5" />
                  <span>Récupération des statistiques et tendances du marché...</span>
                </motion.div>
              )}

              {analysisStage === "Analyse UX heuristique..." && (
                <motion.div variants={fadeIn} className="flex items-center justify-center gap-2 text-hyppe-purple">
                  <Activity className="h-5 w-5" />
                  <span>Évaluation selon les principes de Nielsen...</span>
                </motion.div>
              )}

              {analysisStage === "Analyse du parcours utilisateur..." && (
                <motion.div variants={fadeIn} className="flex items-center justify-center gap-2 text-hyppe-purple">
                  <Users className="h-5 w-5" />
                  <span>Cartographie du parcours et points de friction...</span>
                </motion.div>
              )}

              {analysisStage === "Génération de l'analyse complète..." && (
                <motion.div variants={fadeIn} className="flex items-center justify-center gap-2 text-hyppe-purple">
                  <BarChart4 className="h-5 w-5" />
                  <span>Création du rapport d'analyse avec recommandations...</span>
                </motion.div>
              )}
            </motion.div>
          </motion.div>
        )}

        {result && !isAnalyzing && (
          <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ duration: 0.5 }}>
            <div className="mb-8">
              <div className="flex justify-between items-center mb-6">
                <motion.h2
                  className="text-2xl md:text-3xl font-bold"
                  initial={{ opacity: 0, y: -20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ duration: 0.5 }}
                >
                  Rapport d'analyse complet
                </motion.h2>

                <ExportPdfButton
                  contentId="report-content"
                  fileName={getSafeFileName(url)}
                  setActiveTab={setActiveTab}
                />
              </div>

              <div id="report-content">
                <Tabs value={activeTab} onValueChange={setActiveTab} className="w-full">
                  <TabsList className="grid grid-cols-2 md:grid-cols-6 gap-2 mb-8 bg-white/50 p-1 rounded-lg">
                    <TabsTrigger
                      value="ux"
                      className="flex items-center gap-2 data-[state=active]:bg-hyppe-lime data-[state=active]:text-black"
                    >
                      <Target className="h-4 w-4" />
                      <span>UX Score</span>
                    </TabsTrigger>
                    <TabsTrigger
                      value="heuristic"
                      className="flex items-center gap-2 data-[state=active]:bg-hyppe-lime data-[state=active]:text-black"
                    >
                      <Activity className="h-4 w-4" />
                      <span>Analyse UX</span>
                    </TabsTrigger>
                    <TabsTrigger
                      value="journey"
                      className="flex items-center gap-2 data-[state=active]:bg-hyppe-lime data-[state=active]:text-black"
                    >
                      <Users className="h-4 w-4" />
                      <span>Parcours</span>
                    </TabsTrigger>
                    <TabsTrigger
                      value="value"
                      className="flex items-center gap-2 data-[state=active]:bg-hyppe-lime data-[state=active]:text-black"
                    >
                      <Lightbulb className="h-4 w-4" />
                      <span>Proposition</span>
                    </TabsTrigger>
                    <TabsTrigger
                      value="market"
                      className="flex items-center gap-2 data-[state=active]:bg-hyppe-lime data-[state=active]:text-black"
                    >
                      <Globe className="h-4 w-4" />
                      <span>Marché</span>
                    </TabsTrigger>
                    <TabsTrigger
                      value="data"
                      className="flex items-center gap-2 data-[state=active]:bg-hyppe-lime data-[state=active]:text-black"
                    >
                      <BarChart4 className="h-4 w-4" />
                      <span>Données</span>
                    </TabsTrigger>
                  </TabsList>

                  <AnimatePresence mode="wait">
                    <TabsContent value="ux" className="mt-0">
                      <motion.div
                        key="ux"
                        initial={{ opacity: 0, x: -20 }}
                        animate={{ opacity: 1, x: 0 }}
                        exit={{ opacity: 0, x: 20 }}
                        transition={{ duration: 0.3 }}
                        id="ux-score-section"
                      >
                        <div className="mb-8">
                          <UxScore score={result.uxScore} detailedScores={result.detailedScores} />
                        </div>

                        <div className="mb-12" id="recommendations-section">
                          <h3 className="text-xl font-semibold mb-4">
                            Recommandations pour améliorer votre conversion
                          </h3>
                          <div className="space-y-4">
                            {result.recommendations.map((recommendation, index) => (
                              <RecommendationCard key={index} recommendation={recommendation} index={index} />
                            ))}
                          </div>
                        </div>
                      </motion.div>
                    </TabsContent>

                    <TabsContent value="heuristic" className="mt-0">
                      <motion.div
                        key="heuristic"
                        initial={{ opacity: 0, x: -20 }}
                        animate={{ opacity: 1, x: 0 }}
                        exit={{ opacity: 0, x: 20 }}
                        transition={{ duration: 0.3 }}
                        id="heuristic-analysis-section"
                      >
                        {result.heuristicAnalysis ? (
                          <HeuristicAnalysis heuristicAnalysis={result.heuristicAnalysis as any} />
                        ) : (
                          <Card className="p-6 text-center bg-white/50 backdrop-blur-sm">
                            <p className="text-gray-500">Analyse heuristique non disponible</p>
                          </Card>
                        )}
                      </motion.div>
                    </TabsContent>

                    <TabsContent value="journey" className="mt-0">
                      <motion.div
                        key="journey"
                        initial={{ opacity: 0, x: -20 }}
                        animate={{ opacity: 1, x: 0 }}
                        exit={{ opacity: 0, x: 20 }}
                        transition={{ duration: 0.3 }}
                        id="user-journey-section"
                      >
                        {result.userJourney ? (
                          <UserJourneyMap userJourney={result.userJourney} />
                        ) : (
                          <Card className="p-6 text-center bg-white/50 backdrop-blur-sm">
                            <p className="text-gray-500">Analyse du parcours utilisateur non disponible</p>
                          </Card>
                        )}
                      </motion.div>
                    </TabsContent>

                    <TabsContent value="value" className="mt-0">
                      <motion.div
                        key="value"
                        initial={{ opacity: 0, x: -20 }}
                        animate={{ opacity: 1, x: 0 }}
                        exit={{ opacity: 0, x: 20 }}
                        transition={{ duration: 0.3 }}
                        id="value-proposition-section"
                      >
                        <ValuePropositionAnalysis valueProposition={result.valueProposition} />
                      </motion.div>
                    </TabsContent>

                    <TabsContent value="market" className="mt-0">
                      <motion.div
                        key="market"
                        initial={{ opacity: 0, x: -20 }}
                        animate={{ opacity: 1, x: 0 }}
                        exit={{ opacity: 0, x: 20 }}
                        transition={{ duration: 0.3 }}
                        id="market-analysis-section"
                      >
                        <MarketAnalysis marketAnalysis={result.marketAnalysis} />
                      </motion.div>
                    </TabsContent>

                    <TabsContent value="data" className="mt-0">
                      <motion.div
                        key="data"
                        initial={{ opacity: 0, x: -20 }}
                        animate={{ opacity: 1, x: 0 }}
                        exit={{ opacity: 0, x: 20 }}
                        transition={{ duration: 0.3 }}
                        id="market-data-section"
                      >
                        {result.marketData ? (
                          <MarketDataCharts marketData={result.marketData as any} />
                        ) : (
                          <Card className="p-6 bg-white/50 backdrop-blur-sm">
                            <p className="text-center text-gray-500">Données de marché non disponibles</p>
                          </Card>
                        )}
                        <div className="mt-8" id="data-sources-section">
                          {result.marketData?.sources ? (
                            <DataSources sources={result.marketData.sources} />
                          ) : (
                            <Card className="p-6 bg-white/50 backdrop-blur-sm">
                              <p className="text-center text-gray-500">Sources non disponibles</p>
                            </Card>
                          )}
                        </div>
                      </motion.div>
                    </TabsContent>
                  </AnimatePresence>
                </Tabs>
              </div>
            </div>

            <PremiumUpsell />
          </motion.div>
        )}
      </motion.div>
    </main>
  )
}

