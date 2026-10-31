---
version: alpha
name: "App landing page template by 8B"
description: "Landing page for a mobile app or SaaS product with a warm paper, espresso and navy palette and one green accent; Free HTML template by 8B, MIT."
colors:
  primary: "#1b1411"
  secondary: "#1f3954"
  tertiary: "#33cc7a"
  surface: "#faf5f0"
  surface-deep: "#eee5dc"
  on-surface: "#1b1411"
  caption: "#66574f"
  navy-text: "#bacde0"
  night: "#2e241f"
  muted-on-dark: "#b8aba3"
typography:
  headline-display:
    fontFamily: Host Grotesk
    fontSize: 100px
    fontWeight: 600
    lineHeight: 0.96
    letterSpacing: -0.045em
  headline-lg:
    fontFamily: Host Grotesk
    fontSize: 80px
    fontWeight: 600
    lineHeight: 1
    letterSpacing: -0.04em
  headline-md:
    fontFamily: Host Grotesk
    fontSize: 23px
    fontWeight: 600
    lineHeight: 1.2
    letterSpacing: -0.02em
  body-lg:
    fontFamily: Host Grotesk
    fontSize: 21px
    fontWeight: 400
    lineHeight: 1.45
    letterSpacing: -0.01em
  body-md:
    fontFamily: Host Grotesk
    fontSize: 17px
    fontWeight: 400
    lineHeight: 1.55
  body-sm:
    fontFamily: Host Grotesk
    fontSize: 16px
    fontWeight: 400
    lineHeight: 1.5
  label-md:
    fontFamily: Host Grotesk
    fontSize: 15px
    fontWeight: 600
    lineHeight: 1.25
    letterSpacing: -0.005em
  caption:
    fontFamily: Host Grotesk
    fontSize: 13px
    fontWeight: 400
    lineHeight: 1.5
  button:
    fontFamily: Host Grotesk
    fontSize: 16px
    fontWeight: 600
    lineHeight: 1.2
    letterSpacing: -0.005em
rounded:
  sheet: 56px
  card: 28px
  bubble: 20px
  field: 14px
  tail: 5px
  full: 1000px
spacing:
  gutter: 56px
  gutter-min: 18px
  section-y: 144px
  section-y-min: 80px
  content-max: 1408px
  nav-max: 1344px
  column-gap: 64px
  head-row-gap: 24px
  step-gap: 20px
  card-gap: 16px
components:
  button-primary:
    backgroundColor: "{colors.tertiary}"
    textColor: "{colors.primary}"
    typography: "{typography.button}"
    rounded: "{rounded.full}"
    padding: 14px 26px
    height: 52px
  button-dark:
    backgroundColor: "{colors.primary}"
    textColor: "{colors.surface}"
    typography: "{typography.button}"
    rounded: "{rounded.full}"
    padding: 14px 26px
    height: 52px
  button-compact:
    backgroundColor: "{colors.tertiary}"
    textColor: "{colors.primary}"
    typography: "{typography.label-md}"
    rounded: "{rounded.full}"
    padding: 10px 20px
    height: 44px
  nav-bar:
    backgroundColor: rgba(27, 20, 17, 0.8)
    textColor: "{colors.surface}"
    rounded: "{rounded.full}"
    padding: 7px 7px 7px 20px
  caption-bubble:
    backgroundColor: "{colors.surface}"
    textColor: "{colors.primary}"
    rounded: "{rounded.bubble}"
    padding: 10px 16px 10px 13px
  caption-bubble-you:
    backgroundColor: "{colors.tertiary}"
    textColor: "{colors.primary}"
    rounded: "{rounded.bubble}"
    padding: 10px 16px 10px 13px
  card-review:
    backgroundColor: "{colors.surface-deep}"
    textColor: "{colors.primary}"
    rounded: "{rounded.card}"
    padding: 24px 24px 22px
  input-field:
    backgroundColor: "{colors.surface}"
    textColor: "{colors.primary}"
    rounded: "{rounded.field}"
    padding: 14px 16px
    height: 52px
---

## Overview

This is a landing page template for a mobile app or a SaaS product. The demo sells a live-captioning app for phone calls, but the structure suits any product with a handful of clear features and a human voice. The one idea is the caption: speech becomes text bubbles, and the page behaves like one, with words resolving as you scroll. Warm paper, espresso and navy bands slide over one another like sheets, and a single green marks everything that is yours or can be tapped. The feeling is calm, trustworthy and easy to read.

## Colors

The palette is warm neutrals plus one navy and one green, laid down as flat full-width bands.

