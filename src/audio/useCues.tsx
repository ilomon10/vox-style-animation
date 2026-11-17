import React, { createContext, useContext, useEffect, useMemo, useState } from "react";
import { continueRender, delayRender, staticFile, useVideoConfig } from "remotion";
import { createCueIndex, type CueIndex, type Cues } from "./cues";

const CueContext = createContext<CueIndex | null>(null);

/** Make a cue index the default for useBeatPulse / useAudioLevel / LyricLine / OnCue below this point. */
export const CuesProvider: React.FC<{ cues: CueIndex; children: React.ReactNode }> = ({ cues, children }) => (
  <CueContext.Provider value={cues}>{children}</CueContext.Provider>
);

export const useCueContext = (): CueIndex | null => useContext(CueContext);

/** Resolve the cue index to use: explicit arg, else provider, else throw. */
export const useResolvedCues = (explicit?: CueIndex): CueIndex => {
  const ctx = useContext(CueContext);
  const c = explicit ?? ctx;
  if (!c) throw new Error("audio: no cues — pass `cues` or wrap in <CuesProvider>");
  return c;
};

/**
 * Load `public/audio/<name>.cues.json` (delayRender until ready) or accept the object directly.
 * Returns the lookup index at the composition fps.
 */
export const useCues = (source: string | Cues): CueIndex => {
  const { fps } = useVideoConfig();
  const [loaded, setLoaded] = useState<Cues | null>(typeof source === "string" ? null : source);
  const [handle] = useState(() => (typeof source === "string" ? delayRender(`cues ${source}`) : null));
  useEffect(() => {
    if (typeof source !== "string") {
      setLoaded(source);
      return;
    }
    let live = true;
    fetch(staticFile(`audio/${source}.cues.json`))
      .then((r) => r.json())
      .then((j: Cues) => {
        if (!live) return;
        setLoaded(j);
        if (handle !== null) continueRender(handle);
      })
      .catch((e) => {
        console.error(e);
        if (handle !== null) continueRender(handle);
      });
    return () => {
      live = false;
    };
  }, [source, handle]);
  return useMemo(() => createCueIndex(loaded ?? EMPTY, fps), [loaded, fps]);
};

const EMPTY: Cues = {
  version: 1, name: "", fps: 25, duration_s: 0, duration_frames: 0, words: [], phrases: [], pauses: [], pause_ms: 250,
  tempo_bpm: 0, beats: [], downbeats: [], onsets: [], envelope: { total: [], low: [], mid: [], high: [] }, speech: [],
};
