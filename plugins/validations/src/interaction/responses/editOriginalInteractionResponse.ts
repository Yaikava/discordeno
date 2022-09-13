import { AllowedMentionsTypes, Bot } from "../../../deps.ts";

export function editOriginalInteractionResponse(bot: Bot) {
  const editOriginalInteractionResponse = bot.helpers.editOriginalInteractionResponse;

  bot.helpers.editOriginalInteractionResponse = async function (token, options) {
    if (options.content && options.content.length > 2000) throw Error(bot.constants.Errors.MESSAGE_MAX_LENGTH);

    if (options.embeds && options.embeds.length > 10) options.embeds.splice(10);

    if (options.allowedMentions) {
      if (options.allowedMentions.users?.length) {
        if (options.allowedMentions.parse?.includes(AllowedMentionsTypes.UserMentions)) {
          options.allowedMentions.parse = options.allowedMentions.parse.filter((p) => p !== "users");
        }

        if (options.allowedMentions.users.length > 100) {
          options.allowedMentions.users = options.allowedMentions.users.slice(0, 100);
        }
      }

      if (options.allowedMentions.roles?.length) {
        if (options.allowedMentions.parse?.includes(AllowedMentionsTypes.RoleMentions)) {
          options.allowedMentions.parse = options.allowedMentions.parse.filter((p) => p !== "roles");
        }

        if (options.allowedMentions.roles.length > 100) {
          options.allowedMentions.roles = options.allowedMentions.roles.slice(0, 100);
        }
      }
    }

    return await editOriginalInteractionResponse(token, options);
  };
}