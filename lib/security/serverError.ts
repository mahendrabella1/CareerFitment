/**
 * Server-only: log an error's details and return the text a browser may see
 * (security audit L-01 - internal messages, database errors and stack details
 * stay in the server log).
 */
export const GENERIC_ERROR = "Something went wrong on our side - please try again.";

export function logged(tag: string, detail: unknown, message: string = GENERIC_ERROR): string {
  console.error(`[${tag}]`, detail instanceof Error ? detail.message : (detail as { message?: string })?.message ?? detail);
  return message;
}
