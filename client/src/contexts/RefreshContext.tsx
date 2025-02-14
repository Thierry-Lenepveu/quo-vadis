import type React from "react";
import { createContext, useContext, useMemo, useState } from "react";

interface RefreshContextType {
  refresh: boolean | null;
  setRefresh: React.Dispatch<React.SetStateAction<boolean | null>>;
  newElement: boolean | null;
  setNewElement: React.Dispatch<React.SetStateAction<boolean | null>>;
}

const RefreshContext = createContext<RefreshContextType | null>(null);

export default function RefreshProvider({
  children,
}: { children: React.ReactNode }) {
  const [refresh, setRefresh] = useState<boolean | null>(null);
  const [newElement, setNewElement] = useState<boolean | null>(null);

  const memoRefresh = useMemo(
    () => ({
      refresh,
      setRefresh,
      newElement,
      setNewElement,
    }),
    [refresh, newElement],
  );

  return (
    <RefreshContext.Provider value={memoRefresh}>
      {children}
    </RefreshContext.Provider>
  );
}

export const useRefreshContext = () => {
  const context = useContext(RefreshContext);
  if (context === null) {
    throw new Error("useRefreshContext must be used within an RefreshProvider");
  }
  return context;
};
