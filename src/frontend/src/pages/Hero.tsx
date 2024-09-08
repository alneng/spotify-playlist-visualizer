import React from "react";
import Navbar from "../components/Navbar";
import StatusMessage from "../components/StatusMessage";
import BackgroundGradient from "../components/BackgroundGradient";
import ButtonWithArrow from "../components/ButtonWithArrow";
import "../stylesheets/background.css";

const Hero: React.FC = () => {
  return (
    <>
      <Navbar />
      <BackgroundGradient />
      <StatusMessage className="flex-col bg-black">
        <div className="z-10 text-center">
          <div className="text-7xl font-bold m-8">
            Spotify Playlist Visualizer
          </div>
          <div className="text-2xl">
            Visualizing your Spotify playlists, made interactive.
          </div>
          <ButtonWithArrow
            className="w-[154px] m-8"
            onClick={() => {
              window.location.href = "/explore";
            }}
          >
            Let's Explore
          </ButtonWithArrow>
        </div>
      </StatusMessage>
    </>
  );
};

export default Hero;
