import React from "react";
import { useRouter } from "next/navigation";
import SearchBar from "@/components/SearchBar";

const ReturnHomeButton = () => {
  const router = useRouter();
  const handleClick = () => {
    router.push("/");
  };

  return (
    <button
      className="btn btn-ghost text-2xl font-bold normal-case"
      onClick={handleClick}
    >
      Dashboard
    </button>
  );
};

const LeaderboardButton = () => {
  const router = useRouter();
  const handleClick = () => {
    router.push("/leaderboard");
  };
  return (
    <button
      className="btn btn-ghost text-lg font-semibold"
      onClick={handleClick}
    >
      Leaderboard
    </button>
  );
};

const Header: React.FC = () => {
  return (
    <header className="w-full">
      <div className="navbar bg-base-100 shadow-lg">
        <div className="flex-1 flex gap-2 items-center">
          <ReturnHomeButton />
          <LeaderboardButton />
        </div>
        <div className="flex-none flex items-center gap-2">
          <SearchBar />
        </div>
      </div>
    </header>
  );
};

export default Header;
