"use client"

import { motion } from "framer-motion"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { ArrowUpCircle, ArrowRightCircle, AlertCircle } from "lucide-react"

interface Recommendation {
  title: string
  description: string
  impact: "high" | "medium" | "low"
}

interface RecommendationCardProps {
  recommendation: Recommendation
  index: number
}

export default function RecommendationCard({ recommendation, index }: RecommendationCardProps) {
  const { title, description, impact } = recommendation

  const getImpactColor = () => {
    switch (impact) {
      case "high":
        return "bg-red-100 text-red-800 hover:bg-red-200"
      case "medium":
        return "bg-yellow-100 text-yellow-800 hover:bg-yellow-200"
      case "low":
        return "bg-green-100 text-green-800 hover:bg-green-200"
      default:
        return "bg-blue-100 text-blue-800 hover:bg-blue-200"
    }
  }

  const getImpactIcon = () => {
    switch (impact) {
      case "high":
        return <ArrowUpCircle className="h-4 w-4 mr-1" />
      case "medium":
        return <ArrowRightCircle className="h-4 w-4 mr-1" />
      case "low":
        return <AlertCircle className="h-4 w-4 mr-1" />
      default:
        return null
    }
  }

  const getImpactLabel = () => {
    switch (impact) {
      case "high":
        return "Impact élevé"
      case "medium":
        return "Impact moyen"
      case "low":
        return "Impact faible"
      default:
        return "Impact"
    }
  }

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.5, delay: 0.1 * index }}
      whileHover={{ scale: 1.02 }}
      className="transition-all"
    >
      <Card className="border-l-4 border-l-blue-500">
        <CardHeader className="pb-2">
          <div className="flex justify-between items-start">
            <CardTitle className="text-lg">{title}</CardTitle>
            <Badge className={`flex items-center ${getImpactColor()}`}>
              {getImpactIcon()}
              {getImpactLabel()}
            </Badge>
          </div>
        </CardHeader>
        <CardContent>
          <p className="text-gray-600">{description}</p>
        </CardContent>
      </Card>
    </motion.div>
  )
}

