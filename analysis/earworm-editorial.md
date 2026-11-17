# Vox "Earworm — Quiet Storm": how an idea becomes a video (editorial analysis)

> Analyst: editorial pass (script, structure, claim → picture → sound). Video `earworm`: 153.72 s, 25 fps, 3,843 frames.
>
> **Evidence used**
> - Segment reports `earworm-{A,B,C,D}.md`: shot logs, sync tables and sound design, frame-accurate.
> - `earworm-av-quant.md` and `audio/earworm_sync.json`: refined word onsets (median error 0.5 f), speakers, 27 music boundaries and a per-frame class string (`n` narration, `N` narration + music, `a` other voice, `m` music only, `.` silence).
> - `audio/earworm_words.json`, `audio/earworm_phrases.json`, the keyframe sheets `sheets/earworm/` and native stills.
>
> **My own measurements** (scripts, montages and data in `analysis/stills/editorial/`)
> - Per-second mid/side levels of `audio/earworm_full_stereo48k.wav` (`ms_per_s.csv`).
> - Per-part statistics, claim cross-tabs, type coverage, sentence statistics and shot economy (`scripts/*.py`).
> - Identity check of the two interviewees from the name cards (`interviewees.png`).
>
> **Conventions**
> - t = seconds from the first frame; f = global frame (t × 25).
> - Word times are the refined onsets, or the analysts' hand measurements where they differ.
> - In quoted narration, *italic* marks the word that a picture event lands on: a cut, a pop, a push stop or a title completion.
> - % = share of the 153.72 s runtime.

## 0. Corrected transcript and speakers

Whisper (`earworm_transcript.md`) needs these corrections before the script can be read:

| Whisper | Correct | Evidence |
|---|---|---|
| "That's for Dara Hadley." | "That's **Fredara** Hadley." | name card f1224–1332 (`interviewees.png`); B §1 |
| "Melvin Lindsay Show that night…" | "Melvin **Lindsey's show** that night…" | Washington Post clipping "Airing the Moods of Melvin Lindsey" f2382; MELVIN LINDSEY label f2501 |
| "…popularity, a smooth R&B ballads" | "…popularity **of** smooth R&B ballads" (probable) | grammar; the "a" sits 0.6 s after "popularity" |
| "and that came cold." | archival DJ back-announce "…and **Nat King Cole**" | band-limited radio voice (Q speakers file); the parallel "…Sarah Vaughan" back-announce. Analyst D read it as the narrator; the spectral evidence favours the DJ |
| "Thanks, Sarah Vaughan." | archival DJ back-announce ending "…Sarah Vaughan" (first word uncertain) | C §13, Q |
| "Did you want to hear something?" | the caller says "…to **[h]ear**…" | typeset "TO EAR" (D §4) |
| D's "interviewee 1 / 2" | interviewee 1 = **Angela Stribling** (card: "Radio and TV pe[rsonality] / Washington, DC"); interviewee 2 = **Fredara Hadley** | same faces and rooms as f1481 / f1250 (`interviewees.png`) |

**Speakers**

| Speaker | Items | Words | Speech time | Share |
|---|---|---|---|---|
| Narrator (Estelle Caswell) | 18 sentences | 235 (241 whisper tokens) | 69.4 s articulated; 80.9 s of sentence spans | 45 % articulated; 53 % spans |
| Experts on webcam (Fredara Hadley ×2, Angela Stribling ×2) | 4 bites | 51 | 21.5 s | 14 % |
| Archival speech: George Clinton on the record, 2 DJ back-announces, a phone caller and the DJ | 4 items | 37 | 9.0 s | 6 % |
| Sung vocals with words | 2 | 9 | — | — |

The sung vocals with words are "Right on, chocolate city" and "Don't stop ever loving me". Sarah Vaughan, Nat King Cole and Anita Baker are also heard singing; those vocals are counted as music.

## 1. (a) Narrative arc

The parts tile the whole runtime (sum = 3,843 f). The function names follow the brief.

| # | Part (function) | t (s) | f | % | What happens | Function |
|---|---|---|---|---|---|---|
| P1 | **Cold open = place-and-time setting** | 0.00–10.36 | 0–259 | 6.8 | N1–N2: year → city → campus → station, 4 nested locations in 9.7 s. Picture: digits → collage → map → station label | Orient before anything else. Answers *when* and *where*, and introduces the accent and type system |
| P2 | **Hook** (implicit question + first source) | 10.40–24.12 | 260–603 | 9.0 | N3: "if you want to really understand Washington, DC in 1976, you have to listen to this" → a record flies in → the song plays solo for 7.6 s, carrying George Clinton's 5.9 s spoken intro as karaoke captions | A second-person promise. Screen and soundtrack go to a primary source at 15.6 s (10 % in) |
| P3 | **Context 1**: the city and its anthem | 24.16–40.48 | 604–1012 | 10.6 | N4–N6 ("This is Chocolate City…", "this album explains the reason why", "Washington DC was a chocolate city") + the vocal hook + a 2.9 s music-only photo slam | Names the source. States the social fact. Pays off the first setup 0.8 s after it is made |
| P4 | **Expert voice 1** + ID | 40.52–53.96 | 1013–1349 | 8.8 | Fredara Hadley is heard for 8.0 s before she is seen. The narrator then names her over a silent shot of her. Chapter dip to black and silence | Authority interprets the source. The narrator vouches for her *after* we have heard her |
| P5 | **Context 2**: Black radio and WHUR's format | 54.00–73.72 | 1350–1843 | 12.9 | N9 (the hub was Black Radio), Angela Stribling (witness), N10 (WHUR played jazz, speeches, poetry and news: 4 word cards) | Establishes the institution and the status quo before the change |
| P6 | **Turn** | 73.76–77.44 | 1844–1936 | 2.4 | N11 "Something changed one summer night in 1976." over a *held* card → fade to black → 6 f of near-silence | Opens the main narrative question at 48 % of the runtime and resets the energy |
| P7 | **Context 3**: the sound of the mid-70s | 77.48–95.24 | 1937–2381 | 11.6 | "The drop": picture and new music start on the same frame. N12–N13 over an 18 s multiplane crane through instruments | Musical preconditions. The montage music *is* the sound being described |
| P8 | **Protagonist + event** | 95.28–105.32 | 2382–2634 | 6.6 | N14: Melvin Lindsey's show that night (newspaper clipping → portrait collage with an "A QUIET STORM" LP) | Answers the turn's question 18.8 s after it was asked |
| P9 | **Demonstration with music** | 105.36–116.96 | 2635–2924 | 7.5 | Sarah Vaughan "Stardust" and Nat King Cole "Unforgettable", introduced by archival DJ back-announces, each with a label and a visualizer | The viewer *hears* the format that N14 described ("previous decades of like-minded jazz") |
| P10 | **Expert voice 2** + act break | 117.00–121.24 | 2925–3031 | 2.8 | Angela: "it was all about the music, Melvin would tell a story with the songs" → dip to black and digital silence | A witness interprets. Closes act 2 at 79 % |
| P11 | **Thesis** (+ expert confirmation) | 121.28–129.84 | 3032–3246 | 5.6 | N15 "…but for Quiet Storm, it goes much deeper than that." Then Fredara: "They knew how to construct a story through the records that they chose." | The thesis. The genre's name is spoken for the first time at 123.1 s (80 %). The narrator sets up "deeper"; the expert delivers the claim |
| P12 | **Demonstration 2** | 129.88–133.20 | 3247–3330 | 2.2 | Anita Baker "Angel" in the clear, with lyric captions and a kick-driven scope | Proof by example of the genre |
| P13 | **Payoff** (recap + reveal) | 133.24–146.48 | 3331–3662 | 8.6 | N16–N18: "So, you have [A] and [B]. But something else happens that really ties it all together. [C]." Stage build → spin-swap → recap collage with the title | Summarises the ingredients as physical objects and reveals the third |
| P14 | **Ending / handoff** | 146.52–153.72 | 3663–3842 | 4.7 | Archival call-in (caller, DJ, lyric) as full-bleed kinetic type → zoom-blur → EARWORM card on a bass hit; music to the last frame | The source gets the last word. No VO sign-off, summary or call to action |

**Share by function**

| Function | Parts | % of runtime |
|---|---|---|
| Place-and-time setting (cold open) | P1 | 6.8 |
| Hook | P2 | 9.0 |
| Context | P3, P5, P7 | **35.1** (10.6 + 12.9 + 11.6) |
| Expert voice | P4, P10 | 11.6. Expert *speech* totals 21.5 s = 14.0 % (2 more bites sit inside P5 and P11) |
| Turn | P6 | 2.4 |
| Protagonist + event | P8 | 6.6 |
| Demonstration with music | P9, P12 | 9.7. Rises to 14.7 % if the hook's record (7.6 s) is counted |
| Thesis | P11 | 5.6 |
| Payoff | P13 | 8.6 |
| Ending / handoff | P14 | 4.7 |

