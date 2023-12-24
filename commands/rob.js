// Create a Map to store the last usage time of the /rob command for each user
const robCooldowns = new Map();

module.exports = {
    name: 'rob',
    description: 'Attempt to rob another user.',
    options: [
        {
            name: 'member',
            description: 'The user to rob.',
            type: 6, // Use 6 for USER type
            required: true,
        },
    ],
    async execute(interaction, db) {
        // Check if the user is on cooldown for the /rob command
        const lastUsage = robCooldowns.get(interaction.user.id);
        const cooldownTime = 10 * 60 * 1000; // 10 minutes in milliseconds

        if (lastUsage && Date.now() - lastUsage < cooldownTime) {
            const remainingTime = cooldownTime - (Date.now() - lastUsage);
            const remainingMinutes = Math.ceil(remainingTime / 60000);
            await interaction.reply(`You are on cooldown for the /rob command. You can rob again in ${remainingMinutes} minutes.`);
            return;
        }

        // Get the 'users' collection from the MongoDB database
        const usersCollection = db.collection('users');

        // Find the user's document in the 'users' collection
        const user = await usersCollection.findOne({ id: interaction.user.id });

        // Check if the user exists and has a balance
        if (!user || user.balance === undefined) {
            await interaction.reply(`You cannot use the /rob command. Make sure you have a bank account.`);
            return;
        }

        // Get the mentioned user (the target to rob)
        const targetUser = interaction.options.getMember('member').user;

        // Find the target user's document in the 'users' collection
        const target = await usersCollection.findOne({ id: targetUser.id });

        // Check if the target user exists and has a balance
        if (!target || target.balance === undefined) {
            await interaction.reply(`The target user does not have a bank account.`);
            return;
        }

        // Generate a random amount between 5 and 100 to steal
        const amountToSteal = Math.floor(Math.random() * 96) + 5;

        // Ensure the amount to steal is not more than 100 or greater than the target's balance
        const maxAmountToSteal = Math.min(amountToSteal, target.balance, 100);

        if (maxAmountToSteal <= 0) {
            await interaction.reply(`You cannot rob the target as they have no money in their bank account.`);
            return;
        }

        // Deduct the stolen amount from the target's balance
        await usersCollection.updateOne(
            { id: targetUser.id },
            { $inc: { balance: -maxAmountToSteal } }
        );

        // Add the stolen amount to the robber's balance
        await usersCollection.updateOne(
            { id: interaction.user.id },
            { $inc: { balance: maxAmountToSteal } }
        );

        await interaction.reply(`You attempted to rob ${targetUser.username} and stole $${maxAmountToSteal}!`);

        // Set the last usage time for the /rob command
        robCooldowns.set(interaction.user.id, Date.now());
    },
};
