import type { ApplicationCommand } from "../../../types/interactions/commands/applicationCommand.ts";
import type { EditGlobalApplicationCommand } from "../../../types/interactions/commands/editGlobalApplicationCommand.ts";
import type { Bot } from "../../../bot.ts";
import { makeOptionsForCommand } from "./createSlashCommand.ts";

/**
 * Edit an existing slash command. If this command did not exist, it will create it.
 */
export async function upsertSlashCommand(
  bot: Bot,
  commandId: bigint,
  options: EditGlobalApplicationCommand,
  guildId?: bigint
) {
  [options] = bot.utils.validateSlashCommands(bot, [options]);

  return await bot.rest.runMethod<ApplicationCommand>(
    bot.rest,
    "patch",
    guildId
      ? bot.constants.endpoints.COMMANDS_GUILD_ID(bot.applicationId, guildId, commandId)
      : bot.constants.endpoints.COMMANDS_ID(bot.applicationId, commandId),
    {
      name: options.name,
      description: options.description,
      type: options.type,
      options: options.options ? makeOptionsForCommand(options.options) : undefined,
    }
  );
}