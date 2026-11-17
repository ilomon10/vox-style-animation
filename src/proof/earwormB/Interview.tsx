import React from "react";
import { useCurrentFrame } from "remotion";
import { DecodeNameCard, ZoomWindow } from "../../earworm";
import { rand } from "../../lib/random";
import { voxEarworm } from "../../tokens/colors";
import { earwormType, typeStyle } from "../../tokens/type";
import { capTrim } from "../../type/shared";
import type { Events } from "./events";

/** 5a (f1224–1332): Fredara Hadley, silent and smiling in a rounded Zoom window on the flat #0C0C0C plate, the decode name card at the right.
 *  Footage = the reference's own webcam pixels (private proof only), cropped to the window. */
export const Fredara: React.FC<{ E: Events }> = ({ E }) => (
  <div style={{ position: "absolute", inset: 0, background: "#0C0C0C" }}>
    <ZoomWindow src="_private/earworm_B_fredara.mp4" x={178} y={158} width={854} height={770} radius={20} />
    <DecodeNameCard name="FREDARA HADLEY" title="Ethnomusicologist" affiliation="The Juilliard School" x={1146} y={511} delay={0} resolveAt={E.cardResolve - E.fredara} exitAt={E.cardExit - E.fredara} seed="fh" />
  </div>
);

/** 6 (f1481–1618): Angela Stribling, centred window, J-cut. The card is already complete, clipped by the right frame edge and decoding out (random dropout, gone by f1493). */
export const Angela: React.FC = () => {
  const f = useCurrentFrame();
  const name = "ANGELA STRIBLING";
  // reverse decode: letters drop out at random times; "T" and "I" of STRIBLING outlast the rest (still on screen at f1490), gone by f1493
  const gone = (i: number) => (i === 8 ? 11 : i === 10 ? 12 : 2 + rand(`ang${i}`) * 8);
  const x = (i: number) => 1340 + i * 58;
  return (
    <div style={{ position: "absolute", inset: 0, background: "#0C0C0C" }}>
      <ZoomWindow src="_private/earworm_B_angela.mp4" x={487} y={108} width={946} height={858} radius={20} />
      {Array.from(name).map((c, i) => (f < gone(i) && x(i) > 1440 && c !== " " ? (
        <div key={i} style={{ position: "absolute", left: x(i), top: 491, whiteSpace: "nowrap", ...capTrim, ...typeStyle({ ...earwormType.name, leading: 1 }) }}>{c}</div>
      ) : null))}
    </div>
  );
};
export { voxEarworm };
