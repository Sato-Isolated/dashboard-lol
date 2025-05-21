"use client";

import React, { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import { Search } from "lucide-react";
import { useUserStore } from "@/store/userStore";
import { PlatformRegion } from "@/types/api/platformregion";
import { useEffectiveUser } from "@/hooks/useEffectiveUser";

const SearchBar: React.FC = () => {
  const { effectiveRegion, effectiveTagline, effectiveName } =
    useEffectiveUser();
  const { setUser } = useUserStore();
  const router = useRouter();
  const [hasError, setHasError] = useState(false);

  // Préselectionne la région selon la langue/navigateur si aucune région n'est déjà définie
  useEffect(() => {
    if (!effectiveRegion) {
      let browserLang = navigator.language || navigator.languages?.[0] || "";
      browserLang = browserLang.toLowerCase();
      let defaultRegion = "euw1";
      if (browserLang.startsWith("fr")) defaultRegion = "euw1";
      else if (browserLang.startsWith("en-us")) defaultRegion = "na1";
      else if (browserLang.startsWith("en-gb")) defaultRegion = "euw1";
      else if (browserLang.startsWith("es")) defaultRegion = "euw1";
      else if (browserLang.startsWith("tr")) defaultRegion = "tr1";
      else if (browserLang.startsWith("ru")) defaultRegion = "ru";
      else if (browserLang.startsWith("ja")) defaultRegion = "jp1";
      else if (browserLang.startsWith("ko")) defaultRegion = "kr";
      setUser({
        region: defaultRegion,
        tagline: effectiveTagline,
        summonerName: effectiveName,
      });
    }
  }, [effectiveRegion, effectiveTagline, effectiveName, setUser]);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    const isInvalid =
      effectiveName.trim() === "" || effectiveTagline.trim() === "";

    if (isInvalid) {
      setHasError(true);
      return;
    }

    setHasError(false);
    router.push(
      `/${effectiveRegion}/summoner/${effectiveName}/${effectiveTagline}`
    );
  };

  const handleSummonerNameChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setUser({
      region: effectiveRegion,
      tagline: effectiveTagline,
      summonerName: e.target.value.trimStart(),
    });
  };
  const handleTaglineChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setUser({
      region: effectiveRegion,
      tagline: e.target.value.trimStart(),
      summonerName: effectiveName,
    });
  };
  const handleRegionChange = (e: React.ChangeEvent<HTMLSelectElement>) => {
    setUser({
      region: e.target.value,
      tagline: effectiveTagline,
      summonerName: effectiveName,
    });
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
        <input
          type="text"
          value={effectiveName}
          onChange={handleSummonerNameChange}
          placeholder="SummonerName"
          className={`bg-transparent border-0 outline-none  text-lg w-1/3 min-w-[120px] max-w-xs ${
            hasError ? "text-error" : ""
          }`}
        />

        <span className="mx-4 border-l h-8 border-b-blue-50" />

        <input
          type="text"
          value={effectiveTagline}
          onChange={handleTaglineChange}
          placeholder="Tagline"
          className={`bg-transparent border-0 outline-none  text-lg w-1/4 min-w-[80px] max-w-xs ${
            hasError ? "text-error" : ""
          }`}
        />

        <select
          name="region"
          id="region"
          className="select select-ghost bg-transparent border-0 outline-none text-lg w-24 ml-auto"
          value={effectiveRegion}
          onChange={handleRegionChange}
        >
          {Object.entries(PlatformRegion).map(([key, value]) => (
            <option key={key} value={value} className=" text-lg">
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
