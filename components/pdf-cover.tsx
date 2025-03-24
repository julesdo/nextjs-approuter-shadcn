"use client"

import { Card, CardContent } from "@/components/ui/card"

interface PdfCoverProps {
  url: string
  date: string
}

export default function PdfCover({ url, date }: PdfCoverProps) {
  return (
    <Card className="bg-white p-8 border-0 shadow-none">
      <CardContent className="flex flex-col items-center justify-center min-h-[500px] text-center">
        <div className="mb-8">
          <img
            src="/logo.png"
            alt="ImpactPage AI Logo"
            className="h-16 w-auto"
            onError={(e) => {
              e.currentTarget.style.display = "none"
            }}
          />
        </div>

        <h1 className="text-3xl font-bold text-blue-900 mb-4">Rapport d'analyse UX</h1>

        <div className="text-xl text-blue-700 mb-8">{url}</div>

        <div className="text-gray-500 mb-4">Généré le {date}</div>

        <div className="mt-12 text-sm text-gray-400">
          Rapport généré par ImpactPage AI - Analyse UX basée sur l'intelligence artificielle
        </div>
      </CardContent>
    </Card>
  )
}

