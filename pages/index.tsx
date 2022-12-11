import React, { useEffect, useState } from "react";
import Head from "next/head";
import { db } from "../firebase";
import { collection, onSnapshot } from "@firebase/firestore";
import VideoCard from "../components/VideoCard";
import { VideoProps } from "../types";

const Home = () => {
  const [videos, setVideos] = useState<VideoProps[]>([]);

  useEffect(
    () =>
      onSnapshot(collection(db, "videos"), (snapshot: any) => {
        setVideos(
          snapshot.docs.map((doc: any) => ({ id: doc.id, ...doc.data() }))
        );
      }),
    []
  );

  return (
    <div>
      <Head>
        <title>YouTube - Clone</title>

        <link rel="icon" href="/youtube.svg" />
      </Head>

      <main className="flex flex-wrap justify-center sm:justify-start gap-5">
        {videos
          .sort((a, b) => 0.5 - Math.random())
          .map((video) => (
            <VideoCard key={video.id} video={video} />
          ))}
      </main>
    </div>
  );
};

export default Home;
