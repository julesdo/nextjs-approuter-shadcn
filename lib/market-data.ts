import { generateText } from "ai"
import { openai } from "@ai-sdk/openai"
import { extractJsonFromResponse } from "./utils"

/**
 * Gets market data for the specified industry
 * This is a simplified version that uses OpenAI to generate realistic market data
 * In a production environment, you would use real market data APIs or databases
 */
export async function getMarketData(industry: string): Promise<any> {
  try {
    const apiKey = process.env.OPENAI_API_KEY
    if (!apiKey) {
      throw new Error("OPENAI_API_KEY is not set")
    }

    // In a real implementation, this would call market data APIs or databases
    // For now, we'll use OpenAI to generate realistic market data
    const prompt = `
      Tu es un expert en analyse de marché et données sectorielles. Génère des données de marché réalistes 
      et actuelles pour l'industrie suivante: "${industry}".
      
      IMPORTANT: Tu dois UNIQUEMENT renvoyer un objet JSON valide avec cette structure exacte, sans aucun texte supplémentaire:
      {
        "industry": "${industry}",
        "marketSize": {
          "value": number,
          "unit": "millions € | milliards €",
          "year": number,
          "growthRate": number
        },
        "keyPlayers": [
          {
            "name": "Nom de l'entreprise",
            "marketShare": number,
            "revenue": {
              "value": number,
              "unit": "millions € | milliards €"
            },
            "strengths": ["Force 1", "Force 2"],
            "weaknesses": ["Faiblesse 1", "Faiblesse 2"]
          }
        ],
        "trends": [
          {
            "name": "Nom de la tendance",
            "description": "Description de la tendance",
            "impact": "high | medium | low",
            "adoptionRate": number
          }
        ],
        "metrics": {
          "averageConversionRate": number,
          "customerAcquisitionCost": number,
          "customerLifetimeValue": number,
          "returnOnInvestment": number,
          "averageSalesCycle": number
        },
        "sources": [
          {
            "name": "Nom de la source",
            "url": "URL fictive mais réaliste",
            "year": number
          }
        ]
      }
      
      Ne commence pas ta réponse par "Voici" ou d'autres phrases. Renvoie UNIQUEMENT l'objet JSON.
    `

    const { text } = await generateText({
      model: openai("gpt-4o-mini", { apiKey }),
      prompt,
    })

    // Utiliser la fonction d'extraction JSON robuste
    return extractJsonFromResponse(text)
  } catch (error) {
    console.error("Error getting market data:", error)
    return {
      industry: industry,
      marketSize: {
        value: 0,
        unit: "millions €",
        year: new Date().getFullYear(),
        growthRate: 0,
      },
      keyPlayers: [],
      trends: [],
      metrics: {
        averageConversionRate: 0,
        customerAcquisitionCost: 0,
        customerLifetimeValue: 0,
        returnOnInvestment: 0,
        averageSalesCycle: 0,
      },
      sources: [],
    }
  }
}

