# duke-identity-tools API reference

## Install

```bash
bun add duke-identity-tools
```

## Public exports

```ts
import {
  DukeApiError,
  DukeIdentityClient,
  DukeIdentityError,
  DukeTimeoutError,
  type DukeIdentityConfig,
  type Person,
} from "duke-identity-tools";
```

## Client construction

```ts
const duke = new DukeIdentityClient({
  apiKey: process.env.DUKE_API_KEY!,
  baseUrl: "https://streamer.oit.duke.edu",
  timeout: 10_000,
});
```

Use only `apiKey` when the defaults are acceptable. `baseUrl` defaults to `https://streamer.oit.duke.edu`. `timeout` defaults to `10000`.

## Method signatures

- `fetchByNetId(netId: string): Promise<readonly Person[]>`
- `fetchByDuid(duid: string): Promise<Person>`
- `fetchByLdapkey(ldapkey: string): Promise<Person>`
- `search(query: string): Promise<readonly Person[]>`

## Important return-shape details

- `fetchByNetId()` returns an array, not a single `Person`.
- `search()` returns an array, not a single `Person`.
- `fetchByDuid()` returns a single `Person`.
- `fetchByLdapkey()` returns a single `Person`.
- The response shape uses `display_name`, not `displayName`.

## Person shape

```ts
interface Person {
  readonly ldapkey: string;
  readonly sn: string;
  readonly givenName: string;
  readonly duid: string;
  readonly netid: string;
  readonly display_name: string;
  readonly nickname?: string;
  readonly titles?: readonly string[];
  readonly primary_affiliation?: string;
  readonly emails?: readonly string[];
  readonly phones?: readonly string[];
  readonly department?: string;
  readonly url: string;
}
```

Preserve these property names unless the user explicitly asks for a remapped domain model.

## Error handling

- `DukeApiError`: non-OK HTTP response. Exposes `statusCode` and `statusText`.
- `DukeTimeoutError`: request timed out.
- `DukeIdentityError`: invalid input or lower-level request failure.

## Example usage

```ts
import { DukeApiError, DukeIdentityClient } from "duke-identity-tools";

const duke = new DukeIdentityClient({
  apiKey: process.env.DUKE_API_KEY!,
});

try {
  const people = await duke.fetchByNetId("vprice");
  console.log(people[0]?.display_name);
} catch (error) {
  if (error instanceof DukeApiError) {
    console.error(error.statusCode, error.statusText);
  }
  throw error;
}
```

## Guidance for generated code

- Prefer this client over re-implementing authenticated `fetch` calls when the package is available.
- Instantiate the client once and pass it where needed instead of recreating it for every lookup.
- Choose the method that matches the identifier type the caller already has.
