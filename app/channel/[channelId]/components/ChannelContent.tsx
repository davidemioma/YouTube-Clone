"use client";

import React, { useState } from "react";
import Home from "./Home";
import About from "./About";
import Videos from "./Videos";
import ViewItem from "./ViewItem";
import CoverImage from "./CoverImage";
import ProfileInfo from "./ProfileInfo";
import { ChannelProps, CurrentUser, PostProps } from "@/types";

interface Props {
  currentUser: CurrentUser | null;
  channel: ChannelProps | null;
  posts: PostProps[];
}

enum VIEWS {
  HOME = 0,
  VIDEOS = 1,
  ABOUT = 2,
}

const ChannelContent = ({ currentUser, channel, posts }: Props) => {
  const [view, setView] = useState(VIEWS.HOME);

  let content = (
    <Home
      currentUser={currentUser}
      posts={posts}
      viewAll={() => setView(VIEWS.VIDEOS)}
    />
  );

  if (view === VIEWS.VIDEOS && channel?.id) {
    content = (
      <Videos
        channelId={channel?.id!}
        currentUser={currentUser}
        initialPosts={posts}
      />
    );
  }

  if (view === VIEWS.ABOUT) {
    content = <About channel={channel} />;
  }

  return (
    <>
      <CoverImage channel={channel} currentUser={currentUser} />

      <ProfileInfo channel={channel} currentUser={currentUser} />

      <div className="w-full flex items-center px-5 border-b border-[hsl(0,0%,18.82%)]">
        <ViewItem
          label="HOME"
          active={view === VIEWS.HOME}
          onClick={() => setView(VIEWS.HOME)}
        />

        <ViewItem
          label="VIDEOS"
          active={view === VIEWS.VIDEOS}
          onClick={() => setView(VIEWS.VIDEOS)}
        />

        <ViewItem
          label="ABOUT"
          active={view === VIEWS.ABOUT}
          onClick={() => setView(VIEWS.ABOUT)}
        />
      </div>

      <div className="p-5 pb-10">{content}</div>
    </>
  );
};

export default ChannelContent;
