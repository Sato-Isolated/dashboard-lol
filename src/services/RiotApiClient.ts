export abstract class RiotApiClient {
  protected apiKey: string;
  protected baseUrl: string;
  private rateLimitPerSecond: number = 20;
  private rateLimitPerTwoMinute: number = 100;
  private requestsThisSecond = 0;
  private requestsThisTwoMinutes = 0;
  private lastSecond = Date.now();
  private lastTwoMinutes = Date.now();

  constructor(apiKey: string, region: string) {
    this.apiKey = apiKey;
    this.baseUrl = `https://${region}.api.riotgames.com`;
  }

  private async rateLimit(): Promise<void> {
    const now = Date.now();
    // Reset counters if time window has passed
    if (now - this.lastSecond >= 1000) {
      this.requestsThisSecond = 0;
      this.lastSecond = now;
    }
    if (now - this.lastTwoMinutes >= 120000) {
      this.requestsThisTwoMinutes = 0;
      this.lastTwoMinutes = now;
    }
    // Wait if over the limit
    while (
      this.requestsThisSecond >= this.rateLimitPerSecond ||
      this.requestsThisTwoMinutes >= this.rateLimitPerTwoMinute
    ) {
      await new Promise((resolve) => setTimeout(resolve, 100));
      const now2 = Date.now();
      if (now2 - this.lastSecond >= 1000) {
        this.requestsThisSecond = 0;
        this.lastSecond = now2;
      }
      if (now2 - this.lastTwoMinutes >= 120000) {
        this.requestsThisTwoMinutes = 0;
        this.lastTwoMinutes = now2;
      }
    }
    this.requestsThisSecond++;
    this.requestsThisTwoMinutes++;
  }

  protected async fetch<T>(endpoint: string): Promise<T> {
    await this.rateLimit();
    const url = `${this.baseUrl}${endpoint}`;
    const response = await fetch(url, {
      headers: {
        "X-Riot-Token": this.apiKey,
      },
    });

    if (!response.ok) {
      throw new Error(`Error fetching data: ${response.statusText}`);
    }

    return response.json();
  }
}
