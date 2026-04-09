# MMM-Clock-ao

MagicMirror² module template — React 18 + TypeScript + Vite 5 + Tailwind CSS.

## Installation

```bash
cd MagicMirror/modules
git clone https://github.com/alphaorderly/Magic-Mirror-v2-React-module-template.git MMM-Clock-ao
cd MMM-Clock-ao
yarn install
```

## Rename to Your Module Name

```powershell
# Windows
.\rename-module.ps1 MMM-YourModuleName
```
```bash
# Linux / macOS
chmod +x rename-module.sh && ./rename-module.sh MMM-YourModuleName
```

Then rename the directory and init a fresh git repo:
```bash
mv MMM-Clock-ao MMM-YourModuleName
git init && git add . && git commit -m "chore: initial commit"
```

## Configuration (`config/config.js`)

```js
{
  module: 'MMM-Clock-ao',
  position: 'top_right',
  config: {
    dev: false,                // true enables polling reload during development
    updateInterval: 60 * 1000
  }
}
```

## Commands

| Command | Description |
|---------|-------------|
| `yarn dev` | Watch build → `dist/` (use with MagicMirror) |
| `yarn build` | Production build → `dist/` |
| `yarn test:dev` | Standalone dev server at localhost:3000 (no MagicMirror needed) |
| `yarn typecheck` | TypeScript type check |
| `yarn lint` | Lint |
| `yarn format` | Format |

## Accessing Config in React

`src/config.ts` reads the `data-config` attribute injected by the MagicMirror module:

```ts
import { ensureConfig } from './config';

const cfg = ensureConfig() ?? {};
const isDev = !!cfg.dev;
```

## Automated Release

Push a `v`-prefixed tag matching `package.json` version — GitHub Actions builds and uploads a release zip automatically.

```bash
git add package.json
git commit -m "chore: bump version to 0.1.1"
git tag v0.1.1
git push origin main --tags
```

> Tag must exactly match `package.json` version or the workflow will fail.

## Troubleshooting

| Issue | Fix |
|-------|-----|
| Edits not appearing | Run `yarn dev` and set `dev: true` |
| Slow reload | Lower `updateInterval` (e.g. `5000`) |
| 404 dist assets | Run `yarn build` |
| Missing styles | Delete `dist/` and rebuild |

## License

MIT
