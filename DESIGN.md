---
name: Digital Asset Integrity
colors:
  surface: '#051424'
  surface-dim: '#051424'
  surface-bright: '#2c3a4c'
  surface-container-lowest: '#010f1f'
  surface-container-low: '#0d1c2d'
  surface-container: '#122131'
  surface-container-high: '#1c2b3c'
  surface-container-highest: '#273647'
  on-surface: '#d4e4fa'
  on-surface-variant: '#c3c6d7'
  inverse-surface: '#d4e4fa'
  inverse-on-surface: '#233143'
  outline: '#8d90a0'
  outline-variant: '#434655'
  surface-tint: '#b4c5ff'
  primary: '#b4c5ff'
  on-primary: '#002a78'
  primary-container: '#2563eb'
  on-primary-container: '#eeefff'
  inverse-primary: '#0053db'
  secondary: '#4edea3'
  on-secondary: '#003824'
  secondary-container: '#00a572'
  on-secondary-container: '#00311f'
  tertiary: '#ffb596'
  on-tertiary: '#581e00'
  tertiary-container: '#bc4800'
  on-tertiary-container: '#ffede6'
  error: '#ffb4ab'
  on-error: '#690005'
  error-container: '#93000a'
  on-error-container: '#ffdad6'
  primary-fixed: '#dbe1ff'
  primary-fixed-dim: '#b4c5ff'
  on-primary-fixed: '#00174b'
  on-primary-fixed-variant: '#003ea8'
  secondary-fixed: '#6ffbbe'
  secondary-fixed-dim: '#4edea3'
  on-secondary-fixed: '#002113'
  on-secondary-fixed-variant: '#005236'
  tertiary-fixed: '#ffdbcd'
  tertiary-fixed-dim: '#ffb596'
  on-tertiary-fixed: '#360f00'
  on-tertiary-fixed-variant: '#7d2d00'
  background: '#051424'
  on-background: '#d4e4fa'
  surface-variant: '#273647'
typography:
  headline-xl:
    fontFamily: Geist
    fontSize: 48px
    fontWeight: '700'
    lineHeight: 56px
    letterSpacing: -0.02em
  headline-lg:
    fontFamily: Geist
    fontSize: 32px
    fontWeight: '600'
    lineHeight: 40px
    letterSpacing: -0.01em
  headline-lg-mobile:
    fontFamily: Geist
    fontSize: 24px
    fontWeight: '600'
    lineHeight: 32px
    letterSpacing: -0.01em
  headline-md:
    fontFamily: Geist
    fontSize: 24px
    fontWeight: '600'
    lineHeight: 32px
  body-lg:
    fontFamily: Geist
    fontSize: 18px
    fontWeight: '400'
    lineHeight: 28px
  body-md:
    fontFamily: Geist
    fontSize: 16px
    fontWeight: '400'
    lineHeight: 24px
  body-sm:
    fontFamily: Geist
    fontSize: 14px
    fontWeight: '400'
    lineHeight: 20px
  label-md:
    fontFamily: Geist
    fontSize: 12px
    fontWeight: '600'
    lineHeight: 16px
    letterSpacing: 0.05em
  mono-md:
    fontFamily: Geist
    fontSize: 14px
    fontWeight: '500'
    lineHeight: 20px
    letterSpacing: 0em
rounded:
  sm: 0.125rem
  DEFAULT: 0.25rem
  md: 0.375rem
  lg: 0.5rem
  xl: 0.75rem
  full: 9999px
spacing:
  base: 8px
  container-max-width: 1280px
  gutter: 24px
  margin-mobile: 16px
  margin-desktop: 40px
  stack-sm: 4px
  stack-md: 12px
  stack-lg: 24px
---

## Brand & Style

The design system is engineered to bridge the gap between institutional real estate investment and high-velocity blockchain technology. The brand personality is **authoritative, precise, and visionary**, projecting the stability of physical property through the lens of digital liquidity.

The visual style is **Corporate Modern with High-Fidelity Glassmorphism**. This approach utilizes deep, saturated backgrounds to establish a sense of "vault-like" security, while employing translucent, glass-like layers to represent the transparency of the Avalanche blockchain. The interface prioritizes clarity and high-data density without sacrificing aesthetic refinement, ensuring that complex financial transactions feel effortless and secure.

Key stylistic markers include:
- **Atmospheric Depth:** Layered surfaces with varying degrees of transparency.
- **Precision Lines:** Ultra-thin strokes that define boundaries without adding visual bulk.
- **Luminous Accents:** Subtle glows and gradients that draw attention to primary actions and "success" states.

## Colors

The palette is optimized for a native dark-mode experience, emphasizing high contrast for readability and a premium "fintech" atmosphere.

