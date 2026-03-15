/**
 * release.js — Automatisation de la release de ScreenSnap.
 *
 * Ce script :
 * 1. Verifie que le working tree est propre
 * 2. Propose un bump de version (patch, minor, major)
 * 3. Met a jour package.json
 * 4. Cree un commit de release
 * 5. Cree un tag git
 * 6. Propose de pousser vers le remote (declenche le workflow CI/CD)
 *
 * Usage :
 *   node scripts/release.js              # Interactif
 *   node scripts/release.js patch        # Bump patch directement
 *   node scripts/release.js minor        # Bump minor directement
 *   node scripts/release.js major        # Bump major directement
 *   node scripts/release.js --dry-run    # Simulation sans modification
 */

const { execSync } = require('child_process')
const fs = require('fs')
const path = require('path')
const readline = require('readline')

// ─── Configuration ───────────────────────────────────────────────────────────

const PROJECT_ROOT = path.resolve(__dirname, '..')
const PACKAGE_JSON_PATH = path.join(PROJECT_ROOT, 'package.json')
const CHANGELOG_PATH = path.join(PROJECT_ROOT, 'CHANGELOG.md')

// ─── Utilitaires ─────────────────────────────────────────────────────────────

function exec(cmd) {
  return execSync(cmd, { cwd: PROJECT_ROOT, encoding: 'utf-8' }).trim()
}

function ask(question) {
  const rl = readline.createInterface({
    input: process.stdin,
    output: process.stdout,
  })

  return new Promise((resolve) => {
    rl.question(question, (answer) => {
      rl.close()
      resolve(answer.trim())
    })
  })
}

function bumpVersion(currentVersion, type) {
  const [major, minor, patch] = currentVersion.split('.').map(Number)

  switch (type) {
    case 'major':
      return `${major + 1}.0.0`
    case 'minor':
      return `${major}.${minor + 1}.0`
    case 'patch':
      return `${major}.${minor}.${patch + 1}`
    default:
      throw new Error(`Type de bump invalide : ${type}`)
  }
}

function getDate() {
  const now = new Date()
  const year = now.getFullYear()
  const month = String(now.getMonth() + 1).padStart(2, '0')
  const day = String(now.getDate()).padStart(2, '0')
  return `${year}-${month}-${day}`
}

// ─── Verifications ───────────────────────────────────────────────────────────

function checkGitStatus() {
  const status = exec('git status --porcelain')
  if (status) {
    console.error('\n  Le working tree n\'est pas propre.')
    console.error('  Committez ou stashez vos changements avant de lancer une release.\n')
    console.error('  Fichiers modifies :')
    status.split('\n').forEach((line) => console.error(`    ${line}`))
    process.exit(1)
  }
}

function checkBranch() {
  const branch = exec('git branch --show-current')
  if (branch !== 'main') {
    console.warn(`\n  Attention : vous etes sur la branche "${branch}", pas "main".`)
  }
  return branch
}

// ─── Release ─────────────────────────────────────────────────────────────────

async function main() {
  const args = process.argv.slice(2)
  const dryRun = args.includes('--dry-run')
  const bumpType = args.find((a) => ['patch', 'minor', 'major'].includes(a))

  console.log('')
  console.log('======================================')
  console.log('  ScreenSnap — Release')
  console.log('======================================')
  console.log('')

  // 1. Verifications
  if (!dryRun) {
    checkGitStatus()
  }
  const branch = checkBranch()

  // 2. Lecture de la version actuelle
  const pkg = JSON.parse(fs.readFileSync(PACKAGE_JSON_PATH, 'utf-8'))
  const currentVersion = pkg.version
  console.log(`  Version actuelle : v${currentVersion}`)

  // 3. Determination du type de bump
  let type = bumpType
  if (!type) {
    console.log('')
    console.log('  Quel type de release ?')
    console.log('    1) patch  (bug fixes)')
    console.log('    2) minor  (nouvelles fonctionnalites)')
    console.log('    3) major  (changements incompatibles)')
    console.log('')

    const choice = await ask('  Choix [1/2/3] : ')
    const mapping = { '1': 'patch', '2': 'minor', '3': 'major' }
    type = mapping[choice]

    if (!type) {
      console.error('  Choix invalide.')
      process.exit(1)
    }
  }

  const newVersion = bumpVersion(currentVersion, type)
  console.log(`  Nouvelle version : v${newVersion}`)

  if (dryRun) {
    console.log('\n  [DRY RUN] Aucune modification effectuee.')
    return
  }

  // 4. Confirmation
  const confirm = await ask(`\n  Confirmer la release v${newVersion} ? [y/N] : `)
  if (confirm.toLowerCase() !== 'y') {
    console.log('  Release annulee.')
    process.exit(0)
  }

  // 5. Mise a jour de package.json
  pkg.version = newVersion
  fs.writeFileSync(PACKAGE_JSON_PATH, JSON.stringify(pkg, null, 2) + '\n', 'utf-8')
  console.log(`\n  package.json mis a jour (v${newVersion})`)

  // 6. Mise a jour du CHANGELOG (ajout d'une entree)
  if (fs.existsSync(CHANGELOG_PATH)) {
    let changelog = fs.readFileSync(CHANGELOG_PATH, 'utf-8')
    const newEntry = `\n## [${newVersion}] - ${getDate()}\n\n### Changed\n\n- Release v${newVersion}\n`
    changelog = changelog.replace(
      '## [Unreleased]',
      `## [Unreleased]\n${newEntry}`,
    )
    fs.writeFileSync(CHANGELOG_PATH, changelog, 'utf-8')
    console.log('  CHANGELOG.md mis a jour')
  }

  // 7. Commit de release
  exec('git add package.json CHANGELOG.md')
  exec(`git commit -m "chore(release): v${newVersion}"`)
  console.log(`  Commit cree : chore(release): v${newVersion}`)

  // 8. Tag git
  exec(`git tag -a v${newVersion} -m "Release v${newVersion}"`)
  console.log(`  Tag cree : v${newVersion}`)

  // 9. Push
  const shouldPush = await ask('\n  Pousser vers le remote ? [y/N] : ')
  if (shouldPush.toLowerCase() === 'y') {
    exec(`git push origin ${branch}`)
    exec(`git push origin v${newVersion}`)
    console.log('  Push effectue (branche + tag)')
    console.log(`\n  Le workflow de release devrait demarrer automatiquement.`)
  } else {
    console.log(`\n  Pour pousser manuellement :`)
    console.log(`    git push origin ${branch}`)
    console.log(`    git push origin v${newVersion}`)
  }

  console.log(`\n  Release v${newVersion} terminee.\n`)
}

main().catch((error) => {
  console.error('\n  Erreur lors de la release :', error.message)
  process.exit(1)
})
