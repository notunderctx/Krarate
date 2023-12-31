import {
  SlashCommandBuilder,
  ChannelType,
  TextChannel,
  EmbedBuilder,
} from "discord.js";
import { getThemeColor } from "../functions";
import { SlashCommand } from "../types";

const command: SlashCommand = {
  command: new SlashCommandBuilder()
    .setName("cutecat")
    .setDescription("Shows an image of a cat "),
  execute: async (interaction) => {
    let res = await fetch(
      "https://api.thecatapi.com/v1/images/search?limit=10"
    ).catch(async (err: Error) => {
      console.log(err);
      await interaction.reply({
        ephemeral: true,
        embeds: [
          new EmbedBuilder()
            .setColor(getThemeColor("error"))
            .setDescription("there was a problem fetching the image"),
        ],
      });
    });
    try {
      let json: any[] = await res?.json();
      let rand = Math.floor(Math.random() * 9);
      let resu = json[rand];

      await interaction.reply({
        embeds: [
          new EmbedBuilder().setImage(resu.url).setColor(getThemeColor("text")),
        ],
      });
    } catch (err) {
      console.log("error" + err);
    }
  },
  cooldown: 10,
};

export default command;
