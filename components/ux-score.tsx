"use client"

import { motion } from "framer-motion"
import { Progress } from "@/components/ui/progress"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from "@/components/ui/tooltip"
import { InfoIcon, AlertTriangle, CheckCircle, XCircle } from "lucide-react"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"

interface UxScoreProps {
  score: number
  detailedScores?: {
    clarity: number
    navigation: number
    accessibility: number
    performance: number
    mobileExperience: number
  }
}

export default function UxScore({ score, detailedScores }: UxScoreProps) {
  // Determine color based on score
  const getScoreColor = () => {
    if (score >= 80) return "text-green-600"
    if (score >= 60) return "text-yellow-600"
    return "text-red-600"
  }

  const getProgressColor = () => {
    if (score >= 80) return "bg-green-600"
    if (score >= 60) return "bg-yellow-600"
    return "bg-red-600"
  }

  const getDetailedScoreColor = (score: number) => {
    if (score >= 80) return "bg-green-600"
    if (score >= 60) return "bg-yellow-600"
    return "bg-red-600"
  }

  const getScoreIcon = (score: number) => {
    if (score >= 80) return <CheckCircle className="h-5 w-5 text-green-600" />
    if (score >= 60) return <AlertTriangle className="h-5 w-5 text-yellow-600" />
    return <XCircle className="h-5 w-5 text-red-600" />
  }

  const getScoreDescription = (category: string, score: number) => {
    if (category === "clarity") {
      if (score >= 80) return "Excellente clarté du message et de la proposition de valeur."
      if (score >= 60) return "Message clair mais pourrait être plus percutant."
      return "Manque de clarté dans le message principal et la proposition de valeur."
    }
    if (category === "navigation") {
      if (score >= 80) return "Navigation intuitive et parcours utilisateur fluide."
      if (score >= 60) return "Navigation fonctionnelle mais avec quelques points de friction."
      return "Navigation confuse qui peut désorienter les utilisateurs."
    }
    if (category === "accessibility") {
      if (score >= 80) return "Bonne accessibilité pour tous les utilisateurs."
      if (score >= 60) return "Accessibilité correcte mais avec des améliorations possibles."
      return "Problèmes d'accessibilité qui limitent l'usage pour certains utilisateurs."
    }
    if (category === "performance") {
      if (score >= 80) return "Excellente performance et temps de chargement."
      if (score >= 60) return "Performance acceptable mais pourrait être optimisée."
      return "Performance insuffisante qui impacte l'expérience utilisateur."
    }
    if (category === "mobileExperience") {
      if (score >= 80) return "Expérience mobile optimisée et responsive."
      if (score >= 60) return "Expérience mobile correcte mais avec des limitations."
      return "Expérience mobile problématique qui nécessite une refonte."
    }
    return ""
  }

  return (
    <Card className="overflow-hidden border-2 border-blue-100">
      <CardHeader className="pb-2">
        <CardTitle className="text-xl">Analyse UX détaillée</CardTitle>
      </CardHeader>
      <CardContent className="pt-2">
        <Tabs defaultValue="global">
          <TabsList className="grid grid-cols-2 mb-4">
            <TabsTrigger value="global">Score global</TabsTrigger>
            <TabsTrigger value="detailed">Scores détaillés</TabsTrigger>
          </TabsList>

          <TabsContent value="global">
            <div className="flex items-center justify-between mb-2">
              <h3 className="text-xl font-semibold">UX Score</h3>
              <TooltipProvider>
                <Tooltip>
                  <TooltipTrigger>
                    <InfoIcon className="h-4 w-4 text-gray-400" />
                  </TooltipTrigger>
                  <TooltipContent>
                    <p className="max-w-xs">
                      Le UX Score évalue la qualité de l'expérience utilisateur de votre page d'accueil sur une échelle
                      de 0 à 100, en analysant la clarté du message, la hiérarchie visuelle et l'efficacité des appels à
                      l'action.
                    </p>
                  </TooltipContent>
                </Tooltip>
              </TooltipProvider>
            </div>

            <div className="relative pt-10 pb-2">
              <Progress value={score} className={`h-4 ${getProgressColor()}`} />
              <motion.div
                className="absolute top-0 left-0 w-full flex justify-center"
                initial={{ y: -20, opacity: 0 }}
                animate={{ y: 0, opacity: 1 }}
                transition={{ delay: 0.5, duration: 0.5 }}
              >
                <motion.span
                  className={`text-5xl font-bold ${getScoreColor()}`}
                  initial={{ scale: 0.8 }}
                  animate={{ scale: [0.8, 1.2, 1] }}
                  transition={{ delay: 0.8, duration: 0.5 }}
                >
                  {score}
                </motion.span>
              </motion.div>
            </div>

            <div className="flex justify-between text-xs text-gray-500 mt-1">
              <span>0</span>
              <span>50</span>
              <span>100</span>
            </div>

            <motion.div
              className="mt-6 p-4 rounded-lg bg-blue-50 border border-blue-100"
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 1, duration: 0.5 }}
            >
              {score >= 80 && (
                <p className="text-green-700">
                  <span className="font-bold">Excellent !</span> Votre page d'accueil offre une très bonne expérience
                  utilisateur. Vous êtes sur la bonne voie pour maximiser vos conversions.
                </p>
              )}
              {score >= 60 && score < 80 && (
                <p className="text-yellow-700">
                  <span className="font-bold">Bien !</span> Votre page d'accueil est efficace mais présente des
                  opportunités d'amélioration. Suivez nos recommandations pour augmenter vos conversions.
                </p>
              )}
              {score < 60 && (
                <p className="text-red-700">
                  <span className="font-bold">Attention !</span> Votre page d'accueil nécessite des améliorations
                  significatives. Nos recommandations vous aideront à transformer rapidement votre site.
                </p>
              )}
            </motion.div>
          </TabsContent>

          <TabsContent value="detailed">
            <div className="space-y-6">
              {detailedScores && (
                <div className="space-y-4">
                  {Object.entries(detailedScores).map(([category, score], index) => (
                    <motion.div
                      key={category}
                      initial={{ opacity: 0, y: 10 }}
                      animate={{ opacity: 1, y: 0 }}
                      transition={{ delay: index * 0.1, duration: 0.3 }}
                      className="space-y-2"
                    >
                      <div className="flex items-center justify-between">
                        <div className="flex items-center gap-2">
                          {getScoreIcon(score)}
                          <h4 className="font-medium capitalize">
                            {category === "mobileExperience" ? "Expérience mobile" : category}
                          </h4>
                        </div>
                        <span className={`font-bold ${getScoreColor()}`}>{score}/100</span>
                      </div>
                      <Progress value={score} className={`h-2 ${getDetailedScoreColor(score)}`} />
                      <p className="text-sm text-gray-600">{getScoreDescription(category, score)}</p>
                    </motion.div>
                  ))}
                </div>
              )}

              {detailedScores && (
                <div className="p-4 bg-blue-50 rounded-lg border border-blue-100">
                  <h4 className="font-semibold mb-2">Analyse comparative</h4>
                  <p className="text-sm text-gray-700">
                    Votre site se démarque particulièrement en{" "}
                    <span className="font-medium text-green-700">
                      {Object.entries(detailedScores).sort((a, b) => b[1] - a[1])[0][0] === "mobileExperience"
                        ? "expérience mobile"
                        : Object.entries(detailedScores).sort((a, b) => b[1] - a[1])[0][0]}
                    </span>{" "}
                    mais présente des opportunités d'amélioration en{" "}
                    <span className="font-medium text-red-700">
                      {Object.entries(detailedScores).sort((a, b) => a[1] - b[1])[0][0] === "mobileExperience"
                        ? "expérience mobile"
                        : Object.entries(detailedScores).sort((a, b) => a[1] - b[1])[0][0]}
                    </span>
                    .
                  </p>
                </div>
              )}
            </div>
          </TabsContent>
        </Tabs>
      </CardContent>
    </Card>
  )
}

