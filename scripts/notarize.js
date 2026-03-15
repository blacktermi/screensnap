/**
 * notarize.js — Script de notarisation macOS pour electron-builder.
 *
 * Ce script est execute automatiquement par electron-builder apres la signature
 * du code (hook afterSign). Il soumet l'application a Apple pour notarisation,
 * ce qui est requis pour distribuer l'app en dehors du Mac App Store sur
 * macOS 10.15 (Catalina) et versions ulterieures.
 *
 * Configuration requise :
 *
 * 1. Variables d'environnement :
 *    - APPLE_ID            : Votre identifiant Apple (email)
 *    - APPLE_ID_PASSWORD   : Mot de passe specifique a l'application
 *                            (genere sur appleid.apple.com > Securite > Mots de passe)
 *    - APPLE_TEAM_ID       : Identifiant d'equipe Apple Developer
 *
 * 2. Fichier .env (optionnel) :
 *    APPLE_ID=votre@email.com
 *    APPLE_ID_PASSWORD=xxxx-xxxx-xxxx-xxxx
 *    APPLE_TEAM_ID=XXXXXXXXXX
 *
 * 3. Activation dans electron-builder.yml :
 *    Decommentez la ligne : afterSign: scripts/notarize.js
 *
 * 4. Prerequis :
 *    - Compte Apple Developer actif ($99/an)
 *    - Certificat "Developer ID Application" installe dans le Trousseau
 *    - pnpm add -D @electron/notarize
 *
 * Usage :
 *    Ce script est appele automatiquement par electron-builder.
 *    Ne pas l'executer manuellement.
 */

const { notarize } = require('@electron/notarize')
const path = require('path')

/**
 * Hook afterSign pour electron-builder.
 * @param {import('electron-builder').AfterPackContext} context
 */
exports.default = async function notarizeApp(context) {
  const { electronPlatformName, appOutDir } = context

  // Notarisation uniquement sur macOS
  if (electronPlatformName !== 'darwin') {
    console.log('[Notarize] Plateforme non macOS, notarisation ignoree.')
    return
  }

  // Verification des variables d'environnement
  const appleId = process.env.APPLE_ID
  const appleIdPassword = process.env.APPLE_ID_PASSWORD
  const teamId = process.env.APPLE_TEAM_ID

  if (!appleId || !appleIdPassword || !teamId) {
    console.warn(
      '[Notarize] Variables d\'environnement manquantes.\n' +
        '  Requises : APPLE_ID, APPLE_ID_PASSWORD, APPLE_TEAM_ID\n' +
        '  La notarisation est ignoree.',
    )
    return
  }

  const appName = context.packager.appInfo.productFilename
  const appPath = path.join(appOutDir, `${appName}.app`)

  console.log(`[Notarize] Soumission de "${appName}" a Apple pour notarisation...`)
  console.log(`[Notarize] Chemin : ${appPath}`)
  console.log(`[Notarize] Team ID : ${teamId}`)

  try {
    await notarize({
      appPath,
      appleId,
      appleIdPassword,
      teamId,
      tool: 'notarytool',
    })

    console.log('[Notarize] Notarisation terminee avec succes.')
  } catch (error) {
    console.error('[Notarize] Echec de la notarisation :', error.message)

    // En CI, on peut vouloir echouer le build
    if (process.env.CI) {
      throw error
    }

    // En local, on avertit mais on ne bloque pas le build
    console.warn(
      '[Notarize] Le build continue sans notarisation.\n' +
        '  L\'application ne pourra pas etre distribuee sans notarisation.',
    )
  }
}
