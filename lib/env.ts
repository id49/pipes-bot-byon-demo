function requireEnv(name: string): string {
  const value = process.env[name];
  if (!value) {
    throw new Error(`Missing required environment variable: ${name}`);
  }
  return value;
}

export function getEnv() {
  return {
    PIPES_APP_API_KEY: requireEnv("PIPES_APP_API_KEY"),
    PIPES_APP_SLUG: requireEnv("PIPES_APP_SLUG"),
    PARTNER_REDIRECT_URL: requireEnv("PARTNER_REDIRECT_URL"),
    PIPES_API_BASE_URL:
      process.env.PIPES_API_BASE_URL || "https://api.pipes.bot",
  };
}
