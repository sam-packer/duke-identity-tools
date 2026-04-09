import type { Person, RequestFn } from "../types.js";
import { DukeIdentityError } from "../errors.js";

/**
 * Look up a person by their Duke NetID.
 *
 * @param request - The authenticated request function
 * @param netId - The Duke NetID to look up (e.g. "tt305")
 * @returns An array of matching person records (typically one)
 * @throws {DukeIdentityError} If the NetID is empty
 */
export async function fetchByNetId(
  request: RequestFn,
  netId: string,
): Promise<readonly Person[]> {
  if (!netId) {
    throw new DukeIdentityError("netId must be a non-empty string");
  }

  const sanitized = encodeURIComponent(netId.trim());
  return request<readonly Person[]>(`/ldap/people/netid/${sanitized}`);
}
