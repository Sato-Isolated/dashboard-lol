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
  await fetch("/api/update-matches", {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ region, name, tagline }),
  });
}
