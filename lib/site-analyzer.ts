import { generateText } from "ai"
import { openai } from "@ai-sdk/openai"
import { extractJsonFromResponse } from "./utils"

/**
 * Analyzes a website to determine its industry, content, and basic information
 * This is a simplified version that uses OpenAI to analyze the site
 * In a production environment, you would use web scraping and more sophisticated analysis
 */
export async function analyzeSite(url: string): Promise<any> {
  try {
    const apiKey = process.env.OPENAI_API_KEY
    if (!apiKey) {
      throw new Error("OPENAI_API_KEY is not set")
    }

    // In a real implementation, this would scrape the website and analyze its content
    // For now, we'll use OpenAI to simulate site analysis
    const prompt = `
      Tu es un expert en analyse de sites web. Analyse le site à l'URL suivante: "${url}".
      
      Détermine l'industrie, le secteur d'activité, le type d'entreprise, et les informations clés 
      que tu peux déduire de l'URL.
      
      IMPORTANT: Tu dois UNIQUEMENT renvoyer un objet JSON valide avec cette structure exacte, sans aucun texte supplémentaire:
      {
        "industry": "Industrie principale",
        "sector": "Secteur d'activité",
        "businessType": "B2B | B2C | B2B2C",
        "estimatedSize": "Startup | PME | Grande entreprise",
        "targetAudience": "Description de l'audience cible",
        "likelyGoals": ["Objectif 1", "Objectif 2"],
        "potentialChallenges": ["Défi 1", "Défi 2"],
        "keyFeatures": ["Caractéristique 1", "Caractéristique 2"]
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
    console.error("Error analyzing site:", error)
    // Renvoyer un objet par défaut en cas d'erreur
    return {
      industry: "Non déterminé",
      sector: "Non déterminé",
      businessType: "Non déterminé",
      estimatedSize: "Non déterminé",
      targetAudience: "Non déterminé",
      likelyGoals: [],
      potentialChallenges: [],
      keyFeatures: [],
    }
  }
}

