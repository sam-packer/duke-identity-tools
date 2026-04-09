import type { Person, RequestFn } from "../types.js";
import { DukeIdentityError } from "../errors.js";

/**
 * Look up a person by their Duke Unique ID (DUID).
 *
 * @param request - The authenticated request function
 * @param duid - The Duke Unique ID to look up (e.g. "0788059")
 * @returns A single person record
 * @throws {DukeIdentityError} If the duid is empty
 */
export async function fetchByDuid(
  request: RequestFn,
  duid: string,
): Promise<Person> {
  const trimmed = duid.trim();
  if (!trimmed) {
    throw new DukeIdentityError("duid must be a non-empty string");
  }

  const sanitized = encodeURIComponent(trimmed);
  return request<Person>(`/ldap/people/duid/${sanitized}`);
}
