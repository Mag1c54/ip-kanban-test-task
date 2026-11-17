/**
 * Returns `window.localStorage` when it is available.
 *
 * Access can throw in private mode or sandboxed iframes, so every caller gets
 * `null` instead of an exception and can fall back to in-memory state.
 */
export function getLocalStorage(): Storage | null {
  try {
    return typeof window !== 'undefined' ? window.localStorage : null;
  } catch {
    return null;
  }
}
