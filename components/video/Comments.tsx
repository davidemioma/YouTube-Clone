import React, { useEffect, useState } from "react";
import Link from "next/link";
import { useSelector } from "react-redux";
import { useAuth } from "../../context/AuthProvider";
import { db } from "../../firebase";
import { collection, onSnapshot } from "@firebase/firestore";
import { modeSelector } from "../../store/ui-slice";
import { CommentProps } from "../../types";
import Comment from "./Comment";

const Comments = ({ videoId }: { videoId: string }) => {
  const auth = useAuth();

  const mode = useSelector(modeSelector);

  const [comments, setComments] = useState<CommentProps[]>([]);

  const [text, setText] = useState("");

  const addCommentHandler = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();

    if (!text.trim()) return;

    await auth?.addComment(videoId, text);

    setText("");
  };

  useEffect(
    () =>
      onSnapshot(collection(db, "videos", videoId, "comments"), (snapshot) => {
        setComments(
          snapshot.docs.map((doc: any) => ({
            id: doc.id,
            ...doc.data(),
          }))
        );
      }),
    [videoId]
  );

  return (
    <div className="space-y-10">
      <div className="flex items-center space-x-3">
        <Link href={`/channel/${auth?.currentUser?.uid}`}>
          <img
            className="w-8 h-8 rounded-full cursor-pointer"
            src={auth?.currentUser?.image || "/assets/no-user.jpeg"}
            alt=""
          />
        </Link>

        <form className="flex-1 bg-transparent" onSubmit={addCommentHandler}>
          <input
            className={`bg-transparent w-full outline-none text-sm pb-1 border-b ${
              mode === "dark" ? "border-gray-800" : "border-gray-200"
            }`}
            value={text}
            type="text"
            placeholder="Add a comment..."
            onChange={(e) => setText(e.target.value)}
          />
        </form>
      </div>

      <div className="space-y-5">
        {comments.map((comment, i) => (
          <Comment key={comment.id} comment={comment} />
        ))}
      </div>
    </div>
  );
};

export default Comments;
