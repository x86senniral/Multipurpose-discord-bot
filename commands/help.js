module.exports = {
    name: 'help',
    description: 'Replies with command the bot has.',
    async execute(interaction) {
        await interaction.reply('Bot Prefix: Currently Supports slash commands only. \n **Commands:**\n**1.**AFK (utility) \n**2.**work (economy)\n**3.**rob (economy)\n**4.**leadboard (economy)\n**5.**balance (economy)\n**6.**Kick, Ban, Mute, Unmute (Moderation)\n**7.**Ping (Utility) \n ```Note: For the muted command to work the server must have a role named "Muted"``` ');
    },
};
