# obsidian-cooklang

A plugin for displaying cooklang recipes. Using this plugin you can simply display your cooklang recipes by putting 
them in a "cooklang" codeblock.

~~~markdown
```cooklang
Place @toast{1} on a #plate{} and put @mayonnaise{1%tbsp} on it.
```
~~~

Keeping the recipes in seperate codeblocks, allows you to also insert tags and other metadata or even other text into the document.

# Features

This project comes preconfigured with [Typescript](https://www.typescriptlang.org/), [vite](https://vitejs.dev), and
[Rollup.js](https://rollupjs.org).

# Getting Started

Click "use this template" to create your own fork of this repo. Make sure to reference the official sample plugin for
information about how to get started with the Obsidian API and how to submit your plugin to the Community Plugin
Gallery.

```bash
# for local development
npm install
npm run dev
// Or yarn dev

# for a production bundle
npm install
npm run build
// Or yarn build

# change version
npm bumpversion
// Or yarn bumpversion
```

# Stats

The production output of this sample plugin is ~10 KB.

```
./styles.css   0.44 KiB / gzip: 0.19 KiB
./main.js      12.63 KiB / gzip: 3.70 KiB
```

## API Documentation

See https://github.com/obsidianmd/obsidian-api
