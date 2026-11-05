# UI Design System --- Kusumawati Personal Portfolio

**Version:** 1.0\
**Date:** November 4, 2026\
**Product:** Kusumawati Personal Portfolio & Admin Dashboard\
**Visual Direction:** Chemical Engineering · Scientific Editorial ·
Elegant Blue & White

------------------------------------------------------------------------

## 1. Design Intent

Build a polished personal portfolio for a Chemical Engineering graduate
with experience in research and development, laboratory analysis,
industrial processes, publications, and academic organizations.

The visual identity must communicate:

-   **Professional credibility:** suitable for recruiters, industrial
    companies, research institutions, and academic audiences.
-   **Scientific character:** subtle references to chemical engineering,
    laboratory work, molecular structures, and process diagrams.
-   **Personal warmth:** elegant and approachable, with the profile
    photograph as a central identity element.
-   **Clarity:** content, dates, credentials, and supporting documents
    must be easy to scan.
-   **Editorial quality:** intentional typography, whitespace, strong
    hierarchy, and carefully composed imagery.

The design must not look like a generic SaaS landing page, a laboratory
equipment catalog, or a childish science-themed template.

### Design principles

1.  Content and evidence take priority over decoration.
2.  Use blue and white as the dominant visual language.
3.  Use scientific motifs as subtle supporting details, never as
    background noise.
4.  Keep public pages expressive and editorial; keep admin pages
    practical and efficient.
5.  Use consistent tokens and reusable components.
6.  Do not invent profile claims, metrics, awards, or publication
    details to fill empty space.

------------------------------------------------------------------------

## 2. Brand & Visual Direction

### 2.1 Brand personality

  Attribute      Direction
  -------------- ---------------------------
  Professional   High
  Scientific     High
  Elegant        High
  Feminine       Subtle, not stereotypical
  Playful        Low
  Decorative     Restrained
  Technical      Medium
  Minimal        Medium-high

Avoid excessive pink, purple, glitter, cartoon laboratory illustrations,
oversized gradients, and random floating decorations.

### 2.2 Color palette

Use these tokens as the source of truth. Do not introduce arbitrary
colors per component. The primary blue is the StackPlus identity color;
the blue scale is derived from it, while the neutral and semantic scales
remain distinct.

  -----------------------------------------------------------------------
  Token                   Hex                     Usage
  ----------------------- ----------------------- -----------------------
  `--color-primary-950`   `#111111`                 Deep headings

  `--color-primary-900`   Dark blue mix             Pressed surfaces

  `--color-primary-800`   Dark blue mix             Hover surfaces

  `--color-primary-700`   `#0053FF`               StackPlus blue; primary
                                                  interactive elements

  `--color-primary-600`   Blue mix                  Links and accents

  `--color-primary-500`   Blue mix                  Secondary accents

  `--color-primary-300`   Blue mix                  Borders and soft accents

  `--color-primary-200`   Blue mix                  Soft blue surfaces

  `--color-primary-100`   Blue mix                  Blue-tinted surfaces

  `--color-primary-50`    Blue mix                  Very light blue surfaces

  `--color-white`         `#FFFFFF`               Main card and page
                                                  surfaces

  `--color-neutral-950`   `#111111`               Main body text

  `--color-neutral-800`   Tinted neutral            Secondary headings

  `--color-neutral-700`   Tinted neutral            Body text

  `--color-neutral-600`   Tinted neutral            Muted text, only where
                                                  contrast passes

  `--color-neutral-400`   Tinted neutral            Disabled controls and
                                                  subtle borders

  `--color-neutral-300`   Tinted neutral            Borders

  `--color-neutral-200`   Tinted neutral            Dividers

  `--color-neutral-100`   Tinted neutral            Neutral surfaces

  `--color-neutral-50`    Tinted neutral            Soft neutral surfaces

  `--color-success`       `#237A57`               Success feedback

  `--color-warning`       `#A96813`               Warning feedback

  `--color-danger`        `#B83A45`               Destructive actions and
                                                  errors

  `--color-info`          `#0053FF`               Informational feedback
  -----------------------------------------------------------------------

**Color rules**

