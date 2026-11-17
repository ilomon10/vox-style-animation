import { Config } from "@remotion/cli/config";

// Stills/frames as PNG keep grain and fine paper texture intact before the final encode.
Config.setVideoImageFormat("png");
Config.setPixelFormat("yuv420p");
Config.setCodec("h264");
// Grain is high-frequency detail: a low CRF keeps it from turning into blocky mush.
Config.setCrf(14);
// Parallel frames. tools/remotion-locked.sh exports VOX_CONCURRENCY from tools/local.env (written by tools/setup.sh from
// this machine's RAM and cores); without it stay at 2, which fits a machine with 8 GB free. A --concurrency flag wins.
const concurrency = Number(process.env.VOX_CONCURRENCY);
Config.setConcurrency(Number.isInteger(concurrency) && concurrency > 0 ? concurrency : 2);
