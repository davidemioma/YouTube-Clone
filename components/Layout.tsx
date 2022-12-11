import React from "react";
import { useSelector } from "react-redux";
import { modeSelector } from "../store/ui-slice";
import Menu from "./Menu";
import Nav from "./Nav";
import Sidebar from "./Sidebar";
import UploadModal from "./UploadModal";

interface Props {
  children: React.ReactNode;
}

const Layout = ({ children }: Props) => {
  const mode = useSelector(modeSelector);

  return (
    <div className="w-screen h-screen overflow-hidden">
      <Nav />

      <Sidebar />

      <UploadModal />

      <div
        className={`${
          mode === "dark" ? "bg-[#0f0f0f] text-white" : "bg-white"
        } flex`}
      >
        <Menu />

        <div className="flex-1 h-[calc(100vh-48px)] py-5 px-4 pb-10 overflow-y-scroll overflow-x-hidden scrollbar-hide">
          {children}
        </div>
      </div>
    </div>
  );
};

export default Layout;
