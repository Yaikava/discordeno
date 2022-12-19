import type { DiscordChannel, Optionalize } from '@discordeno/types'
import type { RestManager } from '../restManager.js'

const Mask = (1n << 64n) - 1n

export function packOverwrites (
  allow: string,
  deny: string,
  id: string,
  type: number
): bigint {
  return pack64(allow, 0) | pack64(deny, 1) | pack64(id, 2) | pack64(type, 3)
}
function unpack64 (v: bigint, shift: number): bigint {
  return (v >> BigInt(shift * 64)) & Mask
}
function pack64 (v: string | number, shift: number): bigint {
  const b = BigInt(v)
  if (b < 0 || b > Mask) {
    throw new Error(`should have been a 64 bit unsigned integer: ${v}`)
  }
  return b << BigInt(shift * 64)
}
export function separateOverwrites (
  v: bigint
): [number, bigint, bigint, bigint] {
  return [
    Number(unpack64(v, 3)),
    unpack64(v, 2),
    unpack64(v, 0),
    unpack64(v, 1)
  ] as [number, bigint, bigint, bigint]
}

// eslint-disable-next-line @typescript-eslint/explicit-function-return-type
export function transformChannel (
  rest: RestManager,
  payload: { channel: DiscordChannel } & { guildId?: bigint }
) {
  const channel = {
    // UNTRANSFORMED STUFF HERE
    type: payload.channel.type,
    position: payload.channel.position,
    name: payload.channel.name,
    topic: payload.channel.topic ?? undefined,
    nsfw: payload.channel.nsfw,
    bitrate: payload.channel.bitrate,
    userLimit: payload.channel.user_limit,
    rateLimitPerUser: payload.channel.rate_limit_per_user,
    // recipients: payload.channel.recipients?.map((r) => rest.transformers.user(rest, r)),
    rtcRegion: payload.channel.rtc_region ?? undefined,
    videoQualityMode: payload.channel.video_quality_mode,
    guildId:
      payload.guildId ??
      (payload.channel.guild_id
        ? rest.transformers.snowflake(payload.channel.guild_id)
        : 0n),
    lastPinTimestamp: payload.channel.last_pin_timestamp
      ? Date.parse(payload.channel.last_pin_timestamp)
      : undefined,
    permissionOverwrites: payload.channel.permission_overwrites
      ? payload.channel.permission_overwrites.map((o) =>
        packOverwrites(o.allow ?? '0', o.deny ?? '0', o.id, o.type)
      )
      : [],

    id: rest.transformers.snowflake(payload.channel.id),
    permissions: payload.channel.permissions
      ? rest.transformers.snowflake(payload.channel.permissions)
      : undefined,
    lastMessageId: payload.channel.last_message_id
      ? rest.transformers.snowflake(payload.channel.last_message_id)
      : undefined,
    ownerId: payload.channel.owner_id
      ? rest.transformers.snowflake(payload.channel.owner_id)
      : undefined,
    applicationId: payload.channel.application_id
      ? rest.transformers.snowflake(payload.channel.application_id)
      : undefined,
    parentId: payload.channel.parent_id
      ? rest.transformers.snowflake(payload.channel.parent_id)
      : undefined,
    memberCount: payload.channel.member_count,
    messageCount: payload.channel.message_count,
    archiveTimestamp: payload.channel.thread_metadata?.archive_timestamp
      ? Date.parse(payload.channel.thread_metadata.archive_timestamp)
      : undefined,
    autoArchiveDuration: payload.channel.thread_metadata?.auto_archive_duration,
    botIsMember: Boolean(payload.channel.member),
    archived: payload.channel.thread_metadata?.archived,
    locked: payload.channel.thread_metadata?.locked,
    invitable: payload.channel.thread_metadata?.invitable,
    createTimestamp: payload.channel.thread_metadata?.create_timestamp
      ? Date.parse(payload.channel.thread_metadata.create_timestamp)
      : undefined,
    newlyCreated: payload.channel.newly_created,
    flags: payload.channel.flags
  }

  return channel as Optionalize<typeof channel>
}

export interface Channel extends ReturnType<typeof transformChannel> {}