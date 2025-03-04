"use client";

import { create } from "zustand";

type FormulaItem = {
    name: string;
    value: number;
  };

type FormulaState = {
  formula: (string | FormulaItem)[];
  suggestions: string[];
  editingIndex: number | null;
  setFormula: (formula: (string | FormulaItem)[]) => void;
  setSuggestions: (suggestions: string[]) => void;
  setEditingIndex: (index: number | null) => void;
};

export const useFormulaStore = create<FormulaState>((set) => ({
  formula: [],
  suggestions: [],
  editingIndex: null,
  setFormula: (formula) => set({ formula }),
  setSuggestions: (suggestions) => set({ suggestions }),
  setEditingIndex: (index) => set({ editingIndex: index }),
}));
