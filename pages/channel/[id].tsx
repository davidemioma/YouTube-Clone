import React, { useEffect, useState } from "react";
import Head from "next/head";
import { useRouter } from "next/router";
import { useAuth } from "../../context/AuthProvider";
import { LikeProps, UserProps, VideoProps } from "../../types";
import { collection, doc, onSnapshot, query, where } from "@firebase/firestore";
import { db } from "../../firebase";
import { numberFormatter } from "../../utils/functions";
import CoverImg from "../../components/channel/CoverImg";
import SubBtn from "../../components/SubBtn";
import Selector from "../../components/channel/Selector";
import { useSelector } from "react-redux";
import { selectItemSelector } from "../../store/ui-slice";
import Home from "../../components/channel/Home";
import Video from "../../components/channel/Video";
import ChannelCard from "../../components/channel/Channel";

const Channel = () => {
  const auth = useAuth();

  const router = useRouter();

  const { id } = router.query;

  const selectItem = useSelector(selectItemSelector);

  const [channelInfo, setChannelInfo] = useState<UserProps | null>(null);

  const [videos, setVideos] = useState<VideoProps[]>([]);

  const [subs, setSubs] = useState<LikeProps[]>([]);

  const [members, setMembers] = useState(0);

  const [mySubs, setMySubs] = useState<UserProps[]>([]);

  const [hasSub, setHasSub] = useState(false);

  useEffect(
    () =>
      onSnapshot(
        query(collection(db, "videos"), where("userId", "==", `${id}`)),
        (snapshot) => {
          setVideos(
            snapshot.docs.map((doc: any) => ({
              id: doc.id,
              ...doc.data(),
            }))
          );
        }
      ),
    [id]
  );

  useEffect(
    () =>
      onSnapshot(doc(db, "users", `${id}`), (snapshot: any) => {
        setChannelInfo({
          id: snapshot.id,
          ...snapshot.data(),
        });
      }),
    [id]
  );

  useEffect(
    () =>
      onSnapshot(collection(db, "users", `${id}`, "members"), (snapshot) => {
        setMembers(snapshot.docs.length);
      }),
    [id]
  );

  useEffect(
    () =>
      onSnapshot(collection(db, "users", `${id}`, "subs"), (snapshot) => {
        setSubs(
          snapshot.docs.map((doc: any) => ({
            id: doc.id,
            ...doc.data(),
          }))
        );
      }),
    [id]
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
    () =>
      setHasSub(mySubs?.findIndex((sub) => sub.id === channelInfo?.id) !== -1),
    [mySubs, channelInfo?.id]
  );

  return (
    <div>
      <Head>
        <title>YouTube - Clone</title>

        <link rel="icon" href="/youtube.svg" />
      </Head>

      <main className="w-full">
        {channelInfo && <CoverImg channel={channelInfo} />}

        <div className="w-full max-w-4xl mx-auto flex items-center justify-between mb-2">
          <div className="flex items-center sm:space-x-5">
            <img
              className="hidden sm:inline w-20 h-20 object-cover rounded-full"
              src={channelInfo?.image}
              alt=""
            />

            <div>
              <h1 className="text-xl font-medium uppercase">
                {channelInfo?.username}
              </h1>

              <p className="lowercase text-sm opacity-75">
                @{channelInfo?.username}
              </p>

              {members > 0 && (
                <p className="text-xs opacity-75">
                  {numberFormatter(members)} subscriber
                  {members > 1 && "s"}
                </p>
              )}
            </div>
          </div>

          {id !== auth?.currentUser?.uid && (
            <SubBtn hasSub={hasSub} channel={channelInfo} />
          )}
        </div>

        <Selector />

        {selectItem === "home" && <Home videos={videos} subs={subs} />}

        {selectItem === "videos" && (
          <>
            {videos.length > 0 ? (
              <div className="w-full max-w-4xl mx-auto flex flex-wrap gap-5">
                {videos.map((video) => (
                  <Video key={`cv-${video.id}`} video={video} />
                ))}
              </div>
            ) : (
              <div className="w-full max-w-4xl mx-auto flex flex-col items-center">
                <img
                  className="w-40 h-40 object-cover"
                  src="/assets/no-video.png"
                  alt=""
                />

                <p>No video available!</p>
              </div>
            )}
          </>
        )}

        {selectItem === "channels" && (
          <>
            {subs.length > 0 ? (
              <div className="w-full max-w-4xl mx-auto flex flex-wrap gap-5">
                {subs.map((channel) => (
                  <ChannelCard key={`c-${channel.id}`} channel={channel} />
                ))}
              </div>
            ) : (
              <div className="w-full max-w-4xl mx-auto flex flex-col items-center">
                <img
                  className="w-40 h-40 object-cover"
                  src="/assets/no-video.png"
                  alt=""
                />

                <p>You are not subscribed to any channel!</p>
              </div>
            )}
          </>
        )}
      </main>
    </div>
  );
};

export default Channel;
