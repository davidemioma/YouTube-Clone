import { useRouter } from "next/router";
import React from "react";
import { useSelector } from "react-redux";
import { modeSelector } from "../store/ui-slice";

interface Props {
  Icon: any;
  text: string;
  link?: string;
}

const Item = ({ Icon, text, link }: Props) => {
  const router = useRouter();

  const mode = useSelector(modeSelector);

  return (
    <div
      onClick={() => (link ? router.push(link) : "")}
      className={`flex flex-col items-center gap-2 py-4 w-16 rounded-lg cursor-pointer ${
        mode === "dark" ? "hover:bg-[#333333]" : "hover:bg-gray-100"
      }`}
    >
      <Icon size={20} />

      <p className="text-xs">{text}</p>
    </div>
  );
};

export default Item;
