import {
  addDoc,
  collection,
  deleteDoc,
  doc,
  serverTimestamp,
  setDoc,
  updateDoc,
} from "@firebase/firestore";
import { getDownloadURL, ref, uploadString } from "@firebase/storage";
import React, { createContext, useContext, useEffect, useState } from "react";
import { auth, db, signInWithGoogle, storage } from "../firebase";
import { VideoInfo } from "../types";

interface AuthUser {
  uid: string | null;
  username: string | null;
  email: string | null;
  image: string | null;
}

interface AuthProps {
  currentUser: AuthUser | null;
  loading: boolean;
  signInHandler: () => void;
  signOut: () => void;
  uploadVideo: (info: VideoInfo, videoFile: any, imageFile: any) => void;
  addComment: (videoId: string, text: string) => void;
  addToViews: (videoId: string) => void;
  likeVideo: (videoId: string, hasLike: boolean) => void;
  dislikeVideo: (videoId: string, hasDislike: boolean) => void;
  subscribe: (userId: string, channelName: string, hasSub: boolean) => void;
  addCoverimage: (imageFile: any) => void;
  removeCoverimage: () => void;
}

interface ChildrenProps {
  children: React.ReactNode;
}

export const AuthContext = createContext<AuthProps | null>(null);

export const useAuth = () => useContext(AuthContext);

export const AuthProvider = ({ children }: ChildrenProps) => {
  const [currentUser, setCurrentUser] = useState<AuthUser | null>(null);

  const [loading, setLoading] = useState(true);

  const signInHandler = () => {
    signInWithGoogle()
      .then((res) => {
        setDoc(
          doc(db, "users", res.user.uid),
          {
            username: res.user.displayName,
            email: res.user.email,
            image: res.user.photoURL,
          },
          { merge: true }
        );
      })
      .catch((err) => {
        alert(err);
      });
  };

  const signOut = async () => {
    await auth.signOut();

    setCurrentUser(null);
  };

  const addCoverimage = async (imageFile: any) => {
    const imageRef = ref(storage, `posts/${currentUser?.uid}/coverImages`);

    await uploadString(imageRef, imageFile, "data_url").then(
      async (snapshot) => {
        const downloadUrl = await getDownloadURL(imageRef);

        await updateDoc(doc(db, "users", `${currentUser?.uid}`), {
          coverImg: downloadUrl,
        });
      }
    );
  };

  const removeCoverimage = async () => {
    await updateDoc(doc(db, "users", `${currentUser?.uid}`), {
      coverImg: "",
    });
  };

  const uploadVideo = async (
    info: VideoInfo,
    videoFile: any,
    imageFile: any
  ) => {
    await addDoc(collection(db, "videos"), {
      ...info,
      userId: currentUser?.uid,
      timestamp: serverTimestamp(),
    }).then(async (docRef) => {
      const imageRef = ref(storage, `posts/${docRef?.id}/images`);

      await uploadString(imageRef, imageFile, "data_url").then(
        async (snapshot) => {
          const downloadUrl = await getDownloadURL(imageRef);

          await updateDoc(doc(db, "videos", docRef.id), {
            thumbnail: downloadUrl,
          });
        }
      );

      const videoRef = ref(storage, `posts/${docRef?.id}/videos`);

      await uploadString(videoRef, videoFile, "data_url").then(
        async (snapshot) => {
          const downloadUrl = await getDownloadURL(videoRef);

          await updateDoc(doc(db, "videos", docRef.id), {
            videoUrl: downloadUrl,
          });
        }
      );
    });
  };

  const addToViews = async (videoId: string) => {
    await setDoc(
      doc(db, "videos", videoId, "views", `${currentUser?.uid}`),
      {
        username: currentUser?.username,
      },
      { merge: true }
    );
  };

  const addComment = async (videoId: string, text: string) => {
    await addDoc(collection(db, "videos", videoId, "comments"), {
      text,
      userId: currentUser?.uid,
      timestamp: serverTimestamp(),
    });
  };

  const likeVideo = async (videoId: string, hasLike: boolean) => {
    await deleteDoc(
      doc(db, "videos", videoId, "dislikes", `${currentUser?.uid}`)
    );

    if (hasLike) {
      await deleteDoc(
        doc(db, "videos", videoId, "likes", `${currentUser?.uid}`)
      );
    } else {
      await setDoc(doc(db, "videos", videoId, "likes", `${currentUser?.uid}`), {
        username: currentUser?.username,
      });
    }
  };

  const dislikeVideo = async (videoId: string, hasDislike: boolean) => {
    await deleteDoc(doc(db, "videos", videoId, "likes", `${currentUser?.uid}`));

    if (hasDislike) {
      await deleteDoc(
        doc(db, "videos", videoId, "dislikes", `${currentUser?.uid}`)
      );
    } else {
      await setDoc(
        doc(db, "videos", videoId, "dislikes", `${currentUser?.uid}`),
        {
          username: currentUser?.username,
        }
      );
    }
  };

  const subscribe = async (
    userId: string,
    channelName: string,
    hasSub: boolean
  ) => {
    if (hasSub) {
      await deleteDoc(
        doc(db, "users", userId, "members", `${currentUser?.uid}`)
      );

      await deleteDoc(doc(db, "users", `${currentUser?.uid}`, "subs", userId));
    } else {
      await setDoc(doc(db, "users", userId, "members", `${currentUser?.uid}`), {
        username: currentUser?.username,
      });

      await setDoc(doc(db, "users", `${currentUser?.uid}`, "subs", userId), {
        username: channelName,
      });
    }
  };

  useEffect(() => {
    const unsubscribe = auth.onAuthStateChanged((user) => {
      if (user) {
        setCurrentUser({
          uid: user?.uid,
          username: user?.displayName,
          email: user?.email,
          image: user?.photoURL,
        });
      }

      setLoading(false);
    });

    return unsubscribe;
  }, []);

  return (
    <AuthContext.Provider
      value={{
        currentUser,
        loading,
        signInHandler,
        signOut,
        uploadVideo,
        addComment,
        addToViews,
        likeVideo,
        dislikeVideo,
        subscribe,
        addCoverimage,
        removeCoverimage,
      }}
    >
      {children}
    </AuthContext.Provider>
  );
};
