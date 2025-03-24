import { generateText } from "ai"
import { openai } from "@ai-sdk/openai"
import { extractJsonFromResponse } from "./utils"

/**
 * Gets competitors for the specified URL and industry
 * This is a simplified version that uses OpenAI to generate realistic competitor data
 * In a production environment, you would use real competitor analysis APIs or web scraping
 */
export async function getCompetitors(url: string, industry: string): Promise<any> {
  try {
    const apiKey = process.env.OPENAI_API_KEY
    if (!apiKey) {
      throw new Error("OPENAI_API_KEY is not set")
    }

    // Extract domain from URL
    const domain = new URL(url).hostname.replace("www.", "")

    // In a real implementation, this would use competitor analysis APIs or web scraping
    // For now, we'll use OpenAI to generate realistic competitor data
    const prompt = `
      Tu es un expert en analyse concurrentielle. Identifie les principaux concurrents pour le site 
      "${domain}" dans l'industrie "${industry}".
      
      IMPORTANT: Tu dois UNIQUEMENT renvoyer un objet JSON valide avec cette structure exacte, sans aucun texte supplémentaire:
      {
        "mainCompetitors": [
          {
            "name": "Nom de l'entreprise",
            "domain": "domaine.com",
            "description": "Description courte de l'entreprise",
            "strengths": ["Force 1", "Force 2"],
            "weaknesses": ["Faiblesse 1", "Faiblesse 2"],
            "marketShare": number,
            "conversionRate": number,
            "uniqueSellingPoints": ["USP 1", "USP 2"]
          }
        ],
        "competitorComparison": {
          "pricing": {
            "target": "Description du positionnement prix du site cible",
            "competitors": "Description du positionnement prix des concurrents"
          },
          "features": {
            "target": ["Fonctionnalité 1", "Fonctionnalité 2"],
            "competitors": ["Fonctionnalité 1", "Fonctionnalité 2"]
          },
          "marketingStrategies": {
            "target": ["Stratégie 1", "Stratégie 2"],
            "competitors": ["Stratégie 1", "Stratégie 2"]
          }
        },
        "competitiveLandscape": {
          "barriers": ["Barrière à l'entrée 1", "Barrière à l'entrée 2"],
          "opportunities": ["Opportunité 1", "Opportunité 2"],
          "threats": ["Menace 1", "Menace 2"]
        }
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
    console.error("Error getting competitors:", error)
    return {
      mainCompetitors: [],
      competitorComparison: {
        pricing: { target: "", competitors: "" },
        features: { target: [], competitors: [] },
        marketingStrategies: { target: [], competitors: [] },
      },
      competitiveLandscape: {
        barriers: [],
        opportunities: [],
        threats: [],
      },
    }
  }
}

