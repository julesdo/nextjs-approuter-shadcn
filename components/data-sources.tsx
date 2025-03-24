"use client"

import { motion } from "framer-motion"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"

interface Source {
  name: string
  type?: string
  publisher?: string
  year?: number
  credibilityScore?: number
  credibilityScoreUnit?: string
  url?: string
}

interface DataSourcesProps {
  sources: (string | Source)[]
}

export default function DataSources({ sources }: DataSourcesProps) {
  // Vérifier si les sources sont des objets ou des chaînes de caractères
  const isStructuredSources = sources.length > 0 && typeof sources[0] !== "string"

  return (
    <Card>
      <CardHeader className="pb-2">
        <CardTitle className="text-lg">Sources des données</CardTitle>
      </CardHeader>
      <CardContent>
        <p className="text-gray-700 mb-4">
          Toutes les données présentées dans ce rapport proviennent de sources fiables et à jour.
        </p>

        <ul className="space-y-2">
          {sources.map((source, index) => (
            <motion.li
              key={index}
              initial={{ opacity: 0, x: -10 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ delay: 0.1 * index }}
              className="flex items-start"
            >
              <div className="h-5 w-5 rounded-full bg-blue-100 text-blue-600 flex items-center justify-center mr-2 mt-0.5 flex-shrink-0">
                {index + 1}
              </div>
              {typeof source === "string" ? (
                <span className="text-gray-700">{source}</span>
              ) : (
                <div className="text-gray-700">
                  <p className="font-medium">{source.name}</p>
                  {source.type && source.publisher && (
                    <p className="text-sm text-gray-600">
                      {source.type} par {source.publisher}
                      {source.year && ` (${source.year})`}
                    </p>
                  )}
                  {source.credibilityScore && (
                    <p className="text-sm text-gray-600">
                      Crédibilité: {source.credibilityScore}
                      {source.credibilityScoreUnit || "/10"}
                    </p>
                  )}
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
              )}
            </motion.li>
          ))}
        </ul>

        <div className="mt-6 text-sm text-gray-500">
          <p>
            Les données de marché sont collectées à partir de sources publiques et d'analyses sectorielles. Pour des
            données plus précises et personnalisées, consultez notre version Premium.
          </p>
        </div>
      </CardContent>
    </Card>
  )
}

