"use client";
import React from "react";
import Image from "next/image";
import { getSummonerIcon } from "@/utils/helper";
import { useAccountSummoner } from "@/hooks/useAccountSummoner";
import { useEffectiveUser } from "@/hooks/useEffectiveUser";
import { useUserStore } from "@/store/userStore";
import { useUpdateUserData } from "@/hooks/useUpdateUserData";

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

const HeaderSection: React.FC = () => {
  console.log("HeaderSection render");
  const { effectiveRegion, effectiveTagline, effectiveName } =
    useEffectiveUser();
  const {
    account,
    summoner,
    loading: loadingSummoner,
    error: errorSummoner,
  } = useAccountSummoner(effectiveRegion, effectiveName, effectiveTagline);
  const setUser = useUserStore((s) => s.setUser);
  const [favorites, setFavorites] = React.useState<Favorite[]>([]);
  const [isFav, setIsFav] = React.useState(false);
  const [shareMsg, setShareMsg] = React.useState("");
  const {
    loading: updateUserDataLoading,
    error: updateUserDataError,
    updateUserData,
  } = useUpdateUserData();

  React.useEffect(() => {
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
    const favs = getFavorites();
    const idx = favs.findIndex(
      (f) =>
        f.region === effectiveRegion &&
        f.tagline === effectiveTagline &&
        f.name === effectiveName
    );
    if (idx !== -1) {
      favs.splice(idx, 1);
    } else {
      favs.push({
        region: effectiveRegion,
        tagline: effectiveTagline,
        name: effectiveName,
      });
    }
    saveFavorites(favs);
    setFavorites(favs);
    setIsFav(idx === -1);
  };

  const handleShare = () => {
    const url = `${
      window.location.origin
    }/${effectiveRegion}/summoner/${encodeURIComponent(
      effectiveName
    )}/${encodeURIComponent(effectiveTagline)}`;
    navigator.clipboard.writeText(url);
    setShareMsg("Lien copié !");
    setTimeout(() => setShareMsg(""), 1500);
  };

  const handleSelectFavorite = (fav: Favorite) => {
    setUser({
      region: fav.region,
      tagline: fav.tagline,
      summonerName: fav.name,
    });
    window.location.href = `/${fav.region}/summoner/${encodeURIComponent(
      fav.name
    )}/${encodeURIComponent(fav.tagline)}`;
  };

  if (loadingSummoner) return <div>Chargement...</div>;
  if (errorSummoner || !account || !summoner)
    return <div className="text-error">Erreur de chargement du joueur.</div>;
  return (
    <div className="flex flex-col md:flex-row items-center gap-4 w-full bg-base-200 rounded-xl p-6 shadow">
      <div className="flex items-center gap-4 w-full md:w-auto">
        <Image
          src={getSummonerIcon(summoner.profileIconId)}
          alt={account.gameName}
          width={80}
          height={80}
          className="rounded-full border-4 border-primary"
          onError={(e) => {
            e.currentTarget.src = "/assets/profileicon/0.png";
          }}
        />
        <div className="flex flex-col">
          <span className="text-2xl font-bold text-base-content">
            {account.gameName}
            <span className="text-base-content/60">#{account.tagLine}</span>
          </span>
          <span className="text-base-content/70 text-sm mt-1">
            {effectiveRegion.toUpperCase()}
          </span>
          <span className="text-base-content/50 text-xs">
            Level {summoner.summonerLevel}
          </span>
        </div>
      </div>
      <div className="flex-1 flex flex-col md:flex-row justify-end items-center gap-4 w-full md:w-auto">
        <div className="flex flex-col gap-2 w-full md:w-auto items-center">
          <button
            className={`btn btn-sm btn-outline flex items-center gap-2 w-full justify-center ${
              isFav ? "btn-success" : ""
            }`}
            onClick={handleToggleFavorite}
          >
            <span>⭐</span>{" "}
            {isFav ? "Retirer des favoris" : "Ajouter aux favoris"}
          </button>
          <button
            className="btn btn-sm btn-outline flex items-center gap-2 w-full justify-center"
            onClick={handleShare}
          >
            <span>🔗</span> Partager le profil
          </button>
          {shareMsg && <span className="text-success text-xs">{shareMsg}</span>}
        </div>
        <button
          className="btn btn-primary btn-sm"
          onClick={updateUserData}
          disabled={updateUserDataLoading}
        >
          {updateUserDataLoading ? "Mise à jour..." : "Update"}
        </button>
      </div>
      <div className="flex flex-col items-center w-full md:w-auto">
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
                  <span className="text-base-content/40 ml-1">
                    #{fav.tagline}
                  </span>
                </span>
                <span className="text-xs">{fav.region.toUpperCase()}</span>
              </button>
            ))
          )}
        </div>
      </div>
      {updateUserDataError && (
        <div className="text-error text-xs text-center w-full mt-2">
          {updateUserDataError}
        </div>
      )}
    </div>
  );
};

export default HeaderSection;
