import type { z } from "zod";
import type {
  DiscordEmbedFieldSchema,
  DiscordEmbedFooterSchema,
  DiscordEmbedSchema,
  DiscordWebhookPayloadSchema,
} from "../schemas/discord.schema.ts";

export type DiscordEmbedField = z.infer<typeof DiscordEmbedFieldSchema>;
export type DiscordEmbedFooter = z.infer<typeof DiscordEmbedFooterSchema>;
export type DiscordEmbed = z.infer<typeof DiscordEmbedSchema>;
export type DiscordWebhookPayload = z.infer<typeof DiscordWebhookPayloadSchema>;
