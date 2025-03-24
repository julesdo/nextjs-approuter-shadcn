export interface SavedAnalysis {
  id: string
  url: string
  date: string
  result: any
}

export interface UsageLimit {
  count: number
  lastReset: string
}

const STORAGE_KEYS = {
  ANALYSES: "hyppe-impact-analyses",
  USAGE: "hyppe-impact-usage",
}

const MAX_ANALYSES_PER_DAY = 3

export const storageService = {
  // Sauvegarder une analyse
  saveAnalysis: (url: string, result: any): SavedAnalysis => {
    try {
      const analyses = storageService.getSavedAnalyses()

      // Créer une nouvelle analyse
      const newAnalysis: SavedAnalysis = {
        id: Date.now().toString(),
        url,
        date: new Date().toISOString(),
        result,
      }

      // Ajouter au début de la liste
      analyses.unshift(newAnalysis)

      // Limiter à 10 analyses sauvegardées
      const limitedAnalyses = analyses.slice(0, 10)

      // Sauvegarder dans le localStorage
      localStorage.setItem(STORAGE_KEYS.ANALYSES, JSON.stringify(limitedAnalyses))

      return newAnalysis
    } catch (error) {
      console.error("Erreur lors de la sauvegarde de l'analyse:", error)
      return {
        id: Date.now().toString(),
        url,
        date: new Date().toISOString(),
        result,
      }
    }
  },

  // Récupérer toutes les analyses sauvegardées
  getSavedAnalyses: (): SavedAnalysis[] => {
    try {
      const analysesJson = localStorage.getItem(STORAGE_KEYS.ANALYSES)
      return analysesJson ? JSON.parse(analysesJson) : []
    } catch (error) {
      console.error("Erreur lors de la récupération des analyses:", error)
      return []
    }
  },

  // Récupérer une analyse par son ID
  getAnalysisById: (id: string): SavedAnalysis | null => {
    try {
      const analyses = storageService.getSavedAnalyses()
      return analyses.find((analysis) => analysis.id === id) || null
    } catch (error) {
      console.error("Erreur lors de la récupération de l'analyse:", error)
      return null
    }
  },

  // Supprimer une analyse
  deleteAnalysis: (id: string): boolean => {
    try {
      const analyses = storageService.getSavedAnalyses()
      const filteredAnalyses = analyses.filter((analysis) => analysis.id !== id)
      localStorage.setItem(STORAGE_KEYS.ANALYSES, JSON.stringify(filteredAnalyses))
      return true
    } catch (error) {
      console.error("Erreur lors de la suppression de l'analyse:", error)
      return false
    }
  },

  // Vérifier si l'utilisateur a atteint sa limite quotidienne
  checkUsageLimit: (): { canAnalyze: boolean; remainingAnalyses: number } => {
    try {
      // Récupérer l'utilisation actuelle
      const usageJson = localStorage.getItem(STORAGE_KEYS.USAGE)
      let usage: UsageLimit = usageJson ? JSON.parse(usageJson) : { count: 0, lastReset: new Date().toISOString() }

      // Vérifier si on doit réinitialiser le compteur (nouveau jour)
      const lastReset = new Date(usage.lastReset)
      const now = new Date()
      const isNewDay =
        lastReset.getDate() !== now.getDate() ||
        lastReset.getMonth() !== now.getMonth() ||
        lastReset.getFullYear() !== now.getFullYear()

      if (isNewDay) {
        usage = { count: 0, lastReset: now.toISOString() }
      }

      const remainingAnalyses = MAX_ANALYSES_PER_DAY - usage.count

      return {
        canAnalyze: remainingAnalyses > 0,
        remainingAnalyses,
      }
    } catch (error) {
      console.error("Erreur lors de la vérification de la limite d'utilisation:", error)
      return { canAnalyze: true, remainingAnalyses: MAX_ANALYSES_PER_DAY }
    }
  },

  // Incrémenter le compteur d'utilisation
  incrementUsage: (): void => {
    try {
      const usageJson = localStorage.getItem(STORAGE_KEYS.USAGE)
      let usage: UsageLimit = usageJson ? JSON.parse(usageJson) : { count: 0, lastReset: new Date().toISOString() }

      // Vérifier si on doit réinitialiser le compteur (nouveau jour)
      const lastReset = new Date(usage.lastReset)
      const now = new Date()
      const isNewDay =
        lastReset.getDate() !== now.getDate() ||
        lastReset.getMonth() !== now.getMonth() ||
        lastReset.getFullYear() !== now.getFullYear()

      if (isNewDay) {
        usage = { count: 1, lastReset: now.toISOString() }
      } else {
        usage.count += 1
      }

      localStorage.setItem(STORAGE_KEYS.USAGE, JSON.stringify(usage))
    } catch (error) {
      console.error("Erreur lors de l'incrémentation de l'utilisation:", error)
    }
  },
}

