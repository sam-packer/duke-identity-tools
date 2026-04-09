import { describe, it, expect, beforeAll } from "bun:test";
import { DukeIdentityClient } from "../client.js";
import { DukeApiError, DukeIdentityError } from "../errors.js";
import { describePersonShape } from "../internal/shape-summary.js";
import type { Person } from "../types.js";

const apiKey = process.env["DUKE_API_KEY"];
if (!apiKey) {
  throw new Error("DUKE_API_KEY environment variable is required to run tests");
}

const duke = new DukeIdentityClient({ apiKey });

describe("fetchByDuid", () => {
  let result: Person;

  beforeAll(async () => {
    result = await duke.fetchByDuid("0788059");
  });

  it("returns a person object", () => {
    expect(result).toBeDefined();
    expect(result.netid).toBe("vprice");
  });

  it("returns all expected fields with correct types", () => {
    expect(result.ldapkey).toBeString();
    expect(result.sn).toBeString();
    expect(result.givenName).toBeString();
    expect(result.duid).toBeString();
    expect(result.netid).toBeString();
    expect(result.display_name).toBeString();
    expect(result.url).toBeString();
    if (result.nickname) expect(result.nickname).toBeString();
    if (result.primary_affiliation) expect(result.primary_affiliation).toBeString();
    if (result.emails) expect(result.emails).toBeArray();
  });

  it("returns detailed fields", () => {
    if (result.titles) expect(result.titles).toBeArray();
    if (result.phones) expect(result.phones).toBeArray();
    if (result.department) expect(result.department).toBeString();
  });

  it("matches the expected response shape", () => {
    expect(describePersonShape(result)).toMatchSnapshot();
  });

  it("throws DukeIdentityError for empty duid", async () => {
    await expect(duke.fetchByDuid("")).rejects.toThrow(DukeIdentityError);
  });

  it("throws DukeApiError for invalid API key", async () => {
    const badClient = new DukeIdentityClient({ apiKey: "invalid-key" });
    await expect(badClient.fetchByDuid("0788059")).rejects.toThrow(DukeApiError);
  });
});
