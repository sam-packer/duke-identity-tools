import { describe, it, expect, beforeAll } from "bun:test";
import { DukeIdentityClient } from "../client.js";
import { DukeApiError, DukeIdentityError } from "../errors.js";
import type { Person } from "../types.js";

const apiKey = process.env["DUKE_API_KEY"];
if (!apiKey) {
  throw new Error("DUKE_API_KEY environment variable is required to run tests");
}

const duke = new DukeIdentityClient({ apiKey });

describe("fetchByNetId", () => {
  let result: readonly Person[];

  beforeAll(async () => {
    result = await duke.fetchByNetId("vprice");
  });

  it("returns an array with at least one person", () => {
    expect(result).toBeArray();
    expect(result.length).toBeGreaterThan(0);
  });

  it("returns the correct netid", () => {
    expect(result[0]!.netid).toBe("vprice");
  });

  it("returns all expected fields with correct types", () => {
    const person = result[0]!;
    expect(person.ldapkey).toBeString();
    expect(person.sn).toBeString();
    expect(person.givenName).toBeString();
    expect(person.duid).toBeString();
    expect(person.netid).toBeString();
    expect(person.display_name).toBeString();
    expect(person.nickname).toBeString();
    expect(person.primary_affiliation).toBeString();
    expect(person.emails).toBeArray();
    expect(person.url).toBeString();
  });

  it("matches the expected response shape", async () => {
    expect(result).toMatchSnapshot();
  });

  it("throws DukeIdentityError for empty netid", () => {
    expect(duke.fetchByNetId("")).rejects.toThrow(DukeIdentityError);
  });

  it("throws DukeApiError for invalid API key", () => {
    const badClient = new DukeIdentityClient({ apiKey: "invalid-key" });
    expect(badClient.fetchByNetId("vprice")).rejects.toThrow(DukeApiError);
  });
});
