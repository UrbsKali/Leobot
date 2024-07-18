const { SlashCommandBuilder } = require('discord.js');

module.exports = {
	admin: true,
	data: new SlashCommandBuilder()
		.setName('send')
		.setDescription('envoie un message dans le salon spécifié')
		.addChannelOption(option => option.setName('salon').setDescription('Le salon dans lequel envoyer le message').setRequired(true))
		.addStringOption(option => option.setName('titre').setDescription('Le titre du message').setRequired(true))
		.addStringOption(option => option.setName('text').setDescription('Le corps du message').setRequired(true))
		.addMentionableOption(option => option.setName('user').setDescription('para la mention').setRequired(false)),
	async execute(interaction) {
		const channel = interaction.options.getChannel('salon');
		const titre = interaction.options.getString('titre');
		const text = interaction.options.getString('text');
		const embed = {
			'type': 'rich',
			'title': titre,
			'description': text,
			'color': 0xb72c50,
			'thumbnail': {
				'url': 'https://cdn.discordapp.com/icons/1013512106148106381/a44ad2fdd8cf7b9cebcf08956283e732.webp?size=128',
				'height': 0,
				'width': 0,
			},
		};
		if (interaction.options.getMentionable('user')) {
			channel.send({ embeds: [embed], text: interaction.options.getMentionable('user') });
		} else {
			channel.send({ embeds: [embed] });
		}
		await interaction.reply('Le message a été envoyé !');
	},
};