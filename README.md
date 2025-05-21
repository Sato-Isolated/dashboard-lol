# dashboard-lol

<details>
<summary>🇫🇷 Version française</summary>

Dashboard Next.js pour visualiser l'historique de matchs League of Legends d'un joueur (via Riot API) avec stockage MongoDB, pagination, et mise à jour manuelle.

## Fonctionnalités principales

- **Récupération complète de l'historique de matchs** d'un joueur LoL via l'API Riot (pagination automatique, gestion du rate limit, stockage MongoDB).
- **Bouton "Update"** dans l'UI pour déclencher la récupération côté serveur (historique complet la première fois, puis uniquement les nouvelles games ensuite).
- **Affichage des matchs** paginé (10 par 10) dans le dashboard, avec bouton "Load More" pour charger la suite.
- **Noms de joueurs cliquables** dans l'historique, menant à leur page dédiée.
- **Séparation stricte client/serveur** (Next.js, pas d'import Node côté client).
- **Suivi d'état de récupération** en base (collection `summoners` avec `fetchOldGames`, `lastFetchedGameEndTimestamp`).

## Utilisation

1. **Lancer le serveur**

```bash
npm run dev
# ou
yarn dev
```

2. **Accéder au dashboard**

Ouvrir [http://localhost:3000](http://localhost:3000) dans le navigateur.

3. **Mettre à jour l'historique d'un joueur**

- Rechercher un joueur (nom + tagline).
- Cliquer sur le bouton **Update** pour lancer la récupération complète de l'historique (ou l'incrémental si déjà fait).
- Les 10 premiers matchs s'affichent automatiquement, puis possibilité de paginer avec **Load More**.

## Structure technique

- **src/scripts/fetchAndStoreMatches.ts** : script principal de récupération et stockage des matchs (pagination Riot API, gestion du rate limit, update de l'état en base).
- **src/app/api/update-matches/route.ts** : endpoint API pour déclencher la récupération côté serveur.
- **src/components/layout/HeaderSection.tsx** : bouton Update (déclenche la récupération via l'API).
- **src/components/layout/CenterColumn.tsx** : affichage des matchs paginés, bouton Load More.
- **src/repositories/summonerRepo.ts** : gestion de l'état de récupération par joueur.
- **src/repositories/matchRepo.ts** : gestion des matchs en base.
- **src/types/schema/SummonerCollection.ts** : type Summoner (avec fetchOldGames, lastFetchedGameEndTimestamp).

## Pagination & UX

- Les 10 premiers matchs sont affichés automatiquement après une mise à jour.
- Le bouton "Load More" permet de charger la suite (10 par 10).
- Le bouton "Update" relance la récupération côté serveur (historique complet la première fois, puis incrémental).

## Dépendances

- Next.js, React, MongoDB, Riot API.

---

Pour toute question ou contribution, ouvrir une issue ou une PR sur ce repo.

</details>

<details>
<summary>🇬🇧 English version</summary>

Dashboard Next.js to visualize a League of Legends player's match history (via Riot API) with MongoDB storage, pagination, and manual update.

## Main features

- **Full match history retrieval** for a LoL player via Riot API (automatic pagination, rate limit handling, MongoDB storage).
- **"Update" button** in the UI to trigger server-side fetching (full history the first time, then only new games).
- **Paginated match display** (10 by 10) in the dashboard, with a "Load More" button to fetch more.
- **Clickable player names** in match history, leading to their dedicated page.
- **Strict client/server separation** (Next.js, no Node imports on client side).
- **Fetch state tracking** in the database (collection `summoners` with `fetchOldGames`, `lastFetchedGameEndTimestamp`).

## Usage

1. **Start the server**

```bash
npm run dev
# or
yarn dev
```

2. **Access the dashboard**

Open [http://localhost:3000](http://localhost:3000) in your browser.

3. **Update a player's match history**

- Search for a player (name + tagline).
- Click the **Update** button to fetch the full match history (or only new games if already done).
- The first 10 matches are displayed automatically, then you can paginate with **Load More**.

## Technical structure

- **src/scripts/fetchAndStoreMatches.ts**: main script for fetching and storing matches (Riot API pagination, rate limit handling, DB state update).
- **src/app/api/update-matches/route.ts**: API endpoint to trigger server-side fetching.
- **src/components/layout/HeaderSection.tsx**: Update button (triggers API fetch).
- **src/components/layout/CenterColumn.tsx**: paginated match display, Load More button.
- **src/repositories/summonerRepo.ts**: manages fetch state per player.
- **src/repositories/matchRepo.ts**: manages matches in DB.
- **src/types/schema/SummonerCollection.ts**: Summoner type (with fetchOldGames, lastFetchedGameEndTimestamp).

## Pagination & UX

- The first 10 matches are displayed automatically after an update.
- The "Load More" button loads more (10 by 10).
- The "Update" button triggers server-side fetching (full history first, then incremental).

## Dependencies

- Next.js, React, MongoDB, Riot API.

---

For any questions or contributions, open an issue or PR on this repo.

</details>

```
dashboard-lol
├─ eslint.config.mjs
├─ next.config.ts
├─ package.json
├─ pnpm-lock.yaml
├─ pnpm-workspace.yaml
├─ postcss.config.mjs
├─ public
│  ├─ file.svg
│  ├─ globe.svg
│  ├─ next.svg
│  ├─ vercel.svg
│  └─ window.svg
├─ README.md
├─ src
│  ├─ app
│  │  ├─ api
│  │  │  ├─ matches
│  │  │  │  └─ route.ts
│  │  │  └─ update-matches
│  │  │     └─ route.ts
│  │  ├─ favicon.ico
│  │  ├─ globals.css
│  │  ├─ layout.tsx
│  │  ├─ page.tsx
│  │  ├─ README.md
│  │  └─ [region]
│  │     └─ summoner
│  │        └─ [name]
│  │           └─ [tagline]
│  │              └─ page.tsx
│  ├─ components
│  │  ├─ layout
│  │  │  ├─ CenterColumn.tsx
│  │  │  ├─ header.tsx
│  │  │  ├─ HeaderSection.tsx
│  │  │  ├─ LeftColumn.tsx
│  │  │  ├─ MainLayout.tsx
│  │  │  └─ RightColumn.tsx
│  │  ├─ match
│  │  │  ├─ MatchCard.tsx
│  │  │  └─ TabsSection.tsx
│  │  ├─ README.md
│  │  └─ SearchBar.tsx
│  ├─ context
│  │  ├─ README.md
│  │  └─ UserContext.tsx
│  ├─ db
│  │  └─ init.ts
│  ├─ lib
│  │  ├─ backgroundMatchFetcher.ts
│  │  ├─ mongo.ts
│  │  └─ summoner.ts
│  ├─ repositories
│  │  ├─ matchRepo.ts
│  │  └─ summonerRepo.ts
│  ├─ scripts
│  │  ├─ fetchAndStoreMasteries.ts
│  │  └─ fetchAndStoreMatches.ts
│  ├─ services
│  │  ├─ lol
│  │  │  ├─ accountService.ts
│  │  │  ├─ champion-masteryService.ts
│  │  │  ├─ championService.ts
│  │  │  ├─ data.json
│  │  │  ├─ matchService.ts
│  │  │  ├─ RiotApiClient.ts
│  │  │  ├─ riotServiceFactory.ts
│  │  │  └─ summonerService.ts
│  │  └─ README.md
│  ├─ styles
│  │  └─ README.md
│  ├─ types
│  │  ├─ api
│  │  │  ├─ account.d.ts
│  │  │  ├─ champion-mastery.d.ts
│  │  │  ├─ champion.d.ts
│  │  │  ├─ match.d.ts
│  │  │  ├─ platformregion.ts
│  │  │  ├─ regions.ts
│  │  │  └─ summoners.d.ts
│  │  ├─ data
│  │  │  └─ champion.ts
│  │  ├─ README.md
│  │  ├─ schema
│  │  │  ├─ MatchCollection.ts
│  │  │  └─ SummonerCollection.ts
│  │  └─ ui-match.ts
│  └─ utils
│     ├─ formatName.ts
│     ├─ helper.ts
│     └─ README.md
└─ tsconfig.json

```