import React, { useEffect, useState } from "react";
import Link from "next/link";
import { VideoProps } from "../../types";
import { db } from "../../firebase";
import { collection, onSnapshot } from "@firebase/firestore";
import { numberFormatter } from "../../utils/functions";
import Moment from "react-moment";

const Video = ({ video }: { video: VideoProps }) => {
  const [views, setViews] = useState(0);

  useEffect(
    () =>
      onSnapshot(
        collection(db, "videos", `${video.id}`, "views"),
        (snapshot) => {
          setViews(snapshot.docs.length);
        }
      ),
    [video.id]
  );

  return (
    <div>
      <Link href={`/video/${video.id}`}>
        <div className="min-w-[230px] h-32 overflow-hidden">
          <img
            className="w-full h-full object-cover cursor-pointer rounded-xl hover:scale-105 transition-transform duration-200"
            src={video.thumbnail}
            alt=""
          />
        </div>
      </Link>

      <div className="w-[230px] mt-2">
        <Link href={`/video/${video.id}`}>
          <p className="line-clamp-2 text-sm cursor-pointer">{video.title}</p>
        </Link>

        <p className="mt-1 mb-3 text-xs opacity-75">
          {numberFormatter(views)} view
          {views > 1 && "s"} •{" "}
          {
            <Moment
              fromNow
              date={new Date(video?.timestamp?.seconds * 1000).toUTCString()}
            />
          }
        </p>
      </div>
    </div>
  );
};

export default Video;
