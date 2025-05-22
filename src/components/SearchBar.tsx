"use client";

import React, { useState, useEffect, useRef } from "react";
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
  const [suggestions, setSuggestions] = useState<
    { name: string; tagline: string; region: string }[]
  >([]);
  const [showSuggestions, setShowSuggestions] = useState(false);
  const [highlightedIndex, setHighlightedIndex] = useState(-1);
  const inputRef = useRef<HTMLInputElement>(null);

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

  useEffect(() => {
    if (summonerName.length >= 2) {
      fetch(`/api/summoner/search?q=${encodeURIComponent(summonerName)}`)
        .then((res) => res.json())
        .then((data) => setSuggestions(data));
    } else {
      setSuggestions([]);
    }
  }, [summonerName]);

  // Fermer suggestions si clic en dehors
  useEffect(() => {
    function handleClick(e: MouseEvent) {
      if (!inputRef.current?.parentElement?.contains(e.target as Node)) {
        setShowSuggestions(false);
      }
    }
    if (showSuggestions) {
      document.addEventListener("mousedown", handleClick);
      return () => document.removeEventListener("mousedown", handleClick);
    }
  }, [showSuggestions]);

  // Réinitialise l'index surligné lors du changement de suggestions ou de l'affichage/masquage de la liste
  useEffect(() => {
    setHighlightedIndex(-1);
  }, [suggestions, showSuggestions]);

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
      autoComplete="off"
    >
      <div
        className={`flex items-center bg-base-100 border rounded-2xl px-6 py-3 w-full ${
          hasError ? "border-error" : "border-base-300"
        } relative`}
      >
        <label htmlFor="summonerName" className="sr-only">
          Summoner Name
        </label>
        <input
          id="summonerName"
          type="text"
          value={summonerName}
          onChange={(e) => {
            setSummonerName(e.target.value.trimStart());
            setShowSuggestions(true);
          }}
          placeholder="SummonerName"
          aria-invalid={hasError && summonerName.trim() === ""}
          className={`bg-transparent border-0 outline-none text-lg w-1/3 min-w-[120px] max-w-xs ${
            hasError && summonerName.trim() === "" ? "text-error" : ""
          }`}
          ref={inputRef}
          autoComplete="off"
          onFocus={() => setShowSuggestions(true)}
          onKeyDown={(e) => {
            if (!showSuggestions || suggestions.length === 0) return;
            if (e.key === "ArrowDown") {
              e.preventDefault();
              setHighlightedIndex((prev) => (prev + 1) % suggestions.length);
            } else if (e.key === "ArrowUp") {
              e.preventDefault();
              setHighlightedIndex((prev) =>
                prev <= 0 ? suggestions.length - 1 : prev - 1
              );
            } else if (e.key === "Enter" && highlightedIndex >= 0) {
              e.preventDefault();
              const s = suggestions[highlightedIndex];
              setSummonerName(s.name);
              setTagline(s.tagline);
              setRegion(s.region as PlatformRegion);
              setShowSuggestions(false);
            }
          }}
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
          autoComplete="off"
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
        {showSuggestions && suggestions.length > 0 && (
          <ul className="absolute left-0 top-full mt-2 w-full bg-base-100 border border-base-300 rounded-xl shadow z-50 max-h-60 overflow-auto">
            {suggestions.map((s, i) => (
              <li
                key={s.name + s.tagline + s.region + i}
                className={`px-4 py-2 cursor-pointer flex justify-between ${
                  i === highlightedIndex ? "bg-base-200" : "hover:bg-base-200"
                }`}
                onClick={() => {
                  setSummonerName(s.name);
                  setTagline(s.tagline);
                  setRegion(s.region as PlatformRegion);
                  setShowSuggestions(false);
                }}
                onMouseEnter={() => setHighlightedIndex(i)}
              >
                <span>{s.name}</span>
                <span className="text-xs text-base-content/60 ml-2">
                  #{s.tagline} ({s.region})
                </span>
              </li>
            ))}
          </ul>
        )}
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
