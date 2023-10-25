import { create } from "zustand";

type SelectedItemsState = {
  selectedItems: Set<string>,
  getItems: () => string[],
  addItem: (uuid: string) => void;
  removeItem: (uuid: string) => void;
  isSelected: (uuid: string) => boolean;
  clear: () => void;
  count: () => number;
};

export const useSelectedItemsStore = create<SelectedItemsState>((set, get) => ({
  selectedItems: new Set<string>(),
  addItem: (uuid: string) => {
    set((state) => ({ selectedItems: new Set([...state.selectedItems, uuid]) }));
  },
  removeItem: (uuid: string) => {
    set((state) => ({
      selectedItems: new Set(Array.from(state.selectedItems).filter((item) => item !== uuid)),
    }));
  },
  clear: () => {
    set((state) => ({selectedItems: new Set<string>()}));
  },
  isSelected: (uuid: string) => {
    return get().selectedItems.has(uuid);
  },
  count: () => {
    return get().selectedItems.size;
  },
  getItems: () => {
    return Array.from(get().selectedItems);
  }
}));

