import { useRouter } from "next/router";
import React from "react";
import { AiFillHome, AiOutlineHome, AiOutlineLogout } from "react-icons/ai";
import {
  MdExplore,
  MdOutlineExplore,
  MdSubscriptions,
  MdOutlineSubscriptions,
} from "react-icons/md";
import { useAuth } from "../context/AuthProvider";
import Item from "./Item";

const Menu = () => {
  const auth = useAuth();

  const router = useRouter();

  return (
    <div className="hidden h-[calc(100vh-48px)] w-24 md:inline-flex flex-col items-center ">
      <Item
        Icon={router.pathname === "/" ? AiFillHome : AiOutlineHome}
        text="Home"
        link="/"
      />

      <Item
        Icon={router.pathname === "/trends" ? MdExplore : MdOutlineExplore}
        text="Explore"
        link="/trends"
      />

      <Item
        Icon={
          router.pathname === "/subscriptions"
            ? MdSubscriptions
            : MdOutlineSubscriptions
        }
        text="Subs"
        link="/subscriptions"
      />

      {auth?.currentUser && (
        <button onClick={auth?.signOut}>
          <Item Icon={AiOutlineLogout} text="Logout" />
        </button>
      )}
    </div>
  );
};

export default Menu;
