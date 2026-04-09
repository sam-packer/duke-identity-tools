/**
 * Configuration options for the Duke Identity client.
 */
export interface DukeIdentityConfig {
  /** Your Duke Streamer API access token. */
  readonly apiKey: string;

  /**
   * Base URL for the Duke Streamer API.
   * @default "https://streamer.oit.duke.edu"
   */
  readonly baseUrl?: string;

  /**
   * Request timeout in milliseconds.
   * @default 10000
   */
  readonly timeout?: number;
}

/**
 * A function that performs an authenticated GET request against the Duke API.
 * Used internally by route modules.
 */
export type RequestFn = <T>(path: string, params?: Record<string, string>) => Promise<T>;

/**
 * A person record from Duke's LDAP directory.
 */
export interface Person {
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
