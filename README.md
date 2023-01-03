# MPA toolkit

## Requirements

- pnpm
- Docker
- AWS credentials setup ([docs](https://docs.aws.amazon.com/cli/latest/userguide/cli-configure-files.html))

## Getting started

1. Fill out `.env.local` file (see `.env.local.example` for required keys)

2. Run setup script

```
pnpm run setup
```

3. Run dev server

```
pnpm dev
```

## VSCode settings

Install the following extensions:

- EditorConfig for VS Code (to make use of the `.editorconfig` file)
- ESLint
- Prettier
- Svelte for VS Code
- Prisma (provides syntax highlighting for prisma schema)

Some local settings (`.vscode/settings.json`):

```
{
  "eslint.validate": [ "svelte" ],
  "svelte.enable-ts-plugin": true,
  "[svelte]": {
    "editor.formatOnSave": true,
    "editor.defaultFormatter": "svelte.svelte-vscode"
  },
  "[typescript]": {
    "editor.formatOnSave": true,
    "editor.defaultFormatter": "esbenp.prettier-vscode"
  },
}
```
