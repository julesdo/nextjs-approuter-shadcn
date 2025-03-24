"use client"

import React, { useState } from "react"
import { motion } from "framer-motion"
import { Button } from "./ui/button"
import { Input } from "./ui/input"
import { Sparkles, XIcon } from "lucide-react"
import { Checkbox } from "./ui/checkbox"

const ContactForm: React.FC = () => {
  const [isOpen, setIsOpen] = useState(false)
  const [email, setEmail] = useState("")
  const [consent, setConsent] = useState(false)
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState("")
  const [success, setSuccess] = useState(false)

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault()
    setLoading(true)
    setError("")

    if (!email) {
      setError("Veuillez saisir votre email.")
      setLoading(false)
      return
    }

    if (!consent) {
      setError("Veuillez accepter la Politique de Confidentialité.")
      setLoading(false)
      return
    }
    
    try {
      const payload = { email }

      // Appel à l'API /contact pour enregistrer l'inscription
      const resContact = await fetch("/api/contact", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(payload)
      })

      if (![200, 201, 204].includes(resContact.status)) {
        throw new Error("Erreur lors de l'enregistrement")
      }

      setSuccess(true)
      setEmail("")
      setConsent(false)
    } catch (err) {
      setError("Une erreur est survenue, veuillez réessayer.")
      console.error(err)
    }
    
    setLoading(false)
  }

  return (
    <div>
      <Button
        onClick={() => setIsOpen(true)}
        className="bg-hyppe-purple hover:bg-hyppe-purple/90 text-white flex items-center gap-2"
      >
        <Sparkles className="h-4 w-4" />
        <span>Premium</span>
      </Button>

      {isOpen && (
        <div className="fixed inset-0 flex items-center justify-center z-50">
          {/* Overlay */}
          <div
            className="absolute inset-0 bg-black opacity-50"
            onClick={() => setIsOpen(false)}
          />
          <motion.div
            className="relative bg-background p-8 z-10 max-w-xl w-full"
            initial={{ opacity: 0, scale: 0.8 }}
            animate={{ opacity: 1, scale: 1 }}
            exit={{ opacity: 0, scale: 0.8 }}
          >
            <h2 className="text-2xl font-bold mb-4">
              Le forfait Premium n'est pas encore disponible.
            </h2>
            <p className="mb-4">
              Laissez-nous votre email pour être informé en priorité !
            </p>
            {success ? (
              <p className="text-green-500 mb-4">
                Votre demande a été envoyée avec succès ! Nous vous recontacterons par email dans les plus brefs délais.
              </p>
            ) : (
              <form onSubmit={handleSubmit} className="flex flex-col space-y-4">
                <Input
                  type="email"
                  name="email"
                  placeholder="Votre email"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  className="px-4 py-2"
                  required
                />
                <div className="flex items-start">
                  <Checkbox 
                    name="consent"
                    checked={consent} 
                    onCheckedChange={(checked: boolean) => setConsent(checked)} 
                    required
                    className="mt-1 mr-2"
                  />
                  <label htmlFor="consent" className="text-sm">
                    J'accepte que mes données soient utilisées pour répondre à ma demande et traitées conformément à la{" "}
                    <a href="https://hyppe.run/politique-de-confidentialite" target="_blank" className="underline">
                      Politique de Confidentialité
                    </a>.
                  </label>
                </div>
                {error && <p className="text-red-500">{error}</p>}
                <Button type="submit" disabled={loading}>
                  {loading ? "Envoi..." : "Envoyer"}
                </Button>
              </form>
            )}
            <button
              onClick={() => setIsOpen(false)}
              className="absolute top-4 right-4 font-bold"
            >
              <XIcon strokeWidth={0.5} size={24} />
            </button>
          </motion.div>
        </div>
      )}
    </div>
  )
}

export default ContactForm
