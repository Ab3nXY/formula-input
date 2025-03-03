"use client";

import { create } from "zustand";

type Tag = {
  id: string;
  label: string;
};

type FormulaState = {
  formula: (string | Tag)[];
  suggestions: string[];
  editingTag: string | null;
  setFormula: (formula: (string | Tag)[]) => void;
  setSuggestions: (suggestions: string[]) => void;
  setEditingTag: (tagId: string | null) => void;
};

export const useFormulaStore = create<FormulaState>((set) => ({
  formula: [],
  suggestions: [],
  editingTag: null,
  setFormula: (formula) => set({ formula }),
  setSuggestions: (suggestions) => set({ suggestions }),
  setEditingTag: (tagId) => set({ editingTag: tagId }),
}));
