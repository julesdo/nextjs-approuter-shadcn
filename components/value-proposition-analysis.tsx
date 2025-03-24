"use client"

import { motion } from "framer-motion"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { CheckCircle, XCircle, ArrowUpCircle, Users } from "lucide-react"

interface ValuePropositionProps {
  valueProposition: {
    current: string
    strength: string
    weakness: string
    improvement: string
    competitorComparison: string
  }
}

export default function ValuePropositionAnalysis({ valueProposition }: ValuePropositionProps) {
  const { current, strength, weakness, improvement, competitorComparison } = valueProposition

  return (
    <div className="space-y-6">
      <Card>
        <CardHeader className="pb-2">
          <CardTitle className="text-xl">Analyse de la proposition de valeur</CardTitle>
        </CardHeader>
        <CardContent>
          <p className="text-gray-700 italic border-l-4 border-blue-200 pl-4 py-2 bg-blue-50 rounded-r-md">
            "{current}"
          </p>
        </CardContent>
      </Card>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.4 }}>
          <Card className="h-full border-green-100">
            <CardHeader className="pb-2 bg-green-50 rounded-t-lg">
              <CardTitle className="text-lg flex items-center text-green-700">
                <CheckCircle className="h-5 w-5 mr-2 text-green-600" />
                Points forts
              </CardTitle>
            </CardHeader>
            <CardContent>
              <p className="text-gray-700">{strength}</p>
            </CardContent>
          </Card>
        </motion.div>

        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.4, delay: 0.1 }}
        >
          <Card className="h-full border-red-100">
            <CardHeader className="pb-2 bg-red-50 rounded-t-lg">
              <CardTitle className="text-lg flex items-center text-red-700">
                <XCircle className="h-5 w-5 mr-2 text-red-600" />
                Points faibles
              </CardTitle>
            </CardHeader>
            <CardContent>
              <p className="text-gray-700">{weakness}</p>
            </CardContent>
          </Card>
        </motion.div>

        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.4, delay: 0.2 }}
        >
          <Card className="h-full border-blue-100">
            <CardHeader className="pb-2 bg-blue-50 rounded-t-lg">
              <CardTitle className="text-lg flex items-center text-blue-700">
                <ArrowUpCircle className="h-5 w-5 mr-2 text-blue-600" />
                Pistes d'amélioration
              </CardTitle>
            </CardHeader>
            <CardContent>
              <p className="text-gray-700">{improvement}</p>
            </CardContent>
          </Card>
        </motion.div>
      </div>

      <Card>
        <CardHeader className="pb-2">
          <CardTitle className="text-lg flex items-center">
            <Users className="h-5 w-5 mr-2 text-blue-600" />
            Comparaison avec les concurrents
          </CardTitle>
        </CardHeader>
        <CardContent>
          <p className="text-gray-700">{competitorComparison}</p>

          <div className="mt-4 p-4 bg-amber-50 border border-amber-100 rounded-md">
            <p className="text-amber-800 text-sm">
              <strong>Opportunité :</strong> Différenciez-vous de vos concurrents en mettant davantage en avant les
              points forts identifiés dans votre proposition de valeur.
            </p>
          </div>
        </CardContent>
      </Card>
    </div>
  )
}

