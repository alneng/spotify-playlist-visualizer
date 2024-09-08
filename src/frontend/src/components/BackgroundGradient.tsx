import React from "react";

const BackgroundGradient: React.FC<{ transition?: boolean }> = ({
  transition,
}) => {
  return (
    <div className="fixed top-0 left-0 right-0 w-screen h-screen text-center">
      <div
        className={`animated-bg w-full h-full bg-gradient-to-r from-blue-500 via-blue-500 to-indigo-500 opacity-25`}
      ></div>
      <div
        className={`w-full h-full bg-black absolute top-0 left-0 right-0 bottom-0 transition-opacity duration-1000 ease-in-out ${
          transition ? "opacity-100" : "opacity-0"
        }`}
      ></div>
    </div>
  );
};

export default BackgroundGradient;
