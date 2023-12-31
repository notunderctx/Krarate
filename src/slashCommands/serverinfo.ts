import { SlashCommandBuilder, EmbedBuilder } from "discord.js";
import { getThemeColor, sendTyping } from "../functions";
import { SlashCommand } from "../types";

const command: SlashCommand = {
  command: new SlashCommandBuilder()
    .setName("serverinfo")
    .setDescription("Shows server info"),
  execute: async (interaction) => {
    if (!interaction.inGuild()) {
      await interaction.reply({
        ephemeral: true,
        embeds: [
          new EmbedBuilder()
            .setDescription("this command should be runned in a server")
            .setColor(getThemeColor("error")),
        ],
      });
    }
    const server = interaction.guild;
    await sendTyping(interaction.channel);
    try {
      await interaction.reply({
        embeds: [
          new EmbedBuilder({
            author: {
              name: `${server?.name}`,
              iconURL: `${
                server?.iconURL({ size: 256 }) === null
                  ? "https://upload.wikimedia.org/wikipedia/commons/7/71/Black.png"
                  : server?.iconURL({ size: 256 })
              }`,
            },
            fields: [
              {
                name: "Owner",
                value: `${(await server?.fetchOwner())?.user.username}`,
                inline: true,
              },
              {
                name: "Text Channels",
                value: `${
                  server?.channels.cache.filter((c) => c.type === 0).toJSON()
                    .length
                }`,
                inline: true,
              },
              {
                name: "Voice Channels",
                value: `${
                  server?.channels.cache.filter((c) => c.type === 2).toJSON()
                    .length
                }`,
                inline: true,
              },
              {
                name: "Category Channels",
                value: `${
                  server?.channels.cache.filter((c) => c.type === 4).toJSON()
                    .length
                }`,
                inline: true,
              },
              {
                name: "Members",
                value: `${server?.memberCount}`,
                inline: true,
              },
              {
                name: "Roles",
                value: `${server?.roles.cache.size}`,
                inline: true,
              },
              {
                name: "Role List",
                value: `${server?.roles.cache.toJSON().join(", ")}`,
              },
            ],
            footer: {
              text: `${
                server?.id
              } | Server created:${server?.createdAt.toDateString()}`,
            },
          }).setColor(getThemeColor("variable")),
        ],
      });
    } catch (err) {
      console.log(` errr:${err}`);
    }
  },
  cooldown: 1000,
};

export default command;
