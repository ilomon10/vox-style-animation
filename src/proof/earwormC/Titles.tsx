import React from "react";
import { Img, staticFile, useCurrentFrame } from "remotion";
import { BlackCollageGround, GiantWord, TextFillSilhouette, TornPhoto } from "../../earworm";
import { earwormType } from "../../tokens/type";
import { useDrawingFrame } from "../../lib/time";
import { DesignSpace } from "../../lib/stage";
import { Newsprint, Strip } from "../earworm/art";
import { BW, OUT } from "./art";

/** pre-cut contraction (earworm-C §7/§8 C-WTC): ×.985 on the start frame, ×.95 two frames later, ×.92 two more, then held until the cut */
const Contract: React.FC<{ at: number; children: React.ReactNode }> = ({ at, children }) => {
  const f = useCurrentFrame();
  const r = f - at;
  const s = r < 0 ? 1 : r < 2 ? 0.985 : r < 4 ? 0.95 : 0.92;
  return <div style={{ position: "absolute", inset: 0, transformOrigin: "50% 50%", transform: `scale(${s})` }}>{children}</div>;
};

const MAN = "assets/cutouts/victorian-man.png";

/** S9 SPEECHES: white paper, 8 letters converge horizontally (19 f), two activists + a glued book page in front of PEE|CHE */
export const Speeches: React.FC<{ contractAt: number }> = ({ contractAt }) => (
  <>
    <BlackCollageGround variant="whitePaper" seed="s9" />
    <DesignSpace><Contract at={contractAt}>
      <GiantWord text="SPEECHES" ground="white" convergeFrames={26} cx={950} cy={541} tracking={0.4} seed="speeches">
        <div style={{ position: "absolute", left: 660, top: 140, width: 560, height: 740 }}>
          <div style={{ position: "absolute", left: 20, top: 90, width: 400, height: 560, transform: "rotate(-3deg)", filter: OUT }}>
            <Newsprint w={400} h={560} seed="pg" fs={14} />
          </div>
          <Img src={staticFile(MAN)} style={{ position: "absolute", left: 30, top: -20, width: 330, height: 790, objectFit: "contain", filter: `${BW} ${OUT}` }} />
          <Img src={staticFile(MAN)} style={{ position: "absolute", left: 260, top: 80, width: 290, height: 700, objectFit: "contain", transform: "scaleX(-1)", filter: `${BW} ${OUT}` }} />
        </div>
        <div style={{ position: "absolute", left: 640, top: 920, width: 760, height: 40 }}><Strip w={760} h={40} color="#D7D7D4" seed="s9a" rough={8} /></div>
      </GiantWord>
    </Contract></DesignSpace>
  </>
);

/** S10 POETRY: black, letters converge vertically (3 f held first, then 13 f), poet with handwriting-filled shirt and hat */
export const Poetry: React.FC<{ contractAt: number; pop: number }> = ({ contractAt, pop }) => {
  const f = useCurrentFrame();
  const popped = f >= pop;
  return (
    <>
      <BlackCollageGround seed="s10" />
      <DesignSpace><Contract at={contractAt}>
        <GiantWord text="POETRY" ground="black" delay={pop} convergeFrames={20} scatter={{ axis: "y", amp: 240 }} curve={[0.4, 0.8, 0.2, 0.8]} cx={950} cy={541} tracking={0.3} role={{ ...earwormType.giantWord, cap: 224 }} seed="poetry">
          {/* the poet pops (brighter, rises) on the first letter move, f1777 */}
          <div style={{ position: "absolute", left: 740, top: 20, width: 440, height: 1040, transform: `translateY(${popped ? 0 : 36}px)`, filter: popped ? undefined : "brightness(.55)" }}>
            <TextFillSilhouette src={MAN} width={440} height={1040} fill="handwriting" outline={10} seed="poet" paper="#EDEDEA" ink="#151515" />
          </div>
          <div style={{ position: "absolute", left: 640, top: 905, width: 640, height: 34 }}><Strip w={640} h={34} color="#BEBEBB" seed="s10a" rough={8} /></div>
        </GiantWord>
      </Contract></DesignSpace>
    </>
  );
};

/** S11 NEWS SHOWS: white, slow converge 25 f, curl flattens in 8 f, three people at a press table, torn newsprint strip */
export const NewsShows: React.FC = () => {
  const f = useDrawingFrame();
  const curl = Math.max(0, 1 - f / 8);
  return (
    <>
      <BlackCollageGround variant="whitePaper" seed="s11" />
      <DesignSpace><GiantWord text="NEWS SHOWS" ground="white" convergeFrames={43} curve={[0.3, 0.8, 0.4, 0.9]} scatter={{ axis: "x", amp: 330 }} cx={950} cy={510} tracking={0.32} role={{ ...earwormType.giantWord, cap: 177 }} seed="news">
        <div style={{ position: "absolute", left: 600, top: 70, width: 720, height: 560 }}>
          <TornPhoto src="assets/cc0/photos/ford-highland-park-magneto-line-1913.jpg" x={0} y={0} width={720} height={500} border={10} objectPosition="45% 50%" seed="news" />
          {/* page-curl at the lower-left corner flattening over 8 f */}
          <div style={{ position: "absolute", left: -6, top: 500 - 150 * curl, width: 150 * curl + 12, height: 150 * curl + 12, background: "linear-gradient(45deg,#D4D4D1 0 50%,#F0F0EE 50%)", clipPath: "polygon(0 0,100% 100%,0 100%)", opacity: curl ? 1 : 0 }} />
        </div>
        <div style={{ position: "absolute", left: 600, top: 640, width: 720, height: 230 }}><Newsprint w={720} h={230} seed="nstrip" fs={19} /></div>
      </GiantWord></DesignSpace>
    </>
  );
};
