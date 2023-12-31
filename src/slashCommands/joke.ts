import {
  SlashCommandBuilder,
  ChannelType,
  WebhookClient,
  TextChannel,
  EmbedBuilder,
} from "discord.js";
import { getThemeColor, sendTyping } from "../functions";
import { SlashCommand } from "../types";
import jokes from "../../jokes/index.json";

const command: SlashCommand = {
  execute: async (interaction) => {
    const rand = jokes[Math.floor(Math.random() * jokes.length)];
    try {
      await sendTyping(interaction.channel);
      await interaction.reply({
        embeds: [
          new EmbedBuilder()
            .setAuthor({
              name: `${interaction.user.username}`,
            })
            .setTitle(`${rand.setup}`)
            .setDescription(`${rand.punchline}`)
            .setColor(getThemeColor("variable")),
        ],
      });
    } catch (err) {
      console.log(` error:jokes :${err}`);
    }
  },
  command: new SlashCommandBuilder()
    .setName("jokes")
    .setDescription("Tell a joke"),

  cooldown: 10,
};

export default command;
