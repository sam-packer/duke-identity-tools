import type { Person, RequestFn } from "../types.js";
import { DukeIdentityError } from "../errors.js";

/**
 * Search for people in Duke's LDAP directory.
 *
 * @param request - The authenticated request function
 * @param query - The search query (e.g. "Vincent Price")
 * @returns An array of matching person records
 * @throws {DukeIdentityError} If the query is empty
 */
export async function search(
  request: RequestFn,
  query: string,
): Promise<readonly Person[]> {
  if (!query) {
    throw new DukeIdentityError("query must be a non-empty string");
  }

  return request<readonly Person[]>("/ldap/people", { q: query.trim() });
}
