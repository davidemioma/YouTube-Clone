import React, { useEffect, useState } from "react";
import Head from "next/head";
import VideoCard from "../components/VideoCard";
import { VideoProps } from "../types";
import { db } from "../firebase";
import { collection, onSnapshot, query, where } from "@firebase/firestore";
import { useAuth } from "../context/AuthProvider";

const Subscriptions = () => {
  const auth = useAuth();

  const [videos, setVideos] = useState<VideoProps[]>([]);

  const [subsId, setSubsId] = useState<string[]>([]);

  useEffect(
    () =>
      onSnapshot(
        collection(db, "users", `${auth?.currentUser?.uid}`, "subs"),
        (snapshot: any) => {
          setSubsId(snapshot.docs.map((doc: any) => doc.id));
        }
      ),
    [auth?.currentUser?.uid]
  );

  useEffect(() => {
    const newSubsId = subsId.length > 0 ? subsId : ["test"];

    const unSub = onSnapshot(
      query(collection(db, "videos"), where("userId", "in", newSubsId)),
      (snapshot: any) => {
        setVideos(
          snapshot.docs.map((doc: any) => ({ id: doc.id, ...doc.data() }))
        );
      }
    );

    return unSub;
  }, [subsId]);

  return (
    <div>
      <Head>
        <title>YouTube - Clone</title>

        <link rel="icon" href="/youtube.svg" />
      </Head>

      <main className="grid justify-items-center sm:grid-cols-2 md:grid-cols-3 xl:grid-cols-4 gap-x-7 gap-y-10">
        {videos.map((video) => (
          <VideoCard key={video.id} video={video} />
        ))}
      </main>
    </div>
  );
};

export default Subscriptions;
