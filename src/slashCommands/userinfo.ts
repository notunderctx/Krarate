import {
  SlashCommandBuilder,
  ChannelType,
  TextChannel,
  EmbedBuilder,
  GuildMember,
} from "discord.js";
import { getThemeColor, sendTyping } from "../functions";
import { SlashCommand } from "../types";

const command: SlashCommand = {
  command: new SlashCommandBuilder()
    .setName("userinfo")
    .setDescription("get a user's info")
    .addUserOption((option) => {
      return option
        .setName("user")
        .setDescription("the user")
        .setRequired(false);
    }),
  execute: async (interaction) => {
    if (!interaction.guild?.id === null) {
      interaction.reply({
        ephemeral: true,
        embeds: [
          new EmbedBuilder()
            .setDescription("This command should be sent in a server")
            .setColor(getThemeColor("error")),
        ],
      });
    }
    const userId =
      interaction.options.getUser("user", false)?.id || interaction.user.id;
    const member = await interaction.guild?.members
      .fetch(userId)
      .catch(() => null);
    if (member === null) {
      await interaction.reply({
        embeds: [
          new EmbedBuilder()
            .setTitle("User not found")
            .setColor(getThemeColor("error")),
        ],
        ephemeral: true,
      });
      return;
    }
    await member?.user.fetch();
    const createdAt = member!.user.createdAt.getTime();
    const avatar =
      member?.user.avatarURL({
        size: 4096,
      }) ||
      "https://external-preview.redd.it/4PE-nlL_PdMD5PrFN…o=webp&s=ff4c3fbc1cce1a1856cff36b5d2a40a6d02cc1c3";
    const banner =
      member?.user.bannerURL({ size: 4096 }) ||
      "https://beebom.com/wp-content/uploads/2022/03/discord-cover-banner.jpg?w=1920";
    await sendTyping(interaction.channel);

    try {
      await interaction.reply({
        embeds: [
          new EmbedBuilder()
            .setTitle(`${member?.user.username}`)
            .addFields(
              {
                name: "**Basic Informations**",
                value: `**User's ID:** ${userId}\n**Account Created At:** <t:${Math.floor(
                  createdAt / 1000
                )}
                    `,
              },
              {
                name: "**Server Informations**",
                value: `**Server Nickname:** ${
                  member!.nickname ? member!.nickname : "None"
                }\n**Joined At:** <t:${Math.floor(
                  (member!.joinedTimestamp || 0) / 1000
                )}:D>\n**Highest Role:** ${
                  member!.roles.highest.id !== interaction.guild?.id
                    ? `<@&${member!.roles.highest.id}>`
                    : "No Roles"
                }`,
              }
            )
            .setThumbnail(avatar)
            .setImage(banner)
            .setTimestamp(Date.now())
            .setColor(getThemeColor("variable")),
        ],
      });
    } catch (err) {
      console.log(err);
    }
  },
  cooldown: 10000,
};

export default command;
