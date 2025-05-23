"use client";

import React, { useState, useEffect, useRef } from "react";
import { useRouter } from "next/navigation";
import { Search } from "lucide-react";
import { useUserStore } from "@/store/userStore";
import { PlatformRegion } from "@/types/api/platformregion";
import { useEffectiveUser } from "@/hooks/useEffectiveUser";
import { mapLangToRegion } from "@/utils/langToRegion";

// Explicit typing for SearchBar props
const SearchBar: React.FC = () => {
  // Use local state for the form, sync with store only on submit
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
  const [suggestionError, setSuggestionError] = useState<string | null>(null);

  // Preselect region based on browser language or localStorage if none is set
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

  // Remember region choice on each change
  useEffect(() => {
    if (region && typeof window !== "undefined") {
      localStorage.setItem("preferredRegion", region);
    }
  }, [region]);

  // Sync local state with effective values (e.g., direct navigation)
  useEffect(() => {
    setRegion((effectiveRegion as PlatformRegion) || "");
    setTagline(effectiveTagline || "");
    setSummonerName(effectiveName || "");
  }, [effectiveRegion, effectiveTagline, effectiveName]);

  useEffect(() => {
    const controller = new AbortController();
    if (summonerName.length >= 2) {
      setSuggestionError(null);
      fetch(`/api/summoner/search?q=${encodeURIComponent(summonerName)}`, {
        signal: controller.signal,
      })
        .then((res) => {
          if (!res.ok) throw new Error("Error while searching for players.");
          return res.json();
        })
        .then((data) => setSuggestions(data))
        .catch((e) => {
          if (e.name === "AbortError") return;
          setSuggestionError(e.message || "Error while searching for players.");
          setSuggestions([]);
        });
    } else {
      setSuggestions([]);
      setSuggestionError(null);
    }
    return () => controller.abort();
  }, [summonerName]);

  // Close suggestions if click outside
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

  // Reset highlighted index when suggestions or list visibility changes
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
    router.push(
      `/${region}/summoner/${encodeURIComponent(
        summonerName
      )}/${encodeURIComponent(tagline)}`
    );
  };

  // Add SuggestionList subcomponent
  interface Suggestion {
    name: string;
    tagline: string;
    region: string;
  }

  interface SuggestionListProps {
    suggestions: Suggestion[];
    highlightedIndex: number;
    onSelect: (s: Suggestion) => void;
    onHighlight: (i: number) => void;
  }

  const SuggestionList: React.FC<SuggestionListProps> = ({
    suggestions,
    highlightedIndex,
    onSelect,
    onHighlight,
  }) => (
    <ul className="absolute left-0 top-full mt-2 w-full bg-base-100 border border-base-300 rounded-xl shadow z-50 max-h-60 overflow-auto">
      {suggestions.map((s, i) => (
        <li
          key={s.name + s.tagline + s.region + i}
          className={`px-4 py-2 cursor-pointer flex justify-between ${
            i === highlightedIndex ? "bg-base-200" : "hover:bg-base-200"
          }`}
          onClick={() => onSelect(s)}
          onMouseEnter={() => onHighlight(i)}
        >
          <span>{s.name}</span>
          <span className="text-xs text-base-content/60 ml-2">
            #{s.tagline} ({s.region})
          </span>
        </li>
      ))}
    </ul>
  );

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
          <SuggestionList
            suggestions={suggestions}
            highlightedIndex={highlightedIndex}
            onSelect={(s) => {
              setSummonerName(s.name);
              setTagline(s.tagline);
              setRegion(s.region as PlatformRegion);
              setShowSuggestions(false);
            }}
            onHighlight={setHighlightedIndex}
          />
        )}
      </div>
      {hasError && (
        <p className="text-error text-sm ml-1">
          Please fill in both summoner name and tagline.
        </p>
      )}
      {suggestionError && (
        <p className="text-error text-xs mt-1 ml-1">{suggestionError}</p>
      )}
    </form>
  );
};

export default SearchBar;
