// MongoDB setup
const { MongoClient } = require('mongodb');
// Replace with your MongoDB connection string
const mongoUri = "MONGO DB CONNECTION STRING URI HERE";

//mongo stuff
const mongoClient = new MongoClient(mongoUri);
let db;


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

//temporarely for afk users as long as bot is on.
global.afkUsers = {};


//client is ready?
client.on("ready", async (bot) => {
  console.log(`Client is ready. Logged in as ${bot.user.tag}`);
  client.user.setActivity(`Bot Is Ready.`);
  await registerCommands();
});

//afk
client.on('messageCreate', async message => {
  // Ignore messages from bots
if (message.author.bot) return;

// Check if the message author is AFK
if (global.afkUsers[message.author.id]) {
    // Remove the user from the AFK list
    delete global.afkUsers[message.author.id];

    // Send a message to let the user know they are no longer AFK
    await message.reply('Welcome back! Your AFK status has been removed.');
}

// Check if the message mentions any users and if they are AFK
const mentions = message.mentions.users;
mentions.forEach(mentionedUser => {
    if (global.afkUsers[mentionedUser.id]) {
        const afkMessage = global.afkUsers[mentionedUser.id];
        message.reply(`This user is AFK: ${afkMessage}`);
    }
});
});
// Connect to MongoDB
mongoClient.connect().then(mongoClientInstance => {
  console.log('Connected to MongoDB');
  db = mongoClientInstance.db("economy");

  client.login(process.env.TOKEN);
}).catch(err => {
  console.error('Failed to connect to MongoDB', err);
});


client.on('interactionCreate', async interaction => {
  if (!interaction.isCommand()) return;

  const command = client.commands.get(interaction.commandName);

  if (!command) return;

  if (!db) {
    console.error('Database is not connected');
    await interaction.reply({ content: 'The bot is not connected to the database.', ephemeral: true });
    return;
  }

  try {
    await command.execute(interaction, db, client);
  } catch (error) {
    console.error(error);
    await interaction.reply({ content: 'There was an error executing this command!', ephemeral: true });
  }
});

client.on('messageCreate', async message => {
  if (message.author.bot) return;

  if (message.mentions.has(client.user.id)) {
      await message.reply('Hi!');
      return; // Prevent further processing if the bot is just mentioned
  }

});

client.login(process.env.TOKEN);

