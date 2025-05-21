import React from "react";
import SearchBar from "@/components/SearchBar";

const Header: React.FC = () => {
  return (
    <header className="flex flex-col items-center justify-center w-full h-24 bg-gradient-to-b from-[#0f172a] to-[#1e293b] text-white">
      <div className="relative flex items-center w-full h-24">
        <h1 className="absolute left-8 text-2xl font-bold">Dashboard</h1>
        <div className="mx-auto">
          <SearchBar />
        </div>
      </div>
    </header>
  );
}

export default Header;