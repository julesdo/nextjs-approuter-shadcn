"use client"

import { motion } from "framer-motion"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { CheckCircle, AlertTriangle, XCircle, Info } from "lucide-react"
import { Accordion, AccordionContent, AccordionItem, AccordionTrigger } from "@/components/ui/accordion"
import { Progress } from "@/components/ui/progress"

interface HeuristicPrinciple {
  principle: string
  status: "success" | "warning" | "error"
  description: string
  details: string
  recommendations: string
  score: number
}

interface HeuristicAnalysisProps {
  heuristicAnalysis: {
    summary: {
      strengths: number
      improvements: number
      criticalIssues: number
    }
    principles: HeuristicPrinciple[]
    heuristicScores?: {
      [key: string]: number
    }
  }
}

export default function HeuristicAnalysis({ heuristicAnalysis }: HeuristicAnalysisProps) {
  const { summary, principles, heuristicScores } = heuristicAnalysis

  const getStatusIcon = (status: string) => {
    switch (status) {
      case "success":
        return <CheckCircle className="h-5 w-5 text-green-600" />
      case "warning":
        return <AlertTriangle className="h-5 w-5 text-yellow-600" />
      case "error":
        return <XCircle className="h-5 w-5 text-red-600" />
      default:
        return <Info className="h-5 w-5 text-blue-600" />
    }
  }

  const getStatusBadge = (status: string) => {
    switch (status) {
      case "success":
        return <Badge className="bg-green-100 text-green-800 hover:bg-green-200">Bon</Badge>
      case "warning":
        return <Badge className="bg-yellow-100 text-yellow-800 hover:bg-yellow-200">À améliorer</Badge>
      case "error":
        return <Badge className="bg-red-100 text-red-800 hover:bg-red-200">Problématique</Badge>
      default:
        return <Badge className="bg-blue-100 text-blue-800 hover:bg-blue-200">Neutre</Badge>
    }
  }

  // Fonction pour obtenir le statut en fonction du score
  const getStatusFromScore = (score: number) => {
    if (score >= 7.5) return "success"
    if (score >= 5) return "warning"
    return "error"
  }

  // Vérifier si nous avons des principes à afficher
  const hasPrinciples = principles && principles.length > 0

  // Calculer le score global basé sur les scores individuels
  const calculateOverallScore = () => {
    if (!hasPrinciples) return 0
    const sum = principles.reduce((acc, principle) => acc + principle.score, 0)
    return Math.round((sum / principles.length) * 10) / 10
  }

  const overallScore = calculateOverallScore()

  // Compter correctement les principes par catégorie
  const countPrinciplesByStatus = () => {
    if (!hasPrinciples) return { strengths: 0, improvements: 0, criticalIssues: 0 }

    return principles.reduce(
      (counts, principle) => {
        if (principle.status === "success") counts.strengths++
        else if (principle.status === "warning") counts.improvements++
        else if (principle.status === "error") counts.criticalIssues++
        return counts
      },
      { strengths: 0, improvements: 0, criticalIssues: 0 },
    )
  }

  const counts = countPrinciplesByStatus()

  return (
    <Card className="border-2 border-gray-200 bg-white/50 backdrop-blur-sm">
      <CardHeader className="pb-2">
        <CardTitle className="text-xl">Analyse heuristique (Principes de Nielsen)</CardTitle>
      </CardHeader>
      <CardContent>
        <div className="mb-6 p-4 bg-blue-50 rounded-lg">
          <p className="text-sm text-blue-800">
            Cette analyse évalue votre interface selon les 10 principes heuristiques de Jakob Nielsen, une référence en
            matière d'utilisabilité. Elle identifie les forces et faiblesses de votre expérience utilisateur selon des
            critères établis.
          </p>
        </div>

        <div className="mb-6">
          <div className="flex justify-between items-center mb-2">
            <h3 className="font-medium">Score global d'utilisabilité</h3>
            <span className="font-bold text-lg">{overallScore}/10</span>
          </div>
          <Progress
            value={overallScore * 10}
            className={`h-3 ${
              overallScore >= 7.5 ? "bg-green-500" : overallScore >= 5 ? "bg-yellow-500" : "bg-red-500"
            }`}
          />
          <div className="mt-2 text-sm text-gray-600">
            {overallScore >= 7.5
              ? "Votre site présente une bonne utilisabilité globale, avec quelques points d'amélioration."
              : overallScore >= 5
                ? "Votre site présente une utilisabilité moyenne, avec plusieurs points à améliorer."
                : "Votre site présente des problèmes d'utilisabilité importants qui nécessitent une attention immédiate."}
          </div>
        </div>

        <div className="grid grid-cols-3 gap-4 mb-6">
          <motion.div
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.3 }}
            className="bg-green-50 p-4 rounded-lg text-center"
          >
            <div className="text-2xl font-bold text-green-700">{counts.strengths}</div>
            <div className="text-sm text-green-600">Points forts</div>
          </motion.div>

          <motion.div
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.3, delay: 0.1 }}
            className="bg-yellow-50 p-4 rounded-lg text-center"
          >
            <div className="text-2xl font-bold text-yellow-700">{counts.improvements}</div>
            <div className="text-sm text-yellow-600">À améliorer</div>
          </motion.div>

          <motion.div
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.3, delay: 0.2 }}
            className="bg-red-50 p-4 rounded-lg text-center"
          >
            <div className="text-2xl font-bold text-red-700">{counts.criticalIssues}</div>
            <div className="text-sm text-red-600">Problèmes critiques</div>
          </motion.div>
        </div>

        {hasPrinciples ? (
          <Accordion type="single" collapsible className="w-full">
            {principles.map((item, index) => (
              <motion.div
                key={index}
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.3, delay: 0.1 * index }}
              >
                <AccordionItem value={`item-${index}`} className="border-b border-gray-200">
                  <AccordionTrigger className="hover:no-underline">
                    <div className="flex items-center gap-3 text-left">
                      {getStatusIcon(item.status)}
                      <div>
                        <div className="font-medium">{item.principle}</div>
                        <div className="text-sm text-gray-600">{item.description}</div>
                      </div>
                    </div>
                    <div className="flex items-center gap-2">
                      <div className="text-sm font-bold mr-2">{item.score}/10</div>
                      {getStatusBadge(item.status)}
                    </div>
                  </AccordionTrigger>
                  <AccordionContent className="px-4 pt-2 pb-4">
                    <div className="space-y-3 text-sm">
                      <div>
                        <div className="font-medium text-gray-700">Détails :</div>
                        <p className="text-gray-600">{item.details}</p>
                      </div>
                      <div>
                        <div className="font-medium text-gray-700">Recommandations :</div>
                        <p className="text-gray-600">{item.recommendations}</p>
                      </div>
                      <div className="pt-2">
                        <div className="w-full bg-gray-200 rounded-full h-2">
                          <div
                            className={`h-2 rounded-full ${
                              item.score >= 7.5 ? "bg-green-500" : item.score >= 5 ? "bg-yellow-500" : "bg-red-500"
                            }`}
                            style={{ width: `${item.score * 10}%` }}
                          ></div>
                        </div>
                      </div>
                    </div>
                  </AccordionContent>
                </AccordionItem>
              </motion.div>
            ))}
          </Accordion>
        ) : (
          <div className="text-center py-8 text-gray-500">Aucune analyse heuristique disponible pour le moment.</div>
        )}

        {/* Afficher les scores heuristiques s'ils sont disponibles */}
        {heuristicScores && Object.keys(heuristicScores).length > 0 && (
          <div className="mt-6 p-4 bg-gray-50 rounded-lg">
            <h3 className="font-medium mb-4">Scores détaillés par principe</h3>
            <div className="space-y-3">
              {Object.entries(heuristicScores).map(([key, score], index) => {
                // Convertir le score sur 100 en score sur 10
                const scoreOutOfTen = Math.round((score / 10) * 10)
                return (
                  <div key={index} className="space-y-1">
                    <div className="flex justify-between">
                      <span className="text-sm font-medium capitalize">{key.replace(/([A-Z])/g, " $1").trim()}</span>
                      <span className="text-sm font-bold">{scoreOutOfTen}/10</span>
                    </div>
                    <div className="w-full bg-gray-200 rounded-full h-2">
                      <div
                        className={`h-2 rounded-full ${
                          scoreOutOfTen >= 7.5 ? "bg-green-500" : scoreOutOfTen >= 5 ? "bg-yellow-500" : "bg-red-500"
                        }`}
                        style={{ width: `${scoreOutOfTen * 10}%` }}
                      ></div>
                    </div>
                  </div>
                )
              })}
            </div>
          </div>
        )}
      </CardContent>
    </Card>
  )
}

