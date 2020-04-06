# my-react-template

My React + TypeScript template for [VS Code](https://code.visualstudio.com).

[vscode-eslint](https://marketplace.visualstudio.com/items?itemName=dbaeumer.vscode-eslint), [vscode-stylelint](https://marketplace.visualstudio.com/items?itemName=stylelint.vscode-stylelint) and [prettier-vscode](https://marketplace.visualstudio.com/items?itemName=esbenp.prettier-vscode) are required.

```sh
$ yarn install
$ code . & yarn start
```

## Migrating to preact

See also:

- <https://preactjs.com/guide/v10/differences-to-react/>
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
+   "jsxFactory": "h"
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
