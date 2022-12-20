import { ChannelTypes } from '../../mod.js'
import { assertEquals } from '../deps.js'
import { loadBot } from '../mod.js'
import { CACHED_COMMUNITY_GUILD_ID } from '../utils.js'

Deno.test({
  name: '[channel] edit a channel',
  ignore: process.env.TEST_ENV === 'UNIT',
  async fn(t) {
    const bot = loadBot()
    const channel = await bot.helpers.createChannel(CACHED_COMMUNITY_GUILD_ID, { name: 'editChannel' })

    // Edit a channel name without a reason
    await t.step('[channel] edit a channel name without a reason', async () => {
      const editedChannel = await bot.helpers.editChannel(channel.id, { name: 'editedchannel' })
      assertEquals(editedChannel.name, 'editedchannel')
    })

    // Edit a channel topic
    await t.step('[channel] edit a channel topic with a reason', async () => {
      const editedChannel = await bot.helpers.editChannel(channel.id, { topic: 'editedChannel' })
      assertEquals(editedChannel.topic, 'editedChannel')
    })

    // Change the channel to a news channel
    await t.step('[channel] change the channel to a news channel with a reason', async () => {
      const editedChannel = await bot.helpers.editChannel(
        channel.id,
        { type: ChannelTypes.GuildAnnouncement, reason: 'reason' }
      )
      assertEquals(editedChannel.type, ChannelTypes.GuildAnnouncement)
    })

    // Change from a news channel to a text channel
    await t.step('[channel] change from a news channel to a text channel', async () => {
      const editedChannel = await bot.helpers.editChannel(channel.id, { type: ChannelTypes.GuildText })
      assertEquals(editedChannel.type, ChannelTypes.GuildText)
    })

    // Enable nsfw
    await t.step('[channel] enable nsfw', async () => {
      const editedChannel = await bot.helpers.editChannel(channel.id, { nsfw: true })
      assertEquals(editedChannel.nsfw, true)
    })

    // Disable nsfw
    await t.step('[channel] disable nsfw', async () => {
      const editedChannel = await bot.helpers.editChannel(channel.id, { nsfw: false })
      assertEquals(editedChannel.nsfw, false)
    })

    await bot.helpers.deleteChannel(channel.id)
  }
})