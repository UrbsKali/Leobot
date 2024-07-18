const { SlashCommandBuilder } = require('discord.js');

module.exports = {
	admin: false,
	data: new SlashCommandBuilder()
		.setName('bio')
		.setDescription('Modifie la bio du bot')
		.addStringOption(option => option.setName('texte').setDescription('Le texte de la bio').setRequired(true))
		.addStringOption(option => option.setName('statut').setDescription('Le statut du bot').setRequired(true).addChoices(
			{ name: 'En ligne', value: 'online' },
			{ name: 'Occupé', value: 'dnd' },
			{ name: 'Absent', value: 'idle' },
			{ name: 'Hors ligne', value: 'offline' },
		))
		.addStringOption(option =>
			option.setName('type')
				.setRequired(true)
				.setDescription('Le type d\'activité')
				.addChoices(
					{ name: 'Joue', value: 'Playing' },
					{ name: 'Stream', value:'Streaming' },
					{ name: 'Écoute', value: 'Listening' },
					{ name: 'Regarde', value: 'Watching' },
					{ name: 'Custom', value: 'Custom' },
					{ name: 'Competing', value: 'Competing' },
				)),
	async execute(interaction) {
		if (interaction.user.id == '423567995609022464') {
			const text = interaction.options.getString('texte');
			const statut = interaction.options.getString('statut');
			const type = interaction.options.getString('type');
			const activity = { name: text, type: type };
			// save bio in presence.json
			const fs = require('fs');
			const presence = require('../presence.json');
			presence.activity = activity;
			presence.status = statut;
			fs.writeFileSync('./presence.json', JSON.stringify(presence));
			await interaction.reply('La bio a été modifiée !');
		} else {
			await interaction.reply({ content: 'Désolé, mais c\'est une commande privée 😅', ephemeral: true });
			return;
		}
	},
};