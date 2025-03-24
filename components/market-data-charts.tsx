"use client"

import { motion } from "framer-motion"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Badge } from "@/components/ui/badge"
import { Progress } from "@/components/ui/progress"
import {
  BarChart,
  Bar,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  Legend,
  ResponsiveContainer,
  PieChart,
  Pie,
  Cell,
  LineChart,
  Line,
} from "recharts"
import { TrendingUp, Globe, Users, Target, Zap, Clock } from "lucide-react"

interface MarketDataProps {
  marketData: {
    industryOverview?: {
      industryName: string
      marketSize: number
      marketSizeUnit: string
      annualGrowthRate: number
      annualGrowthRateUnit: string
      totalAddressableMarket: number
      totalAddressableMarketUnit: string
      maturityStage: string
      source: string
    }
    keyPerformanceIndicators?: {
      category: string
      metrics: {
        name: string
        value: number
        unit: string
        benchmark: number
        benchmarkUnit: string
        topPerformerValue: number
        topPerformerUnit: string
        description: string
        source: string
      }[]
    }[]
    customerInsights?: {
      segments: {
        name: string
        size: number
        sizeUnit: string
        averageRevenue: number
        averageRevenueUnit: string
        acquisitionCost: number
        acquisitionCostUnit: string
        retentionRate: number
        retentionRateUnit: string
        lifetimeValue: number
        lifetimeValueUnit: string
      }[]
      customerJourney: {
        averageConversionTime: number
        averageConversionTimeUnit: string
        touchpointsBeforeConversion: number
        abandonmentRate: number
        abandonmentRateUnit: string
        mostEffectiveChannel: string
        channelEffectivenessRate: number
        channelEffectivenessRateUnit: string
      }
    }
    competitiveLandscape?: {
      marketConcentration: number
      marketConcentrationUnit: string
      topPlayersMarketShare: number
      topPlayersMarketShareUnit: string
      entryBarriers: string[]
      disruptiveThreats: string[]
      consolidationTrend: string
    }
    futureForecast?: {
      shortTerm: {
        timeframe: string
        projectedGrowth: number
        projectedGrowthUnit: string
        emergingOpportunities: string[]
        potentialThreats: string[]
      }
      mediumTerm: {
        timeframe: string
        projectedGrowth: number
        projectedGrowthUnit: string
        emergingOpportunities: string[]
        potentialThreats: string[]
      }
    }
    sources?: {
      name: string
      type: string
      publisher: string
      year: number
      credibilityScore: number
      credibilityScoreUnit: string
      url: string
    }[]
    // Anciennes propriétés pour compatibilité
    industryGrowth?: number
    userEngagement?: number
    marketSize?: number
    marketSizeUnit?: string
    customerAcquisitionCost?: {
      estimated: number
      industryAverage: number
      competitorAverage: number
    }
    keyMetrics?: {
      name: string
      value: number
      benchmark: number
      unit: string
      source: string
    }[]
  }
}

// Couleurs pour les graphiques
const COLORS = ["#3b82f6", "#10b981", "#f59e0b", "#ef4444", "#8b5cf6", "#ec4899"]

