"use client";

import React, { useState, useEffect, useRef } from "react";
import { Search } from "lucide-react";
import { Button } from "@/shared/components/ui/Button";
import { PlatformRegion } from "@/shared/types/api/platformregion.types";

interface Suggestion {
  name: string;
  tagline: string;
  region: string;
}

interface SummonerSearchProps {
  onSearch?: (
    summonerName: string,
    tagline: string,
    region: PlatformRegion
  ) => void;
  initialSummonerName?: string;
  initialTagline?: string;
  initialRegion?: PlatformRegion;
  placeholder?: string;
  compact?: boolean;
  showRegionSelect?: boolean;
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
  <ul className="absolute left-0 top-full mt-2 w-full bg-base-100 border border-base-300 rounded-xl shadow-lg z-50 max-h-60 overflow-auto">
    {suggestions.map((s, i) => (
      <li
        key={`${s.name}-${s.tagline}-${s.region}-${i}`}
        className={`px-4 py-2 cursor-pointer flex justify-between transition-colors ${
          i === highlightedIndex ? "bg-primary/10" : "hover:bg-base-200"
        }`}
        onClick={() => onSelect(s)}
        onMouseEnter={() => onHighlight(i)}
      >
        <span className="font-medium">{s.name}</span>
        <span className="text-xs text-base-content/60">
          #{s.tagline} ({s.region})
        </span>
      </li>
    ))}
  </ul>
);

export const SummonerSearch: React.FC<SummonerSearchProps> = ({
  onSearch,
  initialSummonerName = "",
  initialTagline = "",
  initialRegion = PlatformRegion.EUW1,
  placeholder = "Summoner Name",
  compact = false,
  showRegionSelect = true,
}) => {
  const [summonerName, setSummonerName] = useState(initialSummonerName);
  const [tagline, setTagline] = useState(initialTagline);
  const [region, setRegion] = useState<PlatformRegion>(initialRegion);
  const [suggestions, setSuggestions] = useState<Suggestion[]>([]);
  const [showSuggestions, setShowSuggestions] = useState(false);
  const [highlightedIndex, setHighlightedIndex] = useState(-1);
  const [isLoading, setIsLoading] = useState(false);
  const [hasError, setHasError] = useState(false);
  const [suggestionError, setSuggestionError] = useState<string | null>(null);

  const inputRef = useRef<HTMLInputElement>(null);

  // Fetch suggestions when summoner name changes
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

  // Close suggestions when clicking outside
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

  // Reset highlighted index when suggestions change
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
    setIsLoading(true);

    // Call onSearch callback
    onSearch?.(summonerName.trim(), tagline.trim(), region);

    // Reset loading state after a brief delay
    setTimeout(() => setIsLoading(false), 1000);
  };

  const handleSuggestionSelect = (suggestion: Suggestion) => {
    setSummonerName(suggestion.name);
    setTagline(suggestion.tagline);
    setRegion(suggestion.region as PlatformRegion);
    setShowSuggestions(false);
  };

  const handleKeyDown = (e: React.KeyboardEvent) => {
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
      const suggestion = suggestions[highlightedIndex];
      handleSuggestionSelect(suggestion);
    }
  };

  return (
    <div className={`w-full ${compact ? "max-w-md" : "max-w-2xl"}`}>
      <form onSubmit={handleSubmit} className="flex flex-col gap-3">
        <div
          className={`flex items-center bg-base-100 border rounded-2xl px-4 py-3 ${
            hasError ? "border-error" : "border-base-300"
          } relative shadow-sm hover:shadow-md transition-shadow`}
        >
          {/* Summoner Name Input */}
          <div className="flex-1 min-w-0">
            <label htmlFor="summonerName" className="sr-only">
              Summoner Name
            </label>
            <input
              ref={inputRef}
              id="summonerName"
              type="text"
              value={summonerName}
              onChange={(e) => {
                setSummonerName(e.target.value.trimStart());
                setShowSuggestions(true);
                setHasError(false);
              }}
              onFocus={() => setShowSuggestions(true)}
              onKeyDown={handleKeyDown}
              placeholder={placeholder}
              className={`bg-transparent border-0 outline-none text-lg w-full ${
                hasError && summonerName.trim() === "" ? "text-error" : ""
              }`}
              autoComplete="off"
              disabled={isLoading}
            />
          </div>

          {/* Divider */}
          <div className="mx-3 h-6 w-px bg-base-300" />

          {/* Tagline Input */}
          <div className="w-24">
            <label htmlFor="tagline" className="sr-only">
              Tagline
            </label>
            <input
              id="tagline"
              type="text"
              value={tagline}
              onChange={(e) => {
                setTagline(e.target.value.trimStart());
                setHasError(false);
              }}
              placeholder="Tag"
              className={`bg-transparent border-0 outline-none text-lg w-full text-center ${
                hasError && tagline.trim() === "" ? "text-error" : ""
              }`}
              autoComplete="off"
              disabled={isLoading}
            />
          </div>

          {/* Region Select */}
          {showRegionSelect && (
            <>
              <div className="mx-3 h-6 w-px bg-base-300" />
              <div className="w-20">
                <label htmlFor="region" className="sr-only">
                  Region
                </label>
                <select
                  id="region"
                  value={region}
                  onChange={(e) => setRegion(e.target.value as PlatformRegion)}
                  className="select select-ghost bg-transparent border-0 outline-none text-sm w-full text-center p-0"
                  disabled={isLoading}
                >
                  {Object.entries(PlatformRegion).map(([key, value]) => (
                    <option key={key} value={value}>
                      {value}
                    </option>
                  ))}
                </select>
              </div>
            </>
          )}

          {/* Search Button */}
          <div className="ml-3">
            <Button
              type="submit"
              variant="ghost"
              size="sm"
              shape="circle"
              isLoading={isLoading}
              disabled={isLoading}
              className="hover:bg-primary/10"
            >
              <Search size={20} />
            </Button>
          </div>

          {/* Suggestions List */}
          {showSuggestions && suggestions.length > 0 && (
            <SuggestionList
              suggestions={suggestions}
              highlightedIndex={highlightedIndex}
              onSelect={handleSuggestionSelect}
              onHighlight={setHighlightedIndex}
            />
          )}
        </div>

        {/* Error Messages */}
        {hasError && (
          <p className="text-error text-sm">
            Please fill in both summoner name and tagline.
          </p>
        )}
        {suggestionError && (
          <p className="text-warning text-sm">{suggestionError}</p>
        )}
      </form>
    </div>
  );
};

export default SummonerSearch;
