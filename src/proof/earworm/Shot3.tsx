import React from "react";
import { Img, staticFile, useCurrentFrame } from "remotion";
import type { Events } from "./events";
import { bez, drawing12 } from "./shared";

/** the band photo: stand-in = CC0 factory-line print, B&W; pull-back ×0.51 over 27 f on 12 dps drawings, DEAD hold, pull-out-through with the print's white border */
export const Shot3: React.FC<{ E: Events }> = ({ E }) => {
  const f = useCurrentFrame();
  const gf = f + E.cut3;
  // 12 dps drawings (2,2,…,3): the photo move is on 12 dps (earworm-A §7)
  const i = drawing12(gf) - drawing12(E.cut3);
  const p = Math.min(1, i / 12);
  const FROM = 1.96;
  // pull-reveal on log(scale): (0.3, 0, 0.1, 1)
  let s = Math.exp(Math.log(FROM) * (1 - bez(0.3, 0, 0.1, 1)(p)));
  if (gf >= E.pullOut) {
    const q = drawing12(gf) - drawing12(E.pullOut);
    s = [0.998, 0.998 * 0.99, 0.998 * 0.99 * 0.959][Math.min(2, q)];
  }
  return (
    <div style={{ position: "absolute", inset: 0, background: "#050505", overflow: "hidden" }}>
      <div style={{ position: "absolute", left: -29, top: -16, width: 1978, height: 1112, background: "#E4E3DF", transform: `scale(${s})`, transformOrigin: "32% 78%" }}>
        {/* the print is 3 % larger than the screen; its border shows only on the pull-out */}
        <div style={{ position: "absolute", left: 38, top: 22, right: 38, bottom: 22, overflow: "hidden" }}>
          <Img src={staticFile("assets/cc0/photos/ford-highland-park-magneto-line-1913.jpg")} style={{ width: "100%", height: "100%", objectFit: "cover", objectPosition: "30% 40%", filter: "grayscale(1) contrast(1.12)" }} />
        </div>
      </div>
    </div>
  );
};
