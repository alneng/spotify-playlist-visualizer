import React, { ReactNode } from "react";

interface BannerObjectProps {
  className?: string;
  children: ReactNode;
  imgSrc: string;
  imgAlt: string;
}

const BannerObject: React.FC<BannerObjectProps> = ({
  className,
  children,
  imgSrc,
  imgAlt,
}) => {
  return (
    <div className={`bg-gray-800 text-white rounded ${className}`}>
      <div className="flex">
        <img
          src={imgSrc}
          alt={imgAlt}
          className="max-w-28 w-[112px] h-[112px]"
        />
        <div className="flex-1 ml-2 p-2 w-full flex flex-col justify-center">
          {children}
        </div>
      </div>
    </div>
  );
};

export default BannerObject;
