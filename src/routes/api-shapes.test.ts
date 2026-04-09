import { beforeAll, describe, expect, it } from "bun:test";
import { DukeIdentityClient } from "../client.js";
import { describePeopleShape, describePersonShape } from "../internal/shape-summary.js";
import type { Person } from "../types.js";

const apiKey = process.env["DUKE_API_KEY"];
if (!apiKey) {
  throw new Error("DUKE_API_KEY environment variable is required to run tests");
}

const duke = new DukeIdentityClient({ apiKey });
const shapeFixtureNetIds = ["sp800", "apd5", "ttt27", "vprice"] as const;

interface ResolvedFixture {
  readonly netid: string;
  readonly affiliation: string | null;
  readonly searchResult: readonly Person[];
  readonly searchPerson: Person;
  readonly netidResult: readonly Person[];
  readonly netidPerson: Person;
  readonly duidPerson: Person;
  readonly ldapkeyPerson: Person;
}

describe("API shapes", () => {
  let fixtures: readonly ResolvedFixture[];

  beforeAll(async () => {
    fixtures = await Promise.all(shapeFixtureNetIds.map((netid) => resolveFixture(netid)));
  });

  it("lookup routes agree on identity", () => {
    for (const fixture of fixtures) {
      expect(fixture.searchPerson.ldapkey).toBe(fixture.netidPerson.ldapkey);
      expect(fixture.duidPerson.ldapkey).toBe(fixture.netidPerson.ldapkey);
      expect(fixture.ldapkeyPerson.ldapkey).toBe(fixture.netidPerson.ldapkey);
    }
  });

  it("matches the distinct configured response shapes", () => {
    expect(summarizeShapeMatrix(fixtures)).toMatchSnapshot();
  });
});

async function resolveFixture(netid: string): Promise<ResolvedFixture> {
  const netidResult = await duke.fetchByNetId(netid);
  const netidPerson = selectPersonByNetId(netidResult, netid, `fetchByNetId(${netid})`);
  const searchResult = await duke.search(netid);
  const searchPerson = selectPersonByNetId(searchResult, netid, `search(${netid})`);
  const duidPerson = await duke.fetchByDuid(netidPerson.duid);
  const ldapkeyPerson = await duke.fetchByLdapkey(netidPerson.ldapkey);

  return {
    netid,
    affiliation: netidPerson.primary_affiliation ?? null,
    searchResult,
    searchPerson,
    netidResult,
    netidPerson,
    duidPerson,
    ldapkeyPerson,
  };
}

function selectPersonByNetId(
  people: readonly Person[],
  netid: string,
  source: string,
): Person {
  const person = people.find((candidate) => candidate.netid === netid);
  if (!person) {
    throw new Error(`Expected ${source} to include netid ${netid}`);
  }
  return person;
}

function summarizeShapeMatrix(fixtures: readonly ResolvedFixture[]) {
  const grouped = new Map<
    string,
    {
      readonly affiliation: string | null;
      readonly search: ReturnType<typeof describePeopleShape>;
      readonly fetchByNetId: ReturnType<typeof describePeopleShape>;
      readonly fetchByDuid: ReturnType<typeof describePersonShape>;
      readonly fetchByLdapkey: ReturnType<typeof describePersonShape>;
      count: number;
    }
  >();

  for (const fixture of fixtures) {
    const summary = {
      affiliation: fixture.affiliation,
      search: describePeopleShape(fixture.searchResult),
      fetchByNetId: describePeopleShape(fixture.netidResult),
      fetchByDuid: describePersonShape(fixture.duidPerson),
      fetchByLdapkey: describePersonShape(fixture.ldapkeyPerson),
    };
    const key = JSON.stringify(summary);
    const existing = grouped.get(key);

    if (existing) {
      existing.count += 1;
      continue;
    }

    grouped.set(key, { ...summary, count: 1 });
  }

  return {
    fixturesTested: fixtures.length,
    distinctShapes: [...grouped.values()].sort(compareShapeGroups),
  };
}

function compareShapeGroups(
  left: { readonly affiliation: string | null; count: number },
  right: { readonly affiliation: string | null; count: number },
) {
  const leftAffiliation = left.affiliation ?? "";
  const rightAffiliation = right.affiliation ?? "";

  return (
    leftAffiliation.localeCompare(rightAffiliation) ||
    right.count - left.count
  );
}
