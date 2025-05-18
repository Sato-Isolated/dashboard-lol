export abstract class RiotApiClient {
  protected apiKey: string;
  protected baseUrl: string;
  
  constructor(apiKey: string, region: string) {
    this.apiKey = apiKey;
    this.baseUrl = `https://${region}.api.riotgames.com`;
  }

  protected async fetch<T>(endpoint: string): Promise<T> {
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