**Three acts, marked by sound.**
- **Act 1**: 0–53.4 s (35 %). Ends with the chapter dip f1328–1349.
- **Act 2**: 54.0–121.0 s (44 %). Ends with the dip to black f2997–3031.
- **Act 3**: 121.3–153.7 s (21 %).

**Landmarks** (% of runtime)

| Landmark | t | % |
|---|---|---|
| First source alone | 15.6 s | 10 |
| First expert voice | 41.0 s | 27 |
| Chapter dip | 53.4 s | 35 |
| Turn | 73.7 s | 48 |
| Drop | 77.5 s | 50 |
| Protagonist named | 95.4 s | 62 |
| The name "Quiet Storm" on screen (LP) | 99.6 s | 65 |
| Act-break dip | 121.0 s | 79 |
| The name spoken | 123.1 s | 80 |
| Title type QUIET STORM | 143.0 s | 93 |

The story withholds its subject's name until 80 % of the runtime. Everything before that point builds the conditions for it.

**The question is never asked.** The narration contains no question marks. Five *statements* open a loop, and the next element closes it:

| Setup (t) | Payoff | Delay |
|---|---|---|
| N3 "…you have to listen to *this*." (15.56 s) | the record | 0 s |
| N5b "…this album explains the reason why." (33.4 s) | N6 "Washington DC was a chocolate city." | 0.8 s |
| N11 "Something changed one summer night in 1976." (76.3 s) | N14 "Melvin Lindsey's show that night…" | 19.1 s (the montage is inserted) |
| N15 "…it goes much deeper than that." (124.9 s) | Fredara: "They knew how to construct a story…" | 0.15 s |
| N17 "…something else happens that really ties it all together." (144.3 s) | N18 "The call-ins and dedications." → the call itself | 1.0 s / 2.5 s |

## 2. (b) Claim → visual device map

There are 40 rows: every narrator sentence, split into clauses where the picture changes (30 rows), plus every non-narrator voice item (10 rows, marked ▸).

**Claim types**: date · place · person · fact · concept · causal link · sensory description · musical example · quote.

**Asset types** (from the brief): archival photo · footage · interview · document/newspaper (album covers count here) · typography · diagram · prop · map · music visualizer.

**Audio treatments**
- **bed**: music under the voice.
- **song**: a featured or archival recording, in the clear or ducked.
- **silence**: a dry voice with no music, or silence.
- **SFX**: sound effects.

