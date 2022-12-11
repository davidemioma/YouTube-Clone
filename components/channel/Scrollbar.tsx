import React, { useRef, useState } from "react";
import { useSelector } from "react-redux";
import { modeSelector } from "../../store/ui-slice";
import { ChevronLeftIcon, ChevronRightIcon } from "@heroicons/react/outline";

interface Props {
  children: React.ReactNode;
  border?: boolean;
  title: string;
  data: any[];
}

const Scrollbar = ({ children, border, title, data }: Props) => {
  const mode = useSelector(modeSelector);

  const rowRef = useRef<HTMLDivElement>(null);

  const [isMoved, setIsMoved] = useState(false);

  const handleClick = (direction: string) => {
    setIsMoved(true);

    if (rowRef.current) {
      const { scrollLeft, clientWidth } = rowRef.current;

      const scrollTo =
        direction === "left"
          ? scrollLeft - clientWidth
          : scrollLeft + clientWidth;

      rowRef.current.scrollTo({ left: scrollTo, behavior: "smooth" });
    }
  };

  return (
    <div
      className={`py-5 ${border ? "border-b" : "border-b-0"} ${
        mode === "dark"
          ? "border-gray-500/50 text-white"
          : "border-gray-200 text-black"
      }`}
    >
      <h1 className="text-lg font-medium mb-3">{title}</h1>

      <div className="relative w-full">
        {data.length > 1 && (
          <button
            className={`scrollBtn left-0 ${
              !isMoved ? "hidden" : "inline-flex"
            }`}
            onClick={() => handleClick("left")}
          >
            <ChevronLeftIcon className="w-5 h-5" />
          </button>
        )}

        <div
          ref={rowRef}
          className="flex gap-5 overflow-x-scroll scrollbar-hide"
        >
          {children}
        </div>

        {data.length > 1 && (
          <button
            className="scrollBtn flex right-0"
            onClick={() => handleClick("right")}
          >
            <ChevronRightIcon className="w-5 h-5" />
          </button>
        )}
      </div>
    </div>
  );
};

export default Scrollbar;
