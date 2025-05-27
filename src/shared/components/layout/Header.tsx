"use client";
import React, { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import { motion, AnimatePresence } from "framer-motion";
import { TrendingUp, Trophy, Menu, X, Zap } from "lucide-react";
import SearchBar from "@/shared/components/common/SearchBar";

const ReturnHomeButton = () => {
  const router = useRouter();
  const handleClick = () => {
    try {
      router.push("/");
    } catch (error) {
      console.error("Navigation failed:", error);
    }
  };

  return (
    <motion.button
      whileHover={{ scale: 1.02 }}
      whileTap={{ scale: 0.98 }}
      className="btn btn-ghost text-2xl font-bold normal-case hover:bg-primary/10 transition-all duration-300"
      onClick={handleClick}
    >
      <motion.div
        className="flex items-center gap-2"
        initial={{ opacity: 0, x: -20 }}
        animate={{ opacity: 1, x: 0 }}
        transition={{ duration: 0.5 }}
      >
        <div className="w-8 h-8 rounded-lg bg-gradient-to-br from-primary to-secondary flex items-center justify-center">
          <Zap className="w-5 h-5 text-white" />
        </div>
        <span className="bg-gradient-to-r from-primary to-secondary bg-clip-text text-transparent">
          Dashboard
        </span>
      </motion.div>
    </motion.button>
  );
};

const LeaderboardButton = () => {
  const router = useRouter();
  const handleClick = () => {
    try {
      router.push("/leaderboard");
    } catch (error) {
      console.error("Navigation failed:", error);
    }
  };

  return (
    <motion.button
      whileHover={{ scale: 1.05, y: -2 }}
      whileTap={{ scale: 0.95 }}
      className="btn btn-ghost text-lg font-semibold hover:bg-secondary/10 transition-all duration-300 relative group"
      onClick={handleClick}
    >
      <div className="flex items-center gap-2">
        <Trophy className="w-5 h-5 text-secondary group-hover:rotate-12 transition-transform duration-300" />
        <span className="group-hover:text-secondary transition-colors duration-300">
          Leaderboard
        </span>
      </div>
      <div className="absolute bottom-0 left-1/2 w-0 h-0.5 bg-secondary group-hover:w-full group-hover:left-0 transition-all duration-300"></div>
    </motion.button>
  );
};

const MobileMenu = ({
  isOpen,
  onToggle,
}: {
  isOpen: boolean;
  onToggle: () => void;
}) => {
  return (
    <div className="md:hidden">
      <motion.button
        whileTap={{ scale: 0.9 }}
        className="btn btn-ghost btn-square"
        onClick={onToggle}
      >
        <AnimatePresence mode="wait">
          {isOpen ? (
            <motion.div
              key="close"
              initial={{ rotate: -90, opacity: 0 }}
              animate={{ rotate: 0, opacity: 1 }}
              exit={{ rotate: 90, opacity: 0 }}
              transition={{ duration: 0.2 }}
            >
              <X className="w-6 h-6" />
            </motion.div>
          ) : (
            <motion.div
              key="menu"
              initial={{ rotate: 90, opacity: 0 }}
              animate={{ rotate: 0, opacity: 1 }}
              exit={{ rotate: -90, opacity: 0 }}
              transition={{ duration: 0.2 }}
            >
              <Menu className="w-6 h-6" />
            </motion.div>
          )}
        </AnimatePresence>
      </motion.button>
    </div>
  );
};

const Header: React.FC = () => {
  const [isScrolled, setIsScrolled] = useState(false);
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);

  useEffect(() => {
    const handleScroll = () => {
      setIsScrolled(window.scrollY > 20);
    };

    window.addEventListener("scroll", handleScroll);
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  return (
    <motion.header
      className="w-full sticky top-0 z-50"
      initial={{ y: -100 }}
      animate={{ y: 0 }}
      transition={{ duration: 0.5 }}
    >
      <motion.div
        className={`navbar bg-base-100/95 backdrop-blur-md transition-all duration-300 ${
          isScrolled ? "shadow-xl border-b border-primary/10" : "shadow-lg"
        }`}
        animate={{
          paddingTop: isScrolled ? "0.5rem" : "1rem",
          paddingBottom: isScrolled ? "0.5rem" : "1rem",
        }}
        transition={{ duration: 0.3 }}
      >
        {/* Desktop Navigation */}
        <div className="hidden md:flex flex-1 gap-4 items-center">
          <ReturnHomeButton />
          <div className="w-px h-8 bg-base-300"></div>
          <LeaderboardButton />

          {/* Stats indicator */}
          <motion.div
            initial={{ opacity: 0, scale: 0.8 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ delay: 0.3, duration: 0.5 }}
            className="ml-4 hidden lg:flex items-center gap-2 px-3 py-1 rounded-full bg-success/10 border border-success/20"
          >
            <div className="w-2 h-2 bg-success rounded-full animate-pulse"></div>
            <span className="text-xs font-medium text-success">
              Live Tracking
            </span>
          </motion.div>
        </div>

        {/* Mobile Logo */}
        <div className="md:hidden flex-1">
          <ReturnHomeButton />
        </div>

        {/* Search and Mobile Menu */}
        <div className="flex-none flex items-center gap-2">
          <motion.div
            className="hidden sm:block"
            initial={{ opacity: 0, x: 20 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ delay: 0.4, duration: 0.5 }}
          >
            <SearchBar />
          </motion.div>

          <MobileMenu
            isOpen={isMobileMenuOpen}
            onToggle={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
          />
        </div>
      </motion.div>

      {/* Mobile Menu Dropdown */}
      <AnimatePresence>
        {isMobileMenuOpen && (
          <motion.div
            initial={{ opacity: 0, height: 0 }}
            animate={{ opacity: 1, height: "auto" }}
            exit={{ opacity: 0, height: 0 }}
            transition={{ duration: 0.3 }}
            className="md:hidden bg-base-100/95 backdrop-blur-md border-b border-primary/10 shadow-lg"
          >
            <div className="p-4 space-y-4">
              <motion.div
                initial={{ x: -20, opacity: 0 }}
                animate={{ x: 0, opacity: 1 }}
                transition={{ delay: 0.1 }}
                className="block sm:hidden"
              >
                <SearchBar />
              </motion.div>

              <motion.div
                initial={{ x: -20, opacity: 0 }}
                animate={{ x: 0, opacity: 1 }}
                transition={{ delay: 0.2 }}
                className="space-y-2"
              >
                <LeaderboardButton />

                <div className="flex items-center gap-2 px-3 py-2 rounded-lg bg-success/10 border border-success/20 w-fit">
                  <div className="w-2 h-2 bg-success rounded-full animate-pulse"></div>
                  <span className="text-xs font-medium text-success">
                    Live Tracking Active
                  </span>
                </div>
              </motion.div>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </motion.header>
  );
};

export default Header;
