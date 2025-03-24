"use client"

import { motion } from "framer-motion"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { ArrowRight, Frown, Meh, Smile } from "lucide-react"

interface JourneyStep {
  stage: string
  touchpoint: string
  userGoal: string
  userEmotion: "positive" | "neutral" | "negative"
  frictionPoints: string[]
  opportunities: string[]
}

interface UserJourneyMapProps {
  userJourney: {
    journeySteps: JourneyStep[]
    criticalPoints: string[]
  }
}

export default function UserJourneyMap({ userJourney }: UserJourneyMapProps) {
  const { journeySteps, criticalPoints } = userJourney

  const getEmotionIcon = (emotion: string) => {
    switch (emotion) {
      case "positive":
        return <Smile className="h-6 w-6 text-green-500" />
      case "neutral":
        return <Meh className="h-6 w-6 text-yellow-500" />
      case "negative":
        return <Frown className="h-6 w-6 text-red-500" />
      default:
        return null
    }
  }

  const getEmotionColor = (emotion: string) => {
    switch (emotion) {
      case "positive":
        return "border-green-200 bg-green-50"
      case "neutral":
        return "border-yellow-200 bg-yellow-50"
      case "negative":
        return "border-red-200 bg-red-50"
      default:
        return "border-gray-200 bg-gray-50"
    }
  }

  // Vérifier si nous avons des étapes de parcours à afficher
  const hasJourneySteps = journeySteps && journeySteps.length > 0

  return (
    <Card className="border-2 border-blue-100">
      <CardHeader className="pb-2">
        <CardTitle className="text-xl">Cartographie du parcours utilisateur</CardTitle>
      </CardHeader>
      <CardContent>
        <div className="mb-6 p-4 bg-blue-50 rounded-lg">
          <p className="text-sm text-blue-800">
            Cette analyse visualise le parcours de vos utilisateurs à travers votre site, identifiant les points de
            friction et les opportunités d'amélioration à chaque étape. L'objectif est d'optimiser chaque touchpoint
            pour maximiser les conversions.
          </p>
        </div>

        {hasJourneySteps ? (
          <div className="relative mt-8">
            {/* Ligne de connexion */}
            <div className="absolute top-16 left-0 right-0 h-1 bg-blue-200 z-0"></div>

            <div className="grid grid-cols-1 md:grid-cols-5 gap-4 relative z-10">
              {journeySteps.map((step, index) => (
                <motion.div
                  key={index}
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ duration: 0.4, delay: index * 0.1 }}
                  className={`rounded-lg border p-4 ${getEmotionColor(step.userEmotion)}`}
                >
                  <div className="flex justify-between items-start mb-3">
                    <Badge className="bg-blue-100 text-blue-800 hover:bg-blue-200">{step.stage}</Badge>
                    <div className="mt-1">{getEmotionIcon(step.userEmotion)}</div>
                  </div>

                  <h4 className="font-semibold mb-2">{step.touchpoint}</h4>
                  <p className="text-sm text-gray-600 mb-3">
                    <span className="font-medium">Objectif utilisateur :</span> {step.userGoal}
                  </p>

                  {step.frictionPoints.length > 0 && (
                    <div className="mb-3">
                      <h5 className="text-xs font-semibold text-red-700 mb-1">POINTS DE FRICTION</h5>
                      <ul className="text-xs text-red-600 space-y-1 list-disc pl-4">
                        {step.frictionPoints.map((point, i) => (
                          <li key={i}>{point}</li>
                        ))}
                      </ul>
                    </div>
                  )}

                  <div>
                    <h5 className="text-xs font-semibold text-green-700 mb-1">OPPORTUNITÉS</h5>
                    <ul className="text-xs text-green-600 space-y-1 list-disc pl-4">
                      {step.opportunities.map((opportunity, i) => (
                        <li key={i}>{opportunity}</li>
                      ))}
                    </ul>
                  </div>

                  {index < journeySteps.length - 1 && (
                    <div className="hidden md:block absolute right-[-12px] top-16 z-20">
                      <ArrowRight className="h-6 w-6 text-blue-400" />
                    </div>
                  )}
                </motion.div>
              ))}
            </div>
          </div>
        ) : (
          <div className="text-center py-8 text-gray-500">
            Aucune analyse de parcours utilisateur disponible pour le moment.
          </div>
        )}

        {criticalPoints && criticalPoints.length > 0 && (
          <div className="mt-8 p-4 bg-amber-50 border border-amber-200 rounded-lg">
            <h4 className="font-semibold text-amber-800 mb-2">Points critiques identifiés</h4>
            <p className="text-sm text-amber-700">
              L'analyse révèle que les principales opportunités d'amélioration se situent au niveau de :
            </p>
            <ul className="mt-2 space-y-1 list-disc pl-5 text-sm text-amber-700">
              {criticalPoints.map((point, index) => (
                <li key={index}>{point}</li>
              ))}
            </ul>
          </div>
        )}
      </CardContent>
    </Card>
  )
}

