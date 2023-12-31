import {
  SlashCommandBuilder,
  ChannelType,
  TextChannel,
  EmbedBuilder,
} from "discord.js";
import { getThemeColor, sendTyping } from "../functions";
import { SlashCommand } from "../types";
import fs from "fs";
import path from "path";
import BadWordsNext from "bad-words-next";

import en from "bad-words-next/data/en.json";
import es from "bad-words-next/data/es.json";
import fr from "bad-words-next/data/fr.json";
import de from "bad-words-next/data/de.json";
import ru from "bad-words-next/data/ru.json";
import rl from "bad-words-next/data/ru_lat.json";
import ua from "bad-words-next/data/ua.json";
import pl from "bad-words-next/data/pl.json";
import ch from "bad-words-next/data/ch.json";

const badwords = new BadWordsNext();
badwords.add(en);
badwords.add(es);
badwords.add(fr);
badwords.add(de);
badwords.add(ru);
badwords.add(rl);
badwords.add(ua);
badwords.add(pl);
badwords.add(ch);

const command: SlashCommand = {
  command: new SlashCommandBuilder()
    .setName("8ball")
    .setDescription("ask the magic 8ball")
    .addStringOption((option) => {
      return option
        .setName("question")
        .setRequired(true)
        .setDescription("the question");
    }),
  execute: async (interaction) => {
    let question: any = await interaction.options.getString("question");
    try {
      let responses = await fs.readFileSync(
        path.join(__dirname, "../../res.txt"),
        {
          encoding: "utf-8",
        }
      );
      let ArryRes = responses.split("\n").map((responses) => responses.trim());
      await sendTyping(interaction.channel);
      const _randRes = Math.floor(Math.random() * ArryRes.length);
      const randRes = ArryRes[_randRes];
      await interaction.reply({
        embeds: [
          new EmbedBuilder({
            description: `**${interaction.user.username}**:${
              badwords.check(question) ? "********" : question
            }`,
          }),
          new EmbedBuilder().setDescription(`${randRes}`),
        ],
      });
    } catch (err) {
      console.log(err);
    }
  },
  cooldown: 10,
};

export default command;