| # | t s (f) | Narration (corrected) | Claim | Visual device — what appears, when | Assets | Audio |
|---|---|---|---|---|---|---|
| N1 | 0.02–1.00 (0–25) | "The year is *1976*." | date | Cold open on an empty black-paper stage. Four periwinkle digits fly in one by one (f5–33) and assemble 8 f after the word ends | typography | intro bed (sparse bass + hats ≈62–66 BPM), hard from f0, no fade |
| N2a | 2.51–3.84 (63–96) | "The *place* is *Washington*, *DC*," | place | "1976" splits on "place" (f64). A B&W collage unfolds from a seed between 19 and 76: Capitol on "Washington" (f80), rowhouses on "DC" (f91) | archival photo, typography | bed |
| N2b | 5.00–6.08 (125–152) | "and we're at Howard University," | place | **Hold**: the collage holds (f123–163) and Howard is not shown. The map arrives 1.0 s later; the X marks Howard 5.6 s later (f291) | archival photo | bed. The pause after the word is filled by a bass note, and the whip-out starts on it (f164) |
| N2c | 7.01–9.72 (175–243) | "specifically *their* radio station, *WHUR*." | place | Silent whip-out (f164–173) → satellite + line-map cards in 4 stop-motion poses, landing on "their" (f184) → station label "WHUR 96.3 / Washington, DC": cursor, box wipe, scramble (f211–226). The label starts on a bass note 8.5 f before "WHUR" | map ×2, typography | bed. No SFX on the whip or the label |
| N3a | 10.58–12.84 (264–321) | "But if you want to really understand *Washington*, *DC*" | concept (promise, 2nd person) | SnapPush ×1.66 into the map **stops dead on "Washington"** (f291) + periwinkle X on Howard (f291–303); defocus tile swap; torn-paper iris → cut on "DC" (f316) | map, typography, hand mark | bed |
| N3b | 12.84–13.66 (321–342) | "in *1976*," | date | Cut onto the collage mid-unfold. "19" and "76" rise from behind the pieces (f326–341) | typography, archival photo | bed |
| N3c | 14.76–15.56 (369–389) | "you have to listen to *this*." | musical example (cue) | **Source before sound**: a vinyl record flies in at frame centre on "this" (f389–401, Ø 735 px). The digits sink on the song's eighth notes (f414/421/429) | prop (vinyl) | bed's last hit f389 → needle-thump SFX f401 → 11 f crackle → song hard-in f412 |
| ▸A1 | 17.74–23.64 (444–591) | [ARCHIVAL, George Clinton on the record] "Oh, what's happening, CC? They still call it the White House, but that's a temporary condition too. Can you dig it, CC?" | quote (archival) | Crash push ×2.72 into the spinning record on "what's" (f452–463). Karaoke captions: 21 tokens, word-locked (median +1 f), 2 lines max | prop, typography | song solo 7.6 s |
| N4 | 24.08–27.20 (602–680) | "This *is* *Chocolate City* by the legendary funk band *Parliament*." | musical example (title + artist) | Keyword isolation: the caption line dims to "CC" 2 f after "is" (f613); the record sinks; CC unpacks to CHOCOLATE CITY (f626–644); serif credit "Parliament" drops (f679) | typography, prop | song ducked 20 dB in 5 f, 8 f before the VO; **hard stop** f689 → 9 f dead air |
| N5a | 28.23–31.12 (705–778) | "*In* 1976, Parliament was wildly popular in DC," | fact (date + group) | Section cut inside the silence (f697) onto a full-frame B&W band photo, already pulling back (×0.51, peak speed on "In", f705). Then a 60 f **dead hold** | archival photo | sub-swell SFX on the cut +1 f; quiet bed |
| N5b | 31.68–33.38 (792–835) | "*and* this *album* explains the reason why." | causal link (setup) | Pull-out-through match cut on "and" (f791): the same photo, now a torn cut-out on the album; the album art dissolves in on "album" (f797–810) over a spinning record | archival photo, document (album cover), prop | sub drone across the cut; bed −25 dB under "why" → 14 f near-silence (f841–854) → chord hit f855 |
| N6 | 34.42–36.66 (860–917) | "Washington DC *was* a *chocolate* *city*." | concept (nickname = demographic fact) | Zoom-out reveal ×0.596 of a DC collage, one piece per drawing (Capitol, White House, flag, row houses, car, Clinton with a boombox, vinyl). Blue typewriter CHOCOLATE / CITY starts on "was" (f876); CITY completes as "chocolate" starts (f899); X bullet; white ring closes on "city" (f911). Camera rests on the sentence end (f918) | archival photo, typography, hand marks | bed 13 dB under → song cut in f921 |
| ▸A2 | 37.11–40.97 (927–1024) | [ARCHIVAL, song vocal] "Right on, chocolate city" + instrumental | musical example | Electric-blue beam keyed to the vocal across the title (f924–963). Then **music only**: photo slam of Clinton on a 108 BPM beat (f964); torn edge boils; 4 photo swaps on beats and eighths (f989–1001); circle-crop morph on a beat (f1003–1005) | music visualizer, archival photo | song in the clear, level with the voice (−21.8 dBFS) |
| ▸I1 | 40.97–48.62 (1024–1216) | [EXPERT, Fredara Hadley, voice only] "George Clinton is really describing the vibe of post-industrial black urban experiences." | quote (expert; concept) | Clinton circle crop (the hat breaks the mask). GEORGE / CLINTON typewriter lands on her "Clinton" (f1032). PARLIAMENT BAND LEADER label + arrow during a ×1.67 push. Push-into-jump. Kinetic words POST - INDUSTRIAL / BLACK / URBAN / EXPERIENCES pop on the stressed syllables (f1135–1197) | archival photo, typography | music pre-faded −20 dB onto her first word; **killed in 1 f on "really"** (f1056) → 3.8 s dry; new cue hard-in on "black" (f1152); 2 HF ticks on the pops |
| N7 | 49.15–50.06 (1229–1251) | "That's Fredara *Hadley*." | person | Cut 5 f *before* the narrator (f1224) to her Zoom window: silent, smiling. Decode name card (FREDARA HADLEY / Ethnomusicologist / The Juilliard School) resolves on "Hadley" (+3…+5.5 f) | interview, typography | 95.5 BPM bed, 15 dB under |
| N8 | 50.33–53.06 (1258–1326) | "She's an ethnomusicologist who teaches at the Juilliard School." | person (credential) | Same shot. The card holds for exactly the 2 sentences (4.2 s), then exits with an X + 5 f fade into a **chapter dip** (f1328–1349) | interview, typography | bed → digital silence f1334–1342 |
| N9 | 54.12–58.48 (1353–1462) | "The hub of entertainment, culture, and news in *cities* like *Washington* DC was Black Radio." | concept | Fade-up on a DC collage with blue "19 76" (glitches out f1351). The cluster shrinks, tumbles 180° in the pause after "culture," (f1378–1386) and reassembles as a radio (boombox, mic stand, cable, vinyl, dome). Pop-ons follow the noun list ("cities" f1398, "Washington" f1405–1411) | archival photo, props, typography | bass bed fades in with the picture and **fades out f1434–1460 so "Black Radio" is dry**; reverb-throw SFX f1469; 8 f near-silence |
| ▸I2 | 59.18–64.06 (1479–1601) | [EXPERT, Angela Stribling] "Although I'm from Buffalo, New York, I consider myself an honorary Washingtonian." | quote (witness self-introduction) | J-cut (voice leads by 2 f) to a centred window. Her card is already decoding out (f1481–1493). The narrator never names her | interview, typography | bed 10 dB under; +16 dB ride in her 0.6 s pause |
| N10a | 65.00–68.18 (1625–1704) | "At the time, WHUR was known for playing straight ahead *jazz*," | fact | Cut 6 f before the narrator to giant black letterpress WHUR over newsprint printed with 96.3, pulling back slowly → pull-out-through **keyword cut on "jazz"** (f1697, 0 f) to J A Z Z wood type converging on a Miles Davis trumpet cut-out, with a spark boil | typography, document (newsprint), archival photo | **music removed** (64.5–67.7 s, a dry line) → jazz cue pre-laps the cut by 6.5 f |
| N10b | 68.58–72.22 (1714–1806) | "mixed with broadcasts of *speeches*, *poetry*, and news *shows*." | fact (a list of 3) | **One giant word card per list item**, each with a B&W photo inside the word (activists / a poet in a handwriting-filled shirt / a press table). Letters converge in 16–25 f. Each card contracts on the next item's word, then cuts (f1740, 1774, 1810) | typography, archival photo | jazz record hard-stops f1760; radio-dial whistles and static f1757–1803; a dark pad pre-laps NEWS SHOWS by 8 f |
| N11 | 73.74–76.32 (1843–1908) | "Something changed one summer night in *1976*." | date (turn) | **No new picture.** The NEWS SHOWS card holds (drift < 1 px/drawing); a fade to black starts on "1976." (f1898–1924); 13 f of black | — | pad decays; 6 f near-silence f1931–1936 |
| N12a | 78.00–79.86 (1950–1997) | "The Fender *Rhodes* became massively popular," | fact | **The drop**: music and picture fade up on the same frame (f1937) with a pull-back ×0.80 on a Rhodes cut-out. The FENDER / RHODES strip label wipes on 12.5 f *before* the word | archival photo, typography | new jazz-funk groove (69.9 / 139.5 BPM) from the fade-up frame; voice 14 f later |
| N12b | 80.60–82.16 (2015–2054) | "artists *overdosed* on the *synthesizer*," | fact | Multiplane crane 1 accelerates on "overdosed" (f2014). A Minimoog crosses frame centre on "synthesizer" (+6…+8 f) | archival photo | groove, speech band ducked ≈8 dB |
| N12c | 82.63–84.40 (2066–2110) | "songs were *longer* and more experimental," | fact | Crane 1 lands on tape reels on "longer" (f2080). Crane 2 starts in the narration gap (f2120) | archival photo | groove; synth zap sweeps in the gap (f2105–2140) |
| N12d | 86.01–87.70 (2150–2193) | "and *jazz* and *funk* became *one*." | concept (fusion) | Trumpet + Miles Davis LP cross centre on "jazz" (0…+2 f); electric guitar on "funk" (−2 f); arrival on sax + Head Hunters LP on "one" | archival photo, document (album covers) | groove |
| N13 | 88.78–94.88 (2220–2372) | "R&B and soul music, in many ways, continued the trajectory *of* the politically charged music of the 1960s." | causal link (continuity) + date | Hold on the arrival (f2205–2241) → multiplane dolly-in blows the foreground off frame; the singer is isolated on "of" (f2291); women, a child, a guitar, vinyl and newsprint emerge under "politically charged music of the 1960s" | archival photo, props, newsprint | groove → 5 f fade-out on "1960s." (f2371–2376), then room tone |
| N14a | 95.42–98.36 (2386–2459) | "*Melvin* Lindsey's show that night tapped into this growing popularity" | person + event | 7 f dissolve onto a moving tilt of a 1979 Washington Post clipping, "Airing the Moods of Melvin Lindsey". The headline is complete on "Melvin" (f2388); small source tag "The Washington Post \| 1979" | document/newspaper, typography (tag) | smooth pad pre-laps 4 f; dry narration f2440–2462 |
| N14b | 98.96–100.58 (2474–2515) | "of *smooth* *R&B* ballads," | sensory description | Pull-out-through cut on "smooth" (f2476) to an overscaled, defocused Melvin portrait that settles in 2 drawings. LP "A QUIET STORM" (f2489, on "R"), MELVIN LINDSEY label (f2501), "Lindsey" scrap (f2505), WHUR 96.3 type wallpaper drifting | archival photo, document (LP cover), prop (tape reel), typography | ballad swell enters 98.55 s and peaks 8 f after the cut |
| N14c | 101.05–104.56 (2526–2614) | "and he mixed it in with previous decades of like-minded jazz." | fact (method) | **Hold**: an indigo scribble draws on slowly (f2541–2596); the wallpaper drifts; push-through exit with bloom (f2621–2634) | same + hand mark | **music removed** 101.4–104.6 s (dry); riser pre-laps the next song by 15 f |
| ▸A3 | 105.38–111.3 (2634–2782) | [ARCHIVAL, DJ "…Sarah Vaughan" + Vaughan singing "Stardust"] | musical example (the "like-minded jazz") | Newsprint-head mask lifts off Vaughan's profile (f2635–2645). SARAH VAUGHAN label at the end of the name (f2651), STARDUST +5 f. The mic swings in and lands on her first note (f2666). Bokeh dots power on as the DJ stops | archival photo, prop (mic), typography, music visualizer | song in the clear 5.2 s, no narration |
| ▸A4 | 112.03–116.8 (2801–2919) | [ARCHIVAL, DJ "…and Nat King Cole" + "Unforgettable"] | musical example | Blur-through cut (f2783). The artist tag is readable 10 f *before* the name is said (f2791). Spectrum bars wipe on right→left (f2804–2814) and peak at 985 px on the song swell (f2844) | archival photo, typography, music visualizer | sub-boom SFX (peak f2784 = cut +1); song alone −4.2 dBr |
| ▸I3 | 113.27–120.48 (2832–3012) | [EXPERT, Angela] "But it was all about the music, Melvin would tell a story with the songs." | quote (expert; interpretation) | The fragment "But it was all" pre-laps over NKC (the bars burst on her voice). The song swells; then a J-cut (3 f) to her window (f2925); fade to black over "the songs." (f2997–3015) | interview | dry; sub-thump SFX on the first black frame (f3015); digital silence f3026–3031 |
| N15 | 121.30–124.86 (3032–3122) | "Their voices are *awesome*, but for Quiet *Storm*, it goes much *deeper* than that." | concept (thesis setup) | Picture and voice restart **on the same frame** (f3032). Macro of a VU meter: the needle swing peaks on "awesome" (f3054). Mega pull-back ×0.16 (f3052–3104) with its **fastest drawing on "storm"** (f3079); it lands on a top-down console collage on "deeper" | archival photo (VU meter, console), props, newsprint | hard re-entry of VO + mono bass bed (the strongest onset in the film) |
| ▸I4 | 125.01–129.86 (3125–3247) | [EXPERT, Fredara] "They knew how to *construct* a story through the records that they chose." | quote (expert; the thesis claim) | The voice pre-laps 31 f under the console; cut on the stressed "construct" (f3156, +5 f); no card on her second appearance | interview | mono bass bed |
| ▸A5 | 129.88–133.20 (3247–3330) | [ARCHIVAL song, Anita Baker "Angel": "You're my angel"] | musical example | Cut 1 f after the expert's last word to real footage of a spinning record. Oscilloscope line spikes on kicks (0 f). Now-playing credit top-left. Lyric words glitch in (YOU'RE f3265 … GEL f3311) | footage, music visualizer, typography | song in the clear (−7.5 dBr); 25 f fade-out starting 17 f before "So," |
| N16a | 133.68–136.60 (3342–3415) | "*So*, you have this *smooth* and soulful *R&B*" | sensory description (ingredient 1) | Picture-first cut 11 f before "So," (f3331) to an empty newsprint stage. Boombox hinge-flips in (f3336–3348). Singer rises on "you have" (f3358); tuner, record and paper on "smooth". Periwinkle R & B letters masked-rise across "soulful R&B" (f3388–3415), partly behind the props | props, archival photo, typography | mono bass bed |
| N16b | 137.18–140.60 (3430–3515) | "and this relaxing *DJ* who *fades in and out* with the music." | sensory description (ingredient 2) | 90° spin-swap (f3426–3466) to the console collage; the swap is hidden at peak speed on "DJ" (f3442–3446). D J letters rise (f3460/3467) | props, typography | whoosh SFX peaking on the swap; **literal mix**: stereo swell peaks on "fades" (f3472) and drops −15 dB on "and out" |
| N17 | 141.59–144.27 (3540–3607) | "But something *else* happens that really *ties it all* together." | concept (signpost to the reveal) | D J sink out on "else" (f3547–3556). **Recap collage**: ≈14 props from the episode fly in from the edges (f3576–3594) and QUIET STORM rises from behind the console, landing before "together" | props, archival photo, typography | **music removed** 142.0–144.2 s (dry); the outro song enters low-passed at f3616 |
| N18 | 145.25–146.52 (3631–3663) | "The *call-ins* and dedications." | concept (the reveal, a verbless fragment) | Defocus on "The" (f3631) → blur-through cut (f3640) to an oversized rotary phone settling (×2.64 → 1, sharp by f3644) | prop (phone) | the low-pass on the song opens on the defocus frame |
| ▸A6 | 146.74–150.90 (3669–3773) | [ARCHIVAL aircheck] caller "Did you want to [h]ear something?" — DJ "Yes, yes." — song "Don't stop ever loving me." | quote (archival) | The handset lifts as the narration ends (f3663). Full-bleed kinetic type sits behind the phone: one word per drawing, 4 f *before* each syllable, spelled as heard (TO EAR, LOVIN). Squiggles boil. Zoom-blur (f3776–3780) → end card on the bass hit (f3781) | prop, typography | phone EQ; pickup-click SFX; music runs to the last frame at −5 dBr, no fade |

