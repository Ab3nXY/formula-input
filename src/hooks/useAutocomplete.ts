"use client";
import { useQuery } from "@tanstack/react-query";

const fetchSuggestions = async (query: string): Promise<{ name: string; value: number }[]> => {
  if (!query?.trim()) return [];

  const response = await fetch(
    `https://652f91320b8d8ddac0b2b62b.mockapi.io/autocomplete?search=${query}`
  );
  if (!response.ok) throw new Error("Failed to fetch suggestions");

  const data = await response.json();

  return Array.isArray(data)
    ? data.map((item: { name?: string; value?: number }) => ({
        name: item.name || "",
        value: item.value || 0,
      }))
    : [];
};

export const useAutocomplete = (query: string) => {
  return useQuery({
    queryKey: ["autocomplete", query],
    queryFn: () => fetchSuggestions(query),
    enabled: Boolean(query),
    staleTime: 60 * 1000,
    retry: false,
  });
};