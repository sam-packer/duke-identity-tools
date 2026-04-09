import { describe, it, expect, mock, afterEach } from "bun:test";
import { DukeIdentityClient } from "./client.js";
import { DukeIdentityError, DukeTimeoutError } from "./errors.js";

const originalFetch = globalThis.fetch;

afterEach(() => {
  globalThis.fetch = originalFetch;
});

describe("DukeIdentityClient", () => {
  describe("constructor", () => {
    it("throws if apiKey is empty", () => {
      expect(() => new DukeIdentityClient({ apiKey: "" })).toThrow(DukeIdentityError);
    });

    it("creates a client with valid config", () => {
      const client = new DukeIdentityClient({ apiKey: "test-key" });
      expect(client).toBeInstanceOf(DukeIdentityClient);
    });
  });

  describe("error handling", () => {
    it("throws DukeIdentityError on network failure", async () => {
      globalThis.fetch = mock(() => Promise.reject(new TypeError("fetch failed"))) as typeof fetch;

      const client = new DukeIdentityClient({ apiKey: "test-key" });
      await expect(client.fetchByNetId("tt305")).rejects.toThrow(DukeIdentityError);
    });

    it("throws DukeTimeoutError when request exceeds timeout", async () => {
      globalThis.fetch = mock((_input: RequestInfo | URL, init?: RequestInit) => {
        return new Promise<Response>((_resolve, reject) => {
          init?.signal?.addEventListener("abort", () => {
            reject(new DOMException("The operation was aborted.", "AbortError"));
          });
        });
      }) as typeof fetch;

      const client = new DukeIdentityClient({ apiKey: "test-key", timeout: 50 });
      await expect(client.fetchByNetId("tt305")).rejects.toThrow(DukeTimeoutError);
    });
  });
});