## 3. (c) Frequency tables

All counts come from the 40 rows above (`scripts/claims.py`). A row can carry several devices, assets and treatments. "Primary" = the device that carries the claim.

### 3.1 Claim types

| | date | place | person | fact | concept | causal link | sensory | musical example | quote |
|---|---|---|---|---|---|---|---|---|---|
| narrator (30 clauses) | 3 | 3 | 3 | 7 | 7 | 2 | 3 | 2 | 0 |
| other voices (10) | – | – | – | – | – | – | – | 4 | 6 |

The narrator states facts and concepts (14 of 30 clauses) and **never quotes anyone**. Every quote is played as the real recording.

### 3.2 Claim type → primary device (grouped)

| Claim (n) | keyword type | collage build / transform / recap | camera reveal (push, pull, crane) | map | photo / document | interview | source object / visualizer | caption | hold / absence |
|---|---|---|---|---|---|---|---|---|---|
| date (3) | **2** | · | · | · | · | · | · | · | 1 |
| place (3) | · | 1 | · | 1 | · | · | · | · | 1 |
| person (3) | · | · | · | · | 1 | **2** | · | · | · |
| fact (7) | 2 | · | **3** | · | 1 | · | · | · | 1 |
| concept (7) | · | 2 | **4** | · | · | · | 1 | · | · |
| causal link (2) | · | 1 | · | · | 1 | · | · | · | · |
| sensory (3) | · | **3** | · | · | · | · | · | · | · |
| musical example (6) | 1 | · | · | · | 2 | · | **3** | · | · |
| quote (6) | · | · | · | · | · | 3 | · | 3 | · |
| **all (40)** | 5 | 7 | 7 | 1 | 5 | 5 | 4 | 3 | 3 |

**Co-occurring devices** (any role, not only primary):
- **Labels or name cards: 11 of 40 rows.** That is 4 of 6 musical examples, 2 of 3 persons and 2 of 6 quotes.
- Hand marks (X, ring, scribble): 3 rows.
- The source object (record, mic, phone) is a device in 7 rows: 3 of the 6 music rows, both archival quotes, the album row and the call-ins reveal.

### 3.3 Claim type → asset type

| Claim (n) | archival photo | footage | interview | document / newspaper | typography | diagram | prop | map | music visualizer |
|---|---|---|---|---|---|---|---|---|---|
| date (3) | 1 | · | · | · | **2** | · | · | · | · |
| place (3) | 2 | · | · | · | 2 | · | · | **1** | · |
| person (3) | · | · | **2** | 1 | **3** | · | · | · | · |
| fact (7) | **7** | · | · | 1 | 4 | · | · | · | · |
| concept (7) | 5 | · | · | 1 | 3 | · | **4** | 1 | · |
| causal link (2) | 2 | · | · | 1 | · | · | 2 | · | · |
| sensory (3) | 2 | · | · | 1 | 3 | · | **3** | · | · |
| musical example (6) | 3 | 1 | · | · | 4 | · | 3 | · | **4** |
| quote (6) | 1 | · | **3** | · | 4 | · | 2 | · | · |
| **all (40)** | **23** | 1 | 5 | 5 | **25** | **0** | 14 | 2 | 4 |

### 3.4 Claim type → audio treatment

| Claim (n) | bed | song | silence / dry | SFX |
|---|---|---|---|---|
| date (3) | 3 | · | 1 | · |
| place (3) | 3 | · | · | · |
| person (3) | 3 | · | 2 | · |
| fact (7) | 5 | 2 | 2 | 2 |
| concept (7) | 5 | 1 | 2 | 1 |
| causal link (2) | 2 | · | 1 | 1 |
| sensory (3) | 3 | · | · | 1 |
| musical example (6) | 1 | **5** | 1 | 2 |
| quote (6) | 3 | 2 | 2 | 3 |
| **all (40)** | 28 | 10 | 11 | 10 |

### 3.5 What the tables say (rules)

1. **Dates are typeset; they are the picture.** 2 of 3 dates are periwinkle digits. The third is the turn's "1976", which is deliberately *not* illustrated: the picture holds and goes to black.
2. **Places narrow from collage to map to label.**
   - A city gets an unfolding photo collage.
   - The institution gets a map card, a label and an X mark. These are the only maps in the film, used once, in the first 13 s.
3. **Persons get faces plus names.**
   - Experts get an interview window and a decode name card.
   - A historical person gets a newspaper clipping, then a portrait collage with a label.
4. **Facts sit on archival photos** (7 of 7) **and often on type** (4 of 7). A list of facts becomes one card or one object per item:
   - SPEECHES / POETRY / NEWS SHOWS;
   - Rhodes / synthesizer / reels / trumpet / guitar.
5. **Concepts are carried by camera moves through objects** (4 of 7 primary). A concept is *embodied* by a prop: a radio for "Black Radio", a console for "it goes deeper", a phone for "call-ins". Props appear in 4 of 7 concept rows.
6. **Causal links re-contextualise one image.**
   - The band photo becomes a cut-out on the album that "explains the reason why".
   - A crane arrival is blown away to reveal "the trajectory" of 1960s singers.
7. **Sensory descriptions become physical builds** (3 of 3 collage builds: hinge flip, masked rise, spin-swap) **and literal mix moves**: the music fades in and out *on* "fades in and out".
8. **Musical examples always show their source.** The record, the mic or the artist's photo is on screen in 6 of 6; a visualizer in 4 of 6; a name (title, label or credit) in 5 of 6. They play in the clear (5 of 6).
9. **Quotes are never paraphrased.** They play as the real recording:
   - **archival** quotes get word-locked captions (3 of 3);
   - **expert** quotes get an interview window, or keyword pops when the expert names things.
10. **No diagrams** (0 of 40). Only 1 footage clip (a spinning record). Archival photos (23) and typography (25) carry the film.

### 3.6 How often type is on screen

The count covers designed type only: it excludes the Vox bug and text that is part of an archival asset (album covers, newspaper body text). Source: `scripts/typecov.py`.

| Category | Events | On screen | % of runtime |
|---|---|---|---|
| Narrator keyword graphics (1976 ×3, CHOCOLATE CITY ×2, WHUR, JAZZ, SPEECHES / POETRY / NEWS SHOWS, R & B, D J, QUIET STORM) | 11 | 39.7 s | 25.8 |
| Labels: names, roles, credits, source tag, station label, wallpaper | 11 | 40.0 s | 26.0 |
| Captions of archival voices (Clinton karaoke, "YOU'RE MY ANGEL", call-in kinetic type) | 3 | 13.0 s | 8.5 |
| Expert keyword captions (GEORGE CLINTON; POST-INDUSTRIAL / BLACK / URBAN / EXPERIENCES) | 2 | 6.0 s | 3.9 |
| Series card | 1 | 2.4 s | 1.6 |
| **Any designed type** | **28 (10.9 per minute)** | **97.8 s** | **63.6** |

**Type-free stretches ≥ 1 s** (9). These are the moments when an image or a person carries the claim:

| Stretch | Length | What is on screen |
|---|---|---|
| f697–875 | 7.2 s | band photo and album |
| f2038–2381 | 13.8 s | the montage after the Rhodes label |
| f2925–3246 | 12.9 s | Angela → VU / console → Fredara |
| f1494–1618 | 5.0 s | Angela |
| f1360–1480 | 4.8 s | radio collage |
| f964–1019 | 2.2 s | photo slam |
| f3331–3387 | 2.3 s | stage build |
| f174–210 | 1.5 s | map cards |
| f3640–3668 | 1.2 s | phone |

### 3.7 Which words get typeset

**Narrator words that are typeset: 27 of 235 (11.5 %).**

