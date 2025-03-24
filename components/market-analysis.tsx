"use client"

import { motion } from "framer-motion"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Progress } from "@/components/ui/progress"
import { TrendingUp, Users, Target } from "lucide-react"
import { ResponsiveContainer, BarChart, Bar, XAxis, YAxis, Tooltip } from "recharts"

interface CompetitorDetail {
  name: string
  url: string
  strengths: string
  weaknesses: string
  marketShare: number
  marketShareUnit?: string
  annualRevenue?: number
  annualRevenueUnit?: string
  growthRate?: number
  growthRateUnit?: string
  keyDifferentiators?: string[]
}

interface Trend {
  name: string
  description?: string
  impact?: "high" | "medium" | "low"
  timeframe?: string
  adoptionRate?: number
  adoptionRateUnit?: string
  source?: string
}

interface ConversionRate {
  estimated: number
  estimatedUnit?: string
  industryAverage: number
  industryAverageUnit?: string
  potential: number
  potentialUnit?: string
  competitorAverage: number
  competitorAverageUnit?: string
  topPerformerRate?: number
  topPerformerRateUnit?: string
  source?: string
}

interface MarketAnalysisProps {
  marketAnalysis: {
    positioning: string
    competitors: string[]
    competitorDetails: CompetitorDetail[]
    trends: string[] | Trend[]
    conversionRate: ConversionRate
  }
}

