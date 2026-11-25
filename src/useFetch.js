import { useCallback, useEffect, useState } from "react";
import { api } from "./api.js";

// Loads data from the server. Pass null to skip. Returns { data, error, loading, reload }.
export function useFetch(path) {
  const [state, setState] = useState({ data: null, error: "", loading: !!path });
  const [tick, setTick] = useState(0);
  const reload = useCallback(() => setTick((t) => t + 1), []);

  useEffect(() => {
    if (!path) return setState({ data: null, error: "", loading: false });
    let live = true;
    setState((s) => ({ ...s, loading: true, error: "" }));
    api(path)
      .then((data) => live && setState({ data, error: "", loading: false }))
      .catch((e) => live && setState({ data: null, error: e.message, loading: false }));
    return () => { live = false; };
  }, [path, tick]);

  return { ...state, reload };
}
