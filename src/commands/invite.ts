import { PermissionFlagsBits } from "discord.js";
import { Command } from "../types";
import { sendTyping } from "../functions";

const command: Command = {
  name: "invite",
  execute: async (message, args) => {
    await sendTyping(message.channel);

    message.channel.send("https://top.gg/bot/1170309639708102846");
  },
  cooldown: 10,
  aliases: ["add"],
  permissions: ["Administrator", PermissionFlagsBits.SendMessages],
};

export default command;
