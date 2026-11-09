---
name: web-tailwind-conventions
description: Tailwind CSS v4 styling conventions for the Next.js web app. Use when adding or changing classes, or reusing styles, in apps/web.
---

# Web Tailwind conventions

Skill format: https://code.claude.com/docs/en/skills

## Reusing styles

DRY does not apply to Tailwind classes. Repeating utilities across elements is expected: write them
inline on each element.

- Extract a component only when the element itself (markup and behavior) is reused in many places,
  for example a `<Button>`. That is a component decision, not a way to share classes.
- Do not use `@apply` or `@utility` to share class sets.

Never export class strings as constants (for example `const ACTION_CLASS_NAME = '...'`) to share
them across files. It hides the styling from the markup and is not a Tailwind pattern.

## Setup

- CSS-first configuration: `@import "tailwindcss"` and `@theme`. There is no `tailwind.config.js`.
  Never use `@tailwind` or `@layer utilities`.
- Mind the v4 renamed utilities (`outline-hidden`, `shadow-xs`, `rounded-xs`).

## Interactive elements

Tailwind's preflight reset makes links and buttons look like plain text. Every link and button must:

- look clickable (for example `underline`, or `border px-3 py-1`);
- keep a visible keyboard focus state (for example `focus-visible:outline-2 focus-visible:outline-offset-2`).

## Event handlers

Pass function references directly to event handlers. Only wrap in an arrow when you need to pass
arguments, adapt the signature, or combine calls.

```tsx
// Good: direct reference
<button onClick={retry}>Try again</button>

// Good: the arrow passes an argument
<button onClick={() => select(id)}>Select</button>

// Bad: needless wrapper
<button onClick={() => retry()}>Try again</button>
```
