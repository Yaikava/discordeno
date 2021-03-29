import { eventHandlers } from "../../bot.ts";
import { cacheHandlers } from "../../cache.ts";
import {
  DiscordGatewayPayload,
  DiscordGuildMemberRemove,
} from "../../types/gateway.ts";

export async function handleGuildMemberRemove(data: DiscordGatewayPayload) {
  const payload = data.d as DiscordGuildMemberRemove;
  const guild = await cacheHandlers.get("guilds", payload.guild_id);
  if (!guild) return;

  guild.memberCount--;
  const member = await cacheHandlers.get("members", payload.user.id);
  eventHandlers.guildMemberRemove?.(guild, payload.user, member);

  member?.guilds.delete(guild.id);
  if (member && !member.guilds.size) {
    await cacheHandlers.delete("members", member.id);
  }
}