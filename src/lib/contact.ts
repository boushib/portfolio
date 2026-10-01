export type ContactTopic = "Project" | "Role" | "Consulting" | "Just saying hi" | "Other";

export type ContactMessage = {
  name: string;
  email: string;
  topic: ContactTopic;
  message: string;
};

export const contactTopics: ContactTopic[] = ["Project", "Role", "Consulting", "Just saying hi", "Other"];

/**
 * Sends a contact form submission.
 *
 * TODO: wire to the real backend (e.g. POST /api/contact, a Server Action, or a form service).
 * Until then this validates, waits briefly and resolves, so the UI states can be exercised.
 */
export async function submitContact(msg: ContactMessage): Promise<void> {
  if (!msg.name.trim() || !msg.email.trim() || !msg.message.trim()) {
    throw new Error("Please fill in your name, email and message.");
  }
  await new Promise((r) => setTimeout(r, 900));
}
