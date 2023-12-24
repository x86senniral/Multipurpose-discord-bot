const { ApplicationCommandOptionType } = require('discord.js');

module.exports = {
    name: 'afk',
    description: 'Set your AFK status.',
    options: [
        {
            name: 'message',
            type: ApplicationCommandOptionType.String,
            description: 'AFK message',
            required: false,
        },
    ],
   // In commands/afk.js
async execute(interaction) {
    let message = interaction.options.getString('message') || 'AFK';
    message = message.replace(/@everyone/g, '@\u200Beveryone');

    if (global.afkUsers[interaction.user.id]) {
        // Update the AFK message, but don't remove the AFK status
        global.afkUsers[interaction.user.id] = message;
        await interaction.reply({ content: `Your AFK message has been updated: ${message}`, ephemeral: true });
    } else {
        global.afkUsers[interaction.user.id] = message; // Set AFK status
        await interaction.reply({ content: `Your AFK status has been set: ${message}`, ephemeral: true });
    }
}

};
