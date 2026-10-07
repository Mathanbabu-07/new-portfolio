# About Section — Scroll-Scrubbed Figure: Analysis, Method & Dev Prompt

## 1. What your clip actually is

| Property | Finding | Why it matters |
|---|---|---|
| Format | 1920×1080, 24 fps, 4.0 s (96 frames), H.264 + an AAC audio track | The audio must be dropped; the video is far bigger than the on-screen figure needs |
| Background | **Solid grey-blue studio backdrop**, not transparent | On your pure-black page it would show as a grey rectangle. This is the #1 problem to solve |
| Subject | Waist-up, centered, static camera, black suit on a mid-grey backdrop | Strong contrast, so a very clean cut-out is possible (verified, see 3) |
| Motion timeline | **0.0–1.0 s** idle breathing, **1.0–2.2 s** arms raise and both hands point to the left, **2.2–4.0 s** pointing pose held with tiny drift | The motion that matters is only ~1.2 s. The scroll mapping must spend most of its scroll distance there |
| Direction | He points to the **left** of the frame | Perfect for your marked spot: figure on the **right**, text on the **left**, so he points at your About copy |
| Corner mark | A small ✦ mark in the bottom-right of the frame | Falls outside the subject; the pipeline crops it away |

## 2. Why not just drop the video in

1. **Raw `<video>`**: grey rectangle on black. CSS blend modes (`screen`, `lighten`) would erase his black suit, so no.
2. **Scrubbing `video.currentTime` on scroll**: stutters and lags because normal H.264 only seeks cleanly to keyframes. Reverse scrolling is worse. It is also not "perfect".
3. **Transparent WebM/HEVC video**: works in Chrome, but Safari needs a different alpha format, and scrubbing is still jittery.

**The professional approach (what Apple-style product pages use): a transparent image sequence drawn on a `<canvas>`**, with the frame index driven by scroll progress inside a pinned (sticky) section. It gives pixel-exact scrubbing in both directions, identical results in every browser, and true transparency.

```
clean_anim.mp4
   -> extract frames (drop audio)
   -> AI person matting (transparent PNG per frame)
   -> temporal stabilisation (no edge flicker) + edge polish
   -> shared crop (figure never jitters) + WebP with alpha
   -> canvas player: scroll progress -> frame index (damped)
   -> blended into the black page (mask, glow, rim light)
```

## 3. Step 1 — Assets (already done for you)

I ran this pipeline on your clip and checked the result composited on pure black: clean hair edges, no grey halo, no flicker. Output is in **`about-seq.zip`**:

| Set | Frames | Size each | Total | Use on |
|---|---|---|---|---|
| `desktop/` | 73 | 1000×830 | ~3.4 MB | ≥ 1024 px |
| `mobile/` | 73 | 562×466 | ~1.6 MB | < 1024 px |

Unzip into your project so the paths become:
```
public/about-seq/desktop/frame_0001.webp … frame_0073.webp + manifest.json
public/about-seq/mobile/…
```
I trimmed to source frames 8–80 (the first 8 and last 15 are dead time). Index map of the 73 frames (0-based): **0–13 idle · 14–45 the gesture · 46–72 hold**.

Want it sharper for retina screens? Re-run `tools/process_frames.py` with `--scales 1.0,0.5` (about +2 MB).

## 4. Step 2 — Scroll mapping (the "feel")

Structure: a tall section with a sticky inner stage. The user scrolls through the section while the stage stays pinned and the figure plays.

```tsx
<section id="about" ref={ref} className="relative h-[280vh] bg-black">
  <div className="sticky top-0 h-[100svh] overflow-hidden"> …stage… </div>
</section>
```
`const { scrollYProgress: p } = useScroll({ target: ref, offset: ["start start", "end end"] })`

| Scroll progress `p` | Frame index | What the user sees |
|---|---|---|
| 0.00 → 0.12 | 0 → 14 | Figure settles in, idle breathing |
| 0.12 → 0.62 | 14 → 46 | **Arms rise and point** (50% of the scroll for the 32 frames that move) |
| 0.62 → 1.00 | 46 → 72 | Pointing pose holds while the text finishes revealing |

```ts
const frame = useTransform(p, [0, 0.12, 0.62, 1], [0, 14, 46, 72], { clamp: true });
```
Mapping is intentionally non-linear: linear mapping would waste most of the scroll on idle and hold frames and make the gesture feel rushed.

**Damping (this is what makes it feel premium):** never draw `frame` directly. Chase it: `current += (target - current) * 0.14` every animation frame. Fast flicks glide instead of snapping, and it stops by itself when settled.

**Entry/exit:** before the pin begins (`useScroll` with `offset: ["start end", "start start"]`), the figure rises `y: 60 → 0`, `opacity 0 → 1`, `blur(8px) → 0`.

### Text synced to the gesture
All copy reads the same `p`, so the words appear as he points at them:

