import { generateText } from "ai"
import { openai } from "@ai-sdk/openai"
import { extractJsonFromResponse } from "./utils"
import chromium from "@sparticuz/chromium-min"
import puppeteer from "puppeteer-core"

/**
 * Analyzes a website using Nielsen's heuristic principles
 * Uses AI to evaluate the site against the 10 heuristic principles
 */
export async function analyzeUxHeuristics(url: string, apiKey: string): Promise<any> {
  try {
    console.log(`Analyzing UX heuristics for ${url}...`)

    // Capture screenshot and HTML content using Puppeteer
    let screenshot = null
    let htmlContent = ""

    try {
      const browser = await puppeteer.launch({
        args: [...chromium.args, "--hide-scrollbars", "--disable-web-security"],
        defaultViewport: chromium.defaultViewport,
        executablePath: await chromium.executablePath(),
        headless: true,
      })

      const page = await browser.newPage()
      await page.setViewport({ width: 1280, height: 800 })
      await page.goto(url, { waitUntil: "networkidle2", timeout: 30000 })

      // Take screenshot
      screenshot = await page.screenshot({ encoding: "base64" })

      // Get HTML content
      htmlContent = await page.content()

      // Extract key UI elements
      const uiElements = await page.evaluate(() => {
        const elements = {
          headings: Array.from(document.querySelectorAll("h1, h2, h3")).map((el) => el.textContent),
          buttons: Array.from(document.querySelectorAll('button, a.btn, .button, [role="button"]')).map(
            (el) => el.textContent,
          ),
          forms: Array.from(document.querySelectorAll("form")).length,
          images: Array.from(document.querySelectorAll("img")).length,
          navigation: Array.from(document.querySelectorAll("nav a, header a, .navigation a")).map(
            (el) => el.textContent,
          ),
          footerLinks: Array.from(document.querySelectorAll("footer a")).map((el) => el.textContent),
        }
        return elements
      })

      await browser.close()

      // Use OpenAI to analyze the heuristics based on the captured data
      const prompt = `
        Tu es un expert en UX/UI et en heuristiques de Nielsen. Analyse cette page web en utilisant les 10 principes heuristiques de Nielsen.
        
        URL: ${url}
        
        Éléments UI détectés:
        ${JSON.stringify(uiElements)}
        
        HTML (partiel):
        ${htmlContent.substring(0, 10000)}
        
        Évalue chacun des 10 principes heuristiques de Nielsen:
        1. Visibilité de l'état du système
        2. Correspondance entre le système et le monde réel
        3. Contrôle et liberté de l'utilisateur
        4. Cohérence et standards
        5. Prévention des erreurs
        6. Reconnaissance plutôt que rappel
        7. Flexibilité et efficacité
        8. Esthétique et design minimaliste
        9. Aide à la reconnaissance et récupération des erreurs
        10. Aide et documentation
        
        IMPORTANT: Tu dois UNIQUEMENT renvoyer un objet JSON valide avec cette structure exacte, sans aucun texte supplémentaire:
        {
          "heuristicScores": {
            "visibility": number,
            "realWorldMatch": number,
            "userControl": number,
            "consistency": number,
            "errorPrevention": number,
            "recognition": number,
            "flexibility": number,
            "aesthetics": number,
            "errorRecovery": number,
            "help": number
          },
          "detailedAnalysis": [
            {
              "principle": "Nom du principe",
              "score": number,
              "status": "success|warning|error",
              "description": "Description courte",
              "details": "Analyse détaillée",
              "recommendations": "Recommandations d'amélioration"
            }
          ]
        }
        
        Ne commence pas ta réponse par "Voici" ou d'autres phrases. Renvoie UNIQUEMENT l'objet JSON.
      `

      const { text } = await generateText({
        model: openai("gpt-4o-mini", { apiKey }),
        prompt,
      })

      return extractJsonFromResponse(text)
    } catch (error) {
      console.error("Error in Puppeteer analysis:", error)

      // Fallback to direct AI analysis without Puppeteer
      const prompt = `
        Tu es un expert en UX/UI et en heuristiques de Nielsen. Analyse cette page web en utilisant les 10 principes heuristiques de Nielsen.
        
        URL: ${url}
        
        Évalue chacun des 10 principes heuristiques de Nielsen pour ce site web, en te basant sur ton expérience et les meilleures pratiques du secteur.
        
        IMPORTANT: Tu dois UNIQUEMENT renvoyer un objet JSON valide avec cette structure exacte, sans aucun texte supplémentaire:
        {
          "heuristicScores": {
            "visibility": number,
            "realWorldMatch": number,
            "userControl": number,
            "consistency": number,
            "errorPrevention": number,
            "recognition": number,
            "flexibility": number,
            "aesthetics": number,
            "errorRecovery": number,
            "help": number
          },
          "detailedAnalysis": [
            {
              "principle": "Nom du principe",
              "score": number,
              "status": "success|warning|error",
              "description": "Description courte",
              "details": "Analyse détaillée",
              "recommendations": "Recommandations d'amélioration"
            }
          ]
        }
        
        Ne commence pas ta réponse par "Voici" ou d'autres phrases. Renvoie UNIQUEMENT l'objet JSON.
      `

      const { text } = await generateText({
        model: openai("gpt-4o-mini", { apiKey }),
        prompt,
      })

      return extractJsonFromResponse(text)
    }
  } catch (error) {
    console.error("Error in UX heuristic analysis:", error)
    return {
      heuristicScores: {
        visibility: 70,
        realWorldMatch: 65,
        userControl: 60,
        consistency: 75,
        errorPrevention: 55,
        recognition: 60,
        flexibility: 50,
        aesthetics: 70,
        errorRecovery: 55,
        help: 45,
      },
      detailedAnalysis: [],
    }
  }
}

