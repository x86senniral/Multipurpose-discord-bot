const { ApplicationCommandOptionType } = require('discord.js');

module.exports = {
    name: 'kick',
    description: 'Kicks a member from the server.',
    options: [
        {
            name: 'member',
            type: ApplicationCommandOptionType.User, 
            description: 'The member to kick',
            required: true,
        },
    ],
    async execute(interaction) {
        if (!interaction.member.permissions.has('KICK_MEMBERS')) {
            return interaction.reply('You do not have permission to kick members.');
        }

        const member = interaction.options.getMember('member'); // Use the 'member' option
        if (!member) {
            return interaction.reply('Please specify a member to kick.');
        }

        if (!member.kickable) {
            return interaction.reply('I cannot kick this user.');
        }

        await member.kick();
        interaction.reply(`${member.user.tag} has been kicked.`);
    },
};
