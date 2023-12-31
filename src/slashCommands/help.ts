import {
  SlashCommandBuilder,
  ActionRowBuilder,
  ButtonBuilder,
  ButtonStyle,
  EmbedBuilder,
  AnyComponentBuilder,
} from "discord.js";
import { getThemeColor } from "../functions";
import { SlashCommand } from "../types";
let y = Math.random() * 6;

const command: SlashCommand = {
  command: new SlashCommandBuilder()
    .setName("help")
    .setDescription("a help command"),
  execute: (interaction) => {
    try {
      interaction.reply({
        embeds: [
          new EmbedBuilder()
            .setTitle(" - - Help Center - - ")
            .setDescription(`help command guide`)
            .setFields(
              {
                name: "/chat",
                value: "chat with the bot",
                inline: true,
              },
              {
                name: "/help",
                value: "show this response",
                inline: true,
              },
              {
                name: "/serverinfo",
                value: "show the server info",
                inline: true,
              },
              {
                name: "/userinfo",
                value: "show the user's info ",
                inline: true,
              },
              {
                name: "/ping",
                value: "respond with pong",
                inline: true,
              },
              {
                name: "/8ball",
                value: "use the magic 8ball",
                inline: true,
              },
              {
                name: "/cutecats",
                value: "show an image of a cat",
                inline: true,
              },
              {
                name: "/ban",
                value: "ban a user",
                inline: true,
              },
              {
                name: "/kick",
                value: "kick a user",
                inline: true,
              },
              {
                name: "/ping",
                value: "respond with pong",
                inline: true,
              },
              {
                name: "/report",
                value: "report a command",
                inline: true,
              },
              {
                name: "/joke",
                value: "tell a joke",
                inline: true,
              },
              {
                name: "m!trivia",
                value: "play a trivia game",
                inline: true,
              }
            )
            .setColor(getThemeColor("variable")),
        ],
      });
    } catch (err) {
      console.log(err.message);
    }
  },
  cooldown: 10,
};

export default command;
