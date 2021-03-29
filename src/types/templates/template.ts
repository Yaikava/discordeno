import { SnakeCaseProps } from "../util.ts";
import { User } from "../users/user.ts";

export interface Template {
  /** The template code (unique ID) */
  code: string;
  /** Template name */
  name: string;
  /** The description for the template */
  description: string | null;
  /** Number of times this template has been used */
  usageCount: number;
  /** The ID of the user who created the template */
  creatorId: string;
  /** The user who created the template */
  creator: User;
  /** When this template was created */
  createdAt: string;
  /** When this template was last synced to the source guild */
  updatedAt: string;
  /** The ID of the guild this template is based on */
  sourceGuildId: string;
  /** The guild snapshot this template contains */
  serializedSourceGuild: Partial<Guild>;
  /** Whether the template has unsynced changes */
  isDirty: boolean | null;
}

/** https://discord.com/developers/docs/resources/template#template-object-template-structure */
export type DiscordTemplate = SnakeCaseProps<Template>;