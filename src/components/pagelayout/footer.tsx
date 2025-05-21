import React from "react";

const Footer: React.FC = () => {
  return (
    <footer className="bg-base-200 text-base-content">
      <div className="container mx-auto py-4">
        <p className="text-sm">
          &copy; {new Date().getFullYear()} Dashboard - League of Legends Aram
        </p>
      </div>
    </footer>
  );
};

export default Footer;
