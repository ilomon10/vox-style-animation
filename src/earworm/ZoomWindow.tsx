import React from "react";
import { OffthreadVideo, staticFile } from "remotion";

export type ZoomWindowProps = {
  /** path relative to public/ of the cropped webcam clip (live footage runs at its own native rate: never posterised) */
  src: string;
  /** window box, design px (Fredara: 860×775 at x175, y155; r≈20, earworm-B §5) */
  x: number;
  y: number;
  width: number;
  height: number;
  radius?: number;
  /** start of the clip (frames at the composition fps) */
  startFrom?: number;
  /** colour footage keeps its warm grade: no filter by default */
  filter?: string;
};

/** Rounded Zoom-call window on the interview plate: no border, no shadow, native-rate footage (earworm-B §3 "Interview window", §9 `ZoomWindow`). */
export const ZoomWindow: React.FC<ZoomWindowProps> = ({ src, x, y, width, height, radius = 20, startFrom = 0, filter }) => (
  <div style={{ position: "absolute", left: x, top: y, width, height, borderRadius: radius, overflow: "hidden", background: "#0C0C0C" }}>
    <OffthreadVideo src={staticFile(src)} startFrom={startFrom} muted style={{ width, height, objectFit: "cover", filter }} />
  </div>
);
