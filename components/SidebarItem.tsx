import { useRouter } from "next/router";
import React from "react";
import { useSelector } from "react-redux";
import { modeSelector } from "../store/ui-slice";

interface Props {
  Icon: any;
  text: string;
  link?: string;
}

const SidebarItem = ({ Icon, text, link }: Props) => {
  const mode = useSelector(modeSelector);

  const router = useRouter();

  return (
    <div
      onClick={() => (link ? router.push(link) : "")}
      className={`${
        router.pathname === link && mode === "dark" && "bg-[#333333]"
      } ${
        router.pathname === link && mode === "light" && "bg-gray-100"
      } flex item-center space-x-5 py-2 px-3 rounded-lg cursor-pointer ${
        mode === "dark" ? "hover:bg-[#333333]" : "hover:bg-gray-100"
      }`}
    >
      <Icon size={20} className="text-sm" />

      <p className="text-sm">{text}</p>
    </div>
  );
};

export default SidebarItem;
