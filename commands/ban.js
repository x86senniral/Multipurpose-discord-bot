const { ApplicationCommandOptionType } = require('discord.js');

module.exports = {
    name: 'ban',
    description: 'Bans a member from the server.',
    options: [
        {
            name: 'member',
            type: ApplicationCommandOptionType.User, // Specify that the option is a user
            description: 'The member to ban',
            required: true,
        },
        {
            name: 'reason',
            type: ApplicationCommandOptionType.String, // Optionally include a reason
            description: 'The reason for the ban',
            required: false,
        }
    ],
    async execute(interaction) {
        if (!interaction.member.permissions.has('BAN_MEMBERS')) {
            return interaction.reply({ content: 'You do not have permission to ban members.', ephemeral: true });
        }

        const member = interaction.options.getMember('member');
        const reason = interaction.options.getString('reason') || 'No reason provided';

        if (!member) {
            return interaction.reply({ content: 'Please specify a member to ban.', ephemeral: true });
        }

        if (!member.bannable) {
            return interaction.reply({ content: 'I cannot ban this user.', ephemeral: true });
        }

        await member.ban({ reason });
        interaction.reply({ content: `${member.user.tag} has been banned. Reason: ${reason}`, ephemeral: false });
    },
};
