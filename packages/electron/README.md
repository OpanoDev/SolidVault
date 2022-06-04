# Solidvault Desktop app, built with [Electron](https://www.electronjs.org/)

## Building

To build the app, run:

```sh
npm run build
```

The resulting build can be fund in the `dist` folder.

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
