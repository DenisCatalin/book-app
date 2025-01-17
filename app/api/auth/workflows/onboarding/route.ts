import { serve } from "@upstash/workflow/nextjs";

type InitialData = {
  email: string;
};

export const { POST } = serve<InitialData>(async context => {
  const { email } = context.requestPayload;

  await context.run("new-signup", async () => {
    await sendEmail("Welcome to the platform", email);
  });

  await context.sleep("wait-for-3-days", 60 * 60 * 24 * 3);

  while (true) {
    const state = await context.run("check-user-activity", async () => {
      return await getUserState();
    });

    if (state === "non-active") {
      await context.run("sent-email-non-active", async () => {
        await sendEmail("Email to non-active users", email);
      });
    } else if (state === "active") {
      await context.run("sent-email-active", async () => {
        await sendEmail("Send newsletter to active users", email);
      });
    }

    await context.sleep("wait-for-1-day", 60 * 60 * 24 * 30);
  }
});

async function sendEmail(message: string, email: string) {
  console.log(`Sending ${message} email to ${email}`);
}

type UserState = "non-active" | "active";

async function getUserState(): Promise<UserState> {
  return "non-active";
}
