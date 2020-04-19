# my-react-template

My React + TypeScript template for [VS Code](https://code.visualstudio.com).

[vscode-eslint](https://marketplace.visualstudio.com/items?itemName=dbaeumer.vscode-eslint), [vscode-stylelint](https://marketplace.visualstudio.com/items?itemName=stylelint.vscode-stylelint) and [prettier-vscode](https://marketplace.visualstudio.com/items?itemName=esbenp.prettier-vscode) are required.

```sh
$ yarn install
$ code . & yarn start
```

## Advanced settings

<details>
<summary>With styled-components</summary><br>

See also:

- <https://styled-components.com/docs/tooling#typescript-plugin>
- <https://github.com/Igorbek/typescript-plugin-styled-components>
- <https://styled-components.com/docs/tooling#stylelint>
- <https://github.com/stylelint/stylelint/issues/4481>
- <https://github.com/styled-components/stylelint-processor-styled-components/issues/278>

```sh
$ yarn add styled-components
$ yarn add -D @types/styled-components typescript-plugin-styled-components stylelint-config-styled-components
```

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
+ rules: { "declaration-empty-line-before": null },
}
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
+ rules: { "declaration-empty-line-before": null },
}
```

</details>

<details>
<summary>Migrating to preact</summary><br>

See also:

- <https://preactjs.com/guide/v10/differences-to-react>
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
import "./style.css";

// eslint-disable-next-line @typescript-eslint/no-non-null-assertion
render(<h1>Hello, Preact!</h1>, document.getElementById("root")!);
```

</details>
