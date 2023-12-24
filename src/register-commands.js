const fs = require('fs');
const { REST } = require('@discordjs/rest');
const { Routes } = require('discord-api-types/v9');

const token = process.env.TOKEN; // Replace with your bot's token
const clientId = process.env.CLIENT_ID; // Replace with your bot's client ID

const commands = [];
const commandFiles = fs.readdirSync(`${__dirname}/../commands`).filter(file => file.endsWith('.js'));

for (const file of commandFiles) {
    const command = require(`${__dirname}/../commands/${file}`);
    const commandData = {
        name: command.name,
        description: command.description,
        options: command.options, // Include the options property
    };

    commands.push(commandData);
}

const rest = new REST({ version: '9' }).setToken(token);

async function registerCommands() {
    try {
        console.log('Started refreshing application (/) commands.');

        await rest.put(
            Routes.applicationCommands(clientId),
            { body: commands },
        );

        console.log('Successfully reloaded application (/) commands.');
    } catch (error) {
        console.error(error);
    }
}

module.exports = { registerCommands };
