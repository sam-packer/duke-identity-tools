import type { Person } from "../types.js";

type PersonField = keyof Person;

const PERSON_FIELDS: readonly PersonField[] = [
  "ldapkey",
  "sn",
  "givenName",
  "duid",
  "netid",
  "display_name",
  "nickname",
  "titles",
  "primary_affiliation",
  "emails",
  "phones",
  "department",
  "url",
] as const;

export interface PersonShapeSummary {
  readonly presentFields: readonly PersonField[];
  readonly fieldTypes: Partial<Record<PersonField, string>>;
}

export interface PeopleShapeSummary {
  readonly responseType: "array";
  readonly count: number;
  readonly itemShape: PersonShapeSummary | null;
}

export function describePersonShape(person: Person): PersonShapeSummary {
  const presentFields = PERSON_FIELDS.filter((field): field is PersonField => field in person);
  const fieldTypes: Partial<Record<PersonField, string>> = {};

  for (const field of presentFields) {
    fieldTypes[field] = describeValue(person[field]);
  }

  return {
    presentFields: presentFields,
    fieldTypes: fieldTypes,
  };
}

export function describePeopleShape(people: readonly Person[]): PeopleShapeSummary {
  const itemShape = people[0] ? describePersonShape(people[0]) : null;

  return {
    responseType: "array",
    count: people.length,
    itemShape: itemShape,
  };
}

function describeValue(value: Person[keyof Person]) {
  if (Array.isArray(value)) {
    const elementTypes = [...new Set(value.map((item) => typeof item))].sort();
    return elementTypes.length === 0 ? "array" : `${elementTypes.join("|")}[]`;
  }

  return typeof value;
}
