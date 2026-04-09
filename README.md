# duke-identity-tools

A lightweight TypeScript client for Duke University's identity services. Wraps the Duke Streamer LDAP API with type-safe methods, proper error handling, and zero runtime dependencies.

[View on npm](https://www.npmjs.com/package/duke-identity-tools)

## Install

```bash
bun add duke-identity-tools
```

## Quick Start

```ts
import {DukeIdentityClient} from "duke-identity-tools";

const duke = new DukeIdentityClient({apiKey: "your-access-token"});

const people = await duke.fetchByNetId("vprice");
console.log(people[0].display_name); // "Vincent Price, Ph.D."
```

All methods return typed responses and throw specific error classes (`DukeApiError`, `DukeTimeoutError`, `DukeIdentityError`) that you can catch and handle individually.

```ts
import { DukeApiError } from "duke-identity-tools";

try {
  const people = await duke.fetchByNetId("vprice");
} catch (error) {
  if (error instanceof DukeApiError) {
    console.error(`API returned ${error.statusCode}: ${error.statusText}`);
  }
}
```

For detailed API documentation, see the [Wiki](https://github.com/sam-packer/duke-identity-tools/wiki).

## Contributing

### Setup

```bash
git clone https://github.com/sam-packer/duke-identity-tools.git
cd duke-identity-tools
bun install
```

### Build

```bash
bun run build
```

### Test

Tests run against the real Duke Streamer API. Copy `.env.example` to `.env` and add your API key:

```bash
cp .env.example .env
```

Bun auto-loads `.env`, so just run:

```bash
bun test
bun test --coverage
```

If the API response shape changes, regenerate snapshots with:

```bash
bun test --update-snapshots
```

## Disclaimer

This is an unofficial community project and is not affiliated with, endorsed by, or maintained by Duke University or Duke OIT.
