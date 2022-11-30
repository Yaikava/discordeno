const UNIT_TEST_GUILD_ID = process.env.UNIT_TEST_GUILD_ID

export const CACHED_COMMUNITY_GUILD_ID = UNIT_TEST_GUILD_ID ? BigInt(UNIT_TEST_GUILD_ID) : 907350958810480671n

export async function delayUntil (
  maxMs: number,
  isReady: () => boolean | undefined | Promise<boolean | undefined>,
  timeoutTime = 100
): Promise<void> {
  const maxTime = Date.now() + maxMs

  async function hackyFix (resolve: () => void) {
    if ((await isReady()) || Date.now() >= maxTime) {
      resolve()
    } else {
      setTimeout(() => {
        hackyFix(resolve)
      }, timeoutTime)
    }
  }

  return await new Promise(async (resolve) => await hackyFix(resolve))
}
