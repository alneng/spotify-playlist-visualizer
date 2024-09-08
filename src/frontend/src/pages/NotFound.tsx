import React from "react";
import StatusMessage from "../components/StatusMessage";
import Navbar from "../components/Navbar";
import BackgroundGradient from "../components/BackgroundGradient";
import "../stylesheets/background.css";

const NotFound: React.FC = () => {
  return (
    <>
      <Navbar />
      <BackgroundGradient />
      <StatusMessage className="flex-col bg-black">
        <div className="z-10 text-center">
          <div className="text-5xl font-bold my-4">404</div>
          <div className="text-xl">
            Couldn't find the page you were looking for
          </div>
        </div>
      </StatusMessage>
    </>
  );
};

export default NotFound;
