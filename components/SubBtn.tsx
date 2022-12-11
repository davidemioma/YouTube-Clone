import React from "react";
import { useAuth } from "../context/AuthProvider";
import { UserProps } from "../types";

interface Props {
  hasSub: boolean;
  channel: UserProps | null;
  small?: boolean;
}

const SubBtn = ({ hasSub, channel, small }: Props) => {
  const auth = useAuth();

  return (
    <button
      className={`${hasSub ? "bg-gray-500" : "bg-red-700"} ${
        small ? "text-xs py-1 px-2" : "text-sm py-2 px-4 sm:px-6"
      } text-white rounded-3xl disabled:cursor-not-allowed`}
      onClick={() =>
        channel && auth?.subscribe(channel?.id, channel?.username, hasSub)
      }
      disabled={!auth?.currentUser}
    >
      {hasSub ? "Subscribed" : "Subscribe"}
    </button>
  );
};

export default SubBtn;
