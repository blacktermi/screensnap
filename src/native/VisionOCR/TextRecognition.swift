/**
 * ScreenSnapOCR — Reconnaissance de texte via le framework Vision.
 *
 * Utilise VNRecognizeTextRequest pour extraire le texte des captures
 * d'ecran avec une precision elevee. Supporte plusieurs langues
 * et retourne les resultats avec les regions de texte detectees.
 *
 * Ce module est compile en addon natif Node.js (.node) pour etre
 * utilise depuis le processus principal d'Electron.
 */

import Foundation
import Vision

class ScreenSnapOCR {

    // MARK: - Reconnaissance de texte

    /// Reconnait le texte present dans une image.
    ///
    /// - Parameter imageData: Donnees brutes de l'image (PNG, JPEG, etc.)
    /// - Returns: Tableau de chaines de texte detectees, ordonnees
    ///            du haut vers le bas de l'image
    ///
    /// Flux de traitement :
    /// 1. Convertir les donnees en CGImage via CGImageSource
    /// 2. Creer un VNImageRequestHandler avec le CGImage
    /// 3. Configurer un VNRecognizeTextRequest :
    ///    - recognitionLevel = .accurate (precision maximale)
    ///    - usesLanguageCorrection = true (correction orthographique)
    ///    - recognitionLanguages = ["fr", "en"] (francais prioritaire)
    ///    - revision = VNRecognizeTextRequestRevision3 (derniere revision)
    /// 4. Executer la requete de maniere synchrone
    /// 5. Extraire les VNRecognizedTextObservation du resultat
    /// 6. Pour chaque observation, recuperer le candidat avec la meilleure confiance
    /// 7. Retourner les textes detectes
    func recognizeText(imageData: Data) -> [String] {
        // TODO: Implementer la reconnaissance de texte

        guard let cgImageSource = CGImageSourceCreateWithData(imageData as CFData, nil),
              let cgImage = CGImageSourceCreateImageAtIndex(cgImageSource, 0, nil) else {
            // Impossible de creer le CGImage depuis les donnees
            return []
        }

        let requestHandler = VNImageRequestHandler(cgImage: cgImage, options: [:])

        let request = VNRecognizeTextRequest()
        request.recognitionLevel = .accurate
        request.usesLanguageCorrection = true
        request.recognitionLanguages = ["fr", "en"]

        do {
            try requestHandler.perform([request])
        } catch {
            // TODO: Logger l'erreur et la propager vers Node.js
            // print("[OCR] Erreur lors de la reconnaissance : \(error)")
            return []
        }

        guard let observations = request.results else {
            return []
        }

        // Extraire le texte de chaque observation
        var recognizedTexts: [String] = []
        for observation in observations {
            if let topCandidate = observation.topCandidates(1).first {
                recognizedTexts.append(topCandidate.string)
            }
        }

        return recognizedTexts
    }

    // MARK: - Reconnaissance avec regions

    /// Reconnait le texte et retourne les regions detectees avec leurs coordonnees.
    ///
    /// - Parameter imageData: Donnees brutes de l'image
    /// - Returns: Tableau de tuples (texte, confiance, boundingBox)
    ///
    /// Les coordonnees du boundingBox sont normalisees (0.0 a 1.0)
    /// avec l'origine en bas a gauche (convention Vision).
    /// Le caller devra les convertir en coordonnees ecran.
    func recognizeTextWithRegions(imageData: Data) -> [(text: String, confidence: Float, bounds: CGRect)] {
        // TODO: Implementer la reconnaissance avec regions
        //
        // Similaire a recognizeText() mais retourne egalement :
        // - Le score de confiance de chaque observation
        // - Le boundingBox normalise de chaque region de texte
        //
        // Utile pour :
        // - Afficher les zones de texte detectees en overlay
        // - Permettre la selection partielle du texte OCR
        // - Filtrer les resultats par confiance

        return []
    }

    // MARK: - Langues supportees

    /// Retourne la liste des langues supportees pour la reconnaissance.
    ///
    /// - Returns: Tableau des codes de langue (ex: ["fr", "en", "de", ...])
    func supportedLanguages() -> [String] {
        // TODO: Interroger Vision pour les langues disponibles
        //
        // Utiliser VNRecognizeTextRequest.supportedRecognitionLanguages()
        // pour obtenir la liste dynamique des langues supportees
        // par la version du systeme

        return ["fr", "en"]
    }
}
