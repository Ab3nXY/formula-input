"use client";

import FormulaInput from "@/components/FormulaInput";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { useState } from "react";


export default function Home() {
  const [queryClient] = useState(() => new QueryClient());
  return (
    <QueryClientProvider client={queryClient}>
      <div className="flex justify-center items-center h-screen">
        <FormulaInput />
      </div>
    </QueryClientProvider>
  );
}
