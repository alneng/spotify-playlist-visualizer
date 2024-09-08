import React from "react";
import ButtonWithArrow from "./ButtonWithArrow";

const Navbar: React.FC<React.HTMLProps<HTMLDivElement>> = ({ className }) => {
  return (
    <div
      className={`absolute top-0 left-0 right-0 h-16 p-6 px-4 flex items-center justify-between text-white ${className}`}
    >
      <div className="font-bold z-50">
        <a className="hover:underline" href="/">
          Spotify Playlist Visualizer
        </a>
      </div>
      <div className="flex-row z-50">
        <a className="px-3 hover:underline" href="/about">
          About
        </a>
        <ButtonWithArrow
          className="w-[112px] ml-3"
          onClick={() => {
            window.location.href = "/explore";
          }}
        >
          Explore
        </ButtonWithArrow>
      </div>
    </div>
  );
};

export default Navbar;
