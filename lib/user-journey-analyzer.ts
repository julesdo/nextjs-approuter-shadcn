import { generateText } from "ai"
import { openai } from "@ai-sdk/openai"
import { extractJsonFromResponse } from "./utils"
import chromium from "@sparticuz/chromium-min"
import puppeteer from "puppeteer-core"

/**
 * Analyzes the user journey for a website
 * Uses AI to map out the typical user journey and identify friction points
 */
export async function analyzeUserJourney(url: string, industry: string, apiKey: string): Promise<any> {
  try {
    console.log(`Analyzing user journey for ${url}...`)

    // Try to map the site structure using Puppeteer
    let siteStructure = {}
    let mainCTAs = []

    try {
      const browser = await puppeteer.launch({
        args: [...chromium.args, "--hide-scrollbars", "--disable-web-security"],
        defaultViewport: chromium.defaultViewport,
        executablePath: await chromium.executablePath(),
        headless: true,
        ignoreHTTPSErrors: true,
      })

      const page = await browser.newPage()
      await page.setViewport({ width: 1280, height: 800 })
      await page.goto(url, { waitUntil: "networkidle2", timeout: 30000 })

      // Extract main navigation links
      const navLinks = await page.evaluate(() => {
        return Array.from(document.querySelectorAll("nav a, header a, .navigation a")).map((el) => {
          return {
            text: el.textContent?.trim(),
            href: el.getAttribute("href"),
          }
        })
      })

      // Extract main CTAs
      mainCTAs = await page.evaluate(() => {
        const ctaSelectors = [
          "a.btn-primary",
          "a.cta",
          "button.cta",
          ".cta a",
          "a.btn",
          "button.btn-primary",
          'a[href*="signup"]',
          'a[href*="register"]',
          'a[href*="contact"]',
          "a.button",
          "button.button",
        ]

        const ctaElements = []
        for (const selector of ctaSelectors) {
          const elements = document.querySelectorAll(selector)
          elements.forEach((el) => {
            ctaElements.push({
              text: el.textContent?.trim(),
              type: el.tagName.toLowerCase(),
              location: el.getBoundingClientRect().top < window.innerHeight / 2 ? "above-fold" : "below-fold",
            })
          })
        }

        return ctaElements
      })

      // Extract form fields if any
      const formFields = await page.evaluate(() => {
        return Array.from(document.querySelectorAll("form input, form select, form textarea")).map((el) => {
          return {
            type: el.getAttribute("type") || el.tagName.toLowerCase(),
            name: el.getAttribute("name"),
            placeholder: el.getAttribute("placeholder"),
            required: el.hasAttribute("required"),
          }
        })
      })

      siteStructure = {
        navLinks,
        mainCTAs,
        formFields,
        pageTitle: await page.title(),
      }

      await browser.close()
    } catch (error) {
      console.error("Error in Puppeteer site mapping:", error)
      // Continue with AI analysis even if Puppeteer fails
    }

    // Use OpenAI to analyze the user journey
    const prompt = `
      Tu es un expert en UX/UI et en analyse de parcours utilisateur. Analyse le parcours utilisateur typique pour ce site web.
      
      URL: ${url}
      Industrie: ${industry}
      
      Structure du site (si disponible):
      ${JSON.stringify(siteStructure)}
      
      Basé sur ces informations et ton expertise dans le domaine ${industry}, analyse le parcours utilisateur typique pour ce site.
      
      Considère les étapes suivantes du parcours:
      1. Découverte (arrivée sur la page d'accueil)
      2. Considération (exploration des produits/services)
      3. Décision (évaluation des options, tarification)
      4. Action (inscription, achat, contact)
      5. Fidélisation (onboarding, utilisation continue)
      
      Pour chaque étape, identifie:
      - Le touchpoint principal (page ou élément d'interface)
      - L'objectif de l'utilisateur à cette étape
      - Les potentiels points de friction
      - Les opportunités d'amélioration
      - L'émotion probable de l'utilisateur (positive, neutre, négative)
      
      IMPORTANT: Tu dois UNIQUEMENT renvoyer un objet JSON valide avec cette structure exacte, sans aucun texte supplémentaire:
      {
        "journeySteps": [
          {
            "stage": "Nom de l'étape",
            "touchpoint": "Point de contact principal",
            "userGoal": "Objectif de l'utilisateur",
            "userEmotion": "positive|neutral|negative",
            "frictionPoints": ["Point de friction 1", "Point de friction 2"],
            "opportunities": ["Opportunité 1", "Opportunité 2"]
          }
        ],
        "criticalPoints": ["Point critique 1 dans le parcours", "Point critique 2 dans le parcours"]
      }
      
      Ne commence pas ta réponse par "Voici" ou d'autres phrases. Renvoie UNIQUEMENT l'objet JSON.
    `

    const { text } = await generateText({
      model: openai("gpt-4o-mini", { apiKey }),
      prompt,
    })

    return extractJsonFromResponse(text)
  } catch (error) {
    console.error("Error in user journey analysis:", error)
    return {
      journeySteps: [],
      criticalPoints: [],
    }
  }
}

