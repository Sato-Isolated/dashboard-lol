"use client";

import React, { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import { Search } from "lucide-react";
import { useUserStore } from "@/store/userStore";
import { PlatformRegion } from "@/types/api/platformregion";
import { useEffectiveUser } from "@/hooks/useEffectiveUser";
import { mapLangToRegion } from "@/utils/langToRegion";

// Typage explicite des props pour SearchBar
const SearchBar: React.FC = () => {
  // Utilisation d'un état local pour le formulaire, synchronisé avec le store seulement au submit
  const { effectiveRegion, effectiveTagline, effectiveName } =
    useEffectiveUser();
  const { setUser } = useUserStore();
  const router = useRouter();
  const [hasError, setHasError] = useState<boolean>(false);
  const [region, setRegion] = useState<PlatformRegion | "">(
    (effectiveRegion as PlatformRegion) || ""
  );
  const [tagline, setTagline] = useState<string>(effectiveTagline || "");
  const [summonerName, setSummonerName] = useState<string>(effectiveName || "");

  // Préselectionne la région selon la langue/navigateur ou localStorage si aucune région n'est déjà définie
  useEffect(() => {
    const savedRegion =
      typeof window !== "undefined"
        ? localStorage.getItem("preferredRegion")
        : null;
    if (savedRegion && !region) {
      setRegion(savedRegion as PlatformRegion);
      return;
    }
    if (!region) {
      const browserLang = navigator.language || navigator.languages?.[0] || "";
      const defaultRegion = mapLangToRegion(browserLang) as PlatformRegion;
      setRegion(defaultRegion);
      if (typeof window !== "undefined") {
        localStorage.setItem("preferredRegion", defaultRegion);
      }
    }
  }, [region]);

  // Mémorise le choix de région à chaque changement
  useEffect(() => {
    if (region && typeof window !== "undefined") {
      localStorage.setItem("preferredRegion", region);
    }
  }, [region]);

  // Synchronise l'état local avec les valeurs effectives (ex: navigation directe)
  useEffect(() => {
    setRegion((effectiveRegion as PlatformRegion) || "");
    setTagline(effectiveTagline || "");
    setSummonerName(effectiveName || "");
  }, [effectiveRegion, effectiveTagline, effectiveName]);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    const isInvalid = summonerName.trim() === "" || tagline.trim() === "";
    if (isInvalid) {
      setHasError(true);
      return;
    }
    setHasError(false);
    setUser({ region, tagline, summonerName });
    router.push(`/${region}/summoner/${summonerName}/${tagline}`);
  };

  return (
    <form
      onSubmit={handleSubmit}
      className="flex flex-row items-center gap-2 w-full max-w-xl"
    >
      <div
        className={`flex items-center bg-base-100 border rounded-2xl px-6 py-3 w-full ${
          hasError ? "border-error" : "border-base-300"
        }`}
      >
        <label htmlFor="summonerName" className="sr-only">
          Summoner Name
        </label>
        <input
          id="summonerName"
          type="text"
          value={summonerName}
          onChange={(e) => setSummonerName(e.target.value.trimStart())}
          placeholder="SummonerName"
          aria-invalid={hasError && summonerName.trim() === ""}
          className={`bg-transparent border-0 outline-none text-lg w-1/3 min-w-[120px] max-w-xs ${
            hasError && summonerName.trim() === "" ? "text-error" : ""
          }`}
        />
        <span className="mx-4 border-l h-8 border-b-blue-50" />
        <label htmlFor="tagline" className="sr-only">
          Tagline
        </label>
        <input
          id="tagline"
          type="text"
          value={tagline}
          onChange={(e) => setTagline(e.target.value.trimStart())}
          placeholder="Tagline"
          aria-invalid={hasError && tagline.trim() === ""}
          className={`bg-transparent border-0 outline-none text-lg w-1/4 min-w-[80px] max-w-xs ${
            hasError && tagline.trim() === "" ? "text-error" : ""
          }`}
        />
        <label htmlFor="region" className="sr-only">
          Region
        </label>
        <select
          name="region"
          id="region"
          className="select select-ghost bg-transparent border-0 outline-none text-lg w-24 ml-auto"
          value={region}
          onChange={(e) => setRegion(e.target.value as PlatformRegion)}
        >
          {Object.entries(PlatformRegion).map(([key, value]) => (
            <option key={key} value={value} className="text-lg">
              {value}
            </option>
          ))}
        </select>
        <button type="submit" className="pl-6 w-12 cursor-pointer">
          <Search size={28} strokeWidth={2.5} />
        </button>
      </div>
      {hasError && (
        <p className="text-error text-sm ml-1">
          Please fill in both summoner name and tagline.
        </p>
      )}
    </form>
  );
};

export default SearchBar;
