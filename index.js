// Require the necessary discord.js classes
const fs = require('node:fs');
const path = require('node:path');
const { Client, Collection, Events, GatewayIntentBits, ActivityType } = require('discord.js');
const { token } = require('./config.json');

const client = new Client({ intents: [GatewayIntentBits.Guilds] });

client.commands = new Collection();
const commandsPath = path.join(__dirname, 'commands');
const commandFiles = fs.readdirSync(commandsPath).filter(file => file.endsWith('.js'));

for (const file of commandFiles) {
	const filePath = path.join(commandsPath, file);
	const command = require(filePath);
	// Set a new item in the Collection with the key as the command name and the value as the exported module
	if ('data' in command && 'execute' in command) {
		client.commands.set(command.data.name, command);
	} else {
		console.log(`[WARNING] The command at ${filePath} is missing a required "data" or "execute" property.`);
	}
}

client.on(Events.InteractionCreate, async interaction => {
	if (!interaction.isChatInputCommand()) return;

	const command = interaction.client.commands.get(interaction.commandName);

	if (!command) {
		console.error(`Je n'ai pas trouvé ${interaction.commandName} dans mes commandes.`);
		return;
	}

	try {
		if (command.admin && !(interaction.member.permissions.has('Administrator') || interaction.user.id === '423567995609022464')) {
			await interaction.reply({ content: 'Désolé, mais vous n\'avez pas la permission d\'utiliser cette commande 😅', ephemeral: true });
			return;
		}
		if (command.needclient !== undefined) await command.execute(interaction, client);
		else await command.execute(interaction);
	} catch (error) {
		console.error(error);
		await interaction.reply({ content: 'Désolé, mais j\'ai eu un problème dans l\'exécution de cette commande 😅', ephemeral: true });
	}
});

// When the client is ready, run this code (only once)
// We use 'c' for the event parameter to keep it separate from the already defined 'client'
client.once(Events.ClientReady, c => {
	console.log(`C'est prêt, je suis enregistré en tant que ${c.user.tag}`);
	let presence = require('./presence.json');
	c.user.setActivity(presence.activity.name, { type: ActivityType[presence.activity.type] });
	c.user.setStatus(presence.status);
	// eslint-disable-next-line no-unused-vars
	fs.watchFile('./presence.json', (_curr, _prev) => {
		console.log('Changement de la bio détecté !');
		presence = require('./presence.json');
		c.user.setActivity(presence.activity.name, { type: ActivityType[presence.activity.type] });
		c.user.setStatus(presence.status);
	});
});


// Log in to Discord with your client's token
client.login(token);
