import React, { useEffect, useState } from "react";
import Link from "next/link";
import { numberFormatter } from "../utils/functions";
import { UserProps } from "../types";
import { collection, doc, onSnapshot } from "@firebase/firestore";
import { db } from "../firebase";
import Moment from "react-moment";

const Result = ({ result }: { result: any }) => {
  const [views, setViews] = useState(0);

  const [channel, setChannel] = useState<UserProps | null>(null);

  const [subscribers, setSubscribers] = useState(0);

  useEffect(() => {
    let unSub;

    if (result?.type === "video") {
      unSub = onSnapshot(
        collection(db, "videos", `${result?.id}`, "views"),
        (snapshot) => {
          setViews(snapshot.docs.length);
        }
      );
    }

    return unSub;
  }, [result?.id, result?.type]);

  useEffect(() => {
    let unSub;

    if (result?.type === "video") {
      unSub = onSnapshot(doc(db, "users", result?.userId), (snapshot: any) => {
        setChannel({
          id: snapshot.id,
          ...snapshot.data(),
        });
      });
    }

    return unSub;
  }, [result?.userId, result?.type]);

  useEffect(() => {
    let unSub;

    if (result?.type === "channel") {
      unSub = onSnapshot(
        collection(db, "users", result?.id, "members"),
        (snapshot) => {
          setSubscribers(snapshot.docs.length);
        }
      );
    }

    return unSub;
  }, [result?.id, result?.type]);

  return (
    <div className="w-full">
      {result.type === "video" ? (
        <div className="flex space-x-4">
          <Link href={`/video/${result.id}`}>
            <div className="w-[200px] h-28 sm:w-[250px] sm:h-32 md:w-[300px] md:h-40 overflow-hidden cursor-pointer">
              <img
                className="w-full h-full object-cover rounded-lg hover:scale-105 transition-transform duration-200"
                src={result?.thumbnail}
                alt=""
              />
            </div>
          </Link>

          <div className="mt-1">
            <Link href={`/video/${result.id}`}>
              <h1 className="text-lg sm:text-xl line-clamp-2 font-medium cursor-pointer">
                {result.title}
              </h1>
            </Link>

            <p className="text-xs opacity-75">
              {numberFormatter(views)} view{views > 1 && "s"} •{" "}
              {
                <Moment
                  fromNow
                  date={new Date(
                    result?.timestamp?.seconds * 1000
                  ).toUTCString()}
                />
              }
            </p>

            <Link href={`/channel/${channel?.id}`}>
              <div className="flex items-center space-x-2 my-3 cursor-pointer">
                <img
                  className="w-6 h-6 rounded-full object-cover"
                  src={channel?.image}
                  alt=""
                />

                <p className="text-sm opacity-75 uppercase">
                  {channel?.username}
                </p>
              </div>
            </Link>

            <p className="text-xs opacity-75 line-clamp-2">
              {result.description}
            </p>
          </div>
        </div>
      ) : (
        <div className="flex items-center space-x-4">
          <img
            className="w-24 h-24 sm:w-32 sm:h-32 rounded-full"
            src={result.image}
            alt=""
          />

          <div className="flex flex-col gap-1">
            <p>{result.username}</p>

            <p className="text-sm opacity-75">
              <span>@{result.username}</span> . {numberFormatter(subscribers)}{" "}
              subscriber
              {subscribers > 1 && "s"}
            </p>
          </div>
        </div>
      )}
    </div>
  );
};

export default Result;
