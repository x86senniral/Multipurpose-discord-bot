module.exports = {
    name: 'balance',
    description: 'Check your balance.',
    async execute(interaction, db) {
        // Get the 'users' collection from the MongoDB database
        const usersCollection = db.collection('users');

        // Find the user's document in the 'users' collection
        const user = await usersCollection.findOne({ id: interaction.user.id });

        if (!user) {
            await interaction.reply(`You don't have a balance yet. Use the /work command to earn money.`);
            return;
        }

        const balance = user.balance;

        await interaction.reply(`Your current balance is $${balance}.`);
    },
};
