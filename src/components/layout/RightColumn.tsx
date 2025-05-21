import React, { useEffect, useState } from "react";
import { useEffectiveUser } from "@/hooks/useEffectiveUser";
import { useUserStore } from "@/store/userStore";

interface Favorite {
  region: string;
  tagline: string;
  name: string;
}

const FAVORITES_KEY = "lol-favorites";

function getFavorites(): Favorite[] {
  if (typeof window === "undefined") return [];
  try {
    return JSON.parse(localStorage.getItem(FAVORITES_KEY) || "[]");
  } catch {
    return [];
  }
}

function saveFavorites(favs: Favorite[]) {
  if (typeof window === "undefined") return;
  localStorage.setItem(FAVORITES_KEY, JSON.stringify(favs));
}

const RightColumn: React.FC = () => {
  const { effectiveRegion, effectiveTagline, effectiveName } = useEffectiveUser();
  const setUser = useUserStore((s) => s.setUser);
  const [favorites, setFavorites] = useState<Favorite[]>([]);
  const [isFav, setIsFav] = useState(false);
  const [shareMsg, setShareMsg] = useState("");

  useEffect(() => {
    const favs = getFavorites();
    setFavorites(favs);
    setIsFav(
      favs.some(
        (f) =>
          f.region === effectiveRegion &&
          f.tagline === effectiveTagline &&
          f.name === effectiveName
      )
    );
  }, [effectiveRegion, effectiveTagline, effectiveName]);

  const handleToggleFavorite = () => {
    let favs = getFavorites();
    const idx = favs.findIndex(
      (f) =>
        f.region === effectiveRegion &&
        f.tagline === effectiveTagline &&
        f.name === effectiveName
    );
    if (idx !== -1) {
      favs.splice(idx, 1);
    } else {
      favs.push({ region: effectiveRegion, tagline: effectiveTagline, name: effectiveName });
    }
    saveFavorites(favs);
    setFavorites(favs);
    setIsFav(idx === -1);
  };

  const handleShare = () => {
    const url = `${window.location.origin}/${effectiveRegion}/summoner/${encodeURIComponent(
      effectiveName
    )}/${encodeURIComponent(effectiveTagline)}`;
    navigator.clipboard.writeText(url);
    setShareMsg("Lien copié !");
    setTimeout(() => setShareMsg(""), 1500);
  };

  const handleSelectFavorite = (fav: Favorite) => {
    setUser({ region: fav.region, tagline: fav.tagline, summonerName: fav.name });
    window.location.href = `/${fav.region}/summoner/${encodeURIComponent(fav.name)}/${encodeURIComponent(fav.tagline)}`;
  };

  return (
    <div className="flex flex-col gap-4">
      <div className="bg-base-100 rounded-xl shadow p-4 min-h-[120px] flex flex-col items-center justify-center text-base-content/60 w-full">
        <span className="font-semibold text-base-content mb-2">Widgets & Actions</span>
        <div className="flex flex-col gap-2 w-full items-center">
          <button
            className={`btn btn-sm btn-outline flex items-center gap-2 w-full justify-center ${isFav ? "btn-success" : ""}`}
            onClick={handleToggleFavorite}
          >
            <span>⭐</span> {isFav ? "Retirer des favoris" : "Ajouter aux favoris"}
          </button>
          <button
            className="btn btn-sm btn-outline flex items-center gap-2 w-full justify-center"
            onClick={handleShare}
          >
            <span>🔗</span> Partager le profil
          </button>
          {shareMsg && <span className="text-success text-xs">{shareMsg}</span>}
        </div>
      </div>
      <div className="bg-base-100 rounded-xl shadow p-4 flex flex-col items-center w-full">
        <span className="font-semibold text-base-content mb-2">Favoris</span>
        <div className="flex flex-col gap-1 w-full">
          {favorites.length === 0 ? (
            <span className="text-base-content/50 text-xs">Aucun favori</span>
          ) : (
            favorites.map((fav, i) => (
              <button
                key={fav.region + fav.tagline + fav.name + i}
                className={`btn btn-xs btn-outline w-full justify-between ${
                  fav.region === effectiveRegion &&
                  fav.tagline === effectiveTagline &&
                  fav.name === effectiveName
                    ? "btn-primary"
                    : ""
                }`}
                onClick={() => handleSelectFavorite(fav)}
              >
                <span>
                  {fav.name}
                  <span className="text-base-content/40 ml-1">#{fav.tagline}</span>
                </span>
                <span className="text-xs">{fav.region.toUpperCase()}</span>
              </button>
            ))
          )}
        </div>
      </div>
    </div>
  );
};

export default RightColumn;
