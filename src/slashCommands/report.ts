import {
  SlashCommandBuilder,
  ChannelType,
  TextChannel,
  TextInputBuilder,
  TextInputStyle,
  ActionRowBuilder,
  WebhookClient,
  EmbedBuilder,
  ModalBuilder,
} from "discord.js";
import { getThemeColor, sendTyping } from "../functions";
import { SlashCommand } from "../types";

const command: SlashCommand = {
  execute: async (interaction) => {
    const model = new ModalBuilder()
      .setTitle(`bug report`)
      .setCustomId(`buggrrpt`);
    const slash_command = new TextInputBuilder()
      .setCustomId("slasj")
      .setRequired(true)
      .setPlaceholder(`please only state the command name`)
      .setLabel(`What command has a bug`)
      .setStyle(TextInputStyle.Short);

    const description = new TextInputBuilder()
      .setCustomId("desc")
      .setRequired(true)
      .setPlaceholder(`be as detailed as possible so we can take action`)
      .setLabel(`describe the bug`)
      .setStyle(TextInputStyle.Short);

    const rom: any = new ActionRowBuilder().addComponents(slash_command);
    const row: any = new ActionRowBuilder().addComponents(description);
    model.addComponents(rom, row);
    await sendTyping(interaction.channel);
    await interaction.showModal(model);
  },
  command: new SlashCommandBuilder()
    .setName("report")
    .setDescription("report a bug to the devs"),

  cooldown: 10,
};

export default command;
