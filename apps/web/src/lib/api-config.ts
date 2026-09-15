/**
 * Global API Client Configuration
 * Automatically points to the live Render backend if NEXT_PUBLIC_API_URL is not set.
 */

export const API_URL =
  process.env.NEXT_PUBLIC_API_URL || "https://codexa-mog.onrender.com/api";
