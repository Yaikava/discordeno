import { assertExists } from '../../deps.js'
import { loadBot } from '../../mod.js'

Deno.test({
  name: '[member] get dm channel and send a message',
  ignore: process.env.TEST_ENV === 'UNIT',
  async fn(t) {
    const bot = loadBot()
    // Itoh Alt ID
    const channel = await bot.helpers.getDmChannel(750661528360845322n)
    assertExists(channel?.id)

    const message = await bot.helpers.sendMessage(channel.id, { content: 'https://i.imgur.com/doG55NR.png' })
    assertExists(message?.content)
  }
})