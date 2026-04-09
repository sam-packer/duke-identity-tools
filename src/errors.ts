/**
 * Base error class for all Duke Identity errors.
 */
export class DukeIdentityError extends Error {
  override readonly name: string = "DukeIdentityError";

  constructor(message: string, options?: ErrorOptions) {
    super(message, options);
  }
}

/**
 * Thrown when the API returns a non-OK HTTP response.
 */
export class DukeApiError extends DukeIdentityError {
  override readonly name = "DukeApiError";
  readonly statusCode: number;
  readonly statusText: string;

  constructor(statusCode: number, statusText: string, body: string) {
    super(`Duke API error ${statusCode} (${statusText}): ${body}`);
    this.statusCode = statusCode;
    this.statusText = statusText;
  }
}

/**
 * Thrown when a request times out.
 */
export class DukeTimeoutError extends DukeIdentityError {
  override readonly name = "DukeTimeoutError";

  constructor(timeoutMs: number) {
    super(`Request timed out after ${timeoutMs}ms`);
  }
}
