import { generateText } from "ai"
import { openai } from "@ai-sdk/openai"
import { extractJsonFromResponse } from "./utils"

/**
 * Performs a web search for the given query and returns structured results
 * This is a simplified version that uses OpenAI to simulate search results
 * In a production environment, you would use a real search API like Google Custom Search, Bing, etc.
 */
export async function searchWeb(query: string): Promise<any> {
  try {
    const apiKey = process.env.OPENAI_API_KEY
    if (!apiKey) {
      throw new Error("OPENAI_API_KEY is not set")
    }

    // In a real implementation, this would call a search API
    // For now, we'll use OpenAI to simulate search results based on its knowledge
    const prompt = `
      Tu es un moteur de recherche web spécialisé dans les données de marché, les statistiques d'industrie, 
      et les analyses concurrentielles. Recherche des informations pertinentes pour la requête suivante:
      
      "${query}"
      
      IMPORTANT: Tu dois UNIQUEMENT renvoyer un objet JSON valide avec cette structure exacte, sans aucun texte supplémentaire:
      {
        "results": [
          {
            "title": "Titre du résultat",
            "snippet": "Extrait pertinent avec des données chiffrées si possible",
            "source": "Source de l'information (site web, rapport, etc.)",
            "url": "URL fictive mais réaliste",
            "date": "Date de publication approximative"
          }
        ],
        "statistics": [
          {
            "metric": "Nom de la métrique",
            "value": "Valeur numérique",
            "unit": "Unité de mesure",
            "source": "Source de la statistique",
            "year": "Année de la donnée"
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
    console.error("Error in web search:", error)
    return {
      results: [],
      statistics: [],
    }
  }
}

