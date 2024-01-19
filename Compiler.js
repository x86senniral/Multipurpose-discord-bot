const fs = require('fs'); 
require('dotenv').config();
const { spawn } = require('child_process'); 
const {Client, Collection, GatewayIntentBits, EmbedBuilder, PermissionsBitField, Permissions, IntentsBitField} = require('discord.js');
const { registerCommands } = require('./register-commands');
const client = new Client({intents: 
    [
        GatewayIntentBits.Guilds, 
        GatewayIntentBits.GuildMessages, 
        GatewayIntentBits.MessageContent,
        GatewayIntentBits.GuildMembers
    ]});
//collection declaration
client.commands = new Collection();

const PREFIX = '!';
const userWarnings = new Map();
const MAX_WARNINGS = 3;
const ignoredUsers = new Set();
//YOU CAN FINISH THE LOGIC YOURSELF FROM THE MAIN BRANCH.

//PYTHON COMPILER.
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

let lastPythonCommandTime = 0;
const COOLDOWN_PERIOD = 7000;
client.on('messageCreate', async message => {
    if (!message.content.startsWith(PREFIX) || message.author.bot) return;

    const userId = message.author.id;
    if (ignoredUsers.has(userId)) return; 

    const args = message.content.slice(PREFIX.length).trim().split(/ +/);
    const commandName = args.shift().toLowerCase();

    if (commandName === 'python') {
        const currentTime = Date.now();
        if (currentTime - lastPythonCommandTime < COOLDOWN_PERIOD) {
            const remainingTime = COOLDOWN_PERIOD - (currentTime - lastPythonCommandTime);
            message.reply(`Please wait ${Math.ceil(remainingTime / 1000)} more seconds before using the python command again.`);
            return;
        }

        let codeBlockMatch = message.content.match(/```(?:py\n)?([\s\S]+)```/);
        if (codeBlockMatch && codeBlockMatch[1]) {
            const code = codeBlockMatch[1].trim();
            const disallowed = ['import', 'os', 'sys', '__', 'subprocess', 'open', 'eval', 'exec'];

            if (new RegExp(disallowed.join('|')).test(code)) {
                const warnings = (userWarnings.get(userId) || 0) + 1;
                userWarnings.set(userId, warnings);

                if (warnings >= MAX_WARNINGS) {
                    ignoredUsers.add(userId); // Add user to ignored list
                    message.reply('You have been added to the ignore list due to repeated attempts to execute disallowed content.');
                    userWarnings.delete(userId); //Remove from warning list
                } else {
                    message.reply(`Warning: Attempt to execute disallowed content. You have ${MAX_WARNINGS - warnings} attempts left.`);
                }
                return;
            }

            try {
                const output = await executePythonScript(code);
                message.reply(`Output:\n\`\`\`\n${output}\n\`\`\``);
                lastPythonCommandTime = currentTime;
            } catch (error) {
                message.reply(`Error executing Python code: ${error.message}`);
            }
        } else {
            message.reply("YOU NEED TO USE CODE BLOCKS.");
        }
    }
});


function executePythonScript(code) {
    return new Promise((resolve, reject) => {
        const disallowed = ['import', 'os', 'sys', '__', 'subprocess', 'open', 'eval', 'exec'];
        if (new RegExp(disallowed.join('|')).test(code)) {
            reject(new Error('Your Python script contains disallowed keywords.'));
            return;
        }

        const process = spawn('python', ['-c', code]);
        let output = '';
        let errorOutput = '';
        const MAX_OUTPUT_LENGTH = 2000;

        process.stdout.on('data', (data) => {
            output += data.toString();
            if (output.length > MAX_OUTPUT_LENGTH) {
                process.kill();
                reject(new Error("Python script output is too long."));
            }
        });

        process.stderr.on('data', (data) => {
            errorOutput += data.toString();
        });

        process.on('close', (code) => {
            if (code !== 0) {
                reject(new Error(`Python script exited with code ${code}\n${errorOutput}`)); 
            } else {
                resolve(output);
            }
        });
    });
}

client.login("token")
//or process.env.TOKEN if using env