-   Main public page background: `#FFFFFF`.
-   Main text: `#111111`.
-   Primary button: `#0053FF` with white text.
-   Hover and pressed states use darker StackPlus blue tokens.
-   Secondary button: white background, StackPlus-blue border and text.
-   Use soft blue backgrounds to separate sections, not to fill every
    section.
-   Do not place low-contrast light-blue text on white.
-   Text contrast must meet WCAG AA: 4.5:1 for normal text and 3:1 for
    large text and essential UI graphics.
-   Status colors must always be accompanied by text or an icon; color
    alone must not communicate status.

### 2.3 Gradients

Do not use gradients for the StackPlus homepage or interactive controls.
Use the solid brand blue and neutral surface tokens instead.

### 2.4 Typography

Use **Sora** for bold display headings and **Plus Jakarta Sans** for body
copy and controls, with system sans-serif fallbacks.

  Role                Desktop     Mobile     Weight
  ---------------- ---------- ---------- ----------
  Display / Hero     56--68px   38--46px        700
  H1                     44px       34px        700
  H2                     34px       28px        700
  H3                     24px       21px   650--700
  H4                     19px       18px        600
  Body large             18px       17px        400
  Body                   16px   15--16px        400
  Small                  14px       13px        400
  Caption                12px       12px        500
  Button             14--15px       14px        600

Typography rules:

-   Body line-height: `1.65`.
-   Heading line-height: `1.15–1.25`.
-   Paragraph measure: approximately `60–75` characters per line.
-   Use sentence case for headings and buttons.
-   Avoid all-caps paragraphs. Small uppercase eyebrow labels are
    allowed with letter spacing of `0.08em`.
-   Do not use more than three font weights in one component.

### 2.5 Shape, border, and shadow

  ----------------------------------------------------------------------------------
  Token                   Value                              Usage
  ----------------------- ---------------------------------- -----------------------
  `--radius-sm`           `6px`                              Small controls, tags

  `--radius-md`           `10px`                             Inputs, compact cards

  `--radius-lg`           `16px`                             Standard cards

  `--radius-xl`           `22px`                             Feature cards, image
                                                             frames

  `--radius-2xl`          `28px`                             Hero image panel

  `--radius-pill`         `999px`                            Badges and pill
                                                             controls

  `--border-subtle`       `1px solid #E7EDF2`                Default border

  `--shadow-sm`           `0 2px 8px rgba(16,43,78,.05)`     Inputs and small cards

  `--shadow-md`           `0 10px 28px rgba(16,43,78,.08)`   Hovered cards

  `--shadow-lg`           `0 18px 48px rgba(16,43,78,.12)`   Dialogs and featured
                                                             panels
  ----------------------------------------------------------------------------------

Avoid heavy black shadows, excessive glassmorphism, and thick borders.

------------------------------------------------------------------------

## 3. Layout & Spacing System

Use a consistent 4px spacing base.

  Token          Value
  ------------ -------
  `space-1`        4px
  `space-2`        8px
  `space-3`       12px
  `space-4`       16px
  `space-5`       20px
  `space-6`       24px
  `space-8`       32px
  `space-10`      40px
  `space-12`      48px
  `space-16`      64px
  `space-20`      80px
  `space-24`      96px

### 3.1 Container

-   Maximum content width: `1200px`.
-   Wide editorial sections may extend to `1280px`.
-   Desktop side padding: `40px`.
-   Tablet side padding: `28px`.
-   Mobile side padding: `20px`.
-   Keep text content narrower than the full container where readability
    benefits.

### 3.2 Section spacing

-   Desktop section vertical padding: `88px`.
-   Tablet section vertical padding: `68px`.
-   Mobile section vertical padding: `52px`.
-   Section heading to content gap: `28–36px`.
-   Card grid gap: `20–24px`.
-   Compact list gap: `12–16px`.

### 3.3 Responsive breakpoints

Use these breakpoints consistently:

  Name                       Width
  -------------- -----------------
  Mobile                 `< 640px`
  Tablet            `640px–1023px`
  Desktop          `1024px–1279px`
  Wide desktop          `≥ 1280px`

The layout must remain usable from `360px` through `1920px`. Avoid
horizontal page overflow.

------------------------------------------------------------------------

## 4. Public Website Design

### 4.1 Global navigation

**Desktop**

