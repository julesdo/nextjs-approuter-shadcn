"use client"

import { motion } from "framer-motion"
import { Card, CardContent, CardFooter, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { CheckCircle2, Sparkles } from "lucide-react"

export default function PremiumUpsell() {
  return (
    <motion.div
      initial={{ opacity: 0, scale: 0.95 }}
      animate={{ opacity: 1, scale: 1 }}
      transition={{ duration: 0.5, delay: 0.8 }}
      className="relative overflow-hidden"
    >
      <Card className="bg-gradient-hyppe border-none overflow-hidden">
        <div className="absolute top-0 right-0 w-40 h-40 -mt-20 -mr-20 bg-white/20 rounded-full"></div>
        <div className="absolute bottom-0 left-0 w-40 h-40 -mb-20 -ml-20 bg-white/20 rounded-full"></div>

        <CardHeader>
          <CardTitle className="text-2xl text-black flex items-center">
            <Sparkles className="h-6 w-6 mr-2 text-black" />
            Passez à la version Premium
          </CardTitle>
        </CardHeader>
        <CardContent>
          <p className="text-black mb-6 text-lg">
            Obtenez une analyse détaillée et personnalisée de votre site web avec nos experts UX et conversion.
          </p>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div className="space-y-3">
              {[
                "Analyse complète de votre parcours utilisateur",
                "Audit détaillé de votre stratégie de conversion",
                "Recommandations personnalisées avec priorités",
              ].map((feature, index) => (
                <motion.div
                  key={index}
                  initial={{ opacity: 0, x: -10 }}
                  animate={{ opacity: 1, x: 0 }}
                  transition={{ delay: 0.9 + index * 0.1 }}
                  className="flex items-start"
                >
                  <CheckCircle2 className="h-5 w-5 text-black mr-2 mt-0.5 flex-shrink-0" />
                  <span className="text-black">{feature}</span>
                </motion.div>
              ))}
            </div>

            <div className="space-y-3">
              {[
                "Session de consultation avec un expert UX",
                "Suivi des améliorations et mesure d'impact",
                "Accès à notre plateforme d'analyse avancée",
              ].map((feature, index) => (
                <motion.div
                  key={index}
                  initial={{ opacity: 0, x: -10 }}
                  animate={{ opacity: 1, x: 0 }}
                  transition={{ delay: 1.2 + index * 0.1 }}
                  className="flex items-start"
                >
                  <CheckCircle2 className="h-5 w-5 text-black mr-2 mt-0.5 flex-shrink-0" />
                  <span className="text-black">{feature}</span>
                </motion.div>
              ))}
            </div>
          </div>
        </CardContent>
        <CardFooter>
          <Button className="w-full bg-black hover:bg-black/80 text-hyppe-lime text-lg py-6">
            Contacter un expert
          </Button>
        </CardFooter>
      </Card>
    </motion.div>
  )
}

