"use client";

import React, { useState } from "react";
import { useUser } from "@/context/UserContext";
import { PlatformRegion } from "@/types/platformregion";
import { useRouter } from "next/navigation";
import { Search } from "lucide-react";

const SearchBar: React.FC = () => {
  const { user, setUser } = useUser();
  const router = useRouter();
  const [hasError, setHasError] = useState(false);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    const isInvalid =
      user.summonerName.trim() === "" || user.tagline.trim() === "";

    if (isInvalid) {
      setHasError(true);
      return;
    }

    setHasError(false);
    router.push(
      `/${user.region}/summoner/${user.summonerName}/${user.tagline}`
    );
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
          value={user.summonerName}
          onChange={(e) =>
            setUser({ ...user, summonerName: e.target.value.trimStart() })
          }
          placeholder="SummonerName"
          className={`bg-transparent border-0 outline-none  text-lg w-1/3 min-w-[120px] max-w-xs ${
            hasError ? "text-error" : ""
          }`}
        />

        <span className="mx-4 border-l h-8 border-b-blue-50" />

        <input
          type="text"
          value={user.tagline}
          onChange={(e) =>
            setUser({ ...user, tagline: e.target.value.trimStart() })
          }
          placeholder="Tagline"
          className={`bg-transparent border-0 outline-none  text-lg w-1/4 min-w-[80px] max-w-xs ${
            hasError ? "text-error" : ""
          }`}
        />

        <select
          name="region"
          id="region"
          className="select select-ghost bg-transparent border-0 outline-none text-lg w-24 ml-auto"
          value={user.region}
          onChange={(e) => setUser({ ...user, region: e.target.value })}
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
