# my-react-template

My simple React + TypeScript template for [VS Code](https://code.visualstudio.com).

[vscode-eslint](https://marketplace.visualstudio.com/items?itemName=dbaeumer.vscode-eslint), [vscode-stylelint](https://marketplace.visualstudio.com/items?itemName=stylelint.vscode-stylelint) and [prettier-vscode](https://marketplace.visualstudio.com/items?itemName=esbenp.prettier-vscode) are required.

```sh
$ yarn install
$ code . & yarn start
```

If you are running in cmd or powershell, use [cross-env](https://github.com/kentcdodds/cross-env) for `NODE_ENV`.

## Advanced settings

<details>
<summary>With transpileOnly option</summary><br>

See also:

- <https://github.com/TypeStrong/ts-loader/tree/v8.0.11#transpileonly>

[webpack.config.js](webpack.config.js)

```diff
{
  module: {
    rules: [
      {
        test: /\.[tj]sx?$/,
-       loader: "ts-loader",
+       loader: "ts-loader?transpileOnly",
        exclude: /node_modules/,
      },
    ],
  },
}
```

[package.json](package.json)

```diff
{
  "scripts": {
+   "lint:type": "tsc -p . --noEmit",
  }
}
```

</details>

<details>
<summary>With tslib</summary><br>

See also:

- <https://www.typescriptlang.org/docs/handbook/release-notes/typescript-2-1.html#support-for-external-helpers-library-tslib>
- <https://github.com/microsoft/tslib/tree/2.0.3#usage>

```sh
$ yarn add tslib
```

[tsconfig.json](tsconfig.json)

```diff
{
  "compilerOptions": {
    "outDir": "dist", // for allowJs
+   "importHelpers": true,
  }
}
```

</details>

<details>
<summary>With polyfills via Babel</summary><br>

See also:

- <https://github.com/babel/babel-loader/tree/v8.2.1#usage>
- <https://babeljs.io/docs/en/babel-plugin-transform-typescript#caveats>
- <https://babeljs.io/docs/en/plugins/#plugin-ordering>
- <https://babeljs.io/docs/en/babel-preset-env#bugfixes>
- <https://github.com/zloirock/core-js/tree/v3.7.0#babelpreset-env>
- <https://github.com/babel/babel/issues/10008>
- <https://github.com/babel/babel-loader/tree/v8.2.1#babel-is-injecting-helpers-into-each-file-and-bloating-my-code>
- <https://github.com/browserslist/browserslist/tree/4.14.7#configuring-for-different-environments>
- <https://create-react-app.dev/docs/supported-browsers-features/#configuring-supported-browsers>
- <https://github.com/Microsoft/TypeScript-Babel-Starter>
- <https://github.com/babel/babel/issues/8121>

```sh
$ yarn remove ts-loader
$ yarn add -D babel-loader @babel/core @babel/preset-{typescript,react,env} @babel/plugin-transform-runtime
$ yarn add core-js @babel/runtime
```

The `@babel/preset-typescript` is not enough to convert all TypeScript syntaxes.
If you want to use the `enum` syntax or stage 3 syntaxes, please set up additional plugins like [babel-plugin-const-enum](https://github.com/dosentmatter/babel-plugin-const-enum).

If `@babel/preset-env` generates code that depends on `regenerator-runtime`, you can suppress this with [babel-plugin-transform-async-to-promises](https://github.com/rpetrich/babel-plugin-transform-async-to-promises), which is also used in [microbundle](https://github.com/developit/microbundle).

[webpack.config.js](webpack.config.js)

```diff
{
  module: {
    rules: [
      {
        test: /\.[tj]sx?$/,
-       loader: "ts-loader",
+       loader: "babel-loader",
        exclude: /node_modules/,
      },
    ],
  },
}
```

[tsconfig.json](tsconfig.json)

```diff
{
  "compilerOptions": {
-   "target": "es6",
+   "target": "esnext",
    "outDir": "dist", // for allowJs
+   "noEmit": true,
+   "isolatedModules": true,
  }
}
```

babel.config.js

```js
module.exports = {
  presets: [
    [
      "@babel/env",
      {
        useBuiltIns: "usage",
        bugfixes: true,
        corejs: require("core-js/package.json").version,
      },
    ],
    ["@babel/preset-react", { runtime: "automatic" }],
    "@babel/typescript",
  ],
  plugins: [
    [
      "@babel/transform-runtime",
      { version: require("@babel/runtime/package.json").version },
    ],
  ],
};
```

[package.json](package.json)

```diff
{
  "scripts": {
+   "lint:type": "tsc",
  },
+ browserslist: "> 0.2%, not dead, not op_mini all, not ie 11"
}
```

</details>

<details>
<summary>With HMR and Fast Refresh (experimental)</summary><br>

See also:

- "With polyfills via Babel" section in this README
- <https://webpack.js.org/guides/hot-module-replacement>
- <https://github.com/facebook/create-react-app/blob/v4.0.0/packages/react-scripts/config/webpack.config.js>
- <https://github.com/facebook/react/issues/16604>
- <https://github.com/pmmmwh/react-refresh-webpack-plugin>

```sh
$ yarn add -D style-loader react-refresh @pmmmwh/react-refresh-webpack-plugin
```

</details>

<details>
<summary>With styled-components</summary><br>

See also:

- <https://styled-components.com/docs/api#typescript>
- <https://styled-components.com/docs/tooling#typescript-plugin>
- <https://github.com/Igorbek/typescript-plugin-styled-components/tree/1.4.4#ts-loader>
- <https://styled-components.com/docs/tooling#stylelint>
- <https://github.com/stylelint/stylelint/issues/4481>
- <https://github.com/styled-components/stylelint-processor-styled-components/issues/278>

```sh
$ yarn add styled-components
$ yarn add -D @types/styled-components typescript-plugin-styled-components stylelint-config-styled-components
```

Since styled-components uses [stylis](https://github.com/thysultan/stylis.js), there is no need to configure [sass-loader](https://github.com/webpack-contrib/sass-loader), [Autoprefixer](https://github.com/postcss/autoprefixer) and [CSS Modules](https://github.com/css-modules/css-modules) (`css-loader?modules`).

If you do not import CSS files, you do not need `css-loader`, `mini-css-extract-plugin` and `optimize-css-assets-webpack-plugin`.

[webpack.config.js](webpack.config.js)

```diff
+ const scTransformer = require("typescript-plugin-styled-components").default;

{
  module: {
    rules: [
      {
        test: /\.[tj]sx?$/,
        loader: "ts-loader",
+       options: {
+         getCustomTransformers: () => ({
+           before: [scTransformer({ minify: true })],
+         }),
+       },
        exclude: /node_modules/,
      },
    ],
  },
}
```

[.stylelintrc.js](.stylelintrc.js)

```diff
module.exports = {
  extends: [
    "stylelint-config-standard",
+   "stylelint-config-styled-components",
  ],
  rules: {
+   "declaration-empty-line-before": null,
  },
}
```

[src/index.tsx](src/index.tsx)

```tsx
import ReactDOM from "react-dom";
import styled from "styled-components";

const Title = styled.h1`
  font-size: 1.5em;
  text-align: center;
`;

ReactDOM.render(<Title>Hello, React!</Title>, document.getElementById("root"));
```

</details>

<details>
<summary>With linaria</summary><br>

See also:

- "With polyfills via Babel" section in this README
- <https://github.com/callstack/linaria/blob/v2.0.2/docs/BUNDLERS_INTEGRATION.md>
- <https://github.com/callstack/linaria/blob/v2.0.2/docs/LINTING.md>
- <https://github.com/callstack/linaria/issues/614>

```sh
$ yarn add linaria
$ echo '.linaria-cache' >> .gitignore
```

Since linaria uses [stylis](https://github.com/thysultan/stylis.js) (as well as styled-components), there is no need to configure [sass-loader](https://github.com/webpack-contrib/sass-loader), [Autoprefixer](https://github.com/postcss/autoprefixer) and [CSS Modules](https://github.com/css-modules/css-modules).

[webpack.config.js](webpack.config.js)

```diff
{
  module: {
    rules: [
      {
        test: /\.[tj]sx?$/,
-       loader: "babel-loader",
+       use: ["babel-loader", `@linaria/webpack-loader?sourceMap=${dev}`],
        exclude: /node_modules/,
      },
    ],
  },
}
```

[.stylelintrc.js](.stylelintrc.js)

```diff
module.exports = {
  rules: {
+   "declaration-empty-line-before": null,
  },
- ignoreFiles: ["node_modules/**", "dist"],
+ ignoreFiles: ["node_modules/**", "dist", ".linaria-cache"],
}
```

[src/index.tsx](src/index.tsx)

```tsx
import { styled } from "linaria/react";
import ReactDOM from "react-dom";

const Title = styled.h1`
  font-size: 1.5em;
  text-align: center;
`;

ReactDOM.render(<Title>Hello, React!</Title>, document.getElementById("root"));
```

</details>

<details>
<summary>With comlink-loader</summary><br>

See also:

- <https://github.com/GoogleChromeLabs/comlink-loader/tree/2.0.0#singleton-mode>
- <https://github.com/GoogleChromeLabs/comlink-loader/issues/1>
- <https://github.com/webpack-contrib/worker-loader/issues/142>
- <https://github.com/GoogleChromeLabs/comlink-loader/blob/2.0.0/src/index.js#L38>

```sh
$ yarn add -D comlink-loader
```

[webpack.config.js](webpack.config.js)

```diff
{
+ output: { globalObject: "self" },
  module: {
    rules: [
+     {
+       test: /\.?worker\.[tj]s$/,
+       loader: "comlink-loader?singleton&name=[name].js",
+     },
      {
        test: /\.[tj]sx?$/,
        loader: "ts-loader",
        exclude: /node_modules/,
      },
    ],
  },
}
```

src/worker.ts

```ts
/* eslint-disable @typescript-eslint/require-await */

export async function greet(subject: string): Promise<string> {
  return `Hello, ${subject}!`;
}
```

[src/index.tsx](src/index.tsx)

```diff
+ import { greet } from "./worker";

+ (async () => console.log(await greet("dog")))();
```

</details>

<details>
<summary>With Workbox</summary><br>

See also:

- <https://developers.google.com/web/tools/workbox/guides/generate-service-worker/webpack>
- <https://developers.google.com/web/tools/workbox/reference-docs/latest/module-workbox-webpack-plugin.GenerateSW>
- <https://github.com/GoogleChrome/workbox/issues/2064>
- <https://github.com/GoogleChrome/workbox/issues/2493>

```sh
$ yarn add -D workbox-webpack-plugin
```

[webpack.config.js](webpack.config.js)

```diff
+ const { GenerateSW } = require("workbox-webpack-plugin");

{
  plugins: [
    new MiniCssExtractPlugin(),
+   new GenerateSW({
+     clientsClaim: true,
+     skipWaiting: true,
+     inlineWorkboxRuntime: true,
+     sourcemap: dev
+   }),
  ],
}
```

[src/index.ejs](src/index.ejs)

```diff
<html>
  <body>
    <div id="root"></div>
+   <!-- prettier-ignore -->
+   <script>
+     addEventListener("load",_=>navigator.serviceWorker.register("./service-worker.js"))
+   </script>
  </body>
</html>
```

</details>

<details>
<summary>With pre-commit hook</summary><br>

See also:

- <https://github.com/typicode/husky/tree/v4.3.0#install>
- <https://github.com/typicode/husky/blob/v5.0.4/LICENSE>
- <https://github.com/okonet/lint-staged/tree/v10.5.1#running-multiple-commands-in-a-sequence>

```sh
$ yarn add -D husky@4 lint-staged
```

If you do not like the LICENSE after `husky@5`, you can also use [lefthook](https://github.com/Arkweid/lefthook) instead.

[package.json](package.json)

```diff
{
+ "husky": {
+   "hooks": {
+     "pre-commit": "lint-staged"
+   }
+ },
+ "lint-staged": {
+   "src/**": "stylelint --fix",
+   "src/**/*.[tj]s{,x}": "eslint --fix",
+   "*": "prettier -wu"
+ }
}
```

If the outputs conflict, you can run tasks serially with `lint-staged -p false`.

</details>

<details>
<summary>With GitHub Actions and Renovate</summary><br>

See also:

- <https://docs.github.com/en/free-pro-team@latest/actions/guides/building-and-testing-nodejs>
- <https://github.community/t/github-actions-branch-conditional/16057>
- <https://docs.renovatebot.com/install-github-app/>
- <https://github.com/ahuglajbclajep/renovate-config#usage>
- <https://github.com/renovatebot/renovate/issues/5411>

.github/workflows/main.yml

```yaml
name: main
on: push
jobs:
  npm-script:
    strategy:
      fail-fast: false
      matrix:
        script: [build, "lint:format", "lint:ts", "lint:css"]
    if: "!contains(github.event.head_commit.message, '[ci skip]')"
    runs-on: ubuntu-latest
    steps:
      - uses: actions/checkout@v2
      - uses: actions/setup-node@v1
        with:
          node-version: 14
      - uses: actions/cache@v2
        with:
          path: ~/.cache/yarn
          key: yarn-${{ hashFiles('**/yarn.lock') }}
          restore-keys: yarn-
      - run: yarn install --frozen-lockfile
      - run: yarn ${{ matrix.script }}
      - if: >
          matrix.script == 'build' &&
          github.event_name == 'push' &&
          github.ref == 'refs/heads/master' &&
          github.event.head_commit.author.name != 'renovate[bot]' &&
          !contains(github.event.head_commit.message, '[deploy skip]')
        uses: peaceiris/actions-gh-pages@v3
        with:
          github_token: ${{ secrets.GITHUB_TOKEN }}
          publish_dir: ./dist
```

If you want to use the `npm`, change it as follows:

```diff
     - uses: actions/cache@v2
       with:
-         path: ~/.cache/yarn
-         key: yarn-${{ hashFiles('**/yarn.lock') }}
-         restore-keys: yarn-
-     - run: yarn install --frozen-lockfile
-     - run: yarn ${{ matrix.script }}
+         path: ~/.npm
+         key: npm-${{ hashFiles('**/package-lock.json') }}
+         restore-keys: npm-
+     - run: npm ci
+     - run: npm run ${{ matrix.script }}
```

.github/renovate.json

```json
{
  "$schema": "https://docs.renovatebot.com/renovate-schema.json",
  "extends": ["github>ahuglajbclajep/renovate-config"]
}
```

</details>

<details>
<summary>With gh-pages</summary><br>

```sh
$ yarn add -D gh-pages
```

[package.json](package.json)

```diff
{
  "scripts": {
-   "build": "NODE_ENV=production webpack -p",
+   "build": "rm -rf && NODE_ENV=production webpack -p",
+   "deploy": "npm run build && gh-pages -d dist",
  }
}
```

You need to use [rimraf](https://github.com/isaacs/rimraf) instead of `rm -rf` to run in cmd, and you also need to use [run-s](https://github.com/mysticatea/npm-run-all/blob/master/docs/run-s.md) instead of `&&` to run in powershell (before 7).

</details>

<details>
<summary>With Preact</summary><br>

See also:

- <https://preactjs.com/guide/v10/typescript>
- <https://github.com/preactjs/preact/releases/tag/10.5.0>
- <https://github.com/yannickcr/eslint-plugin-react/issues/1955>
- <https://github.com/preactjs/preact-cli/blob/v3.0.3/.eslintrc#L20>
- <https://preactjs.com/guide/v10/differences-to-react/#raw-html-attributeproperty-names>

```sh
$ yarn remove {,@types/}react{,-dom}
$ yarn add preact
```

[tsconfig.json](tsconfig.json)

```diff
{
  "compilerOptions": {
    "jsx": "react-jsx", // or "react-jsxdev"
+   "jsxImportSource": "preact",
  }
}
```

[.eslintrc.json](.eslintrc.json)

```diff
{
- "settings": { "react": { "version": "detect" } },
+ "settings": { "react": { "version": "preact" } },

  "rules": {
    "react/react-in-jsx-scope": "off"
+   "react/no-unknown-property": ["error", { "ignore": ["class"] }]
  }
}
```

[src/index.tsx](src/index.tsx)

```tsx
import { render } from "preact";

// eslint-disable-next-line @typescript-eslint/no-non-null-assertion
render(<h1>Hello, Preact!</h1>, document.getElementById("root")!);
```

</details>

<details>
<summary>Switching to Preact</summary><br>

See also:

- <https://preactjs.com/guide/v10/getting-started#aliasing-react-to-preact>
- <https://www.typescriptlang.org/docs/handbook/module-resolution.html#path-mapping>
- <https://github.com/preactjs/preact/issues/2150>

```sh
$ yarn remove {,@types/}react{,-dom}
$ yarn add preact
```

[webpack.config.js](webpack.config.js)

```diff
{
- resolve: { extensions: [".ts", ".tsx", ".js", ".jsx"] },
+ resolve: {
+   extensions: [".ts", ".tsx", ".js", ".jsx"],
+   alias: {
+     react: "preact/compat",
+     "react-dom": "preact/compat",
+   },
+ },
}
```

[tsconfig.json](tsconfig.json)

```diff
{
  "compilerOptions": {
    "moduleResolution": "node",
+   "paths": {
+     "react": ["./node_modules/preact/compat"],
+     "react-dom": ["./node_modules/preact/compat"]
+   }
  }
}
```

[.eslintrc.json](.eslintrc.json)

```diff
{
- "settings": { "react": { "version": "detect" } },
+ "settings": { "react": { "version": "preact" } },
}
```

[src/declares.d.ts](src/declares.d.ts)

```ts
// define the missing types yourself
declare namespace React {
  type ChangeEvent<T extends EventTarget> = JSX.TargetedEvent<T>;
}
```

Type definitions with `type` can not be overridden, so type annotations must be added for things like `e.target`.

</details>
