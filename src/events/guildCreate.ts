import { Client, EmbedBuilder, Guild } from "discord.js";
import { BotEvent } from "../types";
import fs from "fs";
import path from "path";
import create from "../../create.json";

const event: BotEvent = {
  name: "guildCreate",
  execute: async (guild: Guild, client: Client) => {
    try {
      const data = {
        newGuild: {
          name: guild.name,
          owner: (await guild?.fetchOwner())?.user.username,
          memebers: guild.memberCount,
          icon: guild.iconURL || "",
        },
      };
      create.push(data);
      fs.writeFileSync(
        path.join(__dirname, "../../create.json"),
        JSON.stringify(create, null, 2)
      );
      console.dir(data);
      if (!guild.systemChannel) return;
      guild.systemChannel.send({
        content: `Hello ${guild.name} I'm Krarate, a bot built for multiple things. Thanks for adding me to this server!\n\n\nIf you type /help, I'll send a list of my commands `,
      });
    } catch (err) {
      console.log(err);
    }
  },
};

export default event;
