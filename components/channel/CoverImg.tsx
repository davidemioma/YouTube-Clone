import React, { useRef, useState } from "react";
import { useAuth } from "../../context/AuthProvider";
import { UserProps } from "../../types";
import { uploadFileHandler } from "../../utils/functions";
import { PhotographIcon, TrashIcon } from "@heroicons/react/solid";

const CoverImg = ({ channel }: { channel: UserProps }) => {
  const auth = useAuth();

  const filePickerRef = useRef<HTMLInputElement>(null);

  const [imageFile, setImageFile] = useState(null);

  const [loading, setLoading] = useState(false);

  const uploadCoverImage = async () => {
    setLoading(true);

    try {
      await auth?.addCoverimage(imageFile);

      setLoading(false);

      setImageFile(null);
    } catch (err) {
      console.log(err);
    }
  };

  const removeImageHandler = async () => {
    setLoading(true);

    try {
      await auth?.removeCoverimage();

      setLoading(false);
    } catch (err) {
      console.log(err);
    }
  };

  return (
    <div className="w-full">
      {channel?.coverImg ? (
        <div className="relative w-full h-[200px] mb-5">
          <img
            className="absolute w-full h-full object-cover mb-5"
            src={channel?.coverImg}
            alt=""
          />

          {auth?.currentUser?.uid === channel.id && (
            <button
              onClick={removeImageHandler}
              disabled={loading}
              className="absolute flex items-center space-x-2 bottom-5 left-5 z-10 px-3 py-1 disabled:cursor-not-allowed bg-red-600/80 rounded-3xl"
            >
              <TrashIcon className="h-5" />

              <p>Remove Image</p>
            </button>
          )}
        </div>
      ) : (
        <div className="w-full">
          {channel.id === auth?.currentUser?.uid && (
            <>
              {!imageFile ? (
                <div className="relative w-full h-48 mb-5 bg-white bg-gradient-to-b from-gray-50 to-gray-300">
                  <input
                    ref={filePickerRef}
                    type="file"
                    accept="image/*"
                    hidden
                    onChange={(e) => uploadFileHandler(e, setImageFile)}
                  />

                  <button
                    className="absolute flex items-center space-x-2 bottom-5 left-5 z-10 px-3 py-1 bg-red-700 rounded-3xl"
                    onClick={() => filePickerRef?.current?.click()}
                  >
                    <PhotographIcon className="h-5" />

                    <p>Add cover image</p>
                  </button>
                </div>
              ) : (
                <div className="relative w-full h-48 mb-5">
                  <img
                    className="absolute top-0 w-full h-full object-cover"
                    src={imageFile}
                    alt=""
                  />

                  <button
                    className="absolute bottom-5 right-5 z-10 bg-red-600 py-1 px-6 rounded-3xl"
                    onClick={uploadCoverImage}
                    disabled={loading}
                  >
                    {loading ? "Uploading..." : "Upload"}
                  </button>
                </div>
              )}
            </>
          )}
        </div>
      )}
    </div>
  );
};

export default CoverImg;
