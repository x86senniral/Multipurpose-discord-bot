const { ApplicationCommandOptionType } = require('discord.js');

module.exports = {
    name: 'unmute',
    description: 'Unmutes a member by removing the "Muted" role.',
    options: [
        {
            name: 'member',
            type: ApplicationCommandOptionType.User, // Specify that the option is a user
            description: 'The member to unmute',
            required: true,
        },
    ],
    async execute(interaction) {
        if (!interaction.member.permissions.has('MODERATE_MEMBERS')) {
            return interaction.reply({ content: 'You do not have permission to unmute members.', ephemeral: true });
        }

        const member = interaction.options.getMember('member');
        if (!member) {
            return interaction.reply({ content: 'Please specify a member to unmute.', ephemeral: true });
        }

        const mutedRole = interaction.guild.roles.cache.find(role => role.name === 'Muted');
        if (!mutedRole) {
            return interaction.reply({ content: 'No "Muted" role found in the server.', ephemeral: true });
        }

        if (!member.roles.cache.has(mutedRole.id)) {
            return interaction.reply({ content: 'This member is not muted.', ephemeral: true });
        }

        try {
            // Remove the "Muted" role
            await member.roles.remove(mutedRole);
            
            interaction.reply({ content: `${member.user.tag} has been unmuted.`, ephemeral: false });
        } catch (error) {
            console.error(error);
            interaction.reply({ content: 'There was an error trying to unmute this member.', ephemeral: true });
        }
    },
};
