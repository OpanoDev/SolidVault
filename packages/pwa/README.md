# PWA

The Web Client, a
[Progressive Web App](https://developers.google.com/web/progressive-web-apps).

## Setup

```sh
git clone git@github.com:OpanoDev/SolidVault.git
cd solidvault
npm ci
cd packages/pwa
```

## Building

To build the pwa, simply run the following from within the package directory.

```sh
npm run build
```

### Build options

All build options are provided as environment variables:

| Variable Name   | Description                                        | Default  |
| --------------- | -------------------------------------------------- | -------- |
| `PL_SERVER_URL` | URL to the [server component](../server/README.md) | `./dist` |
| `PL_PWA_DIR`    | Build output directory                             | `./dist` |
| `PL_DISABLE_SW` | Disable web worker                                 | `./dist` |

## Web Server

This package also has a bundled web server, which can be used to serve the web
app:

```sh
npm run start
```

By default the app is hosted on port `3000`. To change the port, you can use
the `PL_PWA_PORT` environment variable:

```sh
PL_PWA_PORT=8081 npm run start
```

Note that this requires the PWA to be [built](#building) first. To build and
serve the app in one step, run:

```sh
npm run build_and_start
```