- **Primary (Cobalt Blue):** Used for primary actions, active states, and brand-critical indicators. It represents intelligence and the technological foundation of the platform.
- **Secondary (Emerald Green):** Used exclusively for "Success" states, positive market movement, and finalized transactions. In the absence of red tones, this color carries significant weight in the user journey.
- **Neutrals (Slate & Navy):** These form the structural foundation. The background is a deep slate to prevent pure-black eye strain, while lighter slate tones define surfaces and containers.
- **Accents:** Utilize subtle gradients from the primary cobalt into deeper shades to create a sense of light-source directionality.

## Typography

This design system utilizes **Geist** for its technical precision and exceptional legibility in data-heavy environments. The typeface evokes a developer-centric accuracy that aligns with Web3 values while maintaining the elegance required for high-value real estate.

- **Headlines:** Use Bold and Semi-Bold weights with tight letter-spacing to create a strong, institutional "voice."
- **Body:** Regular weight is preferred for maximum readability on dark backgrounds. Ensure line heights are generous to prevent text blocks from feeling "heavy."
- **Labels:** Uppercase labels with increased letter-spacing are used for metadata, section headers, and micro-copy.
- **Numerical Data:** Geist's tabular figures should be utilized for wallet balances and property valuations to ensure vertical alignment in data tables.

## Layout & Spacing

The layout is built on a **12-column fixed grid** for desktop environments, providing a structured, trustworthy framework for financial data. 

- **Grid Logic:** Use a 1280px maximum container width. On mobile, transition to a single-column fluid layout with 16px side margins.
- **The 8px Rule:** All spatial relationships (padding, margin, component heights) must be multiples of 8px to maintain mathematical harmony.
- **Density:** The design system favors a "comfortable" density. While data must be accessible, use negative space to separate distinct functional areas (e.g., separating the property portfolio from the wallet controls).
- **Reflow:** On tablets, the 12-column grid collapses to 8 columns. Sidebars should transition to collapsible drawers or bottom-navigation bars on mobile devices.

## Elevation & Depth

Visual hierarchy is established through **Glassmorphism and Tonal Layering** rather than traditional drop shadows.

- **Level 0 (Base):** The #0f172a background. Everything sits on this foundation.
- **Level 1 (Surfaces):** Cards and main containers. Use a subtle fill (#1e293b at 60% opacity) with a `backdrop-filter: blur(12px)`. Apply a 1px solid border (#ffffff at 10% opacity) to define the edge.
- **Level 2 (Overlays):** Modals and dropdowns. These require a higher blur (24px) and a slightly brighter border (#ffffff at 20% opacity) to signify they are closer to the user.
- **Interaction:** Hovering over Level 1 elements should trigger a subtle primary-colored outer glow (`box-shadow: 0 0 15px rgba(37, 99, 235, 0.2)`), simulating a light source from behind the glass.

## Shapes

The shape language is **Soft (0.25rem base)**, emphasizing precision and professional rigor.

- **Standard Elements:** Buttons, inputs, and small chips use a 4px (0.25rem) radius.
- **Containers:** Large cards and section wrappers use an 8px (0.5rem) radius.
- **Web3 Elements:** Wallet addresses and transaction hashes may use "Pill" shapes (full rounding) to distinguish them as unique blockchain identifiers, separate from standard UI controls.
- **Borders:** Always use a 1px stroke. Avoid thick borders which can appear "clunky" and detract from the premium, high-fidelity aesthetic.

## Components

### Buttons
- **Primary:** Solid Cobalt Blue fill with white text. High-contrast, no shadow, 4px radius.
- **Secondary:** Transparent background with a 1px Cobalt Blue border.
- **Success/Mint:** Emerald Green fill, used specifically for "Buy," "Confirm," or "Mint" actions.

### Input Fields
- **Default State:** Deep navy fill (#020617) with a 1px border (#1e293b).
- **Active State:** Border changes to Cobalt Blue with a subtle inner glow.
- **Icons:** Use linear, 2px stroke icons for currency and property types.

### Cards (Property & Assets)
- Glassmorphic style as defined in the Elevation section. 
- Headers within cards should use the `label-md` style for categories (e.g., "RESIDENTIAL," "COMMERCIAL").
- Valuations should be displayed in `headline-md` Geist.

### Chips & Badges
- Used for property status (e.g., "Verified," "On-Chain").
- Subtle background tints (10% opacity of the status color) with high-contrast text.

### Progress Bars (Funding)
- Track: Deep Navy (#020617).
- Fill: Linear gradient from Primary Cobalt to Secondary Emerald to indicate "growth" and completion.

### Additional Components
- **Wallet Status:** A persistent header component showing the connected Avalanche wallet address and native token balance, styled as a glass-morphic pill.
- **Data Tables:** Used for transaction history. Rows should have a subtle hover highlight (#ffffff at 5% opacity).