| Class | Tokens | Words |
|---|---|---|
| Proper nouns | 17 | WHUR ×2, Washington DC, Chocolate City ×2, Parliament, Fredara Hadley, Juilliard School, Fender Rhodes, Melvin Lindsey |
| Category nouns | 7 | jazz, speeches, poetry, news shows, R&B, DJ |
| Dates | 2 | 1976 ×2 |
| Role noun | 1 | ethnomusicologist (on the name card) |

- **No verbs, adjectives, function words or sentences.**
- "Quiet Storm" is *not* typeset when it is spoken (123.1 s). The title is set 20 s later as the recap's centrepiece (f3576).
- Two places are named but marked instead of typeset: "Howard University" gets an X, and "Black Radio" becomes a radio object.

**Expert words typeset: 6 of 51.** All six come from one bite (GEORGE, CLINTON, POST-INDUSTRIAL, BLACK, URBAN, EXPERIENCES): the names and the abstract noun phrase the expert introduces. Her other bite and Angela's two bites get no type.

**Archival words typeset**
- **100 %** of the spoken archival lines that are captioned: Clinton's 21 tokens and the call-in.
- 100 % of the two lyric lines shown: "You're my angel" and "Don't stop ever loving me".
- 0 % of the DJ back-announces. Their names are typeset as labels instead.

**Typesetting rule.** Typeset (a) proper names and dates at the moment they are spoken, (b) category nouns when a list is enumerated, (c) every word of a featured archival voice, and (d) the abstract keywords of an expert's key line. Never typeset the narrator's verbs or claims.

### 3.8 How often the music changes

| Measure | Value | Source |
|---|---|---|
| Music boundaries (start / stop / change) | **27** (11 / 11 / 5) = **10.5 per minute, one every 5.7 s** | Q `earworm_music.json` |
| Excerpts between boundaries | 17; median **6.9 s** (p25 5.2, p75 9.3, max 17.4 = the montage) | Q §4.1 |
| Distinct cues | ≈15: intro bed, "Chocolate City" (record → bed → vocal hook → instrumental), 95 BPM bed, bass bed, bed under Angela, jazz cue, dark pad, jazz-funk montage, smooth pad, ballad swell, "Stardust", "Unforgettable", mono bass bed, "Angel", call-in / outro | B, C, D §13 |
| Named recordings | 4: "Chocolate City" (spoken), "Stardust", "Unforgettable", "Angel" (on-screen labels or credit only) | — |
| Entrances | hard (1–4 f) at section changes; 0.6–1.2 s under speech | Q §4.3 |
| Exits | hard (0–3 f) before cuts; 1.4–1.7 s under an interview or narration | Q §4.3 |
| Lines with the music deliberately removed | 6: the expert's key line 42.2–46.1 s; the WHUR line 64.5–67.7 s; "…like-minded jazz" 101.4–104.6 s; Angela 118–121 s; "…ties it all together" 142.0–144.2 s; the "Black Radio" tail | §5.2 |
| Sound effects (not music) | ≈17 = **6.6 per minute**, all on sources or structure: needle thump, crackle, sub swell, sub drone, 2 HF ticks, reverb throw, radio-dial whistles + static, low swell, riser, sub-boom, sub thump, whoosh, pickup click, 2 glitch ticks. Segment B alone runs at 1 per 13 s | A–D §13 |

**Boundaries per arc part**

| P1 | P2 | P3 | P4 | P5 | P6 | P7 | P8 | P9 | P10 | P11 | P12 | P13 | P14 |
|---|---|---|---|---|---|---|---|---|---|---|---|---|---|
| 0 | 1 | 2 | 4 | 4 | 1 | 2 | **5** | 1 | 1 | 1 | 1 | 3 | 1 |

The music changes most where the argument changes topic (P4, P5, P8). It does not change inside the cold open or inside the montage.

## 4. (d) Script patterns

### 4.1 Sentence length

Narrator sentences, with refined onsets (`scripts/sentences.py`):

| # | Start s (f) | Words | Duration s | Words/s | Pause before (s) | Sentence |
|---|---|---|---|---|---|---|
| N1 | 0.02 (0) | **4** | 0.98 | 4.1 | — | The year is 1976. |
| N2 | 2.51 (63) | 15 | 7.21 | 2.1 | 1.51 | The place is Washington, DC, and we're at Howard University, specifically their radio station, WHUR. |
| N3 | 10.58 (264) | 17 | 4.98 | 3.4 | 0.86 | But if you want to really understand Washington, DC in 1976, you have to listen to this. |
| N4 | 24.08 (602) | 10 | 3.12 | 3.2 | 8.52 (archival) | This is Chocolate City by the legendary funk band Parliament. |
| N5 | 28.23 (706) | 15 | 5.15 | 2.9 | 1.03 | In 1976, Parliament was wildly popular in DC, and this album explains the reason why. |
| N6 | 34.42 (860) | **6** | 2.24 | 2.7 | 1.04 | Washington DC was a chocolate city. |
| N7 | 49.15 (1229) | **3** | 0.91 | 3.3 | 12.49 (song + expert) | That's Fredara Hadley. |
| N8 | 50.33 (1258) | 9 | 2.73 | 3.3 | 0.27 | She's an ethnomusicologist who teaches at the Juilliard School. |
| N9 | 54.12 (1353) | 15 | 4.36 | 3.4 | 1.06 (dip) | The hub of entertainment, culture, and news in cities like Washington DC was Black Radio. |
| N10 | 65.00 (1625) | 20 | 7.22 | 2.8 | 6.52 (expert) | At the time, WHUR was known for playing straight ahead jazz, mixed with broadcasts of speeches, poetry, and news shows. |
| N11 | 73.74 (1843) | **7** | 2.58 | 2.7 | 1.52 | Something changed one summer night in 1976. |
| N12 | 78.00 (1950) | 23 | 9.70 | 2.4 | 1.68 (drop) | The Fender Rhodes became massively popular, artists overdosed on the synthesizer, songs were longer and more experimental, and jazz and funk became one. |
| N13 | 88.78 (2220) | 18 | 6.10 | 3.0 | 1.08 | R&B and soul music, in many ways, continued the trajectory of the politically charged music of the 1960s. |
| N14 | 95.42 (2386) | 25 | 9.14 | 2.7 | 0.54 | Melvin Lindsey's show that night tapped into this growing popularity of smooth R&B ballads, and he mixed it in with previous decades of like-minded jazz. |
| N15 | 121.30 (3032) | 14 | 3.56 | 3.9 | 16.74 (songs, expert, dip) | Their voices are awesome, but for Quiet Storm, it goes much deeper than that. |
| N16 | 133.68 (3342) | 20 | 6.92 | 2.9 | 8.82 (expert + song) | So, you have this smooth and soulful R&B and this relaxing DJ who fades in and out with the music. |
| N17 | 141.59 (3540) | 10 | 2.68 | 3.7 | 0.99 | But something else happens that really ties it all together. |
| N18 | 145.25 (3631) | **4** | 1.27 | 3.1 | 0.98 | The call-ins and dedications. |

**Summary**

| Measure | Value |
|---|---|
| Sentences | 18 = **7.0 per minute** |
| Words per sentence | mean **13.1**, median 14.5, range 3–25, SD 6.6 |
| Short sentences (≤ 7 words) | 5 of 18 (28 %): N1, N6, N7, N11, N18 |
| Long sentences (≥ 18 words) | 5 of 18: N10, N12, N13, N14, N16 |
| Rate | articulation 3.47 words/s (Q). Including pauses inside a sentence: 2.91 words/s (235 words in 80.9 s) |
| Pauses | between phrases inside a sentence: median 0.48 s (p25 0.34, p75 0.88). Between consecutive narrator sentences: median ≈ 1.0 s (0.27–1.68) |
| Phrases | 36 narrator phrases: median 1.6 s, 5.5 words |

**Where short and long sentences go**

