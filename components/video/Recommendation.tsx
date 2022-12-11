import React, { useEffect, useState } from "react";
import { useAuth } from "../../context/AuthProvider";
import { db } from "../../firebase";
import { collection, onSnapshot, query, where } from "@firebase/firestore";
import { VideoProps } from "../../types";
import RecommendCard from "./RecommendCard";

const Recommendation = ({ videoId }: { videoId: string }) => {
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
      {videos
        .filter((video) => video.id !== videoId)
        .slice(0, 10)
        .sort((a, b) => 0.5 - Math.random())
        .map((video, i) => (
          <RecommendCard key={`${video.id}-${i}`} video={video} />
        ))}
    </div>
  );
};

export default Recommendation;
