const { REST, Routes } = require('discord.js');
const { clientId, devGuildId, token } = require('../config.json');


const rest = new REST({ version: '10' }).setToken(token);

rest.put(Routes.applicationGuildCommands(clientId, devGuildId), { body: [] })
	.then(() => console.log('Successfully deleted all guild commands.'))
	.catch(console.error);