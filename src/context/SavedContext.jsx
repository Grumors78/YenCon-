import { createContext, useContext, useEffect, useState } from "react";

const SavedContext = createContext(null);
const KEY = "yencon-saved";

function load() {
  try { return JSON.parse(localStorage.getItem(KEY)) || []; } catch { return []; }
}

export function SavedProvider({ children }) {
  const [ids, setIds] = useState(load);
  useEffect(() => {
    try { localStorage.setItem(KEY, JSON.stringify(ids)); } catch { /* storage unavailable */ }
  }, [ids]);
  const toggle = (id) => setIds((cur) => (cur.includes(id) ? cur.filter((x) => x !== id) : [...cur, id]));
  return <SavedContext.Provider value={{ ids, toggle }}>{children}</SavedContext.Provider>;
}

export const useSaved = () => useContext(SavedContext);
