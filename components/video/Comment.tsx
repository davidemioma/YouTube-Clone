import React, { useEffect, useState } from "react";
import Link from "next/link";
import { db } from "../../firebase";
import { doc, onSnapshot } from "@firebase/firestore";
import { CommentProps, UserProps } from "../../types";
import Moment from "react-moment";

const Comment = ({ comment }: { comment: CommentProps }) => {
  const [channel, setChannel] = useState<UserProps | null>(null);

  useEffect(
    () =>
      onSnapshot(doc(db, "users", `${comment?.userId}`), (snapshot: any) => {
        setChannel({
          id: snapshot.id,
          ...snapshot.data(),
        });
      }),
    []
  );

  return (
    <div className="flex space-x-3 text-sm">
      <Link href={`/channel/${channel?.id}`}>
        <img
          className="w-8 h-8 rounded-full cursor-pointer"
          src={channel?.image || "/assets/no-user.jpeg"}
          alt=""
        />
      </Link>

      <div className="space-y-1">
        <p className="text-sm font-medium">
          {channel?.username}{" "}
          <span className="text-xs opacity-75">
            <Moment
              fromNow
              date={new Date(comment?.timestamp?.seconds * 1000).toUTCString()}
            />
          </span>
        </p>

        <p className="line-clamp-2 text-sm">{comment?.text}</p>
      </div>
    </div>
  );
};

export default Comment;
