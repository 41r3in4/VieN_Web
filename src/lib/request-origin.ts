/** Compare against the configured public URL when running behind a reverse proxy. */
export function hasValidOrigin(request: Request): boolean {
  try {
    const expected = new URL(process.env.BETTER_AUTH_URL || request.url).origin;
    return request.headers.get('origin') === expected;
  } catch {
    return false;
  }
}