-   Sticky top navigation.
-   White or near-white surface with subtle bottom border.
-   Brand/name at the left.
-   Navigation links aligned to the right.
-   Language switcher visible.
-   Active page indicated by a blue underline or soft blue pill.
-   Height target: `72px`.

**Mobile**

-   Compact header, height target `64px`.
-   Brand/name and menu trigger.
-   Navigation opens in a clear dropdown or sheet.
-   Language switcher remains accessible.
-   Menu closes after navigation.

Navigation items:

-   Home
-   Education
-   Certification
-   Experience
-   Organization
-   Contact

Interaction:

-   Hover: text shifts to primary blue.
-   Active: clear persistent state.
-   Focus: visible keyboard focus ring.
-   Sticky header must not obscure anchor targets.

### 4.2 Home hero

The hero is the strongest visual expression of the portfolio. It should
feel like a professional editorial profile with a scientific identity,
not a conventional centered SaaS hero.

**Desktop composition**

-   White, asymmetric editorial composition with the owner portrait
    centered in the foreground and no image card or frame.
-   Set the two-line headline in oversized display type behind/around the
    portrait; keep the lettering legible and avoid covering its glyphs.
-   Keep the admin-managed name and professional title, one summary
    sentence, and both existing actions in the hero.
-   Keep the primary action visible at common laptop viewport sizes.

**Content order**

1.  Name and admin-managed professional title.
2.  Headline: `CHEMICAL` in `#111111`, then `ENGINEERING` in `#0053FF`.
3.  The admin-managed professional summary.
4.  Primary CTA: `Explore experience`.
5.  Secondary CTA: `Download CV`.
6.  Contact link.

**Portrait treatment**

-   Use the actual photo supplied by the owner.
-   Never generate a replacement face or alter identity.
-   Prefer a portrait crop with face and upper body visible.
-   Preserve the source photo and its proportions with `object-fit:
    contain`; do not put it in a card or add a frame.
-   Keep the actual subject clear of headline glyphs.
-   Provide meaningful alt text.

**Scientific decoration**

Use at most two or three subtle motifs near the hero, such as a thin
molecular line drawing, small grid, or abstract process line. Keep
decorations behind content and outside the portrait's face area.

**Mobile**

-   Keep the portrait centered and scale it within the viewport.
-   Stack the two actions at narrow widths and keep them at least 44px
    high.
-   Keep the name, title, and headline readable without horizontal
    overflow or text over the face.

### 4.3 Section introduction

Each public page should begin with:

-   Small eyebrow label.
-   Clear page title.
-   One short supporting sentence.
-   Optional subtle scientific line motif.

Example:

`ACADEMIC BACKGROUND`\
`Education`\
`My academic foundation, areas of study, and selected engineering projects.`

Do not repeat the same decorative header illustration on every page.

### 4.4 Education page

Use a clear academic timeline or stacked education panel.

**Education card**

-   Institution.
-   Degree.
-   Period.
-   Location.
-   GPA, if appropriate.
-   Small institution mark or neutral icon.
-   View details action.

**Academic project cards**

-   Project title.
-   One- or two-line summary.
-   Category or research area.
-   Optional cover image.
-   View details action.

Use a responsive grid: three columns on wide desktop, two on tablet, one
on mobile. If titles are long, allow natural wrapping; do not truncate
important project names.

### 4.5 Certification page

Use category tabs or filter chips:

-   All
-   Certifications
-   Training
-   Journals
-   Patents

Cards should make the type and year immediately scannable.

**Card content**

-   Category label.
-   Title.
-   Issuer or publication source, when available.
-   Year.
-   View details action.
-   Small document or external-link indicator when relevant.

Do not use a large certificate thumbnail for every item if it makes the
page visually noisy. Use a consistent document preview treatment.

### 4.6 Experience page

Provide three clear categories:

-   Work
-   Internship
-   Speaker

Use segmented tabs on desktop and a horizontally scrollable tab row on
mobile if necessary.

**Experience card**

-   Organization name.
-   Position.
-   Period.
-   Location.
-   Short summary.
-   Optional logo or image.
-   `View details` action.

Keep company logos visually consistent: use a fixed image box,
`object-fit: contain`, and neutral background where required. If no logo
exists, use a simple neutral institution icon; do not invent a logo.

**Experience popup**