export default function MarketAnalysis({ marketAnalysis }: MarketAnalysisProps) {
  const { positioning, competitors, competitorDetails, trends, conversionRate } = marketAnalysis

  // Prepare data for the conversion rate chart
  const conversionData = [
    {
      name: "Taux estimé",
      value: conversionRate.estimated,
      fill: "#3b82f6",
    },
    {
      name: "Moyenne du secteur",
      value: conversionRate.industryAverage,
      fill: "#64748b",
    },
    {
      name: "Moyenne concurrents",
      value: conversionRate.competitorAverage,
      fill: "#f59e0b",
    },
    {
      name: "Potentiel",
      value: conversionRate.potential,
      fill: "#10b981",
    },
  ]

  return (
    <div className="space-y-6">
      <Card>
        <CardHeader className="pb-2">
          <CardTitle className="text-xl flex items-center">
            <Target className="h-5 w-5 mr-2 text-blue-600" />
            Positionnement sur le marché
          </CardTitle>
        </CardHeader>
        <CardContent>
          <p className="text-gray-700">{positioning}</p>
        </CardContent>
      </Card>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <motion.div initial={{ opacity: 0, x: -20 }} animate={{ opacity: 1, x: 0 }} transition={{ duration: 0.4 }}>
          <Card className="h-full">
            <CardHeader className="pb-2">
              <CardTitle className="text-lg flex items-center">
                <Users className="h-5 w-5 mr-2 text-blue-600" />
                Concurrents principaux
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="flex flex-wrap gap-2">
                {competitors.map((competitor, index) => (
                  <motion.div
                    key={index}
                    initial={{ opacity: 0, scale: 0.8 }}
                    animate={{ opacity: 1, scale: 1 }}
                    transition={{ delay: index * 0.1 }}
                  >
                    <Badge variant="outline" className="text-sm py-1 px-3">
                      {competitor}
                      {competitorDetails[index]?.marketShare && (
                        <span className="ml-1 text-xs">
                          ({competitorDetails[index].marketShare}
                          {competitorDetails[index].marketShareUnit || "%"})
                        </span>
                      )}
                    </Badge>
                  </motion.div>
                ))}
              </div>
            </CardContent>
          </Card>
        </motion.div>

        <motion.div initial={{ opacity: 0, x: 20 }} animate={{ opacity: 1, x: 0 }} transition={{ duration: 0.4 }}>
          <Card className="h-full">
            <CardHeader className="pb-2">
              <CardTitle className="text-lg flex items-center">
                <TrendingUp className="h-5 w-5 mr-2 text-blue-600" />
                Tendances du marché
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-2">
                {Array.isArray(trends) &&
                  trends.length > 0 &&
                  trends.map((trend, index) => {
                    // Vérifier si trend est un objet ou une string
                    const isTrendObject = typeof trend !== "string"

                    return (
                      <motion.div
                        key={index}
                        initial={{ opacity: 0, y: 10 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ delay: index * 0.1 }}
                        className="flex items-start"
                      >
                        <div className="h-2 w-2 rounded-full bg-blue-500 mr-2 mt-2"></div>
                        <div>
                          {isTrendObject ? (
                            <>
                              <p className="text-gray-700 font-medium">{(trend as Trend).name}</p>
                              {(trend as Trend).description && (
                                <p className="text-sm text-gray-600">{(trend as Trend).description}</p>
                              )}
                              {(trend as Trend).impact && (
                                <Badge
                                  className={`mt-1 ${
                                    (trend as Trend).impact === "high"
                                      ? "bg-red-100 text-red-800"
                                      : (trend as Trend).impact === "medium"
                                        ? "bg-yellow-100 text-yellow-800"
                                        : "bg-green-100 text-green-800"
                                  }`}
                                >
                                  Impact{" "}
                                  {(trend as Trend).impact === "high"
                                    ? "élevé"
                                    : (trend as Trend).impact === "medium"
                                      ? "moyen"
                                      : "faible"}
                                </Badge>
                              )}
                            </>
                          ) : (
                            <p className="text-gray-700">{trend as string}</p>
                          )}
                        </div>
                      </motion.div>
                    )
                  })}
              </div>
            </CardContent>
          </Card>
        </motion.div>
      </div>

      <Card>
        <CardHeader className="pb-2">
          <CardTitle className="text-lg">Taux de conversion (en %)</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="h-64">
            <ResponsiveContainer width="100%" height="100%">
              <BarChart data={conversionData} margin={{ top: 20, right: 30, left: 20, bottom: 20 }}>
                <XAxis dataKey="name" />
                <YAxis />
                <Tooltip formatter={(value) => [`${value}%`, "Taux de conversion"]} />
                <Bar dataKey="value" fill="#3b82f6" />
              </BarChart>
            </ResponsiveContainer>
          </div>

          <div className="mt-4 space-y-4">
            <div>
              <div className="flex justify-between mb-1">
                <span className="text-sm font-medium">Votre taux estimé</span>
                <span className="text-sm font-medium">
                  {conversionRate.estimated}
                  {conversionRate.estimatedUnit || "%"}
                </span>
              </div>
              <Progress
                value={(conversionRate.estimated / conversionRate.potential) * 100}
                className="h-2 bg-gray-200"
              />
            </div>

            <div>
              <div className="flex justify-between mb-1">
                <span className="text-sm font-medium">Moyenne du secteur</span>
                <span className="text-sm font-medium">
                  {conversionRate.industryAverage}
                  {conversionRate.industryAverageUnit || "%"}
                </span>
              </div>
              <Progress
                value={(conversionRate.industryAverage / conversionRate.potential) * 100}
                className="h-2 bg-gray-200"
              />
            </div>

            <div>
              <div className="flex justify-between mb-1">
                <span className="text-sm font-medium">Moyenne des concurrents</span>
                <span className="text-sm font-medium">
                  {conversionRate.competitorAverage}
                  {conversionRate.competitorAverageUnit || "%"}
                </span>
              </div>
              <Progress
                value={(conversionRate.competitorAverage / conversionRate.potential) * 100}
                className="h-2 bg-gray-200"
              />
            </div>

            <div>
              <div className="flex justify-between mb-1">
                <span className="text-sm font-medium">Potentiel atteignable</span>
                <span className="text-sm font-medium">
                  {conversionRate.potential}
                  {conversionRate.potentialUnit || "%"}
                </span>
              </div>
              <Progress value={100} className="h-2 bg-green-200" />
            </div>

            {conversionRate.topPerformerRate && (
              <div>
                <div className="flex justify-between mb-1">
                  <span className="text-sm font-medium">Top performers</span>
                  <span className="text-sm font-medium">
                    {conversionRate.topPerformerRate}
                    {conversionRate.topPerformerRateUnit || "%"}
                  </span>
                </div>
                <Progress
                  value={(conversionRate.topPerformerRate / conversionRate.potential) * 100}
                  className="h-2 bg-blue-200"
                />
              </div>
            )}

            {conversionRate.source && <div className="text-xs text-gray-500 mt-2">Source: {conversionRate.source}</div>}
          </div>
        </CardContent>
      </Card>
    </div>
  )
}

