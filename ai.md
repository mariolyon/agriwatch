# AI Rules: Svelte 5 + SvelteKit + Tailwind CSS + BEM

All AI agents must follow these rules strictly. When in doubt, consult official Svelte 5 / SvelteKit documentation via the Svelte MCP tools before guessing.

---

## 1. Svelte 5 (Runes Only)

Use **Svelte 5 runes** exclusively. Never use legacy Svelte 4 syntax.

### Forbidden patterns

| Legacy (do NOT use)      | Rune equivalent         |
| ------------------------ | ----------------------- |
| `export let prop`        | `let { prop } = $props()` |
| `$: derived = x * 2`    | `let derived = $derived(x * 2)` |
| `$: { sideEffect() }`   | `$effect(() => { sideEffect() })` |
| `on:click={handler}`     | `onclick={handler}`     |
| `<slot />`               | `{@render children()}`  |
| `<slot name="x" />`     | `{@render x()}`         |
| `createEventDispatcher`  | Callback props          |

### State & reactivity

- Use `$state()` for mutable local state.
- Use `$state.raw()` for state that is replaced, never mutated (e.g., API responses).
- Use `$derived()` for simple computed values.
- Use `$derived.by(() => { ... })` for multi-step computations.
- **Never** synchronize state inside `$effect` — use `$derived` instead.
(destructured).
- Use `$effect()` sparingly and only for side effects (DOM manipulation, subscriptions, logging). Always return a cleanup function when allocating resources.

### Props
- Destructure component inputs with  `$props()` and provide sensible defaults.
- Use `$bindable()` only when two-way binding is genuinely needed.
- Use `$props.id()` to generate unique IDs for accessibility (label/input pairs).
- Type props with TypeScript interfaces:

```svelte
<script lang="ts">
  interface Props {
    title: string;
    count?: number;
    onclick?: (e: MouseEvent) => void;
    children?: import('svelte').Snippet;
  }

  let { title, count = 0, onclick, children }: Props = $props();
</script>
```

### Snippets

Use `{#snippet}` for repeated local markup instead of extracting trivial components:

```svelte
{#snippet row(item)}
  <tr class="table__row">
    <td class="table__cell">{item.name}</td>
  </tr>
{/snippet}

{#each items as item}
  {@render row(item)}
{/each}
```

### Event handling

- Use standard attribute syntax (e.g., `onclick={handler}`) rather than the old `on:click` syntax.

---

## 2. SvelteKit Patterns

### Project structure

```
src/
  lib/
    components/    — Reusable UI components
    server/        — Server-only modules (DB, auth, secrets)
    utils/         — Shared pure utilities
    types/         — TypeScript type definitions
  routes/          — File-based routing
  params/          — Param matchers
  hooks.server.ts  — Server hooks
  hooks.client.ts  — Client hooks
  app.html         — HTML shell
  app.css          — Global styles / Tailwind entry
```

### Data loading

- Use `+page.server.ts` for data that needs secrets, DB access, or should never reach the client.
- Use `+page.ts` only when the load function must also run client-side (e.g., no server dependency).
- Always type load functions via `import('./$types')`:

```ts
// +page.server.ts
import type { PageServerLoad } from './$types';

export const load: PageServerLoad = async ({ params, fetch }) => {
  const res = await fetch(`/api/weather/${params.city}`);
  if (!res.ok) error(res.status, 'Failed to fetch weather');
  return { weather: await res.json() };
};
```

- Access loaded data via `$page.data` or the `data` prop in the page component:

```svelte
<script lang="ts">
  import type { PageData } from './$types';
  let { data }: { data: PageData } = $props();
</script>
```

### Form actions

- Prefer native `<form method="POST">` with SvelteKit form actions over client-side API calls.
- Use `fail()` to return validation errors.
- Use `use:enhance` for progressive enhancement.

```svelte
<form method="POST" action="?/login" use:enhance>
  <input name="email" type="email" required />
  <button type="submit">Log in</button>
</form>
```

### API routes (`+server.ts`)

- Return proper `Response` objects with correct status codes and `Content-Type` headers.
- Validate input at the boundary.

### Hooks

- `handle` in `hooks.server.ts` — auth guards, request logging, response header injection.
- `handleError` — capture unexpected errors, return safe messages, never leak stack traces.
- `handleFetch` — modify outgoing server-side fetches if needed.

### Error handling

- Use `error(status, message)` from `@sveltejs/kit` for expected errors.
- Create `+error.svelte` pages for user-facing error UI.
- Never expose internal error details to the client.

### Environment variables

- Public: `$env/static/public` (prefixed `PUBLIC_`).
- Private: `$env/static/private` or `$env/dynamic/private`.
- Never import private env vars in client-side code.

---

## 3. Styling: Tailwind CSS + BEM Hybrid

