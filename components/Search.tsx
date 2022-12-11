import React from "react";
import { AiOutlineSearch } from "react-icons/ai";
import { useDispatch, useSelector } from "react-redux";
import { modeSelector, searchTermSelector } from "../store/ui-slice";
import { setSearchTerm } from "../store/store";
import { useRouter } from "next/router";

const Search = () => {
  const router = useRouter();

  const dispatch = useDispatch();

  const mode = useSelector(modeSelector);

  const searchTerm = useSelector(searchTermSelector);

  const searchHandler = (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();

    router.push(`/results?search_query=${searchTerm.toLowerCase()}`);
  };

  return (
    <form
      onSubmit={searchHandler}
      className={`w-full flex items-center bg-transparent border ${
        mode === "dark" ? "border-[#333333]" : "border-gray-200"
      } pl-4 rounded-full overflow-hidden`}
    >
      <input
        className="bg-transparent outline-none flex-1"
        value={searchTerm}
        type="text"
        placeholder="Search"
        onChange={(e) => dispatch(setSearchTerm(e.target.value))}
      />

      <button
        type="submit"
        className={`${
          mode === "dark"
            ? "bg-[#333333]"
            : "bg-gray-50 border-l border-gray-200"
        } py-1 px-4 flex items-center justify-center`}
      >
        <AiOutlineSearch size={25} />
      </button>
    </form>
  );
};

export default Search;
