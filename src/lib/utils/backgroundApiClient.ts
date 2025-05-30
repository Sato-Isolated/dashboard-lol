/**
 * Calls the Next.js API route to trigger match updates on the server side.
 * To be used on the client side (e.g., Update button)
 */
export async function handleUserUpdate(
  region: string,
  name: string,
  tagline: string,
) {
  const res = await fetch('/api/summoner/matches', {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ region, name, tagline }),
  });
  if (!res.ok) {
    throw new Error('Error while updating matches');
  }
}

export async function handleUserChampionMastery(
  region: string,
  name: string,
  tagline: string,
) {
  const res = await fetch('/api/summoner/masteries', {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ region, name, tagline }),
  });
  if (!res.ok) {
    throw new Error('Error while updating champion masteries');
  }
}

export async function handleUserRecentlyPlayedUpdate(
  region: string,
  name: string,
  tagline: string,
) {
  const res = await fetch('/api/summoner/recently-played', {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ region, name, tagline }),
  });
  if (!res.ok) {
    throw new Error('Error while updating recently played players');
  }
}
