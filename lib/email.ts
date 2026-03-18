export async function sendTransactionalEmail(input: {
  to: string;
  template:
    | "verification"
    | "password-reset"
    | "inquiry"
    | "booking"
    | "message"
    | "subscription";
  subject: string;
  variables: Record<string, string>;
}) {
  return {
    queued: true,
    provider: "resend-ready",
    payload: input,
  };
}
