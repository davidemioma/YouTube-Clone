import React from "react";
import { useDispatch, useSelector } from "react-redux";
import { setSelect } from "../../store/store";
import { modeSelector, selectItemSelector } from "../../store/ui-slice";

const select = ["home", "videos", "channels"];

const Selector = () => {
  const dispatch = useDispatch();

  const selectItem = useSelector(selectItemSelector);

  const mode = useSelector(modeSelector);

  return (
    <div
      className={`w-full border-b mb-5 ${
        mode === "dark"
          ? "border-gray-500/50 text-white"
          : "border-gray-200 text-black"
      }`}
    >
      <div className="w-full max-w-4xl mx-auto flex items-center justify-between">
        {select.map((item) => (
          <button
            className={`${
              selectItem === item
                ? "border-b-2 "
                : "opacity-75 hover:opacity-100"
            } p-4 uppercase text-sm`}
            key={item}
            onClick={() => dispatch(setSelect(item))}
          >
            {item}
          </button>
        ))}
      </div>
    </div>
  );
};

export default Selector;
