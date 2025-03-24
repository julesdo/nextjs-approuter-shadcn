"use client"

import { motion } from "framer-motion"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Progress } from "@/components/ui/progress"
import { ExternalLink, CheckCircle, XCircle } from "lucide-react"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"

interface CompetitorDetail {
  name: string
  url: string
  strengths: string
  weaknesses: string
  marketShare: number
}

interface CompetitorAnalysisProps {
  competitorDetails: CompetitorDetail[]
}

export default function CompetitorAnalysis({ competitorDetails }: CompetitorAnalysisProps) {
  return (
    <div className="space-y-6">
      <Card>
        <CardHeader className="pb-2">
          <CardTitle className="text-xl">Analyse des concurrents principaux</CardTitle>
        </CardHeader>
        <CardContent>
          <p className="text-gray-700 mb-4">
            Analyse détaillée des principaux concurrents identifiés dans votre secteur d'activité, basée sur des données
            réelles du marché.
          </p>

          <div className="mt-6">
            <Tabs defaultValue={competitorDetails[0]?.name || "competitor1"} className="w-full">
              <TabsList className="grid grid-cols-2 md:grid-cols-3 gap-2 mb-6">
                {competitorDetails.map((competitor, index) => (
                  <TabsTrigger key={index} value={competitor.name} className="text-sm">
                    {competitor.name}
                  </TabsTrigger>
                ))}
              </TabsList>

              {competitorDetails.map((competitor, index) => (
                <TabsContent key={index} value={competitor.name} className="mt-0">
                  <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ duration: 0.3 }}>
                    <Card>
                      <CardHeader className="pb-2 flex flex-row items-center justify-between">
                        <CardTitle className="text-lg">{competitor.name}</CardTitle>
                        <a
                          href={competitor.url}
                          target="_blank"
                          rel="noopener noreferrer"
                          className="text-blue-600 hover:text-blue-800 flex items-center text-sm"
                        >
                          Visiter le site <ExternalLink className="h-4 w-4 ml-1" />
                        </a>
                      </CardHeader>
                      <CardContent>
                        <div className="mb-4">
                          <div className="flex justify-between mb-1">
                            <span className="text-sm font-medium">Part de marché</span>
                            <span className="text-sm font-medium">{competitor.marketShare}%</span>
                          </div>
                          <Progress value={competitor.marketShare} className="h-2" />
                        </div>

                        <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mt-6">
                          <div>
                            <h4 className="text-sm font-semibold mb-2 flex items-center text-green-700">
                              <CheckCircle className="h-4 w-4 mr-1" />
                              Points forts
                            </h4>
                            <p className="text-sm text-gray-700">{competitor.strengths}</p>
                          </div>

                          <div>
                            <h4 className="text-sm font-semibold mb-2 flex items-center text-red-700">
                              <XCircle className="h-4 w-4 mr-1" />
                              Points faibles
                            </h4>
                            <p className="text-sm text-gray-700">{competitor.weaknesses}</p>
                          </div>
                        </div>

                        <div className="mt-6">
                          <h4 className="text-sm font-semibold mb-2">Opportunités face à ce concurrent</h4>
                          <div className="bg-blue-50 p-3 rounded-md text-sm text-blue-800">
                            {competitor.weaknesses.split(".")[0]}. Vous pouvez capitaliser sur cette faiblesse en
                            mettant en avant votre propre solution à ce problème.
                          </div>
                        </div>
                      </CardContent>
                    </Card>
                  </motion.div>
                </TabsContent>
              ))}
            </Tabs>
          </div>
        </CardContent>
      </Card>

      <Card>
        <CardHeader className="pb-2">
          <CardTitle className="text-lg">Positionnement concurrentiel</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="overflow-x-auto">
            <table className="min-w-full divide-y divide-gray-200">
              <thead className="bg-gray-50">
                <tr>
                  <th
                    scope="col"
                    className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider"
                  >
                    Concurrent
                  </th>
                  <th
                    scope="col"
                    className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider"
                  >
                    Part de marché
                  </th>
                  <th
                    scope="col"
                    className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider"
                  >
                    Positionnement
                  </th>
                  <th
                    scope="col"
                    className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider"
                  >
                    Avantage concurrentiel
                  </th>
                </tr>
              </thead>
              <tbody className="bg-white divide-y divide-gray-200">
                {competitorDetails.map((competitor, index) => (
                  <tr key={index}>
                    <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900">{competitor.name}</td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">{competitor.marketShare}%</td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                      <Badge className="bg-blue-100 text-blue-800 hover:bg-blue-200">
                        {competitor.marketShare > 20 ? "Leader" : competitor.marketShare > 10 ? "Challenger" : "Niche"}
                      </Badge>
                    </td>
                    <td className="px-6 py-4 text-sm text-gray-500">{competitor.strengths.split(".")[0]}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </CardContent>
      </Card>
    </div>
  )
}

