import React, { useEffect, useState } from "react";
import { numberFormatter } from "../utils/functions";
import { VideoProps, UserProps } from "../types";
import { collection, doc, onSnapshot } from "@firebase/firestore";
import { db } from "../firebase";
import Moment from "react-moment";
import { useRouter } from "next/router";

interface Props {
  video: VideoProps;
}

const VideoCard = ({ video }: Props) => {
  const router = useRouter();

  const [channel, setChannel] = useState<UserProps | null>(null);

  const [views, setViews] = useState(0);

  useEffect(
    () =>
      onSnapshot(doc(db, "users", video.userId), (snapshot: any) => {
        setChannel({
          id: snapshot.id,
          ...snapshot.data(),
        });
      }),
    []
  );

  useEffect(
    () =>
      onSnapshot(
        collection(db, "videos", `${video?.id}`, "views"),
        (snapshot) => {
          setViews(snapshot.docs.length);
        }
      ),
    [video?.id]
  );

  return (
    <div className="w-full max-w-[250px] cursor-pointer">
      <div
        className="w-full h-32 overflow-hidden"
        onClick={() => router.push(`/video/${video.id}`)}
      >
        <img
          className="w-full h-full object-cover hover:scale-105 transition-transform duration-200"
          src={
            video.thumbnail ||
            "https://i9.ytimg.com/vi_webp/k3Vfj-e1Ma4/mqdefault.webp?v=6277c159&sqp=CIjm8JUG&rs=AOn4CLDeKmf_vlMC1q9RBEZu-XQApzm6sA"
          }
          alt=""
        />
      </div>

      <div className="flex items-start h-[90px] space-x-3 mt-3">
        <img
          className="w-8 h-8 object-cover rounded-full cursor-pointer"
          onClick={() => router.push(`/channel/${channel?.id}`)}
          src={channel?.image || "/assets/no-user.jpeg"}
          alt=""
        />

        <div className="text-xs">
          <p
            className="capitalize text-sm line-clamp-2"
            onClick={() => router.push(`/video/${video.id}`)}
          >
            {video.title}
          </p>

          <p
            className="mb-0.5 mt-1 opacity-75 cursor-pointer line-clamp-1"
            onClick={() => router.push(`/channel/${channel?.id}`)}
          >
            {channel?.username}
          </p>

          <p className="opacity-75">
            {numberFormatter(views)} view{views > 1 && "s"} •{" "}
            {
              <Moment
                fromNow
                date={new Date(video?.timestamp?.seconds * 1000).toUTCString()}
              />
            }
          </p>
        </div>
      </div>
    </div>
  );
};

export default VideoCard;