-   Desktop maximum width: `760px`.
-   Mobile: near full-screen dialog with internal scrolling.
-   Header: position, organization, period, location.
-   Body: summary, responsibilities, skills, gallery, and documents.
-   Gallery uses a responsive image grid.
-   Documents appear as clearly labeled rows with file type and
    open/download action.
-   Keep the close button fixed or consistently visible.
-   Focus must remain inside the dialog while open.

### 4.7 Organization page

Use a vertical timeline or clean organization cards.

Each card includes:

-   Organization name.
-   Role.
-   Period.
-   Short contribution summary.
-   Optional event or activity image.
-   View details action.

Avoid treating student organization experience as corporate employment.
Preserve the original role names and context.

### 4.8 Contact page

Use a balanced two-column layout on desktop:

-   Contact introduction and direct contact methods.
-   Contact form.

Direct contact cards:

-   Email.
-   WhatsApp.
-   LinkedIn.
-   Location.

**Form fields**

-   Name.
-   Email.
-   Subject.
-   Message.

**Form states**

  State     Visual treatment
  --------- -----------------------------------------------
  Default   Neutral border, white surface
  Focus     Primary blue border and visible focus ring
  Invalid   Danger border and inline message
  Loading   Disabled submit with spinner and `Sending...`
  Success   Success message with confirmation icon
  Error     Clear error message and retry guidance

On mobile, use one column and full-width submit button.

### 4.9 Footer

Include:

-   Name.
-   Short professional descriptor.
-   Quick navigation.
-   LinkedIn and Email.
-   Copyright year.
-   Optional small `Designed with care` note.

Keep the footer simple, with a deep-blue or white surface depending on
the page composition. Maintain sufficient contrast.

------------------------------------------------------------------------

## 5. Popup, Dialog & Document Preview

All detail popups must follow one consistent interaction pattern.

### 5.1 Dialog dimensions

-   Standard desktop width: `680px`.
-   Large desktop width: `760px`.
-   Maximum height: `min(84vh, 820px)`.
-   Mobile width: `calc(100vw - 24px)`.
-   Mobile maximum height: `90dvh`.
-   Internal content scrolls; the page behind the dialog does not.

### 5.2 Dialog appearance

-   White surface.
-   Radius: `20px` desktop, `16px` mobile.
-   Shadow: `--shadow-lg`.
-   Backdrop: dark navy at approximately 48% opacity.
-   Header and close control remain easy to locate.
-   Use clear section headings and adequate vertical spacing.

### 5.3 Required behavior

-   Open from the relevant card or action.
-   Close with close button.
-   Close with Escape.
-   Close on backdrop click, unless an interaction inside the dialog is
    active.
-   Prevent background scrolling.
-   Trap focus while open.
-   Restore focus to the trigger after closing.
-   Provide an accessible dialog name.
-   On mobile, support comfortable scrolling and touch targets.

### 5.4 Document preview

-   PDF preview may use an embedded viewer when supported.
-   Always provide a separate `Open document` or `Download` action.
-   If preview cannot load, show a clear fallback with filename and
    action.
-   Never render a broken or empty preview frame.

------------------------------------------------------------------------

## 6. Admin Dashboard Design

The admin is a private content management workspace, not a second
marketing website.

### 6.1 Admin shell

**Desktop**

-   Fixed or sticky left sidebar: `248px`.
-   Main content fills remaining width.
-   Header height: `68px`.
-   Content max width: `1440px`.
-   Page padding: `32px`.

**Tablet/mobile**

-   Sidebar becomes a drawer.
-   Header keeps page title and menu control.
-   Tables may become stacked cards or horizontally scroll within their
    own container.
-   Forms use a single column.

### 6.2 Admin navigation

-   Dashboard
-   Profile
-   Education
-   Academic Projects
-   Experience
-   Certifications
-   Publications
-   Patents
-   Organizations
-   Media Library
-   CV & Documents
-   Contact Messages
-   Website Settings

Navigation rules:

-   Active item uses a soft blue background and primary blue text.
-   Icons use one consistent outline style.
-   Keep labels visible; do not rely on icons alone.
-   Include a clear logout action near the bottom or in the account
    menu.

### 6.3 Admin dashboard overview

Use compact statistic cards:

