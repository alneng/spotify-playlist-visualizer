import React from "react";

const StatusMessage: React.FC<React.HTMLProps<HTMLDivElement>> = ({
  className,
  children,
}) => {
  return (
    <div
      className={`z-0 w-full h-full text-white flex justify-center items-center p-16 ${className}`}
    >
      {children}
    </div>
  );
};

export default StatusMessage;
