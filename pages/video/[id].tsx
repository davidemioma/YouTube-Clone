import React, { useEffect, useState } from "react";
import Head from "next/head";
import { db } from "../../firebase";
import { doc, onSnapshot } from "@firebase/firestore";
import { useRouter } from "next/router";
import { UserProps, VideoProps } from "../../types";
import { useAuth } from "../../context/AuthProvider";
import VideoPlayer from "../../components/video/VideoPlayer";
import InfoBox from "../../components/video/InfoBox";
import Recommendation from "../../components/video/Recommendation";
import Comments from "../../components/video/Comments";

const Video = () => {
  const router = useRouter();

  const { id } = router.query;

  const auth = useAuth();

  const [video, setVideo] = useState<VideoProps | null>(null);

  const [channel, setChannel] = useState<UserProps | null>(null);

  useEffect(() => {
    if (auth?.currentUser) {
      id && auth?.addToViews(`${id}`);
    }
  }, [auth?.currentUser, id]);

  useEffect(
    () =>
      onSnapshot(doc(db, "videos", `${id}`), (snapshot: any) => {
        setVideo({
          id: snapshot.id,
          ...snapshot.data(),
        });
      }),
    [id]
  );

  useEffect(
    () =>
      onSnapshot(doc(db, "users", `${video?.userId}`), (snapshot: any) => {
        setChannel({
          id: snapshot.id,
          ...snapshot.data(),
        });
      }),
    [video?.userId]
  );

  return (
    <div>
      <Head>
        <title>YouTube - {video?.title}</title>

        <link rel="icon" href="/youtube.svg" />
      </Head>

      <main className="w-full">
        <div className="w-full lg:hidden">
          <VideoPlayer videoSrc={video?.videoUrl || ""} height="320" />

          <InfoBox video={video} channel={channel} />

          <Recommendation videoId={`${id}`} />

          {auth?.currentUser && <Comments videoId={`${id}`} />}
        </div>

        <div className="hidden lg:inline">
          <VideoPlayer videoSrc={video?.videoUrl || ""} height="500" />

          <div className="flex space-x-5">
            <div className="w-[60%]">
              <InfoBox video={video} channel={channel} />

              {auth?.currentUser && <Comments videoId={`${id}`} />}
            </div>

            <div className="w-[40%]">
              <Recommendation videoId={`${id}`} />
            </div>
          </div>
        </div>
      </main>
    </div>
  );
};

export default Video;
