# Tauri

Native cross-platform app, powered by
[Tauri](https://github.com/tauri-apps/tauri).

## Setup

```sh
git clone git@github.com:OpanoDev/SolidVault.git
cd solidvault
npm ci
cd packages/tauri
```

You also need to follow
[Tauri's setup guide](https://tauri.studio/docs/getting-started/intro/#setting-up-your-environment)

## Building

To build the app, run:

```sh
npm run build
```

The resulting build can be fund in the `dist` folder.

You can also build a debug version of the app, useful for - well - debugging:

```sh
npm run build:debug
```

### Build options

All build options are provided as environment variables:

| Variable Name   | Description                                        | Default  |
| --------------- | -------------------------------------------------- | -------- |
| `PL_SERVER_URL` | URL to the [server component](../server/README.md) | `./dist` |

## Development

For rapid development, there is also dev mode:

```sh
npm run dev
```