| `p` range | Element |
|---|---|
| 0.05 → 0.22 | "ABOUT" label + heading (masked word reveal, same style as the hero name) |
| 0.30 → 0.45 | Paragraph 1 (fade-up + blur-to-sharp) |
| 0.45 → 0.60 | Paragraph 2 |
| 0.58 → 0.70 | **Pointing moment**: a blue gradient bar beside the text sweeps top to bottom once |
| 0.70 → 0.90 | Highlight chips / quick facts stagger in |

## 5. Step 3 — Making him belong on the black background

The cut-out gets you 80%. These make it look like he was shot in this world:

1. **Bottom dissolve.** The footage ends mid-torso. Mask the stage: `mask-image: linear-gradient(to bottom, #000 0%, #000 72%, transparent 100%)`. The suit melts into the page.
2. **Template glow behind him.** Reuse the hero recipe: a `600×600` `bg-blue-900/20 blur-[120px] mix-blend-screen` blob behind his torso, plus a floor spot `radial-gradient(ellipse at 50% 100%, rgba(48,84,255,.18), transparent 60%)`.
3. **Rim light.** Wrapper `filter: drop-shadow(-10px 0 22px rgba(48,84,255,.35))` makes him look lit by the blue curtains. Desktop only (it re-renders per frame).
4. **Colour match.** `filter: contrast(1.05) brightness(.97) saturate(.95)` removes the cool-grey studio cast. Tune by eye.
5. **Seam with the hero.** Make sure the hero's bottom fades to pure black (`absolute bottom-0 h-40 bg-gradient-to-t from-black to-transparent`) so scrolling from the blue curtains into About has no visible edge.
6. **Placement.** Right column, anchored to the bottom of the stage, canvas about `min(48vw, 720px)` wide. Leave a 24 px gap so his fingertips point **at** the text column rather than into it.

## 6. Step 4 — The canvas player (reference logic)

Memory note: 73 decoded frames at 1000×830 is about 240 MB. Keep the compressed files in memory (3.4 MB) and decode only a **window** of about 36 frames around the playhead.

```ts
// SEQ config
export const SEQ = { frames: 73, scrollStops: [0, .12, .62, 1], frameStops: [0, 14, 46, 72], ease: 0.14 };

// loader: fetch blobs once (idle time), decode a sliding window on demand
const blobs: (Blob | undefined)[] = [];
const bitmaps = new Map<number, ImageBitmap>();
const url = (i: number) => `${base}/frame_${String(i + 1).padStart(4, "0")}.webp`;

async function fetchAll() {
  for (let i = 0; i < SEQ.frames; i += 6)            // batches of 6
    await Promise.all([...Array(Math.min(6, SEQ.frames - i))].map(async (_, k) => {
      blobs[i + k] = await (await fetch(url(i + k))).blob();
    }));
}
async function decode(i: number) {
  if (bitmaps.has(i) || !blobs[i]) return;
  bitmaps.set(i, await createImageBitmap(blobs[i]!));
  while (bitmaps.size > 36) {                         // evict the farthest frame
    const far = [...bitmaps.keys()].sort((a, b) => Math.abs(b - i) - Math.abs(a - i))[0];
    bitmaps.get(far)!.close(); bitmaps.delete(far);
  }
}

// render loop: runs only while chasing the target
const tick = () => {
  cur += (target - cur) * SEQ.ease;
  const i = Math.round(cur);
  for (let d = 0; d < 8; d++) {                       // nearest decoded frame wins
    const b = bitmaps.get(i - d) ?? bitmaps.get(i + d);
    if (b) { ctx.clearRect(0, 0, W, H); ctx.drawImage(b, 0, 0); break; }
  }
  for (let d = -6; d <= 10; d++) decode(Math.min(Math.max(i + d, 0), SEQ.frames - 1));  // prefetch ahead
  raf = Math.abs(target - cur) > 0.02 ? requestAnimationFrame(tick) : 0;
};
// frame (motion value) change -> target = v; if (!raf) raf = requestAnimationFrame(tick)
```
- Canvas pixel size = `manifest.json` width/height (CSS scales it). Show frame 0 as a plain `<img>` until the canvas is ready, so there is never an empty gap.
- Start fetching when About is within ~1.5 viewports of the screen (IntersectionObserver), or in `requestIdleCallback` after the hero is interactive, so the hero stays fast.
- On mobile (`< 1024px`) use the `mobile/` set and decode all frames (about 76 MB, fine).

## 7. Mobile, accessibility, performance

