import { useEffect } from 'react'
import { useAppStore, type Theme } from '@renderer/stores/app.store'

/**
 * Determine le theme effectif en fonction du choix utilisateur et du systeme.
 */
function getEffectiveTheme(theme: Theme): 'light' | 'dark' {
  if (theme !== 'system') return theme
  if (typeof window === 'undefined') return 'light'
  return window.matchMedia('(prefers-color-scheme: dark)').matches ? 'dark' : 'light'
}

/**
 * Hook qui synchronise le mode sombre/clair avec la preference systeme
 * et le store de l'application. Ajoute/retire la classe `dark` sur le document.
 */
export function useTheme() {
  const theme = useAppStore((state) => state.theme)
  const setTheme = useAppStore((state) => state.setTheme)

  useEffect(() => {
    function applyTheme() {
      const effective = getEffectiveTheme(theme)
      const root = document.documentElement

      if (effective === 'dark') {
        root.classList.add('dark')
      } else {
        root.classList.remove('dark')
      }
    }

    applyTheme()

    // Ecouter les changements de preference systeme
    const mediaQuery = window.matchMedia('(prefers-color-scheme: dark)')

    function handleChange() {
      if (theme === 'system') {
        applyTheme()
      }
    }

    mediaQuery.addEventListener('change', handleChange)
    return () => {
      mediaQuery.removeEventListener('change', handleChange)
    }
  }, [theme])

  return { theme, setTheme, effectiveTheme: getEffectiveTheme(theme) }
}
