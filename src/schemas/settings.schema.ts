import { z } from "zod";
import { isValidPhoneNumber } from "libphonenumber-js";

export const settingsSchema = z.object({
  name: z.string().min(2, "Name is too short"),
  email: z.string().email("Invalid email"),
  phone: z.string().refine((val) => isValidPhoneNumber(val), {
    message: "Invalid phone number",
  }),
  bio: z.string().max(300).optional(),
});

export type SettingsSchema = z.infer<typeof settingsSchema>;
