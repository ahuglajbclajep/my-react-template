# my-react-template

A simple React and TypeScript template for VS Code.

```sh
$ git clone -b template git@github.com:ahuglajbclajep/my-react-template.git REPOSITORY && cd $_
$ npm i; npm run dev

$ git branch -m main
$ git remote set-url origin git@github.com:OWNER/REPOSITORY.git
```

## Additional Configuration

<details>
<summary>Using with clsx & prettier-plugin-tailwindcss</summary><br>

See also:

- <https://github.com/lukeed/clsx?tab=readme-ov-file#tailwind-support>
- <https://github.com/tailwindlabs/prettier-plugin-tailwindcss>
- <https://github.com/tailwindlabs/tailwindcss/discussions/7554>

```sh
$ npm i clsx
$ npm i -D prettier-plugin-tailwindcss
```

[.vscode/settings.json](.vscode/settings.json)

```diff
{
  "tailwindCSS.experimental.classRegex": [
-   // e.g. const fooStyle = "bar";
-   "Style\\s*=\\s*['\"`]([^'\"`]*)['\"`];"
+   // e.g. const fooStyle = clsx("bar baz", cond ? "qux" : "quux");
+   ["Style\\s*=\\s*clsx\\(([^\\)]*)\\);", "['\"`]([^'\"`]*)['\"`]"]
  ]
}
```

.prettierrc.mjs

```js
/**
 * @type {import("prettier").Config}
 */
const config = {
  plugins: ["prettier-plugin-tailwindcss"],
  tailwindFunctions: ["clsx"],
};

export default config;
```

[package.json](package.json)

```diff
{
- "prettier": {}
}
```

</details>

<details>
<summary>Using with gh-pages</summary><br>

See also:

```sh
$ npm i -D gh-pages
```

[package.json](package.json)

```diff
{
  "scripts": {
    "preview": "vite preview",
+   "deploy": "npm run build && gh-pages -d dist",
    "lint:type": "tsc",
  }
}
```

</details>