We combine **Tailwind** for layout/spacing utilities with **BEM** for component-scoped identity and theming.

### Guiding principles

1. **Layout & spacing** — Use Tailwind utilities directly in markup: `flex`, `gap-4`, `p-4`, `grid`, etc.
2. **Component identity** — Every meaningful component gets a BEM Block class.
3. **Visual theming** — BEM modifiers + `@apply` keep design-token usage inside `<style>`.
4. **Never** use arbitrary Tailwind values (`w-[347px]`) — define design tokens instead.
5. **Scoped Styles:** Place BEM logic in the `<style>` blocks.  Use `@apply` to pull in Tailwind values into BEM classes to maintain design system consistency.

### BEM naming convention

| Level    | Pattern                    | Example                    |
| -------- | -------------------------- | -------------------------- |
| Block    | `.block`                   | `.card`                    |
| Element  | `.block__element`          | `.card__header`            |
| Modifier | `.block--modifier`         | `.card--expanded`          |
| Both     | `.block__element--modifier`| `.card__button--primary`   |

- Block name = component purpose (kebab-case for multi-word: `.weather-card`).
- Never nest BEM blocks inside each other's naming (`.card__header__title` is wrong — make `.card__title` or a new block).


### Style block conventions

Use `<style lang="postcss">` with nesting and `@apply`:

```svelte
<script lang="ts">
  interface Props {
    title: string;
    variant?: 'default' | 'highlighted';
    children?: import('svelte').Snippet;
  }

  let { title, variant = 'default', children }: Props = $props();
</script>

<article class="weather-card flex flex-col gap-3 p-4 {variant === 'highlighted' ? 'weather-card--highlighted' : ''}">
  <h2 class="weather-card__title text-lg font-semibold">{title}</h2>
  <div class="weather-card__body">
    {@render children?.()}
  </div>
</article>

<style lang="postcss">
  .weather-card {
    @apply border border-gray-200 rounded-xl bg-white shadow-sm transition-shadow;

    &--highlighted {
      @apply border-blue-500 shadow-md;
    }

    &__title {
      @apply text-gray-900;
    }

    &__body {
      @apply text-gray-600 text-sm;
    }
  }
</style>
```

### When to use what

| Concern             | Approach             |
| ------------------- | -------------------- |
| Flexbox / Grid      | Tailwind in markup   |
| Padding / Margin    | Tailwind in markup   |
| Font size / weight  | Tailwind in markup   |
| Colors / borders    | BEM + `@apply`       |
| Hover / focus       | BEM + `@apply`       |
| Animations          | BEM + `@apply`       |
| Responsive layout   | Tailwind breakpoints |
| Component variants  | BEM modifiers        |

---

## 4. TypeScript

- Always use `lang="ts"` in `<script>` blocks.
- Define explicit interfaces for component props, API responses, and shared data shapes.
- Place shared types in `$lib/types/`.
- Prefer `interface` over `type` for object shapes.
- Use `satisfies` for type-safe object literals when needed.
- Avoid `any` — use `unknown` and narrow with type guards.

---

## 5. Component Guidelines

- **One component per file.** File name = PascalCase matching the Block name (`WeatherCard.svelte` -> `.weather-card`).
- **Keep components focused.** If a component exceeds ~150 lines, consider splitting.
- **Compose via children/snippets**, not deep prop drilling.
- **Colocate**: tests, stories, and types next to their component when practical.
- **Barrel exports**: re-export components from `$lib/components/index.ts`.

---

## 6. Accessibility

- Use semantic HTML (`<main>`, `<nav>`, `<article>`, `<button>`, etc.).
- Every `<img>` must have an `alt` attribute (empty `alt=""` for decorative images).
- Interactive elements must be keyboard-accessible. Prefer `<button>` over `<div onclick>`.
- Use `aria-` attributes only when semantic HTML is insufficient.
- Generate unique IDs with `$props.id()` for label-input associations.

---

## 7. Performance

- Use `$state.raw()` for large, read-only data sets (API responses, lists).
- Lazy-load heavy components with `{#await import(...)}` or SvelteKit's dynamic imports.
- Prefer server-side data loading (`+page.server.ts`) to reduce client-side JS.
- Use `loading="lazy"` and `decoding="async"` on images.
- Avoid `$effect` for derived state — it creates unnecessary render cycles.

---

## 8. Code Quality

- No `console.log` in committed code (use `$effect` + proper logging if needed).
- No commented-out code.
- Use early returns to reduce nesting.
- Prefer `const` over `let` when the binding is never reassigned.
- Run the **Svelte Autofixer** MCP tool on all Svelte code before finalizing.

## 9. Storybook
When components are created, a storybook story should also be created with that component.

## 10. Verification
after making changes, check that the applications works, and if not, make further changes until it works.

If a problem can not be solved, ask the human for help.

## 11. Projet Context
@project.md
