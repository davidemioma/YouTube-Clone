import React, { useEffect, useState } from "react";
import Head from "next/head";
import { useRouter } from "next/router";
import { collection, onSnapshot } from "@firebase/firestore";
import { db } from "../firebase";
import { UserProps, VideoProps } from "../types";
import Result from "../components/Result";

const Results = () => {
  const router = useRouter();

  const { search_query } = router.query;

  const [channels, setChannels] = useState<UserProps[]>([]);

  const [videos, setVideos] = useState<VideoProps[]>([]);

  const [results, setResults] = useState<(UserProps | VideoProps)[]>([]);

  useEffect(
    () =>
      onSnapshot(collection(db, "videos"), (snapshot: any) => {
        setVideos(
          snapshot.docs.map((doc: any) => ({
            id: doc.id,
            type: "video",
            ...doc.data(),
          }))
        );
      }),
    []
  );

  useEffect(
    () =>
      onSnapshot(collection(db, "users"), (snapshot: any) => {
        setChannels(
          snapshot.docs.map((doc: any) => ({
            id: doc.id,
            type: "channel",
            ...doc.data(),
          }))
        );
      }),
    []
  );

  useEffect(() => {
    const videoResults = videos.filter((video) =>
      video.title.toLowerCase().includes(`${search_query}`)
    );

    const channelResults = channels.filter((channel) =>
      channel.username.toLowerCase().includes(`${search_query}`)
    );

    setResults([...videoResults, ...channelResults]);
  }, [search_query, videos, channels]);

  return (
    <div>
      <Head>
        <title>{search_query} - YouTube</title>

        <link rel="icon" href="/youtube.svg" />
      </Head>

      <h1 className="text-xl font-medium mb-6">Results</h1>

      {results.length > 0 ? (
        <div className="space-y-4">
          {results.map((result) => (
            <Result key={`r-${result.id}`} result={result} />
          ))}
        </div>
      ) : (
        <div className="w-full flex flex-col items-center">
          <img
            className="w-40 h-40 object-cover"
            src="/assets/no-video.png"
            alt=""
          />

          <p>{search_query} not found!</p>
        </div>
      )}
    </div>
  );
};

export default Results;
