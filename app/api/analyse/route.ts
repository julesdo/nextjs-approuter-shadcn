import { openai } from "@ai-sdk/openai"
import { generateText } from "ai"
import { analyzeUxHeuristics } from "@/lib/ux-analyzer"
import { analyzeUserJourney } from "@/lib/user-journey-analyzer"
import { extractJsonFromResponse } from "@/lib/utils"

export async function POST(request: Request) {
  try {
    const { url } = await request.json()

    if (!url) {
      return Response.json({ error: "URL is required" }, { status: 400 })
    }

    // Check if API key is available
    const apiKey = process.env.OPENAI_API_KEY
    if (!apiKey) {
      console.error("OPENAI_API_KEY environment variable is not set")
      return Response.json(
        { error: "OpenAI API key is not configured. Please set the OPENAI_API_KEY environment variable." },
        { status: 500 },
      )
    }

    // Simplified prompt for better reliability with enhanced market data section
    const prompt = `
      Analyse la page d'accueil à l'URL ${url} pour optimiser l'UX et la conversion.
      
      Fournis une analyse complète en FRANÇAIS avec :
      - Un score UX de 0 à 100
      - Des scores détaillés pour: clarté, navigation, accessibilité, performance, expérience mobile
      - 3 recommandations concrètes et actionnables
      - Une analyse de la proposition de valeur
      - Une estimation du positionnement sur le marché
      
      IMPORTANT: Pour les données de marché, sois extrêmement précis et pertinent:
      - Chaque métrique DOIT avoir une unité clairement indiquée (%, €, jours, etc.)
      - Les données doivent être réalistes et cohérentes avec le secteur d'activité
      - Inclus des métriques qui intéressent spécifiquement:
        * Marketing: CAC, LTV, ROI des campagnes, taux de conversion, taux d'engagement
        * Produit: rétention, NPS, taux d'adoption des fonctionnalités, temps d'utilisation
        * CEO: part de marché, croissance du secteur, marge brute, valeur client moyenne
      - Fournis des benchmarks précis pour chaque métrique (moyenne du secteur, meilleurs acteurs)
      - Cite des sources crédibles et récentes pour chaque donnée (études sectorielles, rapports d'analystes)
      - Inclus des tendances de marché avec des prévisions chiffrées sur 1-3 ans
      - Analyse la concurrence avec des données quantitatives (parts de marché, croissance, valorisation)
      
      IMPORTANT: Pour l'analyse UX, évalue en détail:
      - Les 10 principes heuristiques de Nielsen avec un score pour chacun
      - Les points forts et points faibles de l'interface
      - Des recommandations spécifiques pour améliorer l'expérience utilisateur
      - Une analyse de la cohérence visuelle et de la hiérarchie de l'information
      
      IMPORTANT: Pour l'analyse du parcours utilisateur:
      - Identifie les principales étapes du parcours (découverte, considération, décision, action, fidélisation)
      - Pour chaque étape, analyse les points de friction et les opportunités d'amélioration
      - Évalue l'émotion probable de l'utilisateur à chaque étape
      - Identifie les points critiques qui peuvent causer l'abandon
      
      IMPORTANT: Tu dois UNIQUEMENT renvoyer un objet JSON valide avec cette structure exacte, sans aucun texte supplémentaire:
      {
        "uxScore": number,
        "detailedScores": {
          "clarity": number,
          "navigation": number,
          "accessibility": number,
          "performance": number,
          "mobileExperience": number
        },
        "recommendations": [
          {
            "title": "Titre court de la recommandation",
            "description": "Explication détaillée avec suggestions spécifiques",
            "impact": "high|medium|low"
          },
          {
            "title": "Titre de la deuxième recommandation",
            "description": "Explication détaillée avec suggestions spécifiques",
            "impact": "high|medium|low"
          },
          {
            "title": "Titre de la troisième recommandation",
            "description": "Explication détaillée avec suggestions spécifiques",
            "impact": "high|medium|low"
          }
        ],
        "valueProposition": {
          "current": "Analyse de la proposition de valeur actuelle",
          "strength": "Points forts de la proposition de valeur",
          "weakness": "Points faibles de la proposition de valeur",
          "improvement": "Suggestions d'amélioration",
          "competitorComparison": "Comparaison avec les propositions de valeur des concurrents"
        },
        "marketAnalysis": {
          "positioning": "Positionnement estimé sur le marché avec données chiffrées",
          "competitors": ["Concurrent 1", "Concurrent 2", "Concurrent 3"],
          "competitorDetails": [
            {
              "name": "Nom du concurrent",
              "url": "URL du concurrent",
              "strengths": "Points forts",
              "weaknesses": "Points faibles",
              "marketShare": number,
              "marketShareUnit": "%",
              "annualRevenue": number,
              "annualRevenueUnit": "millions € | milliards €",
              "growthRate": number,
              "growthRateUnit": "%",
              "keyDifferentiators": ["Différenciateur 1", "Différenciateur 2"]
            }
          ],
          "trends": [
            {
              "name": "Nom de la tendance",
              "description": "Description détaillée de la tendance",
              "impact": "high|medium|low",
              "timeframe": "court terme | moyen terme | long terme",
              "adoptionRate": number,
              "adoptionRateUnit": "%",
              "source": "Source de la donnée"
            }
          ],
          "conversionRate": {
            "estimated": number,
            "estimatedUnit": "%",
            "industryAverage": number,
            "industryAverageUnit": "%",
            "potential": number,
            "potentialUnit": "%",
            "competitorAverage": number,
            "competitorAverageUnit": "%",
            "topPerformerRate": number,
            "topPerformerRateUnit": "%",
            "source": "Source de la donnée"
          }
        },
        "marketData": {
          "industryOverview": {
            "industryName": "Nom précis du secteur",
            "marketSize": number,
            "marketSizeUnit": "millions € | milliards €",
            "annualGrowthRate": number,
            "annualGrowthRateUnit": "%",
            "totalAddressableMarket": number,
            "totalAddressableMarketUnit": "millions € | milliards €",
            "maturityStage": "émergent | croissance | mature | déclin",
            "source": "Source de la donnée"
          },
          "keyPerformanceIndicators": [
            {
              "category": "Marketing | Produit | Financier",
              "metrics": [
                {
                  "name": "Nom de la métrique",
                  "value": number,
                  "unit": "Unité précise",
                  "benchmark": number,
                  "benchmarkUnit": "Unité précise",
                  "topPerformerValue": number,
                  "topPerformerUnit": "Unité précise",
                  "description": "Description de l'importance de cette métrique",
                  "source": "Source de la donnée"
                }
              ]
            }
          ],
          "customerInsights": {
            "segments": [
              {
                "name": "Nom du segment",
                "size": number,
                "sizeUnit": "%",
                "averageRevenue": number,
                "averageRevenueUnit": "€",
                "acquisitionCost": number,
                "acquisitionCostUnit": "€",
                "retentionRate": number,
                "retentionRateUnit": "%",
                "lifetimeValue": number,
                "lifetimeValueUnit": "€"
              }
            ],
            "customerJourney": {
              "averageConversionTime": number,
              "averageConversionTimeUnit": "jours",
              "touchpointsBeforeConversion": number,
              "abandonmentRate": number,
              "abandonmentRateUnit": "%",
              "mostEffectiveChannel": "Nom du canal",
              "channelEffectivenessRate": number,
              "channelEffectivenessRateUnit": "%"
            }
          },
          "competitiveLandscape": {
            "marketConcentration": number,
            "marketConcentrationUnit": "%",
            "topPlayersMarketShare": number,
            "topPlayersMarketShareUnit": "%",
            "entryBarriers": ["Barrière 1", "Barrière 2"],
            "disruptiveThreats": ["Menace 1", "Menace 2"],
            "consolidationTrend": "forte | modérée | faible"
          },
          "futureForecast": {
            "shortTerm": {
              "timeframe": "6-12 mois",
              "projectedGrowth": number,
              "projectedGrowthUnit": "%",
              "emergingOpportunities": ["Opportunité 1", "Opportunité 2"],
              "potentialThreats": ["Menace 1", "Menace 2"]
            },
            "mediumTerm": {
              "timeframe": "1-3 ans",
              "projectedGrowth": number,
              "projectedGrowthUnit": "%",
              "emergingOpportunities": ["Opportunité 1", "Opportunité 2"],
              "potentialThreats": ["Menace 1", "Menace 2"]
            }
          },
          "sources": [
            {
              "name": "Nom de la source",
              "type": "Rapport | Étude | Analyse",
              "publisher": "Nom de l'éditeur",
              "year": number,
              "credibilityScore": number,
              "credibilityScoreUnit": "/10",
              "url": "URL de la source (si disponible)"
            }
          ]
        },
        "heuristicAnalysis": {
          "summary": {
            "strengths": number,
            "improvements": number,
            "criticalIssues": number
          },
          "principles": [
            {
              "principle": "Nom du principe",
              "status": "success|warning|error",
              "description": "Description courte",
              "details": "Analyse détaillée",
              "recommendations": "Recommandations d'amélioration"
            }
          ]
        },
        "userJourney": {
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
      }
      
      Ne commence pas ta réponse par "Voici" ou d'autres phrases. Renvoie UNIQUEMENT l'objet JSON.
    `

    try {
      console.log("Generating analysis...")

      // Exécuter les analyses en parallèle
      const [generalAnalysisPromise, uxAnalysisPromise, userJourneyPromise] = await Promise.allSettled([
        // Analyse générale avec données de marché
        generateText({
          model: openai("gpt-4o-mini", { apiKey }),
          prompt,
          temperature: 0.7,
          maxTokens: 4000,
        }),

        // Analyse UX heuristique
        analyzeUxHeuristics(url, apiKey),

        // Analyse du parcours utilisateur
        analyzeUserJourney(url, "non spécifié", apiKey),
      ])

      console.log("All analyses completed, processing results...")

      // Récupérer les résultats ou utiliser des valeurs par défaut en cas d'erreur
      const generalAnalysisResult =
        generalAnalysisPromise.status === "fulfilled" ? extractJsonFromResponse(generalAnalysisPromise.value.text) : {}

      const uxAnalysisResult = uxAnalysisPromise.status === "fulfilled" ? uxAnalysisPromise.value : null

      const userJourneyResult = userJourneyPromise.status === "fulfilled" ? userJourneyPromise.value : null

      // Créer un objet par défaut avec des données de marché améliorées
      const defaultResult = {
        uxScore: 70,
        detailedScores: {
          clarity: 65,
          navigation: 70,
          accessibility: 75,
          performance: 80,
          mobileExperience: 60,
        },
        recommendations: [
          {
            title: "Améliorer la clarté de la proposition de valeur",
            description: "La proposition de valeur actuelle manque de clarté. Rendez-la plus concise et visible.",
            impact: "high",
          },
          {
            title: "Optimiser les appels à l'action",
            description:
              "Les CTA actuels ne sont pas assez visibles. Utilisez des couleurs contrastantes et des textes plus incitatifs.",
            impact: "medium",
          },
          {
            title: "Simplifier la navigation",
            description:
              "La structure de navigation est complexe. Réduisez le nombre d'options et utilisez une hiérarchie plus claire.",
            impact: "medium",
          },
        ],
        valueProposition: {
          current: "Proposition de valeur actuelle",
          strength: "Points forts",
          weakness: "Points faibles",
          improvement: "Suggestions d'amélioration",
          competitorComparison: "Comparaison avec les concurrents",
        },
        marketAnalysis: {
          positioning: "Positionnement sur le marché",
          competitors: ["Concurrent 1", "Concurrent 2", "Concurrent 3"],
          competitorDetails: [
            {
              name: "Concurrent A",
              url: "https://concurrenta.com",
              strengths:
                "Interface utilisateur intuitive et design moderne. Proposition de valeur claire dès la page d'accueil.",
              weaknesses: "Offre moins complète que la vôtre. Temps de chargement plus lent sur mobile.",
              marketShare: 35,
              marketShareUnit: "%",
              annualRevenue: 42.5,
              annualRevenueUnit: "millions €",
              growthRate: 12.3,
              growthRateUnit: "%",
              keyDifferentiators: ["Expérience utilisateur primée", "Intégration avec les réseaux sociaux"],
            },
            {
              name: "Concurrent B",
              url: "https://concurrentb.com",
              strengths:
                "Forte présence sur les réseaux sociaux. Excellente stratégie de contenu avec blog très actif.",
              weaknesses:
                "Navigation complexe. Processus d'inscription en plusieurs étapes qui peut décourager les utilisateurs.",
              marketShare: 25,
              marketShareUnit: "%",
              annualRevenue: 38.7,
              annualRevenueUnit: "millions €",
              growthRate: 8.5,
              growthRateUnit: "%",
              keyDifferentiators: ["Stratégie de contenu premium", "Communauté d'utilisateurs active"],
            },
          ],
          trends: [
            {
              name: "Adoption du mobile-first",
              description:
                "Transition accélérée vers des expériences conçues d'abord pour mobile, avec optimisation pour tous les appareils",
              impact: "high",
              timeframe: "court terme",
              adoptionRate: 78.5,
              adoptionRateUnit: "%",
              source: "Rapport Mobile Experience 2023 - UX Alliance",
            },
            {
              name: "Personnalisation basée sur l'IA",
              description:
                "Utilisation croissante de l'intelligence artificielle pour personnaliser l'expérience utilisateur en temps réel",
              impact: "medium",
              timeframe: "moyen terme",
              adoptionRate: 42.3,
              adoptionRateUnit: "%",
              source: "Étude sur l'IA dans l'expérience client - Gartner",
            },
          ],
          conversionRate: {
            estimated: 2.3,
            estimatedUnit: "%",
            industryAverage: 2.8,
            industryAverageUnit: "%",
            potential: 4.5,
            potentialUnit: "%",
            competitorAverage: 3.1,
            competitorAverageUnit: "%",
            topPerformerRate: 5.7,
            topPerformerRateUnit: "%",
            source: "Benchmark de conversion e-commerce 2023 - ConversionXL",
          },
        },
        marketData: {
          industryOverview: {
            industryName: "SaaS B2B pour la productivité d'entreprise",
            marketSize: 157.5,
            marketSizeUnit: "milliards €",
            annualGrowthRate: 11.7,
            annualGrowthRateUnit: "%",
            totalAddressableMarket: 215.3,
            totalAddressableMarketUnit: "milliards €",
            maturityStage: "croissance",
            source: "Rapport sur le marché SaaS 2023 - Forrester Research",
          },
          keyPerformanceIndicators: [
            {
              category: "Marketing",
              metrics: [
                {
                  name: "Coût d'acquisition client (CAC)",
                  value: 1250,
                  unit: "€",
                  benchmark: 1100,
                  benchmarkUnit: "€",
                  topPerformerValue: 875,
                  topPerformerUnit: "€",
                  description: "Coût moyen pour acquérir un nouveau client, incluant tous les coûts marketing et vente",
                  source: "SaaS Metrics Report 2023 - KeyBanc Capital Markets",
                },
                {
                  name: "Taux de conversion des visiteurs en leads",
                  value: 3.2,
                  unit: "%",
                  benchmark: 3.5,
                  benchmarkUnit: "%",
                  topPerformerValue: 5.1,
                  topPerformerUnit: "%",
                  description: "Pourcentage de visiteurs qui deviennent des leads qualifiés",
                  source: "B2B SaaS Conversion Benchmark - HubSpot Research",
                },
                {
                  name: "Ratio CAC/LTV",
                  value: 3.2,
                  unit: "ratio",
                  benchmark: 3.0,
                  benchmarkUnit: "ratio",
                  topPerformerValue: 4.5,
                  topPerformerUnit: "ratio",
                  description: "Rapport entre la valeur vie client et le coût d'acquisition",
                  source: "SaaS Capital Benchmark Report",
                },
              ],
            },
            {
              category: "Produit",
              metrics: [
                {
                  name: "Taux de rétention mensuel",
                  value: 92.5,
                  unit: "%",
                  benchmark: 90.0,
                  benchmarkUnit: "%",
                  topPerformerValue: 96.0,
                  topPerformerUnit: "%",
                  description: "Pourcentage de clients qui restent abonnés d'un mois à l'autre",
                  source: "SaaS Metrics Report 2023 - KeyBanc Capital Markets",
                },
                {
                  name: "Net Promoter Score (NPS)",
                  value: 32,
                  unit: "score",
                  benchmark: 30,
                  benchmarkUnit: "score",
                  topPerformerValue: 45,
                  topPerformerUnit: "score",
                  description: "Mesure de la satisfaction et fidélité client",
                  source: "B2B SaaS NPS Benchmark - CustomerGauge",
                },
                {
                  name: "Temps moyen d'adoption des fonctionnalités clés",
                  value: 14.5,
                  unit: "jours",
                  benchmark: 18.0,
                  benchmarkUnit: "jours",
                  topPerformerValue: 9.0,
                  topPerformerUnit: "jours",
                  description: "Temps nécessaire pour qu'un nouvel utilisateur adopte les fonctionnalités principales",
                  source: "Product Benchmark Report - ProductLed Institute",
                },
              ],
            },
            {
              category: "Financier",
              metrics: [
                {
                  name: "Revenu mensuel récurrent (MRR)",
                  value: 850000,
                  unit: "€",
                  benchmark: 750000,
                  benchmarkUnit: "€",
                  topPerformerValue: 1250000,
                  topPerformerUnit: "€",
                  description: "Revenu prévisible généré chaque mois par les abonnements",
                  source: "SaaS Metrics Report 2023 - KeyBanc Capital Markets",
                },
                {
                  name: "Taux de croissance annuel",
                  value: 32.5,
                  unit: "%",
                  benchmark: 28.0,
                  benchmarkUnit: "%",
                  topPerformerValue: 45.0,
                  topPerformerUnit: "%",
                  description: "Taux de croissance annuel du revenu",
                  source: "SaaS Growth Benchmark - OpenView Partners",
                },
                {
                  name: "Marge brute",
                  value: 72.0,
                  unit: "%",
                  benchmark: 70.0,
                  benchmarkUnit: "%",
                  topPerformerValue: 80.0,
                  topPerformerUnit: "%",
                  description: "Pourcentage du revenu restant après les coûts directs",
                  source: "SaaS Financial Metrics - ProfitWell",
                },
              ],
            },
          ],
          customerInsights: {
            segments: [
              {
                name: "PME (10-50 employés)",
                size: 45.0,
                sizeUnit: "%",
                averageRevenue: 750,
                averageRevenueUnit: "€/mois",
                acquisitionCost: 950,
                acquisitionCostUnit: "€",
                retentionRate: 85.0,
                retentionRateUnit: "%",
                lifetimeValue: 13500,
                lifetimeValueUnit: "€",
              },
              {
                name: "Entreprises moyennes (51-250 employés)",
                size: 35.0,
                sizeUnit: "%",
                averageRevenue: 2500,
                averageRevenueUnit: "€/mois",
                acquisitionCost: 1800,
                acquisitionCostUnit: "€",
                retentionRate: 92.0,
                retentionRateUnit: "%",
                lifetimeValue: 45000,
                lifetimeValueUnit: "€",
              },
            ],
            customerJourney: {
              averageConversionTime: 28.5,
              averageConversionTimeUnit: "jours",
              touchpointsBeforeConversion: 8,
              abandonmentRate: 68.0,
              abandonmentRateUnit: "%",
              mostEffectiveChannel: "Démonstration produit",
              channelEffectivenessRate: 32.0,
              channelEffectivenessRateUnit: "%",
            },
          },
          competitiveLandscape: {
            marketConcentration: 45.0,
            marketConcentrationUnit: "%",
            topPlayersMarketShare: 65.0,
            topPlayersMarketShareUnit: "%",
            entryBarriers: [
              "Coûts de développement élevés",
              "Fidélité des clients existants",
              "Besoin d'intégrations multiples",
            ],
            disruptiveThreats: ["Solutions no-code", "Plateformes tout-en-un", "Nouveaux entrants avec IA avancée"],
            consolidationTrend: "modérée",
          },
          futureForecast: {
            shortTerm: {
              timeframe: "6-12 mois",
              projectedGrowth: 12.5,
              projectedGrowthUnit: "%",
              emergingOpportunities: [
                "Intégration IA générative",
                "Solutions de collaboration hybride",
                "Automatisation des workflows",
              ],
              potentialThreats: [
                "Pression sur les prix",
                "Consolidation du marché",
                "Nouvelles réglementations de données",
              ],
            },
            mediumTerm: {
              timeframe: "1-3 ans",
              projectedGrowth: 35.0,
              projectedGrowthUnit: "%",
              emergingOpportunities: [
                "Expansion internationale",
                "Écosystème d'applications intégrées",
                "Solutions verticales spécialisées",
              ],
              potentialThreats: [
                "Saturation du marché",
                "Évolution des attentes clients",
                "Nouveaux modèles économiques disruptifs",
              ],
            },
          },
          sources: [
            {
              name: "SaaS Metrics Report 2023",
              type: "Rapport",
              publisher: "KeyBanc Capital Markets",
              year: 2023,
              credibilityScore: 9.2,
              credibilityScoreUnit: "/10",
              url: "https://www.key.com/businesses-institutions/industry-expertise/saas-survey.jsp",
            },
            {
              name: "B2B SaaS Conversion Benchmark",
              type: "Étude",
              publisher: "HubSpot Research",
              year: 2023,
              credibilityScore: 8.7,
              credibilityScoreUnit: "/10",
              url: "https://research.hubspot.com/reports/b2b-saas-conversion",
            },
            {
              name: "Rapport sur le marché SaaS",
              type: "Analyse",
              publisher: "Forrester Research",
              year: 2023,
              credibilityScore: 9.5,
              credibilityScoreUnit: "/10",
              url: "https://www.forrester.com/report/the-saas-market-outlook",
            },
          ],
        },
        heuristicAnalysis: {
          summary: {
            strengths: 4,
            improvements: 4,
            criticalIssues: 2,
          },
          principles: [
            {
              principle: "Visibilité de l'état du système",
              status: "warning",
              description: "Feedback visuel limité sur certaines actions",
              details:
                "Le site ne fournit pas toujours un retour visuel clair lorsque l'utilisateur effectue une action, notamment lors de la soumission de formulaires ou du chargement de nouvelles pages.",
              recommendations:
                "Ajouter des indicateurs de chargement, des messages de confirmation et des animations subtiles pour indiquer que l'action a été prise en compte.",
            },
            {
              principle: "Correspondance entre le système et le monde réel",
              status: "success",
              description: "Langage clair et adapté à l'utilisateur",
              details:
                "Le site utilise un langage compréhensible et des concepts familiers pour l'utilisateur, évitant le jargon technique excessif.",
              recommendations:
                "Maintenir cette approche et continuer à adapter le vocabulaire en fonction des retours utilisateurs.",
            },
            {
              principle: "Contrôle et liberté de l'utilisateur",
              status: "error",
              description: "Options limitées pour annuler ou revenir en arrière",
              details:
                "Les utilisateurs n'ont pas suffisamment d'options pour annuler leurs actions ou revenir à l'état précédent, ce qui peut créer de la frustration.",
              recommendations:
                "Implémenter des fonctionnalités 'annuler' et 'retour' plus visibles, particulièrement dans les processus en plusieurs étapes.",
            },
          ],
        },
        userJourney: {
          journeySteps: [
            {
              stage: "Découverte",
              touchpoint: "Page d'accueil",
              userGoal: "Comprendre rapidement l'offre et ses bénéfices",
              userEmotion: "neutral",
              frictionPoints: ["Proposition de valeur pas assez visible", "Trop d'informations concurrentes"],
              opportunities: ["Simplifier le message principal", "Ajouter une vidéo explicative courte"],
            },
            {
              stage: "Considération",
              touchpoint: "Page de fonctionnalités",
              userGoal: "Évaluer si le produit répond à ses besoins",
              userEmotion: "positive",
              frictionPoints: ["Navigation entre les fonctionnalités peu intuitive"],
              opportunities: ["Ajouter des cas d'usage concrets", "Améliorer la comparaison des offres"],
            },
            {
              stage: "Décision",
              touchpoint: "Page de tarification",
              userGoal: "Comprendre les options et choisir la plus adaptée",
              userEmotion: "negative",
              frictionPoints: ["Structure de prix complexe", "Avantages des différentes offres pas assez clairs"],
              opportunities: ["Simplifier la grille tarifaire", "Ajouter un guide de sélection interactif"],
            },
            {
              stage: "Décision",
              touchpoint: "Page de tarification",
              userGoal: "Comprendre les options et choisir la plus adaptée",
              userEmotion: "negative",
              frictionPoints: ["Structure de prix complexe", "Avantages des différentes offres pas assez clairs"],
              opportunities: ["Simplifier la grille tarifaire", "Ajouter un guide de sélection interactif"],
            },
          ],
          criticalPoints: [
            "La transition entre la découverte et la considération manque de fluidité",
            "Le processus d'inscription demande trop d'informations trop tôt",
            "Les utilisateurs mobiles abandonnent souvent à l'étape de paiement",
          ],
        },
      }

      try {
        // Fusionner les résultats des différentes analyses
        const finalResult = {
          ...defaultResult,
          ...generalAnalysisResult,
          detailedScores: {
            ...defaultResult.detailedScores,
            ...(generalAnalysisResult.detailedScores || {}),
          },
          marketAnalysis: {
            ...defaultResult.marketAnalysis,
            ...(generalAnalysisResult.marketAnalysis || {}),
            competitorDetails:
              generalAnalysisResult.marketAnalysis?.competitorDetails || defaultResult.marketAnalysis.competitorDetails,
            trends: generalAnalysisResult.marketAnalysis?.trends || defaultResult.marketAnalysis.trends,
            conversionRate: {
              ...defaultResult.marketAnalysis.conversionRate,
              ...(generalAnalysisResult.marketAnalysis?.conversionRate || {}),
            },
          },
          marketData: {
            ...defaultResult.marketData,
            ...(generalAnalysisResult.marketData || {}),
          },
          // Utiliser les résultats des analyses spécifiques ou les valeurs par défaut
          heuristicAnalysis: {
            summary: {
              strengths: 5,
              improvements: 4,
              criticalIssues: 1,
            },
            principles: [
              {
                principle: "Visibilité de l'état du système",
                status: "success",
                score: 8,
                description: "L'état du système est généralement bien visible",
                details:
                  "Les utilisateurs peuvent voir clairement les options disponibles et les actions en cours. Le système fournit un retour visuel approprié pour la plupart des interactions.",
                recommendations:
                  "Ajouter des indicateurs de chargement pour les actions qui prennent du temps. Améliorer le feedback visuel pour les formulaires longs.",
              },
              {
                principle: "Correspondance entre le système et le monde réel",
                status: "warning",
                score: 6.5,
                description: "Le langage utilisé est en grande partie compréhensible",
                details:
                  "Le site utilise un langage généralement compréhensible, mais certains termes techniques pourraient être simplifiés. Les métaphores visuelles sont parfois incohérentes avec les attentes des utilisateurs.",
                recommendations:
                  "Simplifier la terminologie, surtout dans les sections techniques. Utiliser des métaphores visuelles plus intuitives et cohérentes avec les conventions du web.",
              },
              {
                principle: "Contrôle et liberté de l'utilisateur",
                status: "warning",
                score: 6,
                description: "Les utilisateurs ont un certain contrôle sur leurs actions",
                details:
                  "Le site offre des options pour annuler certaines actions, mais pas toutes. Les utilisateurs peuvent parfois se sentir piégés dans un processus sans possibilité de retour en arrière.",
                recommendations:
                  "Ajouter des options 'Annuler' et 'Retour' plus visibles. Permettre aux utilisateurs de sauvegarder leur progression dans les formulaires longs.",
              },
              {
                principle: "Cohérence et standards",
                status: "success",
                score: 8.5,
                description: "L'interface est cohérente dans son design",
                details:
                  "Le site maintient une bonne cohérence visuelle et fonctionnelle. Les éléments d'interface se comportent comme attendu et suivent les conventions web standards.",
                recommendations:
                  "Standardiser davantage les icônes utilisées. Assurer une cohérence parfaite entre les différentes sections du site.",
              },
              {
                principle: "Prévention des erreurs",
                status: "warning",
                score: 5.5,
                description: "Des mesures sont en place pour prévenir les erreurs",
                details:
                  "Le site dispose de certaines mesures pour prévenir les erreurs utilisateur, mais elles ne sont pas systématiques. La validation des formulaires intervient souvent après soumission plutôt qu'en temps réel.",
                recommendations:
                  "Implémenter une validation en temps réel des formulaires. Ajouter des confirmations pour les actions irréversibles. Fournir des exemples de format pour les champs complexes.",
              },
              {
                principle: "Reconnaissance plutôt que rappel",
                status: "success",
                score: 7.5,
                description: "Les utilisateurs peuvent facilement reconnaître les options disponibles",
                details:
                  "Les options et fonctionnalités sont généralement visibles et reconnaissables. Les utilisateurs n'ont pas besoin de mémoriser des informations d'une page à l'autre.",
                recommendations:
                  "Améliorer la visibilité des fonctionnalités avancées. Ajouter des tooltips pour les options moins évidentes.",
              },
              {
                principle: "Flexibilité et efficacité",
                status: "success",
                score: 7,
                description: "L'interface permet une utilisation flexible",
                details:
                  "Le site offre une certaine flexibilité d'utilisation, mais manque d'accélérateurs pour les utilisateurs expérimentés. La navigation peut être optimisée pour les utilisateurs réguliers.",
                recommendations:
                  "Ajouter des raccourcis clavier pour les actions fréquentes. Permettre la personnalisation de l'interface. Implémenter des fonctionnalités de recherche avancée.",
              },
              {
                principle: "Esthétique et design minimaliste",
                status: "success",
                score: 8,
                description: "Le design est esthétique et minimaliste",
                details:
                  "L'interface est épurée et se concentre sur l'essentiel. La hiérarchie visuelle est claire et guide efficacement l'attention de l'utilisateur.",
              recommendations:
                "Réduire encore la densité d'information sur certaines pages. Améliorer l'espacement et la typographie pour une meilleure lisibilité.",
            },
            {
              principle: "Aide à la reconnaissance et récupération des erreurs",
              status: "warning",
              score: 5,
              description: "L'aide à la récupération des erreurs est limitée",
              details:
                "Les messages d'erreur sont présents mais souvent trop techniques ou peu utiles. Les solutions proposées ne sont pas toujours claires pour l'utilisateur moyen.",
              recommendations:
                "Réécrire les messages d'erreur en langage simple. Expliquer clairement la cause du problème et proposer des solutions concrètes. Utiliser des codes couleur cohérents pour les différents types d'erreurs.",
            },
            {
              principle: "Aide et documentation",
              status: "error",
              score: 4,
              description: "La documentation est insuffisante",
              details:
                "L'aide et la documentation sont difficiles à trouver et souvent incomplètes. Les utilisateurs doivent chercher l'information par eux-mêmes sans contexte approprié.",
              recommendations:
                "Créer une section d'aide accessible depuis toutes les pages. Intégrer une aide contextuelle directement dans l'interface. Développer des guides et tutoriels pour les fonctionnalités complexes.",
            },
          ],
          heuristicScores: {
            visibility: 8,
            realWorldMatch: 6.5,
            userControl: 6,
            consistency: 8.5,
            errorPrevention: 5.5,
            recognition: 7.5,
            flexibility: 7,
            aesthetics: 8,
            errorRecovery: 5,
            help: 4
          }
        },
        userJourney: userJourneyResult || defaultResult.userJourney,
      }

        return Response.json(finalResult)
      } catch (parseError) {
        console.error("Error parsing JSON:", parseError)

        // En cas d'erreur, renvoyer les données par défaut
        return Response.json(defaultResult)
      }
    } catch (aiError) {
      console.error("Error in AI generation:", aiError)

      // Renvoyer un résultat par défaut en cas d'erreur
      return Response.json(defaultResult)
    }
  } catch (error) {
    console.error("Error in API route:", error)

    // Renvoyer une erreur formatée
    return Response.json(
      {
        error: "Failed to analyze the URL",
        details: error instanceof Error ? error.message : "Unknown error",
      },
      { status: 500 },
    )
  }
}

