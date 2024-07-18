const { SlashCommandBuilder } = require('discord.js');

module.exports = {
	admin: false,
	data: new SlashCommandBuilder()
		.setName('check-verif')
		.setDescription('Vérifie l\'état de la liaison entre votre compte discord et votre compte devinci')
		.addMentionableOption(option => option.setName('personne').setDescription('La personne que vous recherchez').setRequired(true)),
	async execute(interaction) {
		const users = require('../data.json');
		let text = '';
		const user = interaction.options.getMentionable('personne');
		if (user.roles.cache.has('1080861451129999403')) {
			text += `✅ ${user.user.username} est déjà vérifé(e) !\n`;
		} else {
			text += `❌ ${user.user.username} n'est pas vérifé(e) !\n`;
		}
		if (users[user.id] === undefined) {
			text += `❌ ${user.user.username} n'a pas encore rentré son mail !\n`;
			text += '❌ Le code n\'est pas encore rentré\n';
		} else {
			text += '✅ Cette personne a rentré son mail !\n';
			if (users[user.id].code !== undefined) {
				text += '❌ Le code n\'est pas encore rentré\n';
			} else {
				text += `✅ ${user.user.username} a rentré son code!\n`;
			}
		}
		const embed = {
			'type': 'rich',
			'title': 'Voici le status de vérification de ' + user.user.username,
			'description': text,
			'color': 0xb72c50,
			'thumbnail': {
				'url': 'https://cdn.discordapp.com/icons/1013512106148106381/a44ad2fdd8cf7b9cebcf08956283e732.webp?size=128',
				'height': 0,
				'width': 0,
			},
		};
		await interaction.reply({ embeds: [embed] });
	},
};