-   Education.
-   Experience.
-   Certifications.
-   Publications.
-   Patents.
-   Organizations.
-   Media assets.
-   Unread messages.

Also include:

-   Recent content updates.
-   Draft count.
-   Published count.
-   Quick actions such as `Add experience` and `Upload asset`.

Do not turn the dashboard into an analytics product. Avoid charts unless
they answer a real content-management question.

### 6.4 Listing pages

Every content listing should have a consistent structure:

1.  Page title and short description.
2.  Primary `Add new` button.
3.  Search field.
4.  Relevant category/status filters.
5.  Table or list.
6.  Pagination when needed.

**Desktop table columns**

-   Title / primary identifier.
-   Category or type.
-   Status.
-   Updated date.
-   Actions.

Use a row action menu for Edit, Preview, and Delete. Do not overcrowd
the table with too many buttons.

**Mobile**

Use stacked list cards with the primary identifier, status, and action
menu. Avoid forcing a wide table onto a narrow viewport.

### 6.5 Create and edit forms

-   Group related fields into clear sections.
-   Use labels above fields.
-   Mark required fields.
-   Show validation messages beside the relevant field.
-   Preserve entered values when validation fails.
-   Provide Save Draft and Publish actions where applicable.
-   Provide Cancel with unsaved-change confirmation when needed.

**Bilingual editor**

Use two clearly labeled tabs or panels:

-   English
-   Bahasa Indonesia

Show a small completion indicator for each language. Do not silently
copy one language into the other.

Recommended field order:

1.  English title and content.
2.  Indonesian title and content.
3.  Shared metadata such as period, location, category, and links.
4.  Media and documents.
5.  Publishing settings.

### 6.6 Media Library

Use a grid/list toggle.

**Grid item**

-   Thumbnail or file-type icon.
-   Filename.
-   File type.
-   File size.
-   Selection state.
-   More actions.

**Upload experience**

-   Clear upload dropzone.
-   Browse files action.
-   Accepted formats and maximum size shown before upload.
-   Upload progress.
-   Success and error feedback.
-   Preview after upload.
-   Ability to select an existing asset from the library.

Do not show a fake progress bar. Progress must reflect the actual upload
state where available.

### 6.7 Contact messages

List view should show:

-   Sender.
-   Subject.
-   Received date.
-   Read status.

Message detail should show the full message and sender information.
Actions should include mark as read/unread, archive, and delete.

### 6.8 Admin feedback states

All admin operations must provide clear feedback:

-   Loading state.
-   Empty state.
-   Validation error.
-   API error.
-   Success toast.
-   Delete confirmation.
-   Upload failure and retry.

Use consistent button and status patterns throughout the dashboard.

------------------------------------------------------------------------

## 7. Component Specifications

### 7.1 Buttons

  Variant     Appearance                       Usage
  ----------- -------------------------------- -------------------------
  Primary     `#0053FF` fill, white text       Main CTA, save, publish
  Secondary   White fill, blue border/text     Secondary CTA
  Ghost       Transparent, neutral/blue text   Low-emphasis action
  Danger      Red fill or red text             Destructive action
  Link        Text with optional arrow         Inline navigation

Button sizing:

-   Large: `48px` height, horizontal padding `22px`.
-   Medium: `42px` height, horizontal padding `18px`.
-   Small: `34px` height, horizontal padding `12px`.
-   Minimum touch target: `44px` for primary mobile interactions.

Include a darker-blue hover and pressed state, a StackPlus-blue focus
ring, neutral disabled styling, and loading states. Use the same tokens
in shared variants and direct CTA links; do not use `transition-all`.

### 7.2 Inputs

-   Default height: `44px`.
-   Textarea minimum height: `120px`.
-   Border: `1px solid #D5DDE5`.
-   Radius: `10px`.
-   Horizontal padding: `12px`.
-   Label: `14px`, weight `600`.
-   Helper/error text: `12–13px`.
-   Focus: primary blue border and a subtle 3px focus ring.
-   Invalid: danger border and inline explanation.

### 7.3 Cards

Standard card:

-   White surface.
-   `1px` subtle border.
-   `16px` radius.
-   `20–24px` internal padding.
-   Subtle shadow only when useful.
-   Hover: border becomes soft blue and card rises by at most `2px`.

Featured card may use a soft blue surface or larger image, but must
preserve text contrast.

