# Server related Files

This package contains the backend server component.

## How to use

### Directly through Node.js

Currently the `@server/server` package is meant to be run from within the
[server monorepo](../../README.md). A standalone npm package is coming soon!

First, clone and install the monorepo:

```sh
git clone git@github.com:OpanoDev/SolidVault.git
cd solidvault
npm ci
```

Then, you can either start the server from the root of the project...

```sh
npm run server:start
```

Or from the package directory.

```sh
cd packages/server
npm start
```

By default, the server will listen on port `3000`. To can set a different port
via the `PL_TRANSPORT_HTTP_PORT` environment variable:


For more configuration options, please consult the
[this file](https://github.com/OpanoDev/SolidVault/blob/main/docs/examples/config/example.env) section of this readme.

## Configuration

server comes with a lot of configuration options, most of which deal with
selecting and configuring backends for certain aspects of the software.

All configuration options for the package are defined in the
[src/config](src/config.ts) moule, and while we'll be discussing the most
important ones here, looking at the source can be a great way to understand how
configuration options are structured and parsed, and to familiarise yourself
with some of the more advanced configuration options.

Most of configuration happens through environment variables, and
because there are a lot of options and therefore a lot of different variables,
we've come up with a simple naming scheme that's based on the hierarchical
nature of configuration. This means that most of the time, you'll be
able to guess the environment variable name simply by looking at the structure
defined in [src/config](src/config.ts).

The generall pattern is that in order to configure a certain aspect, you'll
first choose which backend you want to use. Then, you'll provide the
configuration options required by that specific backend by setting the
corresponding environment variables, which are name-spaced with the backend's
name.

For example, you can choose which backend to use for data storage by setting the
`PL_DATA_BACKEND` variable. By default, server uses LevelDB for data storage on
the server side. To use PostgreSQL instead, simply set the `PL_DATA_BACKEND`
variable to `postgres`.

```sh
PL_DATA_BACKEND=postgres
```

Naturally,server now needs to know where to reach the Postgres server, so
you'll need to set the corresponding environment variables. Our naming scheme
dictates that all postgres-related configuration options are prefixed with
`PL_DATA_POSTGRES_*`. An exampe for a full postgres configuration might look as
follows:

```sh
PL_DATA_BACKEND=postgres
PL_DATA_POSTGRES_HOST=localhost
PL_DATA_POSTGRES_PORT=5432
PL_DATA_POSTGRES_USER=someuser
PL_DATA_POSTGRES_PASSWORD=somepassword
PL_DATA_POSTGRES_DATABASE=server
```

server is designed to be extremely modular, so you'll find that most aspects of
the software can be configured to use different backends. And if your technology
of choice isn't supported, it's usually fairly straightforward to implement the
required backend. [Pull requests welcome](../../README.md#contributing)!

### Setting Environment Variables

Environment variables can be set either the traditional way (consult the
documentation of your operating system) or via a
[`.env`](https://www.npmjs.com/package/dotenv) file. By default, server will
look for a file named `.env` in the current working directory, but you can also
specifiy the path to a different file using the `--env` flag:

```sh
npm start -- --env=/path/to/env/file/.env
```

Note that by default, environment variables set through other means take
preference over the ones defined in your `.env` file. If you want your `.env`
file to override any variables set elsewhere, use the `--env-override` flag:

```sh
npm start -- --env=/path/to/env/file/.env --env-override
```

For your convenience, we've compiled **all** available environment variables in
a [`sample .env file`](https://github.com/OpanoDev/SolidVault/blob/main/docs/examples/config/example.env). Simply copy the file to wherever
you want to keep it and the uncomment and edit any options you want to set (more
info about the most important configuration options below).
