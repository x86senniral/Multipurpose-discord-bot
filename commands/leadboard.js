module.exports = {
    name: 'leaderboard',
    description: 'Display the top users with the highest balance.',
    async execute(interaction, db, client) {
        // Get the 'users' collection from the MongoDB database
        const usersCollection = db.collection('users');

        // Find the top 5 users with the highest balance
        const leaderboard = await usersCollection.find()
            .sort({ balance: -1 }) // Sort in descending order by balance
            .limit(5) // Limit to the top 5 users
            .toArray();

        // Check if there are users in the leaderboard
        if (leaderboard.length === 0) {
            await interaction.reply('There are no users in the leaderboard.');
            return;
        }

        // Create a message with the leaderboard information
        let leaderboardMessage = '**Leaderboard - Top 5 Users:**\n';

        for (let i = 0; i < leaderboard.length; i++) {
            const user = leaderboard[i];

            // Fetch the user's information using their Discord ID
            const fetchedUser = await client.users.fetch(user.id);

            if (fetchedUser) {
                leaderboardMessage += `${i + 1}. ${fetchedUser.username} - $${user.balance}\n`;
            } else {
                leaderboardMessage += `${i + 1}. User ID: ${user.id} - $${user.balance}\n`;
            }
        }

        await interaction.reply(leaderboardMessage);
    },
};
