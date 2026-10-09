export function getApiUrl() {
  if (process.env.NEXT_PUBLIC_API_URL) {
    return process.env.NEXT_PUBLIC_API_URL;
  }

  // By default, use the unified Next.js App Router API routes
  return "/api";
}