- **Mobile:** do not pin the whole stage. Make the figure `sticky top-20` (about 45 vh tall) and let the text scroll beneath it, driven by the same section progress. Skip the drop-shadow rim light.
- **`prefers-reduced-motion`:** no pin, no scrubbing. Show a static `<img>` of frame index 46 (pointing pose) beside the text.
- **A11y:** the canvas is decorative: `aria-hidden="true"`; put the static `<img alt="Mathan Babu S in a black suit pointing toward the About text">` in a `noscript`/fallback.
- **Perf targets:** steady 60 fps while scrolling, no long tasks above 50 ms, total sequence download is 3.4 MB (desktop) or 1.6 MB (mobile), cancel `requestAnimationFrame` and `close()` bitmaps on unmount.
- **Smooth scroll:** the canvas damping already gives the buttery feel. Do not add a smooth-scroll library (Lenis etc.) yet; it can fight sticky positioning and your anchor links.
- Keep the navbar's scroll-spy working: the section is 280 vh tall, so mark "About" active while any part of it is on screen.

## 8. Tuning knobs

| Constant | Effect |
|---|---|
| `h-[280vh]` | Longer = slower, more cinematic playback; shorter = snappier |
| `scrollStops` | Move 0.62 earlier/later to change when the pointing pose lands |
| `ease: 0.14` | 0.08 = floaty and heavy, 0.25 = tight and responsive |
| Mask `72%` | Where the torso starts dissolving |
| Rim-light alpha `.35` | Strength of the blue edge light |
| Blob `blue-900/20` | Strength of the backdrop glow |

## 9. Acceptance checklist

- [ ] No grey rectangle or halo anywhere; the figure sits directly on the black.
- [ ] Scrubbing forward and backward is smooth, with no stutter or flashes.
- [ ] A fast flick glides to rest; the figure never jumps.
- [ ] His fingertips point at the text; the text reveals as he points.
- [ ] Bottom of the torso dissolves; no hard cut line.
- [ ] Hero to About seam is invisible.
- [ ] Mobile uses the small set; reduced-motion shows the static pose.
- [ ] No console errors, memory stays under about 150 MB on desktop.

---

## 10. Paste-ready prompt for your coding assistant

> **Act as a senior React + motion engineer.** In my existing Vite + React + TS + Tailwind portfolio (`motion`, `lucide-react` already installed; hero and glass navbar are done and must not change), replace the placeholder **About** section with a **scroll-scrubbed transparent frame-sequence animation**.
>
> **Assets:** `public/about-seq/desktop/frame_0001.webp…0073.webp` (+ `manifest.json`) and `public/about-seq/mobile/…`. Frames are transparent WebP, 24 fps, 73 frames. Index map (0-based): 0–13 idle, 14–45 gesture (arms raise, point left), 46–72 hold.
>
> **Build:** `components/About/About.tsx`, `ScrollSequence.tsx`, `useFrameLoader.ts`, and `data/portfolio.ts` `about` entries.
> 1. Section `relative h-[280vh] bg-black` with a `sticky top-0 h-[100svh] overflow-hidden` stage. Two columns on `lg`: copy on the left, figure on the right anchored to the bottom (`w-[min(48vw,720px)]`, 24px gap from the copy).
> 2. `useScroll({target, offset:["start start","end end"]})`; `frame = useTransform(p,[0,.12,.62,1],[0,14,46,72])`.
> 3. Canvas player with **damped chase** (`current += (target-current)*0.14`, rAF only while moving), blobs fetched in batches of 6, **sliding decode window of 36 ImageBitmaps** (evict farthest, `close()` on unmount), draw nearest decoded frame as fallback, static first-frame `<img>` until ready. Start loading when About is within 1.5 viewports or on idle.
> 4. Blend into black: bottom mask `linear-gradient(to bottom,#000 0 72%,transparent)`, blue glow blob (`600px bg-blue-900/20 blur-[120px] mix-blend-screen`) + floor radial spot behind the figure, desktop-only rim light `drop-shadow(-10px 0 22px rgba(48,84,255,.35))`, grade `contrast(1.05) brightness(.97) saturate(.95)`.
> 5. Copy synced to `p`: label+heading 0.05–0.22, paragraph 1 0.30–0.45, paragraph 2 0.45–0.60, blue sweep bar at the pointing moment 0.58–0.70, chips 0.70–0.90 (fade-up + blur-to-sharp, same easing `[0.22,1,0.36,1]` as the hero). Use placeholder About copy for now, sourced from the data file.
> 6. Entry: figure rises `y 60→0`, `opacity 0→1`, `blur 8→0` as the section enters.
> 7. Mobile `<1024px`: mobile frame set, no full pin, figure `sticky top-20` (~45vh) with text scrolling under it, no rim light. `prefers-reduced-motion`: static pose image (index 46), no scrubbing. Canvas `aria-hidden`; meaningful `alt` on the fallback image.
> 8. Keep navbar scroll-spy: About stays active across the full 280vh.
> 9. Add a hero bottom gradient (`h-40 from-black`) so hero → About has no seam.
>
> **Deliver:** full code for every new/changed file, a "tuning knobs" list (section height, scroll stops, ease, mask start, glow/rim strength), and any assumptions. 60 fps, no console errors, memory under about 150 MB.
