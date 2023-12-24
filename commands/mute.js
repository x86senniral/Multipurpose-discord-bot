const { ApplicationCommandOptionType } = require('discord.js');

module.exports = {
    name: 'mute',
    description: 'Mutes a member by assigning a "Muted" role.',
    options: [
        {
            name: 'member',
            type: ApplicationCommandOptionType.User, // Specify that the option is a user
            description: 'The member to mute',
            required: true,
        },
    ],
    async execute(interaction) {
        if (!interaction.member.permissions.has('MODERATE_MEMBERS')) {
            return interaction.reply({ content: 'You do not have permission to mute members.', ephemeral: true });
        }

        const member = interaction.options.getMember('member');
        if (!member) {
            return interaction.reply({ content: 'Please specify a member to mute.', ephemeral: true });
        }

        const mutedRole = interaction.guild.roles.cache.find(role => role.name === 'Muted');
        if (!mutedRole) {
            return interaction.reply({ content: 'No "Muted" role found in the server.', ephemeral: true });
        }

        try {
            // Remove all current roles (except @everyone role)
            await member.roles.set([mutedRole.id]);
            
            interaction.reply({ content: `${member.user.tag} has been muted.`, ephemeral: false });
        } catch (error) {
            console.error(error);
            interaction.reply({ content: 'There was an error trying to mute this member.', ephemeral: true });
        }
    },
};
