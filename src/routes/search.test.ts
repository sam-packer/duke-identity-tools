import { describe, it, expect, beforeAll } from "bun:test";
import { DukeIdentityClient } from "../client.js";
import { DukeIdentityError } from "../errors.js";
import { describePeopleShape } from "../internal/shape-summary.js";
import type { Person } from "../types.js";

const apiKey = process.env["DUKE_API_KEY"];
if (!apiKey) {
  throw new Error("DUKE_API_KEY environment variable is required to run tests");
}

const duke = new DukeIdentityClient({ apiKey });

describe("search", () => {
  let result: readonly Person[];

  beforeAll(async () => {
    result = await duke.search("Vincent Price");
  });

  it("returns an array with at least one person", () => {
    expect(result).toBeArray();
    expect(result.length).toBeGreaterThan(0);
  });

  it("returns results with expected fields", () => {
    const person = result[0]!;
    expect(person.ldapkey).toBeString();
    expect(person.sn).toBeString();
    expect(person.givenName).toBeString();
    expect(person.duid).toBeString();
    expect(person.netid).toBeString();
    expect(person.display_name).toBeString();
    expect(person.url).toBeString();
  });

  it("matches the expected response shape", () => {
    expect(describePeopleShape(result)).toMatchSnapshot();
  });

  it("throws DukeIdentityError for empty query", async () => {
    await expect(duke.search("")).rejects.toThrow(DukeIdentityError);
  });
});
