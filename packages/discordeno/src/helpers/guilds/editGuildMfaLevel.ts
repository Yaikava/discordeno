import type { Bot } from '../../mod.js'
import type { BigString, MfaLevels } from '../../types/shared.js'

/** Modify a guild's MFA level. Requires guild ownership. */
export async function editGuildMfaLevel (bot: Bot, guildId: BigString, mfaLevel: MfaLevels, reason?: string) {
  return await bot.rest.runMethod<void>(
    bot.rest,
    'POST',
    bot.constants.routes.GUILD_MFA_LEVEL(guildId),
    { level: mfaLevel, reason }
  )
}