### 7.4 Badges and tags

-   Height: `24–28px`.
-   Pill radius.
-   Small text: `12–13px`.
-   Soft blue background with dark-blue text for neutral categories.
-   Status badges use semantic colors and text labels.
-   Do not use badges for every piece of metadata.

### 7.5 Tabs

-   Height: `40–44px`.
-   Active tab has a clear blue indicator or filled soft-blue surface.
-   Inactive tabs remain readable.
-   Mobile tabs may scroll horizontally.
-   Keyboard navigation must work.

### 7.6 Toasts

-   Position: top-right on desktop; near top with safe margins on
    mobile.
-   Width: max `360px`.
-   Duration: `3–5 seconds` for non-critical feedback.
-   Errors remain visible long enough to read and should not disappear
    before the user can act.
-   Use icon plus text, not color alone.

### 7.7 Confirmation dialog

Use for destructive actions.

-   State exactly what will be deleted.
-   Primary destructive action uses danger styling.
-   Secondary action is Cancel.
-   Never make Delete the default focused action.
-   If a media asset is still referenced, explain why deletion is
    blocked or what must be resolved.

------------------------------------------------------------------------

## 8. Iconography & Scientific Motifs

Use one consistent outline icon family, preferably Lucide.

Icon sizing:

-   Small: `16px`.
-   Standard: `20px`.
-   Large: `24px`.
-   Feature icon: `28–32px`.

Suggested icon concepts:

-   Education: graduation cap or book.
-   Certification: award or badge-check.
-   Experience: briefcase or flask-conical.
-   Organization: users or network.
-   Contact: mail or send.
-   Publications: file-text or book-open.
-   Laboratory: flask-conical, microscope, atom.

Scientific motifs may include:

-   Molecular bond lines.
-   Hexagonal molecular structures.
-   Fine technical grids.
-   Abstract process-flow connectors.
-   Minimal line illustrations of laboratory glassware.

Rules:

-   Decorative motifs must be non-interactive and hidden from assistive
    technology.
-   Do not use scientific icons as substitutes for actual project
    photographs.
-   Do not use multiple unrelated illustration styles.
-   Keep motif opacity low enough that content remains dominant.

------------------------------------------------------------------------

## 9. Motion & Interaction

Motion should feel restrained and purposeful.

  Interaction         Specification
  ------------------- --------------------
  Button hover        `150ms` ease
  Card hover          `180ms` ease
  Dialog open/close   `200ms` ease-out
  Dropdown            `150ms` ease
  Section reveal      `250–350ms`
  Loading indicator   Continuous, subtle

Rules:

-   Prefer transform and opacity animations.
-   Avoid animating layout dimensions where possible.
-   No parallax that interferes with reading.
-   No automatic carousels required.
-   Respect `prefers-reduced-motion`.
-   Keep initial content visible and useful if animation does not run.

------------------------------------------------------------------------

## 10. Responsive Behavior

### Mobile: 360px--639px

-   One-column content layout.
-   Compact header with drawer navigation.
-   Hero text and portrait stacked.
-   Full-width or comfortably sized CTA buttons.
-   One-column cards.
-   Dialogs nearly full-screen.
-   Forms use one column.
-   Admin sidebar becomes a drawer.
-   Tables become stacked cards or contained horizontal scrolling.

### Tablet: 640px--1023px

-   Two-column grids where content permits.
-   Hero may use balanced two-column layout on wider tablets; stack when
    space is limited.
-   Admin sidebar may collapse to a drawer or compact rail.
-   Dialogs remain centered with safe margins.

### Desktop: 1024px and above

-   Two-column hero.
-   Two- or three-column content grids.
-   Sticky public navbar.
-   Persistent admin sidebar.
-   Dialogs centered with controlled width.
-   Generous whitespace and readable content width.

At all widths:

-   No horizontal body overflow.
-   No clipped headings or buttons.
-   No overlapping image and text.
-   Touch targets remain usable.
-   Long publication and project titles wrap naturally.

------------------------------------------------------------------------

## 11. Accessibility Requirements

-   Meet WCAG 2.2 AA where applicable.
-   Normal text contrast: at least `4.5:1`.
-   Large text contrast: at least `3:1`.
-   All interactive elements keyboard accessible.
-   Visible focus indicator.
-   Meaningful image alt text.
-   Decorative images use empty alt text or are hidden from assistive
    technology.