- **Primary (#1b1411):** espresso. Text on paper, the dark bands (the voice panel, the in-person section, the closing photo section, the footer), the dark send button and the nav bar fill at 80 percent.
- **Secondary (#1f3954):** navy. The hero and the calls band.
- **Tertiary (#33cc7a):** green. Primary buttons, "your" caption bubbles, the curved lines in the hero and between places, active toggles, FAQ icon when open. Always a fill with espresso text on it, never small text on paper.
- **Surface (#faf5f0):** warm paper. Page background, text on dark bands, input fill, the other voice's bubbles.
- **Surface-deep (#eee5dc):** second paper tone for review cards, the caption-styles band, the steps band and the contact band.
- **Caption (#66574f):** muted brown for secondary text on paper.
- **Navy-text (#bacde0):** pale blue for lead text on navy.
- **Night (#2e241f):** dark brown fill behind place photos, the closing photo and the Room mode pill.
- **Muted-on-dark (#b8aba3):** tan for small text on espresso.

## Typography

Host Grotesk is the only family. Hierarchy comes from size and weight (400, 500, 600; the animated sample sentence sweeps from 300 to 800). Headlines are semibold with strong negative tracking (-0.04em to -0.045em) and a line height at or just under 1, which makes long sentences read as one block. The hero headline scales from about 42px on a phone to 100px on wide screens, section headings from 36px to 80px, and the lead text from 18px to 21px. Body is regular at 17px (16px for the quieter secondary text); labels are 15px semibold; the small note is 13px. Navigation links and caption bubbles use weight 500 at 15px. The sample caption and the footer wordmark are sized from their character count (`--len`) to fill the width, up to 208px and 448px. Everything is sentence case, with no uppercase and no italics.

## Layout

Content sits in a wrapper up to 1408px wide with side gutters that grow from 18px to 56px. Sections are padded 80px to 144px top and bottom. Section heads are two-column grids (7/5 or 6/5, 64px gap, aligned to the bottom edge), title left and lead right. Below 1024px the nav collapses into a menu button and the places grid drops to two columns; below 768px every grid becomes a single column, panels stack (the read panel above the voice panel), the sticky phone shrinks and the hero photo drops to the bottom of the hero, under the copy. Each section after the hero is a full-width sheet whose rounded top edge overlaps the previous one.

## Elevation & Depth

Depth comes from stacking: sheets lay over sheets, the hero photo fades into navy through a gradient mask, and the phone floats in a sticky column. Two soft shadows exist: a long, tight lift (0 24px 48px -24px, espresso at 60 percent) under caption bubbles, the phone and slider thumbs, and a green glow (0 12px 28px -12px, green at 85 percent) under the primary button. The nav bar is frosted with a 14px blur.

## Shapes

Large soft shapes: sheets have 56px top corners and square bottoms, hidden under the next sheet. Panels, cards and photos use 28px. Caption bubbles are 20px with one 5px corner as the speech tail (bottom left for the other voice, bottom right for you). Buttons, nav bar, pills and tags are fully round (1000px). Inputs are 14px. The phone is drawn in HTML with a 44px body and 34px screen radius. FAQ icons, the endorsement badge and status dots are circles. Icons are line drawings with round caps, 1.6px to 2px strokes. Waveforms are 3px bars with 2px radius.

## Components

- **Buttons:** the primary pill is green with espresso text, 52px high, with a green glow. On hover the label slides 8px left and three small bars animate like a voice. The dark pill is used for the form send button. The compact pill (44px) lives in the nav.
- **Nav bar:** a floating frosted espresso pill, 14px from the top, with the two-stroke logo mark, links and a compact button.
- **Caption bubbles:** paper for the other voice, green for yours, each with a tiny four-bar waveform.
- **Review card:** deep paper, 28px corners, green stars.
- **Input field:** paper fill, 1px espresso border at 55 percent, 14px corners; invalid fields get a green border.

## Motion

The page loads GSAP 3.13.0 with ScrollTrigger and SplitText, and Lenis 1.3.27 for smooth scrolling (lerp 0.085), all from jsDelivr. The motion idea is transcription: speech is shown as bars, then resolves into words. Most scenes are scrubbed to scroll.

- **Hero:** copy rises 28px over 1s and the photo settles from 108 percent scale. Two thin arcs draw in, green dashes flow along them (7s loop) and caption chips ride the curves (8 to 11s loops), all paused off screen. Leaving the hero, the photo zooms to 110 percent while copy and chips rise at different speeds.
- **Headings and leads:** headings reveal line by line from a mask (expo.out, 1s). Lead text brightens word by word from 22 percent opacity. Sheets widen from slightly inset sides.
- **Voice to text:** the stage is pinned; three spoken lines drawn as bars slide into the green panel and become bubbles while the waveform ripples.
- **Calls:** each feature brightens as it reaches mid-screen, the sticky phone adds that step's messages, and on exit the phone shrinks to 80 percent and tilts 7 degrees.
- **Caption styles:** the card grows out of the phone screen, the sample sentence sweeps from weight 300 to 800 and from 80 percent scale to full, then the card flips from light to dark.
- **In person:** places slide sideways on a pinned track, two curved lines draw along, caption pairs rise in.
- **Reviews, steps, closing, footer:** review columns rise at two speeds; step cards stick and stack, each new card dimming the one beneath; the closing photo opens from a small window while the heading clears word by word; the footer wordmark rises and the logo strokes draw.

With reduced motion enabled there is no smooth scrolling, no entrance animation and no pinned scene: panels, places and steps fall back to plain layouts and the page reads in full.

## Do's and Don'ts

- Do keep Host Grotesk as the only family and build hierarchy with size, weight and tight tracking.
- Do use green only for what is yours or tappable: primary buttons, your bubbles, active states.
- Don't put green text on paper; use it as a fill with espresso text.
- Do round the top corners of every full-width band at 56px and let it overlap the previous one.
- Don't add decorative gradient fills (only the dark photo shades and the hero fade exist), extra accent colours or more shadows than the two soft ones.
- Don't turn the phone, waveform or settings controls into flat screenshots; keep them as HTML.
- Do keep body text at 4.5:1 contrast on every band.
- Don't use stock icon sets or sharp rectangles; icons are round-cap line drawings.
- Do keep the Design: 8B footer link unless the site owner asks to remove it.
- Do make sure the page reads in full with reduced motion.
