import { clsx, type ClassValue } from "clsx"
import { twMerge } from "tailwind-merge"

/**
 * Extrait un objet JSON d'une réponse texte, même si celle-ci contient du texte supplémentaire
 */
export function extractJsonFromResponse(text: string): any {
  try {
    // Essayer d'abord de parser directement le texte comme JSON
    return JSON.parse(text.trim())
  } catch (error) {
    console.log("Erreur lors du parsing direct, tentative d'extraction:", error)
    console.log("Texte reçu:", text.substring(0, 200) + "...")

    // Si ça échoue, chercher un bloc JSON dans le texte
    const jsonRegex = /```(?:json)?\s*([\s\S]*?)```/
    const match = text.match(jsonRegex)

    if (match && match[1]) {
      try {
        // Si on trouve un bloc JSON, parser son contenu
        return JSON.parse(match[1].trim())
      } catch (jsonError) {
        console.error("Erreur lors du parsing du bloc JSON:", jsonError)
      }
    }

    // Si aucune des méthodes ci-dessus ne fonctionne, essayer de trouver un objet JSON dans le texte
    const possibleJson = text.match(/(\{[\s\S]*\})/)
    if (possibleJson && possibleJson[0]) {
      try {
        return JSON.parse(possibleJson[0])
      } catch (jsonError) {
        console.error("Erreur lors du parsing de l'objet JSON trouvé:", jsonError)
      }
    }

    // Dernière tentative: chercher le début d'un objet JSON et essayer de le compléter
    if (text.includes("{") && !text.includes("}")) {
      try {
        const jsonStart = text.substring(text.indexOf("{"))
        return JSON.parse(jsonStart + "}")
      } catch (jsonError) {
        console.error("Erreur lors de la tentative de complétion JSON:", jsonError)
      }
    }

    // Si tout échoue, renvoyer un objet par défaut
    console.error("Impossible d'extraire un JSON valide de la réponse")
    throw new Error("La réponse ne contient pas de JSON valide: " + text.substring(0, 100))
  }
}

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs))
}

