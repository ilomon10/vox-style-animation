import React from "react";
import { getStaticFiles } from "@remotion/studio";
import { Composition } from "remotion";
import { AnnotationGallery } from "./gallery/AnnotationGallery";
import { StoryboardVideo, calculateStoryboardMetadata, defaultStoryboardProps } from "./studio/StoryboardVideo";
import { AUDIO_SYNC_GALLERY_DURATION, AudioSyncGallery } from "./gallery/AudioSyncGallery";
import { CollageGallery } from "./gallery/CollageGallery";
import { EarwormFxGallery, EarwormFxGallery_DURATION } from "./gallery/EarwormFxGallery";
import { EarwormGallery, EarwormGallery_DURATION } from "./gallery/EarwormGallery";
import { EffectsGallery } from "./gallery/EffectsGallery";
import { MotionGallery } from "./gallery/MotionGallery";
import { TypeGallery } from "./gallery/TypeGallery";
import { PROOF_DARKCOLLAGE_DURATION, ProofDarkCollage } from "./proof/ProofDarkCollage";
import { PROOF_EARWORM_DURATION, ProofEarworm } from "./proof/ProofEarworm";
import { PROOF_EARWORM_B_DURATION, ProofEarwormB } from "./proof/ProofEarwormB";
import { PROOF_EARWORM_C_DURATION, ProofEarwormC } from "./proof/ProofEarwormC";
import { PROOF_EARWORM_D_DURATION, ProofEarwormD } from "./proof/ProofEarwormD";
import { PROOF_EDITORIAL_DURATION, ProofEditorial } from "./proof/ProofEditorial";
import { PROOF_PAPERDESK_DURATION, ProofPaperDesk } from "./proof/ProofPaperDesk";
import { PROOF_VOXEXPLAINER_DURATION, ProofVoxExplainer } from "./proof/ProofVoxExplainer";

// Everything is authored at 1080p design size. Render 4K with --scale=2 (DesignSpace keeps it sharp).
const HD = { width: 1920, height: 1080 } as const;

/**
 * The four Earworm sync proofs play copyrighted reference audio and clips from public/_private/ (git-ignored, never
 * published). They register only on a machine that has those files, so a fresh clone lists no composition it cannot render.
 */
const HAS_PRIVATE_REFERENCE = getStaticFiles().some((f) => f.name.startsWith("_private/"));

export const RemotionRoot: React.FC = () => (
  <>
    {/* idea → video: renders any public/projects/<slug>/storyboard.json — pass --props='{"project":"<slug>"}' */}
    <Composition id="StoryboardVideo" component={StoryboardVideo} {...HD} fps={25} durationInFrames={250}
      defaultProps={defaultStoryboardProps} calculateMetadata={calculateStoryboardMetadata} />
    {/* proof shots — one per style, recreating reference moments */}
    <Composition id="ProofPaperDesk" component={ProofPaperDesk} {...HD} fps={30} durationInFrames={PROOF_PAPERDESK_DURATION} />
    <Composition id="ProofDarkCollage" component={ProofDarkCollage} {...HD} fps={24} durationInFrames={PROOF_DARKCOLLAGE_DURATION} />
    <Composition id="ProofVoxExplainer" component={ProofVoxExplainer} {...HD} fps={24} durationInFrames={PROOF_VOXEXPLAINER_DURATION} />
    {/* PRIVATE: plays copyrighted reference audio from public/_private for a sync comparison — never publish */}
    {HAS_PRIVATE_REFERENCE && (
      <>
        <Composition id="ProofEarworm" component={ProofEarworm} {...HD} fps={25} durationInFrames={PROOF_EARWORM_DURATION} />
        <Composition id="ProofEarwormB" component={ProofEarwormB} {...HD} fps={25} durationInFrames={PROOF_EARWORM_B_DURATION} />
        <Composition id="ProofEarwormC" component={ProofEarwormC} {...HD} fps={25} durationInFrames={PROOF_EARWORM_C_DURATION} />
        <Composition id="ProofEarwormD" component={ProofEarwormD} {...HD} fps={25} durationInFrames={PROOF_EARWORM_D_DURATION} />
      </>
    )}
    <Composition id="ProofEditorial" component={ProofEditorial} {...HD} fps={24} durationInFrames={PROOF_EDITORIAL_DURATION} />
    {/* component galleries */}
    <Composition id="EffectsGallery" component={EffectsGallery} {...HD} fps={24} durationInFrames={480} />
    <Composition id="CollageGallery" component={CollageGallery} {...HD} fps={24} durationInFrames={480} />
    <Composition id="MotionGallery" component={MotionGallery} {...HD} fps={24} durationInFrames={720} />
    <Composition id="TypeGallery" component={TypeGallery} {...HD} fps={24} durationInFrames={480} />
    <Composition id="AnnotationGallery" component={AnnotationGallery} {...HD} fps={24} durationInFrames={480} />
    <Composition id="EarwormGallery" component={EarwormGallery} {...HD} fps={25} durationInFrames={EarwormGallery_DURATION} />
    <Composition id="EarwormFxGallery" component={EarwormFxGallery} {...HD} fps={25} durationInFrames={EarwormFxGallery_DURATION} />
    <Composition id="AudioSyncGallery" component={AudioSyncGallery} {...HD} fps={25} durationInFrames={AUDIO_SYNC_GALLERY_DURATION} />
  </>
);
