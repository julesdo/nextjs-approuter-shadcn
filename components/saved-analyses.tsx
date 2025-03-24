"use client"

import type React from "react"

import { useState } from "react"
import { motion } from "framer-motion"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { type SavedAnalysis, storageService } from "@/lib/storage-service"
import { Globe, Clock, Trash2, ExternalLink } from "lucide-react"
import { format } from "date-fns"
import { fr } from "date-fns/locale"

interface SavedAnalysesProps {
  onSelectAnalysis: (analysis: SavedAnalysis) => void
}

export default function SavedAnalyses({ onSelectAnalysis }: SavedAnalysesProps) {
  const [analyses, setAnalyses] = useState<SavedAnalysis[]>(() => storageService.getSavedAnalyses())

  const handleDelete = (id: string, e: React.MouseEvent) => {
    e.stopPropagation()
    storageService.deleteAnalysis(id)
    setAnalyses(storageService.getSavedAnalyses())
  }

  const formatDate = (dateString: string) => {
    try {
      return format(new Date(dateString), "dd MMMM yyyy à HH:mm", { locale: fr })
    } catch (error) {
      return dateString
    }
  }

  if (analyses.length === 0) {
    return (
      <Card className="bg-white/50 backdrop-blur-sm border border-gray-200">
        <CardContent className="p-6 text-center">
          <p className="text-gray-500">Aucune analyse sauvegardée</p>
        </CardContent>
      </Card>
    )
  }

  return (
    <Card className="bg-white/50 backdrop-blur-sm border border-gray-200">
      <CardHeader className="pb-2">
        <CardTitle className="text-xl flex items-center">
          <Clock className="h-5 w-5 mr-2 text-hyppe-purple" />
          Analyses récentes
        </CardTitle>
      </CardHeader>
      <CardContent className="p-0">
        <div className="divide-y">
          {analyses.map((analysis, index) => (
            <motion.div
              key={analysis.id}
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.05 * index }}
              className="p-4 hover:bg-gray-50 cursor-pointer transition-colors"
              onClick={() => onSelectAnalysis(analysis)}
            >
              <div className="flex justify-between items-start">
                <div className="flex items-start space-x-3">
                  <div className="h-10 w-10 rounded-full bg-gradient-hyppe flex items-center justify-center flex-shrink-0">
                    <Globe className="h-5 w-5 text-white" />
                  </div>
                  <div>
                    <h3 className="font-medium text-gray-900 truncate max-w-xs">{analysis.url}</h3>
                    <p className="text-sm text-gray-500">{formatDate(analysis.date)}</p>
                  </div>
                </div>
                <div className="flex space-x-2">
                  <Button
                    variant="ghost"
                    size="icon"
                    className="h-8 w-8 text-gray-500 hover:text-gray-700"
                    onClick={(e) => {
                      e.stopPropagation()
                      window.open(analysis.url, "_blank")
                    }}
                  >
                    <ExternalLink className="h-4 w-4" />
                  </Button>
                  <Button
                    variant="ghost"
                    size="icon"
                    className="h-8 w-8 text-gray-500 hover:text-red-600"
                    onClick={(e) => handleDelete(analysis.id, e)}
                  >
                    <Trash2 className="h-4 w-4" />
                  </Button>
                </div>
              </div>
            </motion.div>
          ))}
        </div>
      </CardContent>
    </Card>
  )
}

