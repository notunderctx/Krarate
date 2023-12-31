import { Client, EmbedBuilder, Interaction, WebhookClient } from "discord.js";
import { BotEvent } from "../types";
import { config } from "dotenv";
config();

const event: BotEvent = {
  name: "interactionCreate",
  execute: (interaction: Interaction, client: Client) => {
    if (interaction.isChatInputCommand()) {
      let command = interaction.client.slashCommands.get(
        interaction.commandName
      );
      let cooldown = interaction.client.cooldowns.get(
        `${interaction.commandName}-${interaction.user.username}`
      );
      if (!command) return;
      if (command.cooldown && cooldown) {
        if (Date.now() < cooldown) {
          interaction.reply(
            `You have to wait ${Math.floor(
              Math.abs(Date.now() - cooldown) / 1000
            )} second(s) to use this command again.`
          );
          setTimeout(() => interaction.deleteReply(), 5000);
          return;
        }
        interaction.client.cooldowns.set(
          `${interaction.commandName}-${interaction.user.username}`,
          Date.now() + command.cooldown * 1000
        );
        setTimeout(() => {
          interaction.client.cooldowns.delete(
            `${interaction.commandName}-${interaction.user.username}`
          );
        }, command.cooldown * 1000);
      } else if (command.cooldown && !cooldown) {
        interaction.client.cooldowns.set(
          `${interaction.commandName}-${interaction.user.username}`,
          Date.now() + command.cooldown * 1000
        );
      }
      command.execute(interaction);
    } else if (interaction.isAutocomplete()) {
      const command = interaction.client.slashCommands.get(
        interaction.commandName
      );
      if (!command) {
        console.error(
          `No command matching ${interaction.commandName} was found.`
        );
        return;
      }
      try {
        if (!command.autocomplete) return;
        command.autocomplete(interaction);
      } catch (error) {
        console.error(error);
      }
    } else if (interaction.isModalSubmit()) {
      if (interaction.customId === "buggrrpt") {
        try {
          const Ucommand = interaction.fields.getTextInputValue("slasj");
          const descriptio = interaction.fields.getTextInputValue("desc");
          const server: any = interaction.guild?.name;
          const username = interaction.user.username;
          const hook = new WebhookClient({
            id: "idf",
            url: `${process.env.HOOK}`,
          });
          hook.send({
            username: "Law",
            avatarURL:
              "https://i.pinimg.com/736x/5e/1f/13/5e1f13d8088c19056129f5f22a0172e8.jpg" ||
              "https://lh3.googleusercontent.com/pXH7iG6TEgtc2X4wEbEkNVewPMdcAmQm-ydQFV3YyL8LH3JpnFR7DWm1ZrB4gNsE3vf4eQHXFMJg68clZ_sU1FO6KyQxegDbWKN623Y28BmJCB1qWmukLMvppD51C4GTBA9hHUWZqVh0Ni9JlWSJSPc",
            embeds: [
              {
                title: "Bug Report",
                description: `**Command:** ${Ucommand}\n${descriptio}`,
                color: 0x800080, // Purple color
                fields: [
                  {
                    name: "Reporter",
                    value: username,
                    inline: true,
                  },
                  {
                    name: "Server",
                    value: server || "Not in a server",
                    inline: true,
                  },
                ],
                footer: {
                  text: "Bug Report",
                },
                timestamp: new Date(),
              },
            ],
          });

          interaction.reply({
            ephemeral: true,
            content: "message sent",
          });
        } catch (err) {
          console.log("error");
        }
      }
    }
  },
};

export default event;