export default function MarketDataCharts({ marketData }: MarketDataProps) {
  // Utiliser les nouvelles données si disponibles, sinon utilmarketData}: MarketDataProps) {
  // Utiliser les nouvelles données si disponibles, sinon utiliser les anciennes
  const overview = marketData.industryOverview || {
    industryName: "Secteur non spécifié",
    marketSize: marketData.marketSize || 0,
    marketSizeUnit: marketData.marketSizeUnit || "millions €",
    annualGrowthRate: marketData.industryGrowth || 0,
    annualGrowthRateUnit: "%",
    totalAddressableMarket: 0,
    totalAddressableMarketUnit: "millions €",
    maturityStage: "non spécifié",
    source: "Non spécifié",
  }

  const kpis = marketData.keyPerformanceIndicators || []
  const customerInsights = marketData.customerInsights
  const competitiveLandscape = marketData.competitiveLandscape
  const futureForecast = marketData.futureForecast
  const sources = marketData.sources || []

  // Préparer les données pour les graphiques
  const prepareKpiData = () => {
    const allMetrics = []
    kpis.forEach((category) => {
      category.metrics.forEach((metric) => {
        allMetrics.push({
          name: metric.name,
          value: metric.value,
          benchmark: metric.benchmark,
          topPerformer: metric.topPerformerValue,
          category: category.category,
          unit: metric.unit,
        })
      })
    })
    return allMetrics
  }

  const prepareSegmentData = () => {
    if (!customerInsights?.segments) return []
    return customerInsights.segments.map((segment) => ({
      name: segment.name,
      size: segment.size,
      ltv: segment.lifetimeValue,
      cac: segment.acquisitionCost,
      retention: segment.retentionRate,
    }))
  }

  const prepareForecastData = () => {
    if (!futureForecast) return []
    return [
      { name: "Actuel", growth: 0 },
      { name: futureForecast.shortTerm.timeframe, growth: futureForecast.shortTerm.projectedGrowth },
      { name: futureForecast.mediumTerm.timeframe, growth: futureForecast.mediumTerm.projectedGrowth },
    ]
  }

  const kpiData = kpis.length > 0 ? prepareKpiData() : []
  const segmentData = customerInsights?.segments ? prepareSegmentData() : []
  const forecastData = futureForecast ? prepareForecastData() : []

  return (
    <div className="space-y-6">
      <Tabs defaultValue="overview" className="w-full">
        <TabsList className="grid grid-cols-2 md:grid-cols-5 gap-2 mb-6">
          <TabsTrigger value="overview" className="flex items-center gap-2">
            <Globe className="h-4 w-4" />
            <span>Aperçu</span>
          </TabsTrigger>
          <TabsTrigger value="kpis" className="flex items-center gap-2">
            <Target className="h-4 w-4" />
            <span>KPIs</span>
          </TabsTrigger>
          <TabsTrigger value="customers" className="flex items-center gap-2">
            <Users className="h-4 w-4" />
            <span>Clients</span>
          </TabsTrigger>
          <TabsTrigger value="competition" className="flex items-center gap-2">
            <Zap className="h-4 w-4" />
            <span>Concurrence</span>
          </TabsTrigger>
          <TabsTrigger value="forecast" className="flex items-center gap-2">
            <TrendingUp className="h-4 w-4" />
            <span>Prévisions</span>
          </TabsTrigger>
        </TabsList>

        {/* Onglet Aperçu du marché */}
        <TabsContent value="overview" className="mt-0">
          <Card>
            <CardHeader className="pb-2">
              <CardTitle className="text-xl flex items-center">
                <Globe className="h-5 w-5 mr-2 text-blue-600" />
                Aperçu du marché: {overview.industryName}
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-6">
                <Card className="bg-blue-50">
                  <CardContent className="p-4">
                    <div className="text-sm text-blue-700 mb-1">Taille du marché</div>
                    <div className="text-2xl font-bold text-blue-900">
                      {overview.marketSize} {overview.marketSizeUnit}
                    </div>
                  </CardContent>
                </Card>

                <Card className="bg-green-50">
                  <CardContent className="p-4">
                    <div className="text-sm text-green-700 mb-1">Croissance annuelle</div>
                    <div className="text-2xl font-bold text-green-900">
                      {overview.annualGrowthRate}
                      {overview.annualGrowthRateUnit}
                    </div>
                  </CardContent>
                </Card>

                <Card className="bg-amber-50">
                  <CardContent className="p-4">
                    <div className="text-sm text-amber-700 mb-1">Marché total adressable</div>
                    <div className="text-2xl font-bold text-amber-900">
                      {overview.totalAddressableMarket} {overview.totalAddressableMarketUnit}
                    </div>
                  </CardContent>
                </Card>
              </div>

              <div className="p-4 bg-gray-50 rounded-lg mb-4">
                <h3 className="font-semibold mb-2">
                  Stade de maturité: <span className="text-blue-600">{overview.maturityStage}</span>
                </h3>
                <p className="text-gray-700">
                  Ce marché est actuellement en phase de <strong>{overview.maturityStage}</strong>, caractérisé par{" "}
                  {overview.maturityStage === "émergent"
                    ? "une adoption précoce et une innovation rapide"
                    : overview.maturityStage === "croissance"
                      ? "une adoption accélérée et une concurrence croissante"
                      : overview.maturityStage === "mature"
                        ? "une stabilisation de la croissance et une consolidation des acteurs"
                        : "un ralentissement de la croissance et une réduction des marges"}
                  .
                </p>
              </div>

              <div className="text-sm text-gray-500 mt-4">Source: {overview.source}</div>
            </CardContent>
          </Card>
        </TabsContent>

        {/* Onglet KPIs */}
        <TabsContent value="kpis" className="mt-0">
          <Card>
            <CardHeader className="pb-2">
              <CardTitle className="text-xl flex items-center">
                <Target className="h-5 w-5 mr-2 text-blue-600" />
                Indicateurs clés de performance
              </CardTitle>
            </CardHeader>
            <CardContent>
              {kpis.length > 0 ? (
                <div className="space-y-8">
                  {kpis.map((category, idx) => (
                    <div key={idx} className="space-y-4">
                      <h3 className="text-lg font-semibold flex items-center">
                        <Badge
                          className={`mr-2 ${
                            category.category === "Marketing"
                              ? "bg-blue-100 text-blue-800"
                              : category.category === "Produit"
                                ? "bg-green-100 text-green-800"
                                : "bg-purple-100 text-purple-800"
                          }`}
                        >
                          {category.category}
                        </Badge>
                      </h3>

                      <div className="space-y-6">
                        {category.metrics.map((metric, midx) => (
                          <div key={midx} className="border rounded-lg p-4">
                            <div className="flex justify-between items-start mb-2">
                              <div>
                                <h4 className="font-medium">{metric.name}</h4>
                                <p className="text-sm text-gray-600">{metric.description}</p>
                              </div>
                              <div className="text-right">
                                <div className="text-2xl font-bold">
                                  {metric.value} {metric.unit}
                                </div>
                                <div className="text-sm text-gray-500">
                                  Benchmark: {metric.benchmark} {metric.benchmarkUnit}
                                </div>
                              </div>
                            </div>

                            <div className="mt-2">
                              <div className="flex justify-between mb-1 text-sm">
                                <span>Votre valeur</span>
                                <span>
                                  Top performers: {metric.topPerformerValue} {metric.topPerformerUnit}
                                </span>
                              </div>
                              <Progress value={(metric.value / metric.topPerformerValue) * 100} className="h-2" />
                            </div>

                            <div className="mt-2 text-xs text-gray-500">Source: {metric.source}</div>
                          </div>
                        ))}
                      </div>
                    </div>
                  ))}

                  <div className="h-80 mt-8">
                    <h3 className="text-lg font-semibold mb-4">Comparaison des KPIs</h3>
                    <ResponsiveContainer width="100%" height="100%">
                      <BarChart data={kpiData} margin={{ top: 20, right: 30, left: 20, bottom: 70 }}>
                        <CartesianGrid strokeDasharray="3 3" />
                        <XAxis dataKey="name" angle={-45} textAnchor="end" height={70} />
                        <YAxis />
                        <Tooltip
                          formatter={(value, name) => {
                            const metric = kpiData.find(
                              (m) => m.value === value || m.benchmark === value || m.topPerformer === value,
                            )
                            return [`${value} ${metric?.unit || ""}`, name]
                          }}
                        />
                        <Legend />
                        <Bar dataKey="value" name="Votre valeur" fill="#3b82f6" />
                        <Bar dataKey="benchmark" name="Benchmark" fill="#10b981" />
                        <Bar dataKey="topPerformer" name="Top performers" fill="#f59e0b" />
                      </BarChart>
                    </ResponsiveContainer>
                  </div>
                </div>
              ) : (
                <div className="text-center py-8 text-gray-500">Données KPI non disponibles</div>
              )}
            </CardContent>
          </Card>
        </TabsContent>

        {/* Onglet Clients */}
        <TabsContent value="customers" className="mt-0">
          <Card>
            <CardHeader className="pb-2">
              <CardTitle className="text-xl flex items-center">
                <Users className="h-5 w-5 mr-2 text-blue-600" />
                Insights clients
              </CardTitle>
            </CardHeader>
            <CardContent>
              {customerInsights ? (
                <div className="space-y-8">
                  <div>
                    <h3 className="text-lg font-semibold mb-4">Segments clients</h3>
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                      {customerInsights.segments.map((segment, idx) => (
                        <Card key={idx} className="border">
                          <CardHeader className="pb-2">
                            <CardTitle className="text-base">{segment.name}</CardTitle>
                            <Badge className="bg-blue-100 text-blue-800">
                              {segment.size}
                              {segment.sizeUnit} du marché
                            </Badge>
                          </CardHeader>
                          <CardContent className="space-y-3 pt-2">
                            <div className="flex justify-between">
                              <span className="text-gray-600">Revenu moyen</span>
                              <span className="font-medium">
                                {segment.averageRevenue} {segment.averageRevenueUnit}
                              </span>
                            </div>
                            <div className="flex justify-between">
                              <span className="text-gray-600">Coût d'acquisition</span>
                              <span className="font-medium">
                                {segment.acquisitionCost} {segment.acquisitionCostUnit}
                              </span>
                            </div>
                            <div className="flex justify-between">
                              <span className="text-gray-600">Taux de rétention</span>
                              <span className="font-medium">
                                {segment.retentionRate}
                                {segment.retentionRateUnit}
                              </span>
                            </div>
                            <div className="flex justify-between">
                              <span className="text-gray-600">Valeur vie client</span>
                              <span className="font-medium">
                                {segment.lifetimeValue} {segment.lifetimeValueUnit}
                              </span>
                            </div>
                          </CardContent>
                        </Card>
                      ))}
                    </div>
                  </div>

                  <div>
                    <h3 className="text-lg font-semibold mb-4">Parcours client</h3>
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                      <Card className="border">
                        <CardContent className="pt-4">
                          <div className="flex items-center mb-4">
                            <Clock className="h-5 w-5 text-blue-600 mr-2" />
                            <h4 className="font-medium">Temps de conversion</h4>
                          </div>
                          <div className="text-3xl font-bold mb-2">
                            {customerInsights.customerJourney.averageConversionTime}{" "}
                            {customerInsights.customerJourney.averageConversionTimeUnit}
                          </div>
                          <p className="text-sm text-gray-600">
                            Temps moyen nécessaire pour qu'un prospect devienne client
                          </p>
                        </CardContent>
                      </Card>

                      <Card className="border">
                        <CardContent className="pt-4">
                          <div className="flex items-center mb-4">
                            <Target className="h-5 w-5 text-blue-600 mr-2" />
                            <h4 className="font-medium">Points de contact</h4>
                          </div>
                          <div className="text-3xl font-bold mb-2">
                            {customerInsights.customerJourney.touchpointsBeforeConversion}
                          </div>
                          <p className="text-sm text-gray-600">Nombre moyen d'interactions avant conversion</p>
                        </CardContent>
                      </Card>
                    </div>

                    <div className="mt-4">
                      <Card className="border">
                        <CardContent className="pt-4">
                          <div className="flex justify-between mb-4">
                            <div>
                              <h4 className="font-medium">Taux d'abandon</h4>
                              <p className="text-sm text-gray-600">
                                Pourcentage de prospects qui abandonnent avant conversion
                              </p>
                            </div>
                            <div className="text-right">
                              <div className="text-2xl font-bold text-red-600">
                                {customerInsights.customerJourney.abandonmentRate}
                                {customerInsights.customerJourney.abandonmentRateUnit}
                              </div>
                            </div>
                          </div>

                          <div className="mt-4">
                            <h4 className="font-medium mb-2">Canal le plus efficace</h4>
                            <div className="flex justify-between items-center bg-green-50 p-3 rounded-lg">
                              <span className="font-medium">
                                {customerInsights.customerJourney.mostEffectiveChannel}
                              </span>
                              <Badge className="bg-green-100 text-green-800">
                                {customerInsights.customerJourney.channelEffectivenessRate}
                                {customerInsights.customerJourney.channelEffectivenessRateUnit}
                              </Badge>
                            </div>
                          </div>
                        </CardContent>
                      </Card>
                    </div>
                  </div>

                  <div className="h-80">
                    <h3 className="text-lg font-semibold mb-4">Comparaison des segments</h3>
                    <ResponsiveContainer width="100%" height="100%">
                      <BarChart data={segmentData} margin={{ top: 20, right: 30, left: 20, bottom: 5 }}>
                        <CartesianGrid strokeDasharray="3 3" />
                        <XAxis dataKey="name" />
                        <YAxis />
                        <Tooltip />
                        <Legend />
                        <Bar dataKey="ltv" name="Valeur vie client (€)" fill="#3b82f6" />
                        <Bar dataKey="cac" name="Coût d'acquisition (€)" fill="#ef4444" />
                        <Bar dataKey="retention" name="Taux de rétention (%)" fill="#10b981" />
                      </BarChart>
                    </ResponsiveContainer>
                  </div>
                </div>
              ) : (
                <div className="text-center py-8 text-gray-500">Données clients non disponibles</div>
              )}
            </CardContent>
          </Card>
        </TabsContent>

        {/* Onglet Concurrence */}
        <TabsContent value="competition" className="mt-0">
          <Card>
            <CardHeader className="pb-2">
              <CardTitle className="text-xl flex items-center">
                <Zap className="h-5 w-5 mr-2 text-blue-600" />
                Paysage concurrentiel
              </CardTitle>
            </CardHeader>
            <CardContent>
              {competitiveLandscape ? (
                <div className="space-y-6">
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <Card className="border">
                      <CardContent className="pt-4">
                        <h3 className="font-medium mb-4">Concentration du marché</h3>
                        <div className="h-40">
                          <ResponsiveContainer width="100%" height="100%">
                            <PieChart>
                              <Pie
                                data={[
                                  { name: "Top players", value: competitiveLandscape.topPlayersMarketShare },
                                  { name: "Autres acteurs", value: 100 - competitiveLandscape.topPlayersMarketShare },
                                ]}
                                cx="50%"
                                cy="50%"
                                labelLine={false}
                                outerRadius={80}
                                fill="#8884d8"
                                dataKey="value"
                                label={({ name, percent }) => `${name}: ${(percent * 100).toFixed(0)}%`}
                              >
                                <Cell fill="#3b82f6" />
                                <Cell fill="#e5e7eb" />
                              </Pie>
                              <Tooltip formatter={(value) => [`${value}%`, "Part de marché"]} />
                            </PieChart>
                          </ResponsiveContainer>
                        </div>
                        <div className="text-sm text-gray-600 mt-2 text-center">
                          Indice de concentration: {competitiveLandscape.marketConcentration}
                          {competitiveLandscape.marketConcentrationUnit}
                        </div>
                      </CardContent>
                    </Card>

                    <Card className="border">
                      <CardContent className="pt-4">
                        <h3 className="font-medium mb-2">Tendance de consolidation</h3>
                        <div className="bg-blue-50 p-4 rounded-lg">
                          <div className="text-xl font-bold text-blue-800 mb-2 capitalize">
                            {competitiveLandscape.consolidationTrend}
                          </div>
                          <p className="text-sm text-blue-700">
                            {competitiveLandscape.consolidationTrend === "forte"
                              ? "Le marché connaît une forte consolidation avec des fusions et acquisitions fréquentes."
                              : competitiveLandscape.consolidationTrend === "modérée"
                                ? "Le marché présente une consolidation modérée avec quelques fusions et acquisitions notables."
                                : "Le marché reste fragmenté avec peu de mouvements de consolidation."}
                          </p>
                        </div>

                        <h3 className="font-medium mt-6 mb-2">Barrières à l'entrée</h3>
                        <ul className="space-y-2">
                          {competitiveLandscape.entryBarriers.map((barrier, idx) => (
                            <li key={idx} className="flex items-start">
                              <div className="h-5 w-5 rounded-full bg-red-100 text-red-600 flex items-center justify-center mr-2 mt-0.5 flex-shrink-0">
                                {idx + 1}
                              </div>
                              <span className="text-gray-700">{barrier}</span>
                            </li>
                          ))}
                        </ul>
                      </CardContent>
                    </Card>
                  </div>

                  <Card className="border">
                    <CardHeader className="pb-2">
                      <CardTitle className="text-base">Menaces disruptives</CardTitle>
                    </CardHeader>
                    <CardContent>
                      <div className="space-y-3">
                        {competitiveLandscape.disruptiveThreats.map((threat, idx) => (
                          <div key={idx} className="p-3 bg-amber-50 border border-amber-100 rounded-md">
                            <p className="text-amber-800">{threat}</p>
                          </div>
                        ))}
                      </div>
                    </CardContent>
                  </Card>
                </div>
              ) : (
                <div className="text-center py-8 text-gray-500">Données sur la concurrence non disponibles</div>
              )}
            </CardContent>
          </Card>
        </TabsContent>

        {/* Onglet Prévisions */}
        <TabsContent value="forecast" className="mt-0">
          <Card>
            <CardHeader className="pb-2">
              <CardTitle className="text-xl flex items-center">
                <TrendingUp className="h-5 w-5 mr-2 text-blue-600" />
                Prévisions de marché
              </CardTitle>
            </CardHeader>
            <CardContent>
              {futureForecast ? (
                <div className="space-y-6">
                  <div className="h-80">
                    <ResponsiveContainer width="100%" height="100%">
                      <LineChart data={forecastData} margin={{ top: 20, right: 30, left: 20, bottom: 5 }}>
                        <CartesianGrid strokeDasharray="3 3" />
                        <XAxis dataKey="name" />
                        <YAxis />
                        <Tooltip formatter={(value) => [`${value}%`, "Croissance projetée"]} />
                        <Legend />
                        <Line
                          type="monotone"
                          dataKey="growth"
                          name="Croissance projetée (%)"
                          stroke="#3b82f6"
                          activeDot={{ r: 8 }}
                        />
                      </LineChart>
                    </ResponsiveContainer>
                  </div>

                  <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    <Card className="border">
                      <CardHeader className="pb-2 bg-blue-50">
                        <CardTitle className="text-base flex items-center">
                          <Clock className="h-4 w-4 mr-2 text-blue-600" />
                          Court terme ({futureForecast.shortTerm.timeframe})
                        </CardTitle>
                      </CardHeader>
                      <CardContent className="pt-4">
                        <div className="mb-4">
                          <div className="text-2xl font-bold text-blue-600 mb-1">
                            +{futureForecast.shortTerm.projectedGrowth}
                            {futureForecast.shortTerm.projectedGrowthUnit}
                          </div>
                          <div className="text-sm text-gray-600">Croissance projetée</div>
                        </div>

                        <div className="space-y-4">
                          <div>
                            <h4 className="text-sm font-medium text-green-700 mb-1">OPPORTUNITÉS ÉMERGENTES</h4>
                            <ul className="space-y-1 list-disc pl-5 text-sm text-gray-700">
                              {futureForecast.shortTerm.emergingOpportunities.map((opportunity, idx) => (
                                <li key={idx}>{opportunity}</li>
                              ))}
                            </ul>
                          </div>

                          <div>
                            <h4 className="text-sm font-medium text-red-700 mb-1">MENACES POTENTIELLES</h4>
                            <ul className="space-y-1 list-disc pl-5 text-sm text-gray-700">
                              {futureForecast.shortTerm.potentialThreats.map((threat, idx) => (
                                <li key={idx}>{threat}</li>
                              ))}
                            </ul>
                          </div>
                        </div>
                      </CardContent>
                    </Card>

                    <Card className="border">
                      <CardHeader className="pb-2 bg-purple-50">
                        <CardTitle className="text-base flex items-center">
                          <Clock className="h-4 w-4 mr-2 text-purple-600" />
                          Moyen terme ({futureForecast.mediumTerm.timeframe})
                        </CardTitle>
                      </CardHeader>
                      <CardContent className="pt-4">
                        <div className="mb-4">
                          <div className="text-2xl font-bold text-purple-600 mb-1">
                            +{futureForecast.mediumTerm.projectedGrowth}
                            {futureForecast.mediumTerm.projectedGrowthUnit}
                          </div>
                          <div className="text-sm text-gray-600">Croissance projetée</div>
                        </div>

                        <div className="space-y-4">
                          <div>
                            <h4 className="text-sm font-medium text-green-700 mb-1">OPPORTUNITÉS ÉMERGENTES</h4>
                            <ul className="space-y-1 list-disc pl-5 text-sm text-gray-700">
                              {futureForecast.mediumTerm.emergingOpportunities.map((opportunity, idx) => (
                                <li key={idx}>{opportunity}</li>
                              ))}
                            </ul>
                          </div>

                          <div>
                            <h4 className="text-sm font-medium text-red-700 mb-1">MENACES POTENTIELLES</h4>
                            <ul className="space-y-1 list-disc pl-5 text-sm text-gray-700">
                              {futureForecast.mediumTerm.potentialThreats.map((threat, idx) => (
                                <li key={idx}>{threat}</li>
                              ))}
                            </ul>
                          </div>
                        </div>
                      </CardContent>
                    </Card>
                  </div>
                </div>
              ) : (
                <div className="text-center py-8 text-gray-500">Données de prévision non disponibles</div>
              )}
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>

      {/* Sources */}
      {sources && sources.length > 0 && (
        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="text-lg">Sources des données</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-3">
              {Array.isArray(sources)
                ? sources.map((source, idx) => (
                    <motion.div
                      key={idx}
                      initial={{ opacity: 0, y: 10 }}
                      animate={{ opacity: 1, y: 0 }}
                      transition={{ delay: 0.1 * idx }}
                      className="flex items-start"
                    >
                      <div className="h-5 w-5 rounded-full bg-blue-100 text-blue-600 flex items-center justify-center mr-2 mt-0.5 flex-shrink-0">
                        {idx + 1}
                      </div>
                      <div>
                        <div className="font-medium">{source.name}</div>
                        <div className="text-sm text-gray-600">
                          {source.publisher}, {source.year} • {source.type} • Crédibilité: {source.credibilityScore}
                          {source.credibilityScoreUnit}
                        </div>
                        {source.url && (
                          <a
                            href={source.url}
                            target="_blank"
                            rel="noopener noreferrer"
                            className="text-sm text-blue-600 hover:underline"
                          >
                            Consulter la source
                          </a>
                        )}
                      </div>
                    </motion.div>
                  ))
                : null}
            </div>
          </CardContent>
        </Card>
      )}
    </div>
  )
}

