# my-react-template

My simple React + TypeScript template for [VS Code](https://code.visualstudio.com).

[vscode-eslint](https://marketplace.visualstudio.com/items?itemName=dbaeumer.vscode-eslint), [vscode-stylelint](https://marketplace.visualstudio.com/items?itemName=stylelint.vscode-stylelint) and [prettier-vscode](https://marketplace.visualstudio.com/items?itemName=esbenp.prettier-vscode) are required.

```sh
$ yarn install
$ code . & yarn start
```

## Advanced settings

<details>
<summary>With transpileOnly option</summary><br>

See also:

- <https://github.com/TypeStrong/ts-loader/tree/v7.0.2#transpileonly>
- <https://www.typescriptlang.org/docs/handbook/tsconfig-json.html#using-tsconfigjson>

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
<summary>With babel</summary><br>

See also:

- <https://devblogs.microsoft.com/typescript/typescript-and-babel-7>
- <https://github.com/Microsoft/TypeScript-Babel-Starter>
- <https://github.com/babel/babel-loader>
- <https://github.com/babel/babel/issues/10008>
- <https://babeljs.io/docs/en/babel-preset-env>
- <https://github.com/zloirock/core-js/tree/v3.6.5#babelpreset-env>
- <https://babeljs.io/docs/en/babel-plugin-transform-runtime>
- <https://babeljs.io/docs/en/babel-plugin-transform-typescript#caveats>

```sh
$ yarn remove ts-loader
$ yarn add -D babel-loader @babel/core @babel/preset-{typescript,react,env} @babel/plugin-transform-runtime
$ yarn add core-js @babel/runtime
```

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
      { useBuiltIns: "usage", corejs: require("core-js/package.json").version },
    ],
    "@babel/react",
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
  }
}
```

</details>

<details>
<summary>With styled-components</summary><br>

See also:

- <https://styled-components.com/docs/api#typescript>
- <https://styled-components.com/docs/tooling#typescript-plugin>
- <https://github.com/Igorbek/typescript-plugin-styled-components>
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
import React from "react";
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

- <https://github.com/callstack/linaria/issues/420>
- <https://github.com/callstack/linaria/blob/v1.4.0-beta.6/docs/BUNDLERS_INTEGRATION.md>
- <https://github.com/callstack/linaria/issues/197>
- <https://github.com/callstack/linaria/blob/v1.4.0-beta.6/docs/LINTING.md>
- <https://github.com/callstack/linaria/issues/558>

```sh
$ yarn add linaria@beta
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
-       loader: "ts-loader",
+       use: [`linaria/loader?sourceMap=${dev}`, "ts-loader"],
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
import React from "react";
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
- <https://developers.google.com/web/tools/workbox/guides/codelabs/webpack#optional-config>

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

- <https://github.com/typicode/husky/tree/v4.2.5#install>
- <https://github.com/okonet/lint-staged/tree/v10.1.6#examples>

```sh
$ yarn add -D husky lint-staged
```

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
+   "*.{[tj]s{,x},css,json,md}": "prettier --write"
+ }
}
```

If the outputs conflict, you can run tasks serially with `lint-staged -p false`.

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
-   "build": "webpack -p",
+   "build": "rm -rf && webpack -p",
+   "deploy": "npm run build && gh-pages -d dist",
  }
}
```

You must use [rimraf](https://github.com/isaacs/rimraf) instead of `rm -rf` when running in cmd, and [run-s](https://github.com/mysticatea/npm-run-all/blob/master/docs/run-s.md) instead of `&&` when running in powershell (before 7).

</details>

<details>
<summary>With Preact</summary><br>

See also:

- <https://preactjs.com/guide/v10/differences-to-react#jsx-constructor>
- <https://github.com/microsoft/TypeScript/issues/20469>
- <https://github.com/yannickcr/eslint-plugin-react/issues/1955>
- <https://github.com/preactjs/preact-cli/blob/v3.0.0-rc.9/.eslintrc#L20>

```sh
$ yarn remove {,@types/}react{,-dom}
$ yarn add preact
```

[tsconfig.json](tsconfig.json)

```diff
{
  "compilerOptions": {
    "jsx": "react",
+   "jsxFactory": "h",
  }
}
```

[.eslintrc.json](.eslintrc.json)

```diff
{
- "settings": { "react": { "version": "detect" } },
+ "settings": { "react": { "version": "preact", "pragma": "h" } },

  "rules": {
    "react/prop-types": "off",
+   "react/no-unknown-property": [2, { "ignore": ["class"] }]
  }
}
```

[src/index.tsx](src/index.tsx)

```tsx
import { h, render } from "preact";

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
+   "baseUrl": ".",
+   "paths": {
+     "react": ["node_modules/preact/compat"],
+     "react-dom": ["node_modules/preact/compat"]
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
