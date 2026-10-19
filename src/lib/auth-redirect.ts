/** Only allow returning to the authenticated experience, never another origin. */
export function experienceRedirect(value: unknown): string {
  if (typeof value !== 'string') return '/experience';
  try {
    const url = new URL(value, 'https://vien.invalid');
    if (url.origin !== 'https://vien.invalid' || url.pathname !== '/experience') return '/experience';
    const params = new URLSearchParams();
    for (const key of ['tab', 'destination']) {
      const item = url.searchParams.get(key);
      if (item) params.set(key, item);
    }
    return '/experience' + (params.size ? `?${params}` : '');
  } catch { return '/experience'; }
}
