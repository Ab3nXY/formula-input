"use client";

import { create } from "zustand";

type FormulaItem = {
    label: string;
    value: number;
  };

type FormulaState = {
  formula: (string | FormulaItem)[];
  suggestions: string[];
  editingFormulaItem: string | null;
  setFormula: (formula: (string | FormulaItem)[]) => void;
  setSuggestions: (suggestions: string[]) => void;
  setEditingFormulaItem: (FormulaItemId: string | null) => void;
};

export const useFormulaStore = create<FormulaState>((set) => ({
  formula: [],
  suggestions: [],
  editingFormulaItem: null,
  setFormula: (formula) => set({ formula }),
  setSuggestions: (suggestions) => set({ suggestions }),
  setEditingFormulaItem: (FormulaItemId) => set({ editingFormulaItem: FormulaItemId }),
}));
