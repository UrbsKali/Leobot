const { SlashCommandBuilder } = require('discord.js');

module.exports = {
	urbainonly: true,
	admin: false,
	data: new SlashCommandBuilder()
		.setName('get-user')
		.setDescription('récupère les informations d\'un utilisateur')
		.addMentionableOption(option => option.setName('personne').setDescription('La personne en question').setRequired(true)),
	async execute(interaction) {
		const users = require('../data.json');
		const user = interaction.options.getMentionable('personne');
		let email = '';
		let embed = {};
		try {
			email = users[user.id].email;
			embed = {
				'type': 'rich',
				'title': 'Voici les données de l\'utilisateur',
				'description': `l'adresse email de <@${user.id}> est : \`${email}\``,
				'color': 0xb72c50,
				'thumbnail': {
					'url': 'https://cdn.discordapp.com/icons/1013512106148106381/a44ad2fdd8cf7b9cebcf08956283e732.webp?size=128',
					'height': 0,
					'width': 0,
				},
			};
			await interaction.user.send({ embeds: [embed] });
		} catch (e) {
			await interaction.user.send('Cet utilisateur n\'existe pas sur les bases de données !');
		}

		await interaction.reply({ content:'Les données ont été envoyées en message privé !', ephemeral: true });
	},
};