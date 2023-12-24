module.exports = {
    name: 'gamble',
    description: 'Gamble an amount of money.',
    options: [
        {
            name: 'amount',
            type: 4, // This represents INTEGER
            description: 'The amount of money you want to gamble',
            required: true,
        },
    ],
    async execute(interaction, db) {
        // Get the 'users' collection from the MongoDB database
        const usersCollection = db.collection('users');

        // Get the amount to gamble from the command input
        const gambleAmount = interaction.options.getInteger('amount'); // Or getNumber

        // Validate the gamble amount
        if (!gambleAmount || gambleAmount <= 0) {
            await interaction.reply('Please enter a valid amount to gamble.');
            return;
        }

        // Find the user's document in the 'users' collection
        const user = await usersCollection.findOne({ id: interaction.user.id });

        if (!user) {
            await interaction.reply(`You don't have an account yet. Use the /work command to earn money.`);
            return;
        }

        const currentBalance = user.balance;

        // Check if the user has enough balance to gamble
        if (gambleAmount > currentBalance) {
            await interaction.reply(`You do not have enough money to gamble. Your current balance is $${currentBalance}.`);
            return;
        }

        // Gambling logic
        const winChance = 0.5; // 50% chance to win
        const didWin = Math.random() < winChance;

        let newBalance;
        if (didWin) {
            newBalance = currentBalance + gambleAmount;
            await interaction.reply(`Congratulations! You won $${gambleAmount}! Your new balance is $${newBalance}. And don't forget, make sure you gamble everyday, you could be 1 gamble away from winning a gazillion dollars!`);
        } else {
            newBalance = currentBalance - gambleAmount;
            await interaction.reply(`Unlucky! You lost $${gambleAmount}. Your new balance is $${newBalance}.`);
        }

        // Update the user's balance
        await usersCollection.updateOne(
            { id: interaction.user.id },
            { $set: { balance: newBalance } }
        );
    },
};
