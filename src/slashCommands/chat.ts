import { SlashCommandBuilder, EmbedBuilder } from "discord.js";
import { getThemeColor, sendTyping } from "../functions";
import { SlashCommand } from "../types";
import { NlpManager } from "node-nlp";
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
    .setName("chat")
    .setDescription("chat with ai")
    .addStringOption((option) => {
      return option
        .setName("message")
        .setRequired(true)
        .setDescription("The message");
    }),
  execute: async (interaction) => {
    let message: string | null = interaction.options.getString("message");
    const manager = new NlpManager({ languages: ["en"], forceNER: true });
    manager.addDocument("en", "see you", "greetings.bye");
    manager.addDocument("en", "take care", "greetings.bye");
    manager.addDocument("en", "farewell", "greetings.bye");
    manager.addDocument("en", "good to see you", "greetings.hello");
    manager.addDocument("en", "hi", "greetings.hello");
    manager.addDocument("en", "hello", "greetings.hello");
    manager.addDocument("en", "yo whats up", "greetings.hello");
    manager.addDocument("en", "hey", "greetings.hello");
    manager.addDocument("en", "what's up", "greetings.hello");
    manager.addDocument("en", "tell me your name", "greetings.name");
    manager.addDocument("en", "introduce yourself", "greetings.name");
    manager.addDocument("en", "what is your name ", "greetings.name");
    manager.addDocument("en", "who are you", "greetings.name");
    manager.addDocument("en", "***********", "insult");

    manager.addAnswer(
      "en",
      "insult",
      "I'm sorry, but I won't engage in or promote the use of offensive language."
    );

    manager.addAnswer(
      "en",
      "greetings.name",
      "I'm Kaido, your virtual assistant"
    );
    manager.addAnswer("en", "greetings.bye", "Take care, see you next time!");
    manager.addAnswer("en", "greetings.bye", "Goodbye, have a great day!");
    manager.addAnswer(
      "en",
      "greetings.hello",
      " Hello! How can I assist you today?"
    );
    manager.addAnswer(
      "en",
      "greetings.hello",
      "Greetings! What can I do for you?"
    );
    if (badwords.check(`${message}`)) {
      message = "***********";
    }

    await manager.train();
    manager.save();
    const response = await manager.process("en", message);
    if (message === "***********") {
      await interaction.reply({
        ephemeral: true,
        embeds: [
          new EmbedBuilder()
            .setAuthor({ name: `${message}` })
            .setFooter({
              text: interaction.user.username,
              iconURL: interaction.user.displayAvatarURL(),
            })
            .setDescription(`${response.answer}`)
            .setColor(getThemeColor("variable")),
        ],
      });
    }
    await sendTyping(interaction.channel);

    try {
      await interaction.reply({
        embeds: [
          new EmbedBuilder()
            .setAuthor({ name: `${message}` })
            .setFooter({
              text: interaction.user.username,
              iconURL: interaction.user.displayAvatarURL(),
            })
            .setDescription(`${response.answer}`)
            .setColor(getThemeColor("variable")),
        ],
      });
    } catch (err) {
      console.log(`error :${err}`);
    }
  },
  cooldown: 100,
};

export default command;
