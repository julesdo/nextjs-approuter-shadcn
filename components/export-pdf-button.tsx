"use client"

import { useState } from "react"
import { Button } from "@/components/ui/button"
import { FileDown, Loader2 } from "lucide-react"
import { jsPDF } from "jspdf"
import html2canvas from "html2canvas"

interface ExportPdfButtonProps {
  contentId: string
  fileName?: string
  setActiveTab?: (tab: string) => void
}

export default function ExportPdfButton({
  contentId,
  fileName = "rapport-analyse",
  setActiveTab,
}: ExportPdfButtonProps) {
  const [isExporting, setIsExporting] = useState(false)

  const exportToPdf = async () => {
    const container = document.getElementById(contentId)
    if (!container) {
      console.error(`Element with id ${contentId} not found`)
      return
    }

    try {
      setIsExporting(true)

      // Création d'un document PDF au format A4
      const pdf = new jsPDF({
        orientation: "portrait",
        unit: "mm",
        format: "a4",
      })

      const pdfWidth = pdf.internal.pageSize.getWidth()

      // En-tête commun
      pdf.setFontSize(18)
      pdf.setTextColor(59, 130, 246)
      pdf.text("Rapport d'analyse Scoriz", 14, 20)

      pdf.setFontSize(10)
      pdf.setTextColor(100, 100, 100)
      pdf.text(`Généré le ${new Date().toLocaleDateString("fr-FR")}`, 14, 28)

      pdf.setDrawColor(200, 200, 200)
      pdf.line(14, 32, pdfWidth - 14, 32)

      // Structure de mapping incluant éventuellement des sous-tabs
      const tabMapping = [
        {
          value: "ux",
          id: "ux-score-section",
          title: "UX Score",
          subTabs: [
            { value: "global", id: "ux-global-section", title: "Score global" },
            { value: "detailed", id: "ux-detailed-section", title: "Scores détaillés" },
          ],
        },
        { value: "heuristic", id: "heuristic-analysis-section", title: "Analyse UX" },
        { value: "journey", id: "user-journey-section", title: "Parcours" },
        { value: "value", id: "value-proposition-section", title: "Proposition" },
        { value: "market", id: "market-analysis-section", title: "Marché" },
        { value: "data", id: "market-data-section", title: "Données" },
      ]

      // Parcours des onglets et de leurs éventuels sous-tabs
      for (let i = 0; i < tabMapping.length; i++) {
        const { value, id, title, subTabs } = tabMapping[i]
        if (setActiveTab) {
          setActiveTab(value)
          // Attendre la mise à jour du DOM (ajustez la durée si besoin)
          await new Promise((resolve) => setTimeout(resolve, 1500))
        }

        // Si l'onglet possède des sous-tabs, on les itère
        if (subTabs && subTabs.length > 0) {
          for (let j = 0; j < subTabs.length; j++) {
            const subTab = subTabs[j]
            // Optionnel : simuler le clic sur le trigger du sous-onglet (vous devez ajouter un attribut data-subtab dans votre composant de sous-tabs)
            const subTabTrigger = container.querySelector(`[data-subtab="${subTab.value}"]`)
            if (subTabTrigger) {
              ;(subTabTrigger as HTMLElement).click()
              await new Promise((resolve) => setTimeout(resolve, 1500))
            }
            const subTabContent = document.getElementById(subTab.id)
            if (!subTabContent) {
              console.error(`Element with id ${subTab.id} not found for sub-tab ${subTab.value}`)
              continue
            }

            // Titre de la section (contenant à la fois l'onglet et le sous-onglet)
            pdf.setFontSize(14)
            pdf.setTextColor(59, 130, 246)
            pdf.text(`${title} - ${subTab.title}`, 14, 40)

            try {
              const canvas = await html2canvas(subTabContent, {
                scale: 2,
                useCORS: true,
                allowTaint: true,
                backgroundColor: "#ffffff",
              })
              const imgData = canvas.toDataURL("image/jpeg", 0.95)
              const ratio = canvas.width / canvas.height
              const imgWidth = pdfWidth - 28 // marges de 14mm
              const imgHeight = imgWidth / ratio

              pdf.addImage(imgData, "JPEG", 14, 45, imgWidth, imgHeight)

              // Ajout d'une nouvelle page si ce n'est pas le dernier sous-onglet du dernier onglet
              if (!(i === tabMapping.length - 1 && j === subTabs.length - 1)) {
                pdf.addPage()
              }
            } catch (captureError) {
              console.error(`Error capturing content for sub-tab ${subTab.value}:`, captureError)
            }
          }
        } else {
          // Pour les onglets sans sous-tabs
          const tabContent = document.getElementById(id)
          if (!tabContent) {
            console.error(`Element with id ${id} not found for tab ${value}`)
            continue
          }

          pdf.setFontSize(14)
          pdf.setTextColor(59, 130, 246)
          pdf.text(title, 14, 40)

          try {
            const canvas = await html2canvas(tabContent, {
              scale: 2,
              useCORS: true,
              allowTaint: true,
              backgroundColor: "#ffffff",
            })
            const imgData = canvas.toDataURL("image/jpeg", 0.95)
            const ratio = canvas.width / canvas.height
            const imgWidth = pdfWidth - 28
            const imgHeight = imgWidth / ratio

            pdf.addImage(imgData, "JPEG", 14, 45, imgWidth, imgHeight)

            if (i < tabMapping.length - 1) {
              pdf.addPage()
            }
          } catch (captureError) {
            console.error(`Error capturing content for tab ${value}:`, captureError)
          }
        }
      }

      // Sauvegarde du PDF
      pdf.save(`${fileName}-${new Date().toISOString().slice(0, 10)}.pdf`)
    } catch (error) {
      console.error("Erreur lors de l'exportation en PDF:", error)
      alert("Une erreur est survenue lors de la génération du PDF. Veuillez réessayer.")
    } finally {
      setIsExporting(false)
    }
  }

  return (
    <Button onClick={exportToPdf} disabled={isExporting}>
      {isExporting ? (
        <>
          <Loader2 className="mr-2 h-4 w-4 animate-spin" />
          Génération du PDF...
        </>
      ) : (
        <>
          <FileDown className="mr-2 h-4 w-4" />
          Exporter en PDF
        </>
      )}
    </Button>
  )
}
