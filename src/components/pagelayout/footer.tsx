import React from "react";
import { useTheme } from "@/context/ThemeContext";

const ThemeSwitcher: React.FC = () => {
  const { theme, setTheme, themes } = useTheme();
  return (
    <select
      className="select select-bordered select-sm ml-2"
      value={theme}
      onChange={(e) => setTheme(e.target.value)}
      aria-label="Changer de thème"
    >
      {themes.map((t) => (
        <option key={t} value={t}>
          {t.charAt(0).toUpperCase() + t.slice(1)}
        </option>
      ))}
    </select>
  );
};

const Footer: React.FC = () => {
  return (
    <footer className="footer footer-center p-4 bg-base-200 text-base-content rounded-t-xl mt-8">
      <aside>
        <p className="text-sm">
          &copy; {new Date().getFullYear()} Dashboard - League of Legends Aram
        </p>
        <div className="mt-2">
          <ThemeSwitcher />
        </div>
      </aside>
    </footer>
  );
};

export default Footer;
