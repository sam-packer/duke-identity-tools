import type { DukeIdentityConfig, Person } from "./types.js";
import { DukeApiError, DukeIdentityError, DukeTimeoutError } from "./errors.js";
import { fetchByNetId } from "./routes/fetch-by-netid.js";
import { search } from "./routes/search.js";

const DEFAULT_BASE_URL = "https://streamer.oit.duke.edu";
const DEFAULT_TIMEOUT_MS = 10_000;

export class DukeIdentityClient {
  readonly #apiKey: string;
  readonly #baseUrl: string;
  readonly #timeout: number;

  constructor(config: DukeIdentityConfig) {
    if (!config.apiKey) {
      throw new DukeIdentityError("apiKey is required");
    }

    this.#apiKey = config.apiKey;
    this.#baseUrl = (config.baseUrl ?? DEFAULT_BASE_URL).replace(/\/+$/, "");
    this.#timeout = config.timeout ?? DEFAULT_TIMEOUT_MS;
  }

  /**
   * Look up a person by their Duke NetID.
   */
  async fetchByNetId(netId: string): Promise<readonly Person[]> {
    return fetchByNetId(this.#request, netId);
  }

  /**
   * Search for people in Duke's LDAP directory.
   */
  async search(query: string): Promise<readonly Person[]> {
    return search(this.#request, query);
  }

  #request = async <T>(path: string, params?: Record<string, string>): Promise<T> => {
    const url = new URL(path, this.#baseUrl);
    if (params) {
      for (const [key, value] of Object.entries(params)) {
        url.searchParams.set(key, value);
      }
    }
    url.searchParams.set("access_token", this.#apiKey);

    const controller = new AbortController();
    const timeoutId = setTimeout(() => controller.abort(), this.#timeout);

    let response: Response;
    try {
      response = await fetch(url, {
        method: "GET",
        headers: { accept: "application/json" },
        signal: controller.signal,
      });
    } catch (error: unknown) {
      if (error instanceof DOMException && error.name === "AbortError") {
        throw new DukeTimeoutError(this.#timeout);
      }
      throw new DukeIdentityError("Request failed", { cause: error });
    } finally {
      clearTimeout(timeoutId);
    }

    if (!response.ok) {
      const body = await response.text().catch(() => "");
      throw new DukeApiError(response.status, response.statusText, body);
    }

    return response.json() as Promise<T>;
  };
}
