import React from "react";

const Footer = () => {
  return (
    <footer className="relative overflow-hidden bg-neutral-900 text-neutral-400">
      {/* Decorative SVG waves */}
      <svg
        className="absolute -bottom-20 left-1/2 w-[1900px] -translate-x-1/2"
        width="2745"
        height="488"
        viewBox="0 0 2745 488"
        fill="none"
        xmlns="http://www.w3.org/2000/svg"
      >
        {[...Array(16)].map((_, i) => (
          <path
            key={i}
            d={`M0.5 ${330.864 - i * 21.991}C232.505 ${403.801 - i * 21.991} 853.749 ${
              527.683 - i * 21.991
            } 1482.69 ${439.719 - i * 21.991}C2111.63 ${
              351.756 - i * 21.991
            } 2585.54 ${434.588 - i * 21.991} 2743.87 ${487 - i * 21.991}`}
            className="stroke-neutral-700/50"
            stroke="currentColor"
          />
        ))}
      </svg>

      {/* Footer content */}
      <div className="relative z-10 w-full max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 py-10">
        <div className="border-l border-neutral-700 pl-6 ml-4">
          <p className="text-sm text-neutral-400">
            © {new Date().getFullYear()} BookYourEvent. All rights reserved. —{" "}
            <span className="text-white font-semibold">Shravan Suthar</span>
          </p>
        </div>
      </div>
    </footer>
  );
};

export default Footer;
