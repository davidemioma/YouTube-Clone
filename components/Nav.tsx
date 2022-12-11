import React, { useState } from "react";
import Link from "next/link";
import { useDispatch, useSelector } from "react-redux";
import { modeSelector } from "../store/ui-slice";
import { MenuIcon } from "@heroicons/react/outline";
import { BsYoutube, BsArrowLeft } from "react-icons/bs";
import { FaRegUserCircle } from "react-icons/fa";
import { AiOutlineSearch } from "react-icons/ai";
import { MdOutlineVideoCall } from "react-icons/md";
import { setOpenModal, setOpenSidebar } from "../store/store";
import { useAuth } from "../context/AuthProvider";
import Search from "./Search";

const Nav = () => {
  const auth = useAuth();

  const dispatch = useDispatch();

  const mode = useSelector(modeSelector);

  const [openSearch, setOpenSearch] = useState(false);

  return (
    <div
      className={`${
        mode === "dark" ? "bg-[#0f0f0f] text-white" : "bg-white text-black"
      } flex items-center h-12 px-4 md:pl-9 md:pr-4`}
    >
      <div className="w-full flex items-center justify-between space-x-2">
        <div
          className={`${
            openSearch
              ? "hidden md:inline-flex md:items-center md:space-x-5"
              : "flex items-center space-x-5"
          }`}
        >
          <MenuIcon
            onClick={() => dispatch(setOpenSidebar(true))}
            className="h-6 cursor-pointer"
          />

          <Link href="/">
            <div className="flex items-center space-x-0.5 cursor-pointer">
              <BsYoutube size={30} color="red" />

              <p className="text-xl font-sans tracking-tighter">YouTube</p>
            </div>
          </Link>
        </div>

        {openSearch && (
          <button
            onClick={() => setOpenSearch(false)}
            className={`${
              mode === "dark" ? "hover:bg-[#333333]" : "hover:bg-gray-50 "
            } flex md:hidden items-center justify-center rounded-full w-8 h-8`}
          >
            <BsArrowLeft size={22} />
          </button>
        )}

        <div
          className={`${
            openSearch ? "flex-1 max-w-lg" : "hidden md:inline flex-1 max-w-lg"
          } `}
        >
          <Search />
        </div>

        <div className="flex items-center space-x-2">
          {!openSearch && (
            <button
              onClick={() => setOpenSearch(true)}
              className={`${
                mode === "dark" ? "hover:bg-[#333333]" : "hover:bg-gray-50 "
              } flex md:hidden items-center justify-center rounded-full w-8 h-8`}
            >
              <AiOutlineSearch size={22} />
            </button>
          )}

          {auth?.loading ? (
            <div className="flex items-center space-x-4">
              {[1, 2, 3, 4].map((item, i) => (
                <div
                  key={i}
                  className={`${
                    mode === "dark" ? "bg-gray-600/50" : "bg-gray-100/50"
                  } w-5 h-5 rounded-full animate-bounce`}
                />
              ))}
            </div>
          ) : (
            <>
              {auth?.currentUser ? (
                <div className="flex items-center">
                  <button onClick={() => dispatch(setOpenModal(true))}>
                    <MdOutlineVideoCall size={25} />
                  </button>

                  <Link href={`/channel/${auth.currentUser?.uid}`}>
                    <div className="flex items-center cursor-pointer">
                      <img
                        className="w-8 h-8 rounded-full object-cover ml-2 lg:mr-2"
                        src={auth.currentUser?.image || "/assets/no-user.jpeg"}
                      />

                      <p className="text-sm font-semibold hidden lg:inline">
                        {auth.currentUser?.username}
                      </p>
                    </div>
                  </Link>
                </div>
              ) : (
                <button
                  onClick={auth?.signInHandler}
                  className={`${
                    openSearch ? "hidden md:inline-flex" : "flex"
                  } items-center space-x-2 px-2 sm:px-4 py-1 border border-blue-400 text-blue-400 `}
                >
                  <FaRegUserCircle size={20} />

                  <p className="text-xs sm:text-sm">SIGN IN</p>
                </button>
              )}
            </>
          )}
        </div>
      </div>
    </div>
  );
};

export default Nav;
