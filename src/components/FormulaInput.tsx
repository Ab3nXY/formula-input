"use client";
import { useState, useRef, useEffect } from "react";
import { useFormulaStore } from "@/store/formulaStore";
import { useAutocomplete } from "@/hooks/useAutocomplete";

interface FormulaItem {
  name: string;
  value: number;
}

const FormulaInput: React.FC = () => {
  const [inputValue, setInputValue] = useState<string>("");
  const [showSuggestions, setShowSuggestions] = useState<boolean>(false);
  const inputRef = useRef<HTMLInputElement>(null);
  const containerRef = useRef<HTMLDivElement>(null);
  const { formula, setFormula, editingIndex, setEditingIndex } = useFormulaStore();
  const [editingValue, setEditingValue] = useState("");
  const activeInput = editingIndex !== null ? editingValue : inputValue;

  const { data: allSuggestions = [] } = useAutocomplete("");
  const { data: filteredSuggestions = [] } = useAutocomplete(activeInput);

  useEffect(() => {
    setShowSuggestions(activeInput.length > 0);
  }, [activeInput]);

  useEffect(() => {
    if (inputRef.current) {
      inputRef.current.focus();
    }
  }, [editingIndex]);

  const handleSuggestionClick = (suggestion: FormulaItem) => {
    if (editingIndex !== null) {
      const newFormula = [...formula];
      newFormula[editingIndex] = { name: suggestion.name, value: suggestion.value };
      setFormula(newFormula);
      setEditingIndex(null);
      setEditingValue("");
    } else {
      setFormula([...formula, { name: suggestion.name, value: suggestion.value }]);
    }
    setInputValue("");
    if (inputRef.current) {
      inputRef.current.focus();
    }
  };

  const handleKeyDown = (e: React.KeyboardEvent<HTMLInputElement>) => {
    if (["+", "-", "*", "/", "(", ")", "^"].includes(e.key)) {
      if (inputValue.trim() && !isNaN(Number(inputValue))) {
        setFormula([...formula, { name: inputValue, value: Number(inputValue) }, e.key]);
        setInputValue("");
      } else {
        setFormula([...formula, e.key]);
      }
      e.preventDefault();
      if (inputRef.current) {
        inputRef.current.focus();
      }
    } else if (e.key === "Enter") {
      if (inputValue.trim() && !isNaN(Number(inputValue))) {
        setFormula([...formula, { name: inputValue, value: Number(inputValue) }]);
        setInputValue("");
      }
      e.preventDefault();
      if (inputRef.current) {
        inputRef.current.focus();
      }
    } else if (e.key === "Backspace" && inputValue === "") {
      setFormula(formula.slice(0, -1));
    }
  };

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const value = e.target.value;
    setInputValue(value);
  }

  const calculateResult = () => {
    try {
      const expression = formula
        .map((item) => (typeof item === "string" ? item : item.value))
        .join("");
      return eval(expression);
    } catch {
      return "Error";
    }
  };

  const handleItemClick = (index: number, item: string | FormulaItem) => {
    if (typeof item !== "string") {
      setEditingIndex(index);
      setEditingValue(item.name);
      setShowSuggestions(true);
    }
  };

  return (
    <div className="max-w-lg mx-auto p-4 bg-gray-100 rounded-lg">
      <div className="flex items-center gap-4 mb-4">
        <div className="relative flex-1" ref={containerRef}>
          <div className="flex items-center flex-wrap gap-2 bg-white rounded p-2 shadow border">
            <span className="text-gray-500">=</span>
            {formula.map((item, index) =>
              editingIndex === index ? (
                <div key={index} className="relative inline-block">
                  <input
                    value={editingValue}
                    onChange={(e) => setEditingValue(e.target.value)}
                    onKeyDown={(e) => {
                      if (e.key === "Enter") {
                        const newToken = isNaN(Number(editingValue))
                          ? editingValue
                          : { name: editingValue, value: Number(editingValue) };
                        const newFormula = [...formula];
                        newFormula[index] = newToken;
                        setFormula(newFormula);
                        setEditingIndex(null);
                        if (inputRef.current) {
                          inputRef.current.focus();
                        }
                      } else if (e.key === "Backspace" && editingValue === "") {
                        const newFormula = formula.filter((_, i) => i !== index);
                        setFormula(newFormula);
                        setEditingIndex(null);
                        if (inputRef.current) {
                          inputRef.current.focus();
                        }
                      }
                    }}
                    className="font-mono bg-blue-100 px-2 rounded outline-none"
                  />
                  {showSuggestions && (
                    <ul className="absolute left-0 right-0 mt-1 bg-white border rounded shadow-lg z-10">
                      {allSuggestions.map((sug) => (
                        <li
                          key={sug.name + sug.value}
                          className="px-4 py-2 hover:bg-blue-50 cursor-pointer font-mono text-sm"
                          onClick={() => {
                            const newFormula = [...formula];
                            newFormula[index] = { name: sug.name, value: sug.value };
                            setFormula(newFormula);
                            setEditingIndex(null);
                            if (inputRef.current) {
                              inputRef.current.focus();
                            }
                          }}
                        >
                          {sug.name} ({sug.value})
                        </li>
                      ))}
                    </ul>
                  )}
                </div>
              ) : typeof item === "string" ? (
                <span
                  key={index}
                  className="font-mono text-blue-600 cursor-pointer"
                  onClick={() => handleItemClick(index, item)}
                >
                  {item}
                </span>
              ) : (
                <span
                  key={index}
                  className="font-mono bg-blue-100 px-2 rounded cursor-pointer"
                  onClick={() => handleItemClick(index, item)}
                >
                  {item.name}
                </span>
              )
            )}

            <input
              ref={inputRef}
              type="text"
              value={inputValue}
              onChange={handleChange}
              onKeyDown={handleKeyDown}
              className="flex-1 min-w-[100px] outline-none font-mono"
              placeholder="Type here..."
              autoComplete="off"
            />
          </div>
          {showSuggestions && (
            <ul className="absolute left-0 right-0 mt-1 bg-white border rounded shadow-lg z-10">
              {filteredSuggestions.map((suggestion) => (
                <li
                  key={suggestion.name + suggestion.value}
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