const fs = require('fs'); 
require('dotenv').config();

const {Client, Collection, GatewayIntentBits, EmbedBuilder, PermissionsBitField, Permissions, IntentsBitField} = require('discord.js');
const { registerCommands } = require('./register-commands'); // Import the function
const client = new Client({intents: 
    [
        GatewayIntentBits.Guilds, 
        GatewayIntentBits.GuildMessages, 
        GatewayIntentBits.MessageContent,
        GatewayIntentBits.GuildMembers
    ]});
//collection declaration
client.commands = new Collection();

//command file logic
const commandFiles = fs.readdirSync(`${__dirname}/../commands`).filter(file => file.endsWith('.js'));

for (const file of commandFiles) {
    const command = require(`${__dirname}/../commands/${file}`);
    client.commands.set(command.name, command);
}


//client is ready?
client.on("ready", async (bot) => {
    console.log(`Client is ready. Logged in as ${bot.user.tag}`);
    client.user.setActivity(`Selectas Is Ready.`);
    await registerCommands();
});

//command interaction logic
client.on('interactionCreate', async interaction => {
    if (!interaction.isCommand()) return;

    const command = client.commands.get(interaction.commandName);

    if (!command) return;

    try {
        await command.execute(interaction);
    } catch (error) {
        console.error(error);
        await interaction.reply({ content: 'There was an error executing this command!', ephemeral: true });
    }
});


client.login(process.env.TOKEN);