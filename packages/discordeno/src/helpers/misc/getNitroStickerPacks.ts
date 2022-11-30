import { Bot } from '../../bot.js'
import { StickerPack } from '../../transformers/sticker.js'
import { DiscordStickerPack } from '../../types/discord.js'
import { Collection } from '../../util/collection.js'

/**
 * Returns the list of sticker packs available to Nitro subscribers.
 *
 * @param bot The bot instance to use to make the request.
 * @returns A collection of {@link StickerPack} objects assorted by sticker ID.
 *
 * @see {@link https://discord.com/developers/docs/resources/sticker#list-nitro-sticker-packs}
 */
export async function getNitroStickerPacks (bot: Bot): Promise<Collection<bigint, StickerPack>> {
  const results = await bot.rest.runMethod<DiscordStickerPack[]>(
    bot.rest,
    'GET',
    bot.constants.routes.NITRO_STICKER_PACKS()
  )

  return new Collection(
    results.map((result) => {
      const pack = bot.transformers.stickerPack(bot, result)
      return [pack.id, pack]
    })
  )
}
