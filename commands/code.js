const { SlashCommandBuilder } = require('discord.js');
const fs = require('fs');

module.exports = {
	admin: false,
	data: new SlashCommandBuilder()
		.setName('code')
		.setDescription('Vérifie votre compte discord avec votre compte devinci')
		.addStringOption(option => option.setName('code').setDescription('Le code que vous avez reçu par mail').setRequired(true)),
	async execute(interaction) {
		// eslint-disable-next-line prefer-const
		let users = require('../data.json');
		const role = interaction.guild.roles.cache.get('1080861451129999403');
		if (interaction.member.roles.cache.has('1080861451129999403')) {
			await interaction.reply({ content:'Vous êtes déjà vérifé(e) !', ephemeral: true });
			return;
		}
		if (users[interaction.user.id] === undefined) {
			await interaction.reply({ content:'Vous n\'avez pas encore rentré votre mail !', ephemeral: true });
			return;
		}
		if (users[interaction.user.id].code == interaction.options.getString('code')) {
			users[interaction.user.id].verified = 'true';
			delete users[interaction.user.id].code;
			interaction.member.roles.add(role);
		} else {
			await interaction.reply({ content:'Le code est incorrect !', ephemeral: true });
			return;
		}
		const embed = {
			'type': 'rich',
			'title': 'Félicitations !',
			'description': 'Vous êtes maintenant vérifié(e) !!\nVous pouvez désormais accéder à tous les salons !',
			'color': 0xb72c50,
			'thumbnail': {
				'url': 'https://cdn.discordapp.com/icons/1013512106148106381/a44ad2fdd8cf7b9cebcf08956283e732.webp?size=128',
				'height': 0,
				'width': 0,
			},
		};
		fs.writeFile('./data.json', JSON.stringify(users), (err) => {
			if (err) console.log(err);
		});

		await interaction.reply({ embeds: [embed], ephemeral: true });

	},
};