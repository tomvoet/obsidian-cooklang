# Obsidian Cooklang

Render [Cooklang](https://cooklang.org/) recipes inside Obsidian. Write a recipe in a
`cooklang` code block and the plugin renders the ingredients, cookware, timers and steps.

~~~markdown
```cooklang
Place @toast{1} on a #plate{} and put @mayonnaise{1%tbsp} on it.
```
~~~

Keeping recipes in separate code blocks means you can still add tags, metadata and prose
around them in the same note.

## Features

- Renders ingredients, cookware, timers and step-by-step instructions from a `cooklang` block.
- Built-in countdown timers for any `~{...}` timer in the recipe.

## Development

This plugin is built with [Svelte 5](https://svelte.dev), [Vite](https://vite.dev) and
[TypeScript](https://www.typescriptlang.org/), and uses [pnpm](https://pnpm.io/).

```bash
# install dependencies
pnpm install

# build and rebuild on change
pnpm dev

# type-check and produce a production bundle (main.js + styles.css)
pnpm build

# lint
pnpm lint
```

### Releasing

Bump the version (this runs `version-bump.mjs` to sync `manifest.json` and `versions.json`):

```bash
pnpm version patch   # or minor / major
git push --follow-tags
```

Pushing the tag triggers the GitHub Actions release workflow, which builds the plugin and
attaches `main.js`, `manifest.json` and `styles.css` to a new GitHub release.

## License

[MIT](LICENSE)
