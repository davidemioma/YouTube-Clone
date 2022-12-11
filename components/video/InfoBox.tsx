import React, { useState, useEffect } from "react";
import Link from "next/link";
import { useSelector } from "react-redux";
import { modeSelector } from "../../store/ui-slice";
import { LikeProps, UserProps, VideoProps } from "../../types";
import { db } from "../../firebase";
import { collection, onSnapshot } from "@firebase/firestore";
import { numberFormatter } from "../../utils/functions";
import {
  AiOutlineLike,
  AiFillLike,
  AiOutlineDislike,
  AiFillDislike,
} from "react-icons/ai";
import { IoMdShareAlt } from "react-icons/io";
import { CiSaveDown1 } from "react-icons/ci";
import Moment from "react-moment";
import { useAuth } from "../../context/AuthProvider";
import SubBtn from "../SubBtn";

interface Props {
  video: VideoProps | null;
  channel: UserProps | null;
}

const InfoBox = ({ video, channel }: Props) => {
  const auth = useAuth();

  const mode = useSelector(modeSelector);

  const [views, setViews] = useState(0);

  const [likes, setLikes] = useState<LikeProps[]>([]);

  const [dislikes, setDislikes] = useState<LikeProps[]>([]);

  const [subs, setSubs] = useState<LikeProps[]>([]);

  const [members, setMembers] = useState<LikeProps[]>([]);

  const [hasLiked, setHasLiked] = useState(false);

  const [hasDisliked, setHasDisiked] = useState(false);

  const [hasSub, setHasSub] = useState(false);

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

  useEffect(
    () =>
      onSnapshot(
        collection(db, "users", `${video?.userId}`, "members"),
        (snapshot: any) => {
          setMembers(
            snapshot.docs.map((doc: any) => ({
              id: doc.id,
              ...doc.data(),
            }))
          );
        }
      ),
    [video?.userId]
  );

  useEffect(
    () =>
      onSnapshot(
        collection(db, "videos", `${video?.id}`, "likes"),
        (snapshot: any) => {
          setLikes(
            snapshot.docs.map((doc: any) => ({
              id: doc.id,
              ...doc.data(),
            }))
          );
        }
      ),
    [video?.id]
  );

  useEffect(
    () =>
      onSnapshot(
        collection(db, "users", `${auth?.currentUser?.uid}`, "subs"),
        (snapshot: any) => {
          setSubs(
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
      onSnapshot(
        collection(db, "videos", `${video?.id}`, "dislikes"),
        (snapshot: any) => {
          setDislikes(
            snapshot.docs.map((doc: any) => ({
              id: doc.id,
              ...doc.data(),
            }))
          );
        }
      ),
    [video?.id]
  );

  useEffect(
    () =>
      setHasLiked(
        likes?.findIndex((like) => like.id === auth?.currentUser?.uid) !== -1
      ),
    [likes, auth?.currentUser?.uid]
  );

  useEffect(
    () =>
      setHasDisiked(
        dislikes?.findIndex(
          (dislike) => dislike.id === auth?.currentUser?.uid
        ) !== -1
      ),
    [dislikes, auth?.currentUser?.uid]
  );

  useEffect(
    () => setHasSub(subs?.findIndex((sub) => sub.id === channel?.id) !== -1),
    [subs, channel?.id]
  );

  return (
    <div className="my-3">
      <p className="text-lg font-medium capitalize line-clamp-2 mb-2">
        {video?.title}
      </p>

      <div
        className={`flex flex-col gap-3 sm:flex-row sm:justify-between sm:items-center pb-3 border-b ${
          mode === "dark" ? "border-gray-800" : "border-gray-200"
        }`}
      >
        <p className="opacity-75 text-xs">
          {numberFormatter(views)} view
          {views > 1 && "s"} •{" "}
          {video?.timestamp?.seconds && (
            <Moment
              fromNow
              date={new Date(video?.timestamp?.seconds * 1000).toUTCString()}
            />
          )}
        </p>

        <div className="flex items-center space-x-4">
          <button
            className="flex items-center space-x-1 disabled:cursor-not-allowed"
            onClick={() => video && auth?.likeVideo(`${video?.id}`, hasLiked)}
            disabled={!auth?.currentUser}
          >
            {hasLiked ? <AiFillLike size={20} /> : <AiOutlineLike size={20} />}

            <p className="text-sm">{numberFormatter(likes.length)}</p>
          </button>

          <button
            className="flex items-center space-x-1 disabled:cursor-not-allowed"
            onClick={() =>
              video && auth?.dislikeVideo(`${video?.id}`, hasDisliked)
            }
            disabled={!auth?.currentUser}
          >
            {hasDisliked ? (
              <AiFillDislike size={20} />
            ) : (
              <AiOutlineDislike size={20} />
            )}

            <p className="text-sm">{numberFormatter(dislikes.length)}</p>
          </button>

          <button className="flex items-center space-x-1">
            <IoMdShareAlt size={20} />

            <p className="text-sm">Share</p>
          </button>

          <button className="flex items-center space-x-1">
            <CiSaveDown1 size={20} />

            <p className="text-sm">Save</p>
          </button>
        </div>
      </div>

      <div
        className={`py-3 flex items-center space-x-2 justify-between border-b ${
          mode === "dark" ? "border-gray-800" : "border-gray-200"
        }`}
      >
        <div className="flex space-x-2">
          <Link href={`/channel/${channel?.id}`}>
            <img
              className="w-8 h-8 rounded-full object-cover cursor-pointer"
              src={channel?.image || "/assets/no-user.jpeg"}
              alt=""
            />
          </Link>

          <div>
            <Link href={`/channel/${channel?.id}`}>
              <p className="mb-0.5 text-sm font-medium cursor-pointer">
                {channel?.username}
              </p>
            </Link>

            {members.length > 0 && (
              <p className="text-xs opacity-75 mb-2">
                {numberFormatter(members.length)} subscriber
                {members.length > 1 && "s"}
              </p>
            )}

            <p className="text-sm line-clamp-2 leading-5">
              {video?.description}
            </p>
          </div>
        </div>

        {video?.userId !== auth?.currentUser?.uid && (
          <SubBtn hasSub={hasSub} channel={channel} />
        )}
      </div>
    </div>
  );
};

export default InfoBox;
