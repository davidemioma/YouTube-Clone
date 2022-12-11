import React from "react";
import Link from "next/link";
import { useDispatch, useSelector } from "react-redux";
import { modeSelector, sidebarSelector } from "../store/ui-slice";
import { setMode, setOpenSidebar } from "../store/store";
import { MenuIcon } from "@heroicons/react/outline";
import { BsYoutube } from "react-icons/bs";
import { AiFillHome } from "react-icons/ai";
import { IoLogoGameControllerB } from "react-icons/io";
import { RiNewspaperLine } from "react-icons/ri";
import {
  MdExplore,
  MdSubscriptions,
  MdVideoLibrary,
  MdOutlineHistory,
  MdLibraryMusic,
  MdOutlineSportsBasketball,
  MdOutlineMovie,
  MdLiveTv,
  MdSettings,
  MdFlag,
  MdOutlineHelp,
  MdSettingsBrightness,
} from "react-icons/md";
import SidebarItem from "./SidebarItem";

const Sidebar = () => {
  const dispatch = useDispatch();

  const mode = useSelector(modeSelector);

  const sidebarOpen = useSelector(sidebarSelector);

  return (
    <>
      {sidebarOpen && (
        <div
          className="fixed top-0 left-0 h-screen w-screen z-40 bg-black/30"
          onClick={() => dispatch(setOpenSidebar(false))}
        />
      )}

      <div
        className={`${
          mode === "dark" ? "bg-[#0f0f0f] text-white" : "bg-white text-black"
        } ${
          sidebarOpen ? "translate-x-0" : "-translate-x-full"
        } absolute top-0 h-screen z-50 p-4 w-64 overflow-y-scroll overflow-x-hidden transition-transform duration-300`}
      >
        <div className="flex items-center space-x-5 ml-3">
          <MenuIcon
            onClick={() => dispatch(setOpenSidebar(false))}
            className="h-6 cursor-pointer"
          />

          <Link href="/">
            <div className="flex items-center space-x-0.5 cursor-pointer">
              <BsYoutube size={30} color="red" />

              <p className="text-xl font-sans tracking-tighter">YouTube</p>
            </div>
          </Link>
        </div>

        <div
          className={`pt-5 pb-4 border-b ${
            mode === "dark" ? "border-gray-700" : "border-gray-200"
          }`}
        >
          <SidebarItem Icon={AiFillHome} text="Home" link="/" />

          <SidebarItem Icon={MdExplore} text="Explore" link="/trends" />

          <SidebarItem
            Icon={MdSubscriptions}
            text="Subscriptions"
            link="/subscriptions"
          />
        </div>

        <div
          className={`pt-5 pb-4 border-b ${
            mode === "dark" ? "border-gray-700" : "border-gray-200"
          }`}
        >
          <SidebarItem Icon={MdVideoLibrary} text="Library" link="" />

          <SidebarItem Icon={MdOutlineHistory} text="History" link="" />
        </div>

        <div
          className={`pt-5 pb-4 border-b ${
            mode === "dark" ? "border-gray-700" : "border-gray-200"
          }`}
        >
          <SidebarItem Icon={MdLibraryMusic} text="Music" link="" />

          <SidebarItem Icon={MdOutlineSportsBasketball} text="Sports" link="" />

          <SidebarItem Icon={IoLogoGameControllerB} text="Gaming" link="" />

          <SidebarItem Icon={MdOutlineMovie} text="Movies" link="" />

          <SidebarItem Icon={RiNewspaperLine} text="News" link="" />

          <SidebarItem Icon={MdLiveTv} text="Live" link="" />
        </div>

        <div className="pt-5 pb-4">
          <SidebarItem Icon={MdSettings} text="Settings" link="" />

          <SidebarItem Icon={MdFlag} text="Report" link="" />

          <SidebarItem Icon={MdOutlineHelp} text="Help" link="" />

          <button
            onClick={() =>
              dispatch(setMode(mode === "dark" ? "light" : "dark"))
            }
            className="w-full"
          >
            <SidebarItem
              Icon={MdSettingsBrightness}
              text={mode === "dark" ? "Light Mode" : "Dark Mode"}
              link=""
            />
          </button>
        </div>
      </div>
    </>
  );
};

export default Sidebar;
