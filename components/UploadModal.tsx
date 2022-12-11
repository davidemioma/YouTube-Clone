import React, { useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { setOpenModal } from "../store/store";
import { modalSelector, modeSelector } from "../store/ui-slice";
import { XIcon } from "@heroicons/react/solid";
import { useAuth } from "../context/AuthProvider";
import { useRouter } from "next/router";
import { uploadFileHandler } from "../utils/functions";
import Spinner from "./Spinner";

const UploadModal = () => {
  const auth = useAuth();

  const dispatch = useDispatch();

  const router = useRouter();

  const mode = useSelector(modeSelector);

  const modalOpen = useSelector(modalSelector);

  const [loading, setLoading] = useState(false);

  const [title, setTitle] = useState("");

  const [description, setDescription] = useState("");

  const [tag, setTag] = useState("");

  const [tags, setTags] = useState<string[]>([]);

  const [videoFile, setVideoFile] = useState(null);

  const [imageFile, setImageFile] = useState(null);

  const addToTags = (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();

    const newtag = tag;

    setTags((prev) => [newtag, ...prev]);

    setTag("");
  };

  const uploadVideoHandler = async () => {
    setLoading(true);

    try {
      await auth?.uploadVideo(
        { title, description, tags },
        videoFile,
        imageFile
      );

      setLoading(false);

      setTitle("");

      setDescription("");

      setTags([]);

      setVideoFile(null);

      setImageFile(null);

      dispatch(setOpenModal(false));

      router.push("/");
    } catch (err) {
      alert(err);
    }
  };

  return (
    <>
      {modalOpen && (
        <div
          className="fixed top-0 left-0 h-screen w-screen z-30 bg-black/30"
          onClick={() => dispatch(setOpenModal(false))}
        />
      )}

      <div
        className={`absolute left-1/2 -translate-x-1/2 z-40 w-full max-w-xl transition-transform duration-300 ${
          modalOpen ? "top-1/2 -translate-y-1/2" : "-translate-y-[200%]"
        } ${
          mode === "dark" ? "bg-[#202020] text-white" : "bg-white text-black"
        }`}
      >
        <div className="px-5 pt-5 pb-10">
          <XIcon
            className="h-6 cursor-pointer ml-auto"
            onClick={() => !loading && dispatch(setOpenModal(false))}
          />

          <h1 className="text-2xl font-medium text-center mb-6">
            Upload a New Video
          </h1>

          <div className="space-y-4">
            <div className="flex flex-col space-y-2">
              <label htmlFor="video">Video:</label>

              <input
                id="video"
                className={`w-full outline-none border ${
                  mode === "dark" ? "border-white/40" : "border-gray-300"
                } py-0.5 px-2 bg-transparent rounded`}
                type="file"
                accept="video/*"
                onChange={(e) => uploadFileHandler(e, setVideoFile)}
              />
            </div>

            <input
              className={`w-full outline-none border ${
                mode === "dark" ? "border-white/40" : "border-gray-300"
              } py-0.5 px-2 bg-transparent rounded`}
              type="text"
              value={title}
              placeholder="Title"
              onChange={(e) => setTitle(e.target.value)}
            />

            <textarea
              className={`w-full outline-none border ${
                mode === "dark" ? "border-white/40" : "border-gray-300"
              } py-0.5 px-2 bg-transparent rounded`}
              rows={4}
              value={description}
              placeholder="Description"
              onChange={(e) => setDescription(e.target.value)}
            />

            <form className="flex flex-col space-y-2" onSubmit={addToTags}>
              <label htmlFor="tag">Tags:</label>

              <input
                id="tag"
                className={`w-full outline-none border ${
                  mode === "dark" ? "border-white/40" : "border-gray-300"
                } py-0.5 px-2 bg-transparent rounded`}
                type="text"
                value={tag}
                placeholder="Tag"
                onChange={(e) => setTag(e.target.value)}
              />

              {tags.length > 0 && (
                <div className="flex flex-wrap items-center space-x-2">
                  {tags.map((tag, i) => (
                    <span key={i} className="text-sm">
                      {tag}
                    </span>
                  ))}
                </div>
              )}
            </form>

            <div className="flex flex-col space-y-2">
              <label htmlFor="image">Image:</label>

              <input
                id="image"
                className={`w-full outline-none border ${
                  mode === "dark" ? "border-white/40" : "border-gray-300"
                } py-0.5 px-2 bg-transparent rounded`}
                type="file"
                accept="image/*"
                onChange={(e) => uploadFileHandler(e, setImageFile)}
              />
            </div>

            <button
              className={`${
                mode === "dark" ? "bg-[#373737]" : "bg-[#f5f5f5]"
              } flex items-center justify-center w-full py-1 rounded disabled:cursor-not-allowed`}
              onClick={uploadVideoHandler}
              disabled={
                loading ||
                !title.trim() ||
                !description.trim() ||
                !tags.length ||
                !imageFile ||
                !videoFile
              }
            >
              {loading ? <Spinner /> : <p>Upload</p>}
            </button>
          </div>
        </div>
      </div>
    </>
  );
};

export default UploadModal;
