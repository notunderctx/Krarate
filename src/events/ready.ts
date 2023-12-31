import { ActivityType, Client } from "discord.js";
import { BotEvent } from "../types";
import { color } from "../functions";

const event: BotEvent = {
  name: "ready",
  once: true,
  execute: (client: Client) => {
    console.log(
      color("text", `💪 Logged in as ${color("variable", client.user?.tag)}`)
    );

    client.user?.setActivity({
      name: "/help",
      type: ActivityType.Listening,
    });

    client.user?.setAvatar(
      "https://static.wikia.nocookie.net/onepiece/images/2/25/Nekomamushi_at_Age_10.png/revision/latest?cb=20210228040910"
    );
  },
};

export default event;