- **Short sentences are structural.** Each one is an opening (N1), a payoff (N6), an identification (N7), the turn (N11) or the reveal (N18, which has no verb).
- **Long sentences are lists** of 3–4 items (N10, N12) or **causal chains** (N13, N14). They run over montages or builds that change the picture once per item.
- **The rhythm** is short → long → long → short at every section: 4/15/17 · 10/15/**6** · **3**/9 · 15/20/**7** · 23/18/25 · 14 · 20/10/**4**.

### 4.2 Person, tense, questions

| Feature | Count | Where |
|---|---|---|
| Second person "you" | **3** (1.3 % of words; 1.2 per minute) | the hook N3 (×2) and the payoff N16 (×1): bookends |
| First person "we're" | 1 | N2, "we're at Howard University": the "you are there" present |
| Rhetorical questions in narration | **0** | The only questions in the film are archival: "what's happening, CC?", "Can you dig it, CC?", "Did you want to hear something?" |
| Present tense | 9 sentences | the frame, the promise, the IDs, the thesis and the payoff (N1–N4, N7, N8, N15–N17) |
| Past tense | 8 sentences | history and context (N5, N6, N9–N14) |
| Deictic "this" | 6 | "listen to this", "This is Chocolate City", "this album", "this growing popularity", "this smooth…", "this relaxing DJ". The script points at the sound or object on screen |
| Repeated anchors | "1976" spoken ×4 (and typeset ×3); "Washington, DC" / "DC" ×5 | — |
| Meta-talk ("in this video", "let's", "here's why", "first / second") | 0 | — |
| Hedges | 1: "in many ways" (N13) | — |

### 4.3 How sources and experts are introduced

| Source | Introduction | Numbers |
|---|---|---|
| **Fredara Hadley** (expert) | **Voice first.** Her bite plays over Clinton graphics with her keywords typeset. She is seen only afterwards, silent and smiling, while the narrator says "That's Fredara Hadley. She's an ethnomusicologist who teaches at the Juilliard School." | voice → face lag **8.0 s** (f1024 → f1224). The ID formula is name + role + institution: 2 sentences, 12 words, 3.9 s. The card builds from the cut (5 f before the name is spoken), resolves on the surname +3…+5 f and holds exactly as long as the 2 sentences |
| **Angela Stribling** (witness) | **Self-introduction.** Her first bite establishes her standing ("Although I'm from Buffalo, New York, I consider myself an honorary Washingtonian"). Her card is on screen only 12 f, and the narrator never names her | J-cut 2 f |
| Second appearances (both experts) | no card, no ID | J-cut 3 f (Angela); 31 f pre-lap with the cut on the stressed "construct" (Fredara) |
| Records | play first, then the name: "Chocolate City" plays solo 7.6 s before "This is Chocolate City by the legendary funk band Parliament" (formula: *This is [TITLE] by the [adjective] [genre] band [ARTIST]*) | — |
| Ballads | named by the archival DJ (Vaughan, NKC) and by labels timed to the name | NKC tag 10 f before the name; SARAH VAUGHAN label at the end of the name (−1 f) |
| "Angel" | named only by the now-playing credit, never spoken | — |
| Documents | the newspaper carries an on-screen source tag "The Washington Post \| 1979" | the VO never cites a source; there is no "according to" |

### 4.4 Signposting

| Device | Instances |
|---|---|
| Sentence-initial "But" (pivot) | N3 "But if you want…", N17 "But something else…" |
| "So," (summary) | N16 |
| Time signposts | "The year is 1976", "in 1976" ×2, "At the time", "one summer night in 1976", "that night", "of the 1960s", "previous decades" (8) |
| Cataphoric pointers (the setups in §1) | "listen to this", "explains the reason why", "much deeper than that", "something else … ties it all together": 4, plus the turn sentence |
| Enumerations | N10 (4 broadcast kinds), N12 (4 trends), N16 (2 ingredients) + N18 (the 3rd as a fragment) |
| Section boundaries in sound, not words | a dip (×2), a drop (×1), a hard stop + silence hole (×3) |

### 4.5 Ratio of narration to archival audio

**By time** (frame classes from `earworm_sync.json`)

| Class | Time | % |
|---|---|---|
| Narration with music | 60.3 s | 39.2 |
| Narration dry | 9.7 s | 6.3 |
| **Narration total** | 70.0 s | **45.5** |
| Other voices (experts, archival speech, songs with spoken intros) | 34.3 s | 22.3 |
| Music only | 43.6 s | 28.4 |
| Silence | 5.8 s | 3.8 |

**Ratios**
- **Narrator : other spoken voices ≈ 2.3 : 1** (69.4 s vs 30.5 s articulated). By words, 235 : 88 ≈ 2.7 : 1.
- **Narrator : all source audio** (other voices + music only) **≈ 0.9 : 1**. The narrator holds the floor less than half the time.
- 86 % of narrator speech has music under it (Q §2). The music is pulled out for 6 key lines (§3.8).

### 4.6 How the episode lets music "speak"

Music-only passages ≥ 1 s. The total "music only" class is 43.6 s including phrase-gap fill.

| # | t (s) | f | Length | What plays | On screen | Picture timing |
|---|---|---|---|---|---|---|
| 1 | 15.56–17.74 | 389–444 | 2.2 s (then 5.9 s of Clinton talking on the record) | bed hit → needle thump → crackle → song intro | the record flies in and spins; digits sink | source shown ≥ 20 f before the sound; exits on eighth notes (±1.5 f) |
| 2 | 38.06–40.97 | 951–1024 | 2.9 s | "Chocolate City" instrumental, 108.3 BPM | photo slam, torn-edge boil, 4 photo swaps, circle morph | 7 changes on the eighth-note grid, mean \|d\| 0.9 f |
| 3 | 72.22–73.74 | 1806–1843 | 1.5 s | dark pad swells | NEWS SHOWS holds | — |
| 4 | 84.40–86.01 | 2110–2150 | 1.6 s | groove + synth sweeps | crane 2 starts | the move starts in the narration gap |
| 5 | 106.1–112.0 | 2652–2800 | **5.9 s** | Vaughan sings "Stardust" → hand-off to NKC | Vaughan cut-out, artist and song labels, mic pendulum, bokeh visualizer → newsprint-head wipe → blur-through | the mic lands on the first sung note (+1 f) |
| 6 | 113.8–116.8 | 2846–2919 | 2.9 s | NKC swells +6–8 dB after the interview fragment | NKC cut-out, tag, spectrum bars at maximum | bars lead the level by 2 f |
| 7 | 129.88–133.68 | 3247–3342 | **3.8 s** | Anita Baker "Angel" | spinning-record footage, kick scope, credit, lyric captions | scope 0 f on kicks; lyrics +1 f |
| 8 | 148.4–149.6 | 3711–3741 | 1.2 s | outro between the DJ and the lyric | YES held, squiggles boiling | — |
| 9 | 150.9–153.72 | 3773–3842 | 2.8 s | outro to the last frame | zoom-blur → EARWORM glitch card | cut on the bass hit (0 f) |

**Rules from this table**
- **Length.** Featured songs get 2.9–5.9 s alone (median 3.4 s). Bridges get 1.2–1.6 s.
- **Count.** 9 passages in 154 s ≈ 3.5 per minute. Featured songs alone ≈ 1.6 per minute.
- **What is on screen.**
  - **The source**: the record (×2), the mic (×1) or the singer's photo (×3).
  - **A name**: title, artist label or credit.
  - **A listening graphic**: a visualizer or word-locked lyrics.
  - The narrator never talks over a featured song in the clear: songs and narration take turns.
  - Picture changes snap to the music **only here**, on eighth notes. Under the narration they ignore the beat (4.15 f vs 4.4 f random; A §12).

### 4.7 Opening and closing formulas

**Opening** (0–24 s): *"The year is [YEAR]. The place is [CITY], and we're at [INSTITUTION], specifically [SUB-PLACE]. But if you want to really understand [CITY] in [YEAR], you have to listen to this."* → the primary source alone for ≥ 7 s → *"This is [TITLE] by the [adjective] [kind] [ARTIST]."*

- **Time first, then place in 3–4 nested steps** in < 10 s, in the present tense. One noun per beat on screen: digits → city collage → map → label.
- **A "But" pivot to a second-person promise**, ending on a deictic "this" that the picture answers instantly with the source object.

**Closing** (133–154 s): *"So, you have [INGREDIENT A] and [INGREDIENT B]. But something else happens that really ties it all together. [INGREDIENT C, noun phrase]."* → [ARCHIVAL C itself, 4–5 s, as kinetic type] → series card on a bass hit → music to the last frame.

- The last narrator words are a **verbless fragment that names the final element**.
- The archival source has the last word (the narrator's last word comes at 95.3 % of the runtime).
- There is no summary sentence after the reveal, no sign-off and no call to action.

## 5. (e) Music & tempo arc

### 5.1 Energy over time

Per part (`scripts/sections.py`):
- rms and bass are dBr from `earworm_features.csv`.
- side = stereo music level from my mid/side pass (voices are mono, so side ≈ music only).
- motion = mean `mad_lo`.
- setups = distinct compositions (§6).

| Part | Music (tempo) | rms dBr | Bass < 200 Hz dBr | Side (music) dB | Motion | Setups/min | Narration % / other voice % / music only % / silence % |
|---|---|---|---|---|---|---|---|
| P1 setting | sparse bass + hats ≈62–66 BPM | −4.4 | **−6.4** | −25.0 | 1.78 | 11.5 | 53 / 0 / 47 / 0 |
| P2 hook | "Chocolate City" record (funk) | −4.9 | −8.3 | −31.6 | 2.48 | 17.4 | 26 / 38 / 36 / 0 |
| P3 context 1 | Chocolate City bed (≈77 BPM under VO) → vocal → instrumental 108 BPM | −6.9 | −13.2 | −30.6 | 3.32 | 18.3 | 60 / 6 / 29 / 4 |
| P4 expert 1 | killed → 95.5 BPM bed → dip | −5.5 | **−18.4** | −37.5 | **1.71** | 13.4 | 28 / 53 / 11 / 9 |
| P5 context 2 | bass bed, bed under Angela, dry, jazz cue, radio dial, dark pad | −6.4 | −12.6 | −30.7 | 3.50 | **21.3** | 47 / 25 / 20 / 8 |
| P6 turn | pad decay → silence | −6.7 | −9.8 | −31.4 | 2.44 | (hold) | 69 / 0 / 18 / 13 |
| P7 montage | jazz-funk groove 69.9 BPM, double-time 140, 16th hats | −4.9 | −8.0 | −36.6 | **6.40** | 10.1 (one 18 s crane) | 74 / 0 / 23 / 3 |
| P8 protagonist | smooth pad → ballad swell → dry | −6.8 | −14.5 | −33.0 | 2.90 | 11.9 | 81 / 0 / 13 / 6 |
| P9 demonstration | "Stardust" (rubato ≈67–85) → "Unforgettable" (≈83) | −7.0 | −12.2 | −26.6 | 3.12 | 10.3 | 0 / 43 / 57 / 0 |
| P10 expert 2 + break | dry → digital silence | −7.0 | −14.5 | **−46.2** | 1.63 | 14.0 | 0 / 81 / 11 / 7 |
| P11 thesis | mono bass bed (≈70 / 142) | −5.0 | −14.0 | −38.3 | 3.44 | 20.9 | 42 / 57 / 1 / 0 |
| P12 demonstration 2 | "Angel" 82 BPM | −7.7 | −13.3 | **−22.1** | 5.08 | 17.9 | 0 / 0 / 100 / 0 |
| P13 payoff | mono bass bed + swell → dry → call-in music | −4.2 | −6.0 | −32.4 | 2.48 | 18.1 | 78 / 0 / 19 / 2 |
| P14 ending | call-in bed (≈116) → outro, no fade | **−2.8** | **−3.3** | −22.9 | 5.29 | 8.3 | 1 / 38 / 62 / 0 |

**The shape of the arc**
- **Loudness is nearly flat** (LRA 4.1 LU; parts span −7.7 to −2.8 dBr). Energy is shaped by *bass, stereo width, tempo and motion*, not by volume.
- **Three bass peaks**: the cold open (−6.4), the montage (−8.0) and the payoff + ending (−6.0 → −3.3).
- **The troughs are the voices**: experts (−18.4) and the act break.
- **The montage is the energy summit** at 50–62 % of the runtime: fastest groove, highest motion (6.40). It is placed *right after* the turn's silence (the "drop").
- **After the summit the tempo falls on purpose.** The second half runs on rubato ballads at 82–85 BPM: the music turns into the subject ("quiet storm" = smooth, slow).
  - Energy comes back only through stereo width (Angel −22.1 dB side) and the final bass (−3.3).
  - The film ends at its loudest point, with music still playing.

### 5.2 Where silence is used

| t (s) | f | Kind | Before / after | Function |
|---|---|---|---|---|
| 27.56 | 689–700 | 11 f hard-stop hole (−57 dB) | after the title + credit → **cut inside the hole** onto the band photo; sub swell at +1 f | section cut |
| 33.64 | 841–854 | 14 f near-silence (−51 dBFS sub only) | after "explains the reason why" → chord hit → "Washington DC was a chocolate city" | **silence before a payoff line** |
| 42.2–46.1 | 1056–1151 | 3.8 s dry (music killed in 1 f) | the expert's key line → new cue on "black" | spotlight on the expert |
| 53.4 | 1334–1342 | 7 f digital silence inside a 22 f dip | expert ID → "The hub of…" | chapter break (end of act 1) |
| 58.5–59.2 | 1462–1478 | reverb throw + 8 f near-silence | "Black Radio." → Angela | the line lands dry |
| 64.5–67.7 | 1611–1692 | dry narration | "At the time, WHUR was known for…" | exposition without decoration |
| 77.0 | 1925–1941 | 16 f (−60 dB) inside 13 f of black | "1976." → **the drop**: picture and music restart together | silence before the energy summit |
| 94.9 | 2373–2382 | 9 f | "1960s." → newspaper | section cut |
| 101.4–104.6 | 2526–2614 | dry narration | "…like-minded jazz." → archival DJ | lets the next song enter clean |
| 118.0–121.3 | 2950–3032 | dry interview, then 8 f digital silence inside 17 f of black | Angela → the thesis | **act break**; the thesis restarts picture + voice on one frame |
| 142.0–144.2 | 3551–3606 | dry narration | "…ties it all together." → the reveal | silence before the reveal |

Silence and dry passages total 15.5 s (10 %): silence 5.8 s + dry narration 9.7 s, plus ≈5.7 s of dry interview. They serve three purposes (the act break at 118–121 s does all three):
1. **Before a payoff** (×3, plus the act break): it frames the next line or the next music as an event.
2. **Under key expository and expert lines** (×4, plus Angela's dry bite before the act break): the line has no competition.
3. **Section breaks** (×3, plus the act break): a hard stop, then the cut lands inside the 8–11 f hole.

### 5.3 How song choices map to story beats

| Beat | Music | Why it fits |
|---|---|---|
| Setting (0–16.5 s) | anonymous sparse bass + hats | neutral, low and slow: it leaves room for 3 nested place facts |
| Hook (16.5–24 s) | Parliament "Chocolate City", spoken intro | the record *is* the argument: the city's own voice and the most characterful sound in the film |
| Context 1 (28–40 s) | "Chocolate City" as bed → the vocal hook "Right on, chocolate city" → instrumental | the nickname arrives *sung* right after the narrator says it |
| Expert 1 (42–53 s) | none → new 95 BPM bed entering on "black" | the music gets out of the way of the interpretation, then returns on its key word |
| Context 2 (54–74 s) | beds → **jazz cue on the word "jazz"** → radio-dial static under "broadcasts" | literal: each format the station played gets its sound |
| Turn (74–77 s) | the pad decays into silence | the change is announced by taking sound away |
| Montage (77–95 s) | jazz-funk with Rhodes and synth sweeps | the music is the trend the narrator lists (Rhodes, synths, jazz + funk) |
| Protagonist (95–105 s) | smooth pad → **ballad swell under "smooth R&B ballads"** → dry | literal again; then dry so the jazz can enter clean |
| Demonstration (105–117 s) | Sarah Vaughan "Stardust", Nat King Cole "Unforgettable" | they *are* the "previous decades of like-minded jazz" (N14c) |
| Thesis (121–130 s) | mono bass bed | minimal under the claim |
| Demonstration 2 (130–133 s) | Anita Baker "Angel" | a smooth ballad of the genre, in the clear, with lyrics |
| Payoff (133–146 s) | bed with **a swell on "fades in and out"** → dry → outro low-passed, opening on the reveal | the mix acts out the sentence |
| Ending (146–154 s) | the call-in's own music, to the last frame | the archival source ends the film |

**Rules**
1. The hook gets the most characterful *archival* sound, preferably one with a voice.
2. Context beds should literally sound like what the line names.
3. The montage gets the fastest groove.
4. The subject is demonstrated by the subject's own music, in the clear.
5. Remove music under interpretations and key expository lines.
6. End on the source's music, unfaded.

## 6. (f) Shot economy

### 6.1 Shots, setups, ideas, phrases

- **Designed shots**: 24. A shot change is any cut, dissolve or dip. The detector's 21 merged cuts count the f1904 fade as a cut and miss the two dips.
- **Setups**: 38. A setup is a distinct composition inside a shot, such as an unfold, a crash push, a zoom-out reveal, a slam or a spin-swap.
- **Ideas**: claim rows from §2. List items count as one idea each, and J-cut voices are attributed to the shot that shows the speaker.
- **Phrases**: all speakers, refined phrase starts (`scripts/economy.py`). As with ideas, a J-cut phrase that starts 2–31 f before its cut is counted in the speaker's shot.

| Shot | f | Length s | Setups | Ideas | Phrases | Content |
|---|---|---|---|---|---|---|
| S1 | 0 | 12.6 | 2 | **5** | 8 | year → collage → map → label → push + X |
| S2 | 316 | 15.2 | 4 | 4 | 4 | digits → record → crash push + karaoke → title |
| S3 | 697 | 3.8 | 1 | 1 | 2 | band photo |
| S4 | 791 | 17.3 | 5 | 4 | 5 | album → DC collage → slam → circle + label → kinetic words |
| S5a | 1224 | 4.7 | 1 | 2 | 2 | Fredara + card |
| S5c | 1342 | 5.6 | 2 | 1 | 1 | collage → radio |
| S6 | 1481 | 5.5 | 1 | 1 | 1 | Angela |
| S7 | 1619 | 3.1 | 1 | 1 | 2 | WHUR |
| S8 | 1697 | 1.7 | 1 | 1 | 1 | JAZZ |
| S9 | 1740 | 1.4 | 1 | 1 | 1 | SPEECHES |
| S10 | 1774 | 1.4 | 1 | 1 | 1 | POETRY |
| S11 | 1810 | 5.1 | 1 | 2 | 1 | NEWS SHOWS (+ the turn line over the hold) |
| S16 | 1937 | 17.8 | 3 | **5** | 6 | crane montage |
| S19 | 2382 | 3.8 | 1 | 1 | 1 | newspaper |
| S20 | 2476 | 6.4 | 1 | 2 | 1 | Melvin collage |
| S21 | 2635 | 5.9 | 1 | 1 | 2 | Vaughan |
| S22 | 2783 | 5.7 | 1 | 1 | 1 | Nat King Cole |
| S23a | 2925 | 4.3 | 1 | 1 | 1 | Angela |
| S23c | 3032 | 5.0 | 2 | 1 | 1 | VU → console |
| S24 | 3156 | 3.6 | 1 | 1 | 1 | Fredara |
| S25 | 3247 | 3.4 | 1 | 1 | 0 (sung only) | Angel |
| S26 | 3331 | 12.4 | 3 | 3 | 4 | R&B stage → spin → DJ → recap |
| S27 | 3640 | 5.6 | 1 | 2 | 3 | phone + kinetic voice |
| S28 | 3781 | 2.5 | 1 | 0 | 0 | end card |

### 6.2 Distribution

| Measure | Shots (24) | Setups (38) |
|---|---|---|
| Length | median **5.0 s** (mean 6.4) | median **4.0 s** (one new composition every 4.0 s) |
| Ideas | median **1**, mean 1.8 | median **1**, mean 1.1 |
| Phrases | median **1** (mean 2.1) | median **1** |

**Ideas per shot**: 0 → 1 shot · 1 → 14 · 2 → 4 · 3 → 1 · 4 → 2 · 5 → 2. Q's detector-based shots give a median of 3.7 s and 1 phrase per shot (ρ = 0.79 between shot length and phrase count).

**Visual events**: the four segment reports log ≈209 picture events (A 62, B 48, C 47, D 52). That is **1.36 per second, one every 0.74 s**.

**Rules**
- **One idea per composition.** 58 % of shots (14 of 24) and the median setup carry exactly one claim.
- **Multi-idea shots are "stage shots" of 12–18 s** (S1, S2, S4, S16, S26). They carry 3–5 ideas because the stage *transforms* once per idea (unfold, whip, crash push, zoom-out, crane, spin-swap). In effect every idea still gets its own composition.
- **Lists split into one shot per item** (S8–S11, 1.4–5.1 s each) or one object per item inside a crane.
- **Shortest shots**: 1.4 s, on the narrator's list nouns. **Longest**: 17.8 s, the montage.
- **Cut density** (Q): 11 cuts per minute in music-only passages, 8 per minute under narration with music, 5.3 per minute under interview, 0 under dry narration.

### 6.3 Reveal order inside a setup

Of the 38 setups:
- **12 show the image or object first and add the type later.** Lag: median **18 f (0.7 s)**, range 6–68 f.
  - map → label: 35 f
  - collage → digits: 10 f
  - record → karaoke: 68 f
  - collage → typewriter title: 18 f
  - circle portrait → name: 15 f
  - portrait → label: 25 f
  - face → labels: 6 f
  - photo → tag: 8 f
  - record → lyric: 18 f
  - boombox → R&B letters: 52 f
  - console → DJ letters: 14 f
  - phone → kinetic words: 29 f
- **9 show type and image together**: the giant word cards with their photo inside (×4), the Rhodes + label, the newspaper + source tag, the interview + building card, the collage + "19 76", and the recap + title.
- **1 shows type first**: the cold open's "1976". The collage grows out of the digits.
- 4 are type-only (title, kinetic words, WHUR, end card). 12 are image-only (photos, interviews, the crane, the VU / console).

**Build order inside a busy setup.** It is always: ground → hero (image or object) → type / label → hand mark (X, ring, underline, arrow, scribble) → secondary motion (visualizer, beam, sparks). Examples:

| Setup | Order |
|---|---|
| S1b | map f176 → label f211 → X f291 |
| S4b | collage f858 → title f876 → ring f903 → beam f924 |
| S4c | circle f1005 → name f1020 → label + arrow f1072 |
| S20 | head f2476 → LP f2489 → label f2501 → scrap f2505 → scribble f2541 |
| S21 | face f2645 → labels f2651 → mic f2656 → bars f2662 |

**Marks always come last.** Only the source object breaks the order, and only for music: it arrives ≥ 20 f *before* its sound.

## 7. Comparison with Vox "Epigenetics" (`epigenetics.md`)

| | Epigenetics (51 s excerpt) | Earworm "Quiet Storm" (154 s) |
|---|---|---|
| Mode | argument / explainer: concept → evidence → open question | **story**: setting → context → turn → event → demonstration → thesis → payoff |
| Narration | ≈2.6 words/s *assumed* (no transcript) | **3.47 words/s measured**, 45 % of the runtime, 94 words per minute of video |
| Other voices | 1 interview insert of 1.8 s (3.6 %) | 4 expert bites + 6 archival items = 22 % of the runtime |
| Music | not analysed (no music log) | 27 boundaries, 15 cues, 28 % music only |
| Shot length | median 2.8 s (14 shots) | median 5.0 s (24 shots); setups every 4.0 s |
| Visual beats | 43 in 51 s = 0.84 per second (one per 2–3 words) | ≈209 in 154 s = 1.36 per second |
| Assets | flat vector diagrams (DNA, gears, dot grids), photo prints, a journal page, desk props | archival photos (23 rows), type (25), props (14), interviews, newspapers, album covers, 1 map; **0 diagrams** |
| Type | serif titles, handwritten tape labels, sticky notes, "??" | condensed caps: nouns, names and dates only; captions of the sources' own words |
| Emphasis | eased push-ins ending in a ≥ 15 f drift tail | pushes stop dead on the stressed word; long moves peak on the key noun |
| Silence | — | a structural tool: hard-stop holes, a drop, 2 dips |
| Shared | one visual beat per clause, beats land just after a pause, physical entrances, one accent colour, 12 drawings/s | ← same |

For the framework: argument topics (science, policy) may borrow Epigenetics' *diagram* recipes (VX-4, VX-6, VX-7) for numbers. Everything else should follow Earworm's *editorial* logic: sources speak, picture follows the claim type, sound marks structure.

## 8. Rules extracted for the framework

Implemented prescriptively in `docs/style-guide/13-story-to-screen.md`:

1. **Arc and placement**
   - Arc: setting 7 % → hook 9 % → context 35 % (in 3 blocks) → expert voices 12–14 % → turn 2 % → protagonist / event 7 % → demonstrations 10 % → thesis 6 % → payoff 9 % → handoff 5 %.
   - Dips at ≈35 % and ≈79 %; the turn at ≈48 %; the subject's name spoken at ≈80 %.
2. **Pace**
   - 94 narrator words per minute of video (3.5 words/s while speaking, 45 % of the time).
   - 7 sentences per minute, mean 13 words, ≥ 1 short sentence (≤ 7 words) per section.
   - Phrase pauses 0.5 s; sentence pauses ≈ 1 s.
3. **Voice**: no rhetorical questions; "you" only in the hook and the payoff; present tense for frame / thesis / payoff, past for history. Questions are posed as statements and paid off by the next element (median delay 0.8 s; the turn ≤ 20 s).
4. **Claim → picture**: dates → digits; places → collage, then map + label; persons → face + name card or clipping; facts → archival photo (+ one card per list item); concepts → a camera move through an embodying object; causal links → the same image re-contextualised; sensory descriptions → physical builds + literal mix moves; music → source object + label + visualizer, in the clear; quotes → the real recording + captions.
5. **Type**: on screen ≈ 64 % of the time, 11 events per minute. Typeset only names, dates and category nouns (≈ 11 % of narrator words), every word of a featured archival voice, and an expert's key abstract nouns.
6. **Sound**
   - The music changes every ≈ 6 s, at topic joints. The sources speak alone ≈ 28 % of the runtime (featured songs 3–6 s).
   - Remove music under key lines; use silence before payoffs.
   - End on the archival source, with music to the last frame.
7. **Shots**: one idea per composition, a new composition every ≈ 4 s, a picture event every ≈ 0.75 s. Image first, label ≈ 0.7 s later, marks last.

## 9. Evidence index

| Path (under `analysis/`) | What |
|---|---|
| `earworm-{A,B,C,D}.md` | shot logs, sync tables, sound design (every frame number above that is not marked as mine) |
| `earworm-av-quant.md`, `audio/earworm_sync.json` | refined words, speakers, frame classes, music boundaries, pacing, cut density |
| `stills/earwormQ/earworm_speakers.json`, `earworm_music.json` | speaker spans and 27 music boundaries |
| `stills/editorial/interviewees.png` | f1250 / f1481 / f2950 / f3200: Fredara and Angela identified from their cards |
| `stills/editorial/overview_A_B.png`, `overview_C_D.png` | 28 native stills, one per key composition |
| `stills/editorial/ms_per_s.csv` | per-second mid / side levels (dBFS) of the stereo master |
| `stills/editorial/scripts/` | `claims.py` (40-row map + cross-tabs), `typecov.py`, `sentences.py`, `sections.py`, `economy.py`, `ms_energy.py`, `grid.py`; run with `python3 -I` |
| `sheets/earworm/sheet_029.png` | FENDER RHODES label leaves the frame at ≈ f2037 |
