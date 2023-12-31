import { PermissionFlagsBits, EmbedBuilder } from "discord.js";
import { Command } from "../types";
import { getThemeColor, sendTyping } from "../functions";
import canvacord from "canvacord";
import path from "path";

const command: Command = {
  name: "trivia",
  execute: async (m, args: string[]) => {
    if (!m.member?.permissions.has(PermissionFlagsBits.BanMembers)) {
      return m.reply({
        content: "'`You don't have permission to use this command.`'",
      });
    }
    try {
      await sendTyping(m.channel);
      await m.channel.send({
        content: "Trivia in 15 seconds",
        embeds: [
          new EmbedBuilder()
            .setTitle("Trivia")
            .setDescription(`The trivia was started by ${m.author.username}`),
        ],
      });

      const res = await fetch("https://opentdb.com/api.php?amount=10");
      const data = await res.json();
      const results = data.results;
      function shuffleArray<T>(array: T[]) {
        for (let i = array.length - 1; i > 0; i--) {
          const j = Math.floor(Math.random() * (i + 1));
          [array[i], array[j]] = [array[j], array[i]];
        }
      }

      const filter = (response) =>
        !response.author.bot && response.author.id === m.author.id;

      async function askQuestion(index: number) {
        if (index >= results.length) {
          return;
        }

        const result = results[index];
        const answer = result.correct_answer;
        const incorrectAnswers = result.incorrect_answers;
        const choices = [...incorrectAnswers, answer];
        shuffleArray(choices);
        let correctAnswerFound = false;

        await m.channel.send({
          embeds: [
            new EmbedBuilder()
              .setTitle(":exclamation: Trivia")
              .setDescription(`${result.question}`)
              .setColor(getThemeColor("variable")),
            new EmbedBuilder()
              .setDescription(
                choices.map((choice, i) => `**${i + 1}.** ${choice}`).join("\n")
              )
              .setColor("Gold")
              .setFooter({
                text: `${new Date().toLocaleString()}`,
              }),
          ],
        });

        let answered = false;

        const collector = m.channel.createMessageCollector({
          filter: (response) => !response.author.bot,
          time: 15000,
          max: 1,
        });

        collector.on("collect", async (ms) => {
          if (
            ms.content === answer ||
            ms.content.trim().toLowerCase() === answer.trim().toLowerCase() ||
            ms.content.trim().toUpperCase() === answer.trim().toUpperCase()
          ) {
            await sendTyping(m.channel);
            await m.channel.send({
              embeds: [
                new EmbedBuilder().setTitle(":scroll: Results").addFields(
                  {
                    name: ":white_check_mark: answer",
                    value: `${result.correct_answer}`,
                  },
                  {
                    name: "Winner",
                    value: `${ms.author.username}`,
                  }
                ),
              ],
            });
            answered = true;
            correctAnswerFound = true;
          }
          if (
            ms.content != answer ||
            ms.content.trim().toLowerCase() != answer.trim().toLowerCase() ||
            ms.content.trim().toUpperCase() != answer.trim().toUpperCase()
          ) {
            correctAnswerFound = false;
          }
        });

        collector.on("end", async (collected) => {
          if (!correctAnswerFound) {
            await sendTyping(m.channel);
            await m.channel.send({
              embeds: [
                new EmbedBuilder()
                  .setTitle("Results")
                  .addFields({
                    name: "answer",
                    value: `${result.correct_answer}`,
                  })
                  .setColor(getThemeColor("text")),
              ],
            });
          }

          setTimeout(() => askQuestion(index + 1), 2000);
        });
      }

      askQuestion(0);
    } catch (err) {
      console.log(err + "at" + "trivia.ts");
    }
  },
  cooldown: 10,
  aliases: ["quiz", "whatthequiz"],
  permissions: ["Administrator", PermissionFlagsBits.BanMembers],
};

export default command;
