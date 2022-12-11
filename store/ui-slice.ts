import { createSlice, PayloadAction } from "@reduxjs/toolkit";
import { RoofState } from "./store";

const UISlice = createSlice({
  name: "ui",
  initialState: {
    openSidebar: false,
    openModal: false,
    mode: "dark",
    select: "home",
    searchTerm: "",
  },
  reducers: {
    setOpenSidebar(state, action: PayloadAction<boolean>) {
      state.openSidebar = action.payload;
    },
    setOpenModal(state, action: PayloadAction<boolean>) {
      state.openModal = action.payload;
    },
    setMode(state, action: PayloadAction<string>) {
      state.mode = action.payload;
    },
    setSelect(state, action: PayloadAction<string>) {
      state.select = action.payload;
    },
    setSearchTerm(state, action: PayloadAction<string>) {
      state.searchTerm = action.payload;
    },
  },
});

export const sidebarSelector = (state: RoofState) => state.ui.openSidebar;

export const modalSelector = (state: RoofState) => state.ui.openModal;

export const modeSelector = (state: RoofState) => state.ui.mode;

export const selectItemSelector = (state: RoofState) => state.ui.select;

export const searchTermSelector = (state: RoofState) => state.ui.searchTerm;

export default UISlice;
