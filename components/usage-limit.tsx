"use client"

import { useEffect, useState } from "react"
import { motion } from "framer-motion"
import { Card, CardContent } from "@/components/ui/card"
import { Progress } from "@/components/ui/progress"
import { storageService } from "@/lib/storage-service"
import { AlertCircle } from "lucide-react"

export default function UsageLimit() {
  const [usageInfo, setUsageInfo] = useState(() => storageService.checkUsageLimit())

  useEffect(() => {
    // Mettre à jour les informations d'utilisation toutes les minutes
    const interval = setInterval(() => {
      setUsageInfo(storageService.checkUsageLimit())
    }, 60000)

    return () => clearInterval(interval)
  }, [])

  const { canAnalyze, remainingAnalyses } = usageInfo
  const maxAnalyses = 3 // Doit correspondre à MAX_ANALYSES_PER_DAY dans le service
  const usedAnalyses = maxAnalyses - remainingAnalyses
  const progressPercentage = (usedAnalyses / maxAnalyses) * 100

  return (
    <motion.div initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.2 }}>
      <Card className="bg-white/50 backdrop-blur-sm border border-gray-200">
        <CardContent className="p-4">
          <div className="flex items-center justify-between mb-2">
            <h3 className="text-sm font-medium text-gray-700">Analyses restantes aujourd'hui</h3>
            <span className="text-sm font-bold">
              {remainingAnalyses}/{maxAnalyses}
            </span>
          </div>
          <Progress value={progressPercentage} className="h-2" />

          {!canAnalyze && (
            <div className="mt-3 flex items-start text-sm text-amber-700 bg-amber-50 p-2 rounded">
              <AlertCircle className="h-4 w-4 mt-0.5 mr-2 flex-shrink-0" />
              <p>
                Vous avez atteint votre limite quotidienne d'analyses. Revenez demain ou passez à la version premium
                pour des analyses illimitées.
              </p>
            </div>
          )}
        </CardContent>
      </Card>
    </motion.div>
  )
}

