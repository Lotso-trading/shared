import { z } from "zod";

export const DiscordEmbedFieldSchema = z.object({
  name: z.string().min(1, "Le nom du champ est requis").max(256),
  value: z.string().min(1, "La valeur du champ est requise").max(1024),
  inline: z.boolean().optional(),
});

export const DiscordEmbedFooterSchema = z.object({
  text: z.string().min(1).max(2048),
  icon_url: z.string().url().optional(),
});

export const DiscordEmbedSchema = z.object({
  title: z.string().min(1, "Le titre est requis").max(256),
  url: z.string().url().optional(),
  description: z.string().max(4096),
  color: z
    .number()
    .int()
    .min(0)
    .max(16777215, "La couleur doit être un code RGB valide (0 à 16777215)"),
  fields: z.array(DiscordEmbedFieldSchema).max(25, "Maximum 25 champs par embed"),
  timestamp: z.string().datetime({ message: "Le timestamp doit être au format ISO 8601" }),
  footer: DiscordEmbedFooterSchema.optional(),
});

export const DiscordWebhookPayloadSchema = z.object({
  username: z.string().trim().max(80).optional(),
  avatar_url: z.string().url().optional(),
  embeds: z
    .array(DiscordEmbedSchema)
    .min(1, "Au moins un embed doit être fourni")
    .max(10, "Maximum 10 embeds par payload"),
});
