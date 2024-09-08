import React from "react";
import "../stylesheets/arrow-button.css";

const ButtonWithArrow: React.FC<React.HTMLProps<HTMLButtonElement>> = ({
  className,
  onClick,
  children,
}) => {
  return (
    <button
      className={`animated-arrow-btn bg-[#20D45C] text-black font-bold py-2 px-4 rounded 
        border-gray-800 hover:bg-[#4CE47F] hover:border-white border-[1px] transition duration-300 ${className}`}
      onClick={onClick}
    >
      <div className="text-left">{children}</div>
      <div className="relative left-6 bottom-5 mr-8 rotate-45 float-right">
        <div className="animated-arrow"></div>
      </div>
    </button>
  );
};

export default ButtonWithArrow;
