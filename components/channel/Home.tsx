import React, { useEffect, useState } from "react";
import Link from "next/link";
import { db } from "../../firebase";
import { collection, doc, onSnapshot } from "@firebase/firestore";
import { LikeProps, UserProps, VideoProps } from "../../types";
import { numberFormatter } from "../../utils/functions";
import Moment from "react-moment";
import { useSelector } from "react-redux";
import { modeSelector } from "../../store/ui-slice";
import Scrollbar from "./Scrollbar";
import Video from "./Video";
import Channel from "./Channel";

interface Props {
  videos: VideoProps[];
  subs: LikeProps[];
}

const Home = ({ videos, subs }: Props) => {
  const mode = useSelector(modeSelector);

  const [views, setViews] = useState(0);

  const [channel, setChannel] = useState<UserProps | null>(null);

  useEffect(
    () =>
      onSnapshot(
        collection(db, "videos", `${videos[0]?.id}`, "views"),
        (snapshot) => {
          setViews(snapshot.docs.length);
        }
      ),
    [videos[0]?.id]
  );

  useEffect(
    () =>
      onSnapshot(doc(db, "users", `${videos[0]?.userId}`), (snapshot: any) => {
        setChannel({
          id: snapshot.id,
          ...snapshot.data(),
        });
      }),
    [videos[0]?.userId]
  );

  return (
    <div className="w-full max-w-4xl mx-auto">
      {videos[0] && (
        <div
          className={`flex flex-col md:flex-row gap-y-2 gap-x-4 pb-5 border-b ${
            mode === "dark"
              ? "border-gray-500/50 text-white"
              : "border-gray-200 text-black"
          }`}
        >
          <Link href={`/video/${videos[0]?.id}`}>
            <div className="w-[250px] h-36 overflow-hidden">
              <img
                className="w-full h-full object-cover rounded-xl cursor-pointer hover:scale-105 transition-transform duration-200"
                src={videos[0]?.thumbnail}
                alt=""
              />
            </div>
          </Link>

          <div className="mt-1">
            <Link href={`/video/${videos[0]?.id}`}>
              <h2 className="text-lg cursor-pointer font-medium w-full truncate">
                {videos[0]?.title}
              </h2>
            </Link>

            <p className="mt-1 mb-3 text-xs opacity-75">
              <span className="uppercase mr-2">{channel?.username}</span>
              {numberFormatter(views)} view
              {views > 1 && "s"} •{" "}
              {
                <Moment
                  fromNow
                  date={new Date(
                    videos[0]?.timestamp?.seconds * 1000
                  ).toUTCString()}
                />
              }
            </p>

            <p className="opacity-75 text-xs line-clamp-2 md:line-clamp-none">
              {videos[0]?.description}
            </p>
          </div>
        </div>
      )}

      {videos.length > 0 && (
        <Scrollbar title="Videos" border={true} data={videos}>
          {videos.map((video) => (
            <Video key={`v-${video.id}`} video={video} />
          ))}
        </Scrollbar>
      )}

      {subs.length > 0 && (
        <Scrollbar title="Channels" data={subs}>
          {subs.map((sub) => (
            <Channel key={`c-${sub.id}`} channel={sub} />
          ))}
        </Scrollbar>
      )}
    </div>
  );
};

export default Home;
