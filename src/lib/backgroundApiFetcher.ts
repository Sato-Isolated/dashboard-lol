// src/lib/backgroundMatchFetcher.ts
// Ce fichier ne doit contenir que du code utilisable côté client !
// PAS d'import Node/Mongo ici !

/**
 * Appelle l'API route Next.js pour lancer la mise à jour des matchs côté serveur.
 * À utiliser côté client (ex: bouton Update)
 */
export async function handleUserUpdate(
  region: string,
  name: string,
  tagline: string
) {
  const res = await fetch("/api/summoner/matches", {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ region, name, tagline }),
  });
  if (!res.ok) throw new Error("Erreur lors de la mise à jour des matchs");
}

export async function handleUserChampionMastery(
  region: string,
  name: string,
  tagline: string
) {
  const res = await fetch("/api/summoner/masteries", {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ region, name, tagline }),
  });
  if (!res.ok) throw new Error("Erreur lors de la mise à jour des champions");
}

export async function handleUserRecentlyPlayedUpdate(
  region: string,
  name: string,
  tagline: string
) {
  const res = await fetch("/api/summoner/recently-played", {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ region, name, tagline }),
  });
  if (!res.ok)
    throw new Error(
      "Erreur lors de la mise à jour des joueurs récemment joués"
    );
}
