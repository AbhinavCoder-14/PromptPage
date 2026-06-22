import {z} from "zod"

export const consentSchema = z.object({
  userId: z.string(),
  analytics: z.boolean(),
  marketing: z.boolean(),
  personalization: z.boolean(),
  policyVersion: z.string(),
  region:z.string()
});
