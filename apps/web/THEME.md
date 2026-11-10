# Theme and style guide

TransitOps is dark-only. Build UI from the tokens below, never from raw hex values or Tailwind's
default palette (it is disabled with `--color-*: initial`). Black and white are not available: use
`bg` and `fg`.

## Tokens

| Token          | Value     | Use it for                                           |
| -------------- | --------- | ---------------------------------------------------- |
| `bg`           | `#0B0B0C` | Page background                                      |
| `surface`      | `#17181A` | Cards and panels                                     |
| `border`       | `#2A2C2F` | Borders and dividers                                 |
| `muted`        | `#9A9DA3` | Secondary text                                       |
| `fg`           | `#F5F5F5` | Body text                                            |
| `primary`      | `#00798C` | Fills: primary buttons, active states                |
| `primary-fg`   | `#FFFFFF` | Text on `primary` (5.1:1)                            |
| `primary-text` | `#3FB6C6` | Teal text and links on dark backgrounds, focus rings |
| `warning`      | `#EDAE49` | Status only: delays, degraded service                |
| `danger`       | `#D1495B` | Status only: incidents, errors                       |

## Contrast rules

- `primary` is a fill, never text on `bg` or `surface` (3.9:1). Use `primary-text` for teal text.
- `warning` and `danger` are status-only, never brand or decoration.
- On a `warning` or `danger` fill, the text is `text-bg`.
- Do not use `danger` or `warning` as body text. Use them for fills, borders, icons and badges.

## Focus

Every link and button keeps a visible focus ring:

`focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-primary-text`

## Form controls

Form controls use `border-muted`, because `border` is too faint for input edges.

## Hover

There is no hover color token. Primary buttons use `hover:underline` or no hover change, never a
new hex.

## Spacing

Use Tailwind's default 4px scale.

- Page gutter: `px-4 md:px-8`
- Card: `p-4` with `border border-border rounded bg-surface`
- Gaps: `gap-2` (tight) or `gap-4` (default)
- Section spacing: `space-y-6`
