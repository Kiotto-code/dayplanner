# Design Brief

## Direction
Cool Serene Minimal — a calm, clarity-focused schedule app with cool blue accents and refined typography.

## Tone
Refined minimalism with cool undertones; trust through clarity and visual hierarchy without decoration.

## Differentiation
Time-based visual progression: past events are muted and faded, current/active slots have a subtle blue background highlight with bold accent bar, future slots are clean cards, completed tasks show a soft sage green accent with checkmark.

## Color Palette

| Token      | Light OKLCH     | Dark OKLCH      | Role                          |
|------------|-----------------|-----------------|-------------------------------|
| background | 0.98 0.008 230  | 0.12 0.01 230   | Cool off-white to cool black  |
| foreground | 0.18 0.015 230  | 0.92 0.008 230  | Deep charcoal to bright white |
| card       | 1.0 0.004 230   | 0.16 0.012 230  | Pure white to slate           |
| primary    | 0.42 0.14 240   | 0.65 0.18 240   | Deep ocean blue (CTAs, active slots) |
| accent     | 0.6 0.15 170    | 0.65 0.18 170   | Sage teal (completed, secondary) |
| muted      | 0.94 0.01 230   | 0.22 0.01 230   | Light grey to dark grey       |
| destructive| 0.55 0.22 25    | 0.55 0.2 25     | Warm red for delete actions   |

## Typography
- Display: Space Grotesk — confident, tech-forward headers and time labels
- Body: DM Sans — friendly, highly readable for descriptions and UI text
- Scale: Hero `text-3xl font-bold`, h2 `text-xl font-semibold`, label `text-sm font-medium`, body `text-base`

## Elevation & Depth
Subtle card elevation via clean shadows (only `shadow-sm` for cards). No decorative shadows or blur effects. Depth through layering and border treatment, not visual noise.

## Structural Zones

| Zone       | Background          | Border              | Notes                                  |
|------------|---------------------|---------------------|----------------------------------------|
| Header     | card with border-b  | border-primary/20   | Current date, app title                |
| Content    | background (clean)  | —                   | Time slot cards on clean background    |
| Time Slot  | card or muted/5     | subtle border       | Past = muted bg, Current = highlight   |
| Footer     | background          | border-t subtle     | Optional action bar if needed          |

## Spacing & Rhythm
Spacious gaps (gap-4 to gap-6 between sections). Compact micro-spacing (px-3 py-2) within time slots. Consistent 8px base rhythm via Tailwind default scale.

## Component Patterns
- Buttons: Ocean blue primary (primary-600), sage accent for secondary, warm red for destructive. Rounded-md (8px), no shadow on default.
- Cards: 8px border-radius, subtle border (border-primary/10), light shadow only on hover.
- Time Slot Cards: Left accent bar (4px width in primary) for active/current slots. Strikethrough text for past events.
- Badges: Sage green for completed, muted grey for future, primary blue for active.

## Motion
- Entrance: Slot cards fade in on load (100ms stagger). Smooth opacity transition.
- Hover: Card shadow expands, subtle background shift on interactive elements (transition-smooth 0.2s).
- Decorative: None. Motion is purposeful and minimal.

## Constraints
- No gradients, no blur effects, no decorative ornamentation.
- Radii: 8px (md) for cards, 6px (sm) for inputs/buttons.
- Spacing: Always multiples of 4px (Tailwind defaults).
- Dark mode: Invert L (lightness) while keeping C (chroma) and H (hue) stable.

## Signature Detail
Clear time-based visual state: past slots fade to muted grey (showing temporal progression), current slot has a bold left accent bar in ocean blue with subtle background highlight, future slots remain clean and minimal. This creates an at-a-glance understanding of schedule state without text scanning.
