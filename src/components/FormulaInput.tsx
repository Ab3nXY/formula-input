"use client";
import { useState, useRef, useEffect } from "react";
import { useFormulaStore } from "@/store/formulaStore";
import { useAutocomplete } from "@/hooks/useAutocomplete";

interface FormulaItem {
  label: string;
  value: number;
}

const FormulaInput: React.FC = () => {
  const { formula, setFormula } = useFormulaStore();
  const [inputValue, setInputValue] = useState<string>("");
  const [showSuggestions, setShowSuggestions] = useState<boolean>(false);
  const inputRef = useRef<HTMLInputElement>(null);
  const containerRef = useRef<HTMLDivElement>(null);

  const { data: suggestions = [] } = useAutocomplete(inputValue);

  useEffect(() => {
    setShowSuggestions(inputValue.length > 0);
  }, [inputValue]);

  const handleSuggestionClick = (suggestion: FormulaItem) => {
    setFormula([...formula, { label: suggestion.name, value: suggestion.value }]);
    setInputValue("");
  };

  const handleKeyDown = (e: React.KeyboardEvent<HTMLInputElement>) => {
    if (e.key === "Enter") {
      if (inputValue.trim() && !isNaN(Number(inputValue))) {
        setFormula([...formula, { label: inputValue, value: Number(inputValue) }]);
        setInputValue("");
      }
      e.preventDefault();
    } else if (["+", "-", "*", "/", "(", ")", "^"].includes(e.key)) {
      setFormula([...formula, e.key]);
      e.preventDefault();
    } else if (e.key === "Backspace" && inputValue === "") {
      setFormula(formula.slice(0, -1));
    }
  };

  const calculateResult = () => {
    try {
      const expression = formula
        .map(item => (typeof item === "string" ? item : item.value))
        .join("");
      return eval(expression);
    } catch (e) {
      return "Error";
    }
  };

  return (
    <div className="max-w-lg mx-auto p-4 bg-gray-100 rounded-lg">
      <div className="flex items-center gap-4 mb-4">
        <div className="relative flex-1" ref={containerRef}>
          <div className="flex items-center flex-wrap gap-2 bg-white rounded p-2 shadow border">
            <span className="text-gray-500">=</span>
            {formula.map((item, index) =>
              typeof item === "string" ? (
                <span key={index} className="font-mono text-blue-600">
                  {item}
                </span>
              ) : (
                <span
                  key={index}
                  className="font-mono bg-blue-100 px-2 rounded cursor-pointer"
                  onClick={() => setFormula(formula.filter((_, i) => i !== index))}
                >
                  {item.label}
                </span>
              )
            )}
            <input
              ref={inputRef}
              type="text"
              value={inputValue}
              onChange={(e) => setInputValue(e.target.value)}
              onKeyDown={handleKeyDown}
              className="flex-1 min-w-[100px] outline-none font-mono"
              placeholder="Type here..."
              autoComplete="off"
            />
          </div>
          {showSuggestions && suggestions.length > 0 && (
            <ul className="absolute left-0 right-0 mt-1 bg-white border rounded shadow-lg z-10">
              {suggestions.map((suggestion) => (
                <li
                  key={suggestion.id}
                  className="px-4 py-2 hover:bg-blue-50 cursor-pointer font-mono text-sm"
                  onClick={() => handleSuggestionClick(suggestion)}
                >
                  {suggestion.name} ({suggestion.value})
                </li>
              ))}
            </ul>
          )}
        </div>
        <div className="bg-white p-2 rounded shadow font-mono">
          {formula.length > 0 ? calculateResult() : "0"}
        </div>
      </div>
      <div className="text-gray-500 text-sm">
        Allowed operators: +, -, *, /, (, ), ^, numbers
      </div>
    </div>
  );
};

export default FormulaInput;