// Create a Map to store the last usage time of the /work command for each user
const workCooldowns = new Map();

module.exports = {
    name: 'work',
    description: 'Work to earn money.',
    async execute(interaction, db) {
        // Check if the user is on cooldown
        const lastUsage = workCooldowns.get(interaction.user.id);
        const cooldownTime = 10 * 60 * 1000; // 10 minutes in milliseconds

        if (lastUsage && Date.now() - lastUsage < cooldownTime) {
            const remainingTime = cooldownTime - (Date.now() - lastUsage);
            const remainingMinutes = Math.ceil(remainingTime / 60000);
            await interaction.reply(`You are on cooldown. You can work again in ${remainingMinutes} minutes.`);
            return;
        }

        // Generate a random amount between 5 and 100
        const amountEarned = Math.floor(Math.random() * 96) + 5;

        // Get the 'users' collection from the MongoDB database
        const usersCollection = db.collection('users');

        // Find the user's document in the 'users' collection
        const user = await usersCollection.findOne({ id: interaction.user.id });

        // Initialize the balance to 0 if the user doesn't exist in the database
        let balance = user ? user.balance : 0;

        // Update the user's balance with the earned amount
        await usersCollection.updateOne(
          { id: interaction.user.id },
          { $set: { balance: balance + amountEarned } },
          { upsert: true } // Create a new document if it doesn't exist
        );

        // Set the last usage time for the user
        workCooldowns.set(interaction.user.id, Date.now());

        // Send a response to the user with the earned amount and new balance
        await interaction.reply(`You worked hard and earned $${amountEarned}! Your new balance is $${balance + amountEarned}.`);
    },
};
