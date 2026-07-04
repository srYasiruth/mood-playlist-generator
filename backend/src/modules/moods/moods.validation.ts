import { z } from "zod";
import { containsHtml, sanitizeJournalText } from "../../utils/moodDetector";
import { MoodError } from "./moods.service";

const journalTextSchema = z.object({
  text: z.string({ required_error: "Journal text is required." })
});

export function validateMoodDetectionRequest(body: unknown) {
  const parsed = journalTextSchema.safeParse(body);

  if (!parsed.success) {
    throw new MoodError("Journal text is required.", "INVALID_INPUT", 400);
  }

  const text = sanitizeJournalText(parsed.data.text);

  if (containsHtml(text)) {
    throw new MoodError("Journal text cannot include HTML.", "INVALID_INPUT", 400);
  }

  if (text.length < 5 || text.length > 500) {
    throw new MoodError("Journal text must be between 5 and 500 characters.", "INVALID_INPUT", 400);
  }

  return { text };
}