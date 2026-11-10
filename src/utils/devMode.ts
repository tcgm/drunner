const DEV_TOOLS_KEY = 'drunner-dev-tools'

/**
 * Dev tools are always available in dev builds. In production they stay hidden
 * from players; visiting the game with `?dev=1` enables them on this browser
 * (remembered), and `?dev=0` turns them back off.
 */
export function isDevToolsEnabled(): boolean {
  if (import.meta.env.DEV) return true
  try {
    const flag = new URLSearchParams(window.location.search).get('dev')
    if (flag === '1') localStorage.setItem(DEV_TOOLS_KEY, '1')
    else if (flag === '0') localStorage.removeItem(DEV_TOOLS_KEY)
    return localStorage.getItem(DEV_TOOLS_KEY) === '1'
  } catch {
    return false
  }
}
