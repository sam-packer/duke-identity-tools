import type { Person, RequestFn } from "../types.js";
import { DukeIdentityError } from "../errors.js";

/**
 * Look up a person by their LDAP key.
 *
 * @param request - The authenticated request function
 * @param ldapkey - The LDAP key (UUID) to look up
 * @returns A single person record
 * @throws {DukeIdentityError} If the ldapkey is empty
 */
export async function fetchByLdapkey(
  request: RequestFn,
  ldapkey: string,
): Promise<Person> {
  const trimmed = ldapkey.trim();
  if (!trimmed) {
    throw new DukeIdentityError("ldapkey must be a non-empty string");
  }

  const sanitized = encodeURIComponent(trimmed);
  return request<Person>(`/ldap/people/${sanitized}`);
}