-   Form fields have programmatic labels.
-   Errors are associated with their fields.
-   Dialogs use correct dialog semantics and focus management.
-   Tabs expose selected state.
-   Status is not conveyed by color alone.
-   Support `prefers-reduced-motion`.
-   Maintain logical heading order.
-   Ensure mobile zoom is not disabled.

------------------------------------------------------------------------

## 12. Image & Document Guidelines

### 12.1 Profile photography

-   Use only owner-provided photographs.
-   Prefer high-resolution original files.
-   Use responsive image delivery.
-   Crop consistently without cutting off important facial features.
-   Do not apply artificial face replacement or identity-changing
    filters.
-   Do not use a stock photo as a substitute for the owner.

### 12.2 Experience and event gallery

-   Use consistent aspect ratios within each gallery.
-   Prefer `4:3` for activity and laboratory photographs.
-   Prefer `16:9` for presentation slides and wide event photos.
-   Use `object-fit: cover` for photography and `contain` for
    logos/documents.
-   Clicking an image may open a larger lightbox.
-   Provide alt text.

### 12.3 Documents

-   Display file title and type.
-   PDF preview should have a fallback open/download action.
-   Do not embed huge documents automatically on initial page load.
-   Use clear labels for certificate, journal, patent, CV, and
    presentation files.

------------------------------------------------------------------------

## 13. Content & Localization Rules

-   English is the default public language.
-   Indonesian is available through the language switcher.
-   Translate interface labels, headings, descriptions, buttons,
    validation messages, empty states, and dialog labels.
-   Preserve official organization names, publication titles, degree
    names, instrument names, and technical terms where translation would
    reduce accuracy.
-   Do not fabricate missing content.
-   Do not invent metrics, participant counts, research outcomes,
    verification links, or institutional logos.
-   If a field is missing, omit that field or show a neutral fallback.
-   Dates must use a consistent format within each language.
-   Ensure longer Indonesian and English strings do not break layouts.

------------------------------------------------------------------------

## 14. UI States & Quality Checklist

Every interactive area must account for the following states where
relevant:

-   Default.
-   Hover.
-   Focus-visible.
-   Active/selected.
-   Disabled.
-   Loading.
-   Empty.
-   Success.
-   Error.
-   Validation error.

Before declaring UI complete, verify:

-   [ ] Public navigation works on desktop and mobile.
-   [ ] Admin navigation works on desktop and mobile.
-   [ ] Hero image crop is correct.
-   [ ] All text has sufficient contrast.
-   [ ] Cards align consistently.
-   [ ] Long titles wrap without clipping.
-   [ ] Popup scroll and close behavior work.
-   [ ] Document preview fallback works.
-   [ ] Upload progress and errors are understandable.
-   [ ] Form validation and feedback are visible.
-   [ ] English and Indonesian layouts both work.
-   [ ] No horizontal overflow at 360px.
-   [ ] Keyboard focus is visible.
-   [ ] Reduced-motion preference is respected.
-   [ ] No placeholder or fabricated content is presented as real.

------------------------------------------------------------------------

## 15. Implementation Rules for AI Agents

This file is the UI source of truth for the Kusumawati Personal
Portfolio.

Before implementing UI:

1.  Read this entire `ui.md`.
2.  Read the project PRD.
3.  Inspect the existing Maincore architecture and conventions.
4.  Reuse existing design tokens, components, and utilities where
    available.
5.  Do not create a parallel design system if an equivalent system
    already exists.
6.  Do not change backend architecture while working on frontend UI.
7.  Do not add unrequested pages or features.
8.  Do not invent portfolio content or visual assets.
9.  Keep public portfolio and admin dashboard visually related but
    optimized for their different purposes.
10. Verify responsive behavior and all interaction states before
    considering a component complete.

**Priority order when making design decisions:**

1.  PRD functional requirements.
2.  This `ui.md` visual and interaction specifications.
3.  Existing Maincore conventions and project constraints.
4.  Accessibility, responsiveness, and performance.

If a requirement conflicts with the existing architecture, report the
conflict and propose the smallest compatible solution instead of
silently replacing established conventions.
