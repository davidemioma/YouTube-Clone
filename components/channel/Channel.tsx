import React, { useEffect, useState } from "react";
import Link from "next/link";
import { numberFormatter } from "../../utils/functions";
import { db } from "../../firebase";
import { collection, doc, onSnapshot } from "@firebase/firestore";
import { LikeProps, UserProps } from "../../types";
import SubBtn from "../SubBtn";
import { useAuth } from "../../context/AuthProvider";

const Channel = ({ channel }: { channel: LikeProps }) => {
  const auth = useAuth();

  const [channelInfo, setChannelInfo] = useState<UserProps | null>(null);

  const [members, setMembers] = useState(0);

  const [mySubs, setMySubs] = useState<LikeProps[]>([]);

  const [hasSub, setHasSub] = useState(false);

  useEffect(
    () =>
      onSnapshot(doc(db, "users", `${channel.id}`), (snapshot: any) => {
        setChannelInfo({
          id: snapshot.id,
          ...snapshot.data(),
        });
      }),
    [channel.id]
  );

  useEffect(
    () =>
      onSnapshot(
        collection(db, "users", `${channel.id}`, "members"),
        (snapshot) => {
          setMembers(snapshot.docs.length);
        }
      ),
    [channel.id]
  );

  useEffect(
    () =>
      onSnapshot(
        collection(db, "users", `${auth?.currentUser?.uid}`, "subs"),
        (snapshot) => {
          setMySubs(
            snapshot.docs.map((doc: any) => ({
              id: doc.id,
              ...doc.data(),
            }))
          );
        }
      ),
    [auth?.currentUser?.uid]
  );

  useEffect(
    () => setHasSub(mySubs?.findIndex((sub) => sub.id === channel?.id) !== -1),
    [mySubs]
  );

  return (
    <div className="flex flex-col items-center cursor-pointer">
      <Link href={`/channel/${channel.id}`}>
        <img
          className="w-24 h-24 object-cover rounded-full cursor-pointer"
          src={channelInfo?.image}
          alt=""
        />
      </Link>

      <Link href={`/channel/${channel.id}`}>
        <h2 className="font-medium mt-1 mb-0.5 cursor-pointer">
          {channelInfo?.username}
        </h2>
      </Link>

      {members > 0 && (
        <p className="text-xs opacity-75 mb-2">
          {numberFormatter(members)} subscriber
          {members > 1 && "s"}
        </p>
      )}

      {channel.id !== auth?.currentUser?.uid && (
        <SubBtn hasSub={hasSub} channel={channelInfo} small />
      )}
    </div>
  );
};

export default Channel;
