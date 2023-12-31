import {
  SlashCommandBuilder,
  ChannelType,
  TextChannel,
  EmbedBuilder,
  PermissionFlagsBits,
  Client,
  Interaction,
} from "discord.js";
import { getThemeColor, sendTyping } from "../functions";
import { SlashCommand } from "../types";

const command: SlashCommand = {
  /**
   * @param {Client} client
   * @param {Interaction} interaction
   */
  execute: async (interaction, client) => {
    const target_user_id: any = interaction.options.getUser("user");
    const reason =
      interaction.options.getString("reason") || "No reason provided";
    await interaction.deferReply();
    await sendTyping(interaction.channel);
    const targetUser = await interaction.guild?.members.fetch(target_user_id);

    if (!targetUser) {
      await interaction.editReply("That user doesn't exist in this server.");
      return;
    }

    if (targetUser.id === interaction.guild?.ownerId) {
      await interaction.editReply(
        "You can't kick that user because they're the server owner."
      );
      return;
    }

    const targetUserRolePosition = targetUser.roles.highest.position;
    const requestUserRolePosition = interaction.member?.roles.highest.position;
    const botRolePosition: any =
      interaction.guild?.members.me?.roles.highest.position;
    if (targetUserRolePosition >= botRolePosition) {
      await sendTyping(interaction.channel);
      await interaction.editReply(
        "I can't kick that user because they have the same/higher role than me."
      );
      return;
    }
    try {
      await targetUser.kick(reason);
      await sendTyping(interaction.channel);
      await interaction.editReply({
        embeds: [
          new EmbedBuilder()
            .setDescription(`User ${targetUser} was kicked\nReason: ${reason}`)
            .setColor(getThemeColor("text")),
        ],
      });
    } catch (error) {
      console.log(`There was an error when kicking: ${error}`);
    }
  },
  command: new SlashCommandBuilder()
    .setName("kick")
    .setDescription("kick a user")
    .addUserOption((option) => {
      return option
        .setName("user")
        .setDescription("the user to ban")
        .setRequired(true);
    })
    .addStringOption((option) => {
      return option
        .setName("reason")
        .setDescription("The reason")
        .setRequired(false);
    })
    .setDefaultMemberPermissions(PermissionFlagsBits.KickMembers)
    .setDMPermission(false),
  cooldown: 10,
};

export default command;
