const { SlashCommandBuilder } = require('discord.js');
const generate = require('../utils/generate-code.js');
const sendMail = require('../utils/send-mail.js');
const fs = require('node:fs');

module.exports = {
	admin: false,
	data: new SlashCommandBuilder()
		.setName('verify')
		.setDescription('Vérifie votre compte discord avec votre compte devinci')
		.addStringOption(option => option.setName('email').setDescription('Votre adresse mail devinci').setRequired(true)),
	async execute(interaction) {
		let users = require('../data.json');
		try {
			if (interaction.member.roles.cache.has('1080861451129999403')) {
				await interaction.reply({ content:'Vous êtes déjà vérifé(e) !', ephemeral: true });
				return;
			}
		} catch (error) {
			await interaction.reply({ content: ':x: Vous devez être sur le serveur de l\'ESILV pour utiliser cette commande !', ephemeral: true });
			console.log(interaction.user.tag + ' tried to use the verify command outside of the server\nid : ' + interaction.user.id);
			return;
		}
		const email = interaction.options.getString('email');
		if (!email.includes('@edu.devinci.fr')) {
			await interaction.reply({ content:':x: Vous devez utiliser une adresse mail **@edu.devinci.fr** !', ephemeral: true });
			return;
		}
		for (const id in users) {
			if (users[id].email == email) {
				await interaction.reply({ content: ':x: Cette adresse email est déjà utilisé par un compte discord', ephemeral: true });
				return;
			}
		}
		const code = generate.execute();
		const html = `<div style="display:flex;flex-direction: column;padding: 1em;margin: 1em;background-color: rgb(248, 248, 248);border-radius: 5px;">
		<div style="margin: auto;">
			<h2 style="font-family: 'Segoe UI', Tahoma, Geneva, Verdana, sans-serif;">Voici votre code de vérification pour le serveur de L'ESILV</h2>
			
		</div>
		<div style="margin: auto;display: flex;">
			<p style="padding: 1em;background-color: rgb(235, 235, 235); margin: .5em;border-radius: 5px;font-family:'Courier New', Courier, monospace">${code}</p>
		</div>
		<div style="width: 100%;">
			<p style="font-family: 'Segoe UI', Tahoma, Geneva, Verdana, sans-serif;text-align: center;">Ce code est valable pendant 1 minute.<br>Il faut le rentrer dans <span style="padding: 0 2px; background-color: rgba(61, 66, 110, 0.811);color: white;border-radius: 5px;">@Leobot</span> grâce à la commande <span style="background-color: rgb(74, 74, 74);border-radius: 5px;padding: 2px; margin: 2px; color: white;font-family: 'Courier New', Courier, monospace;">/code</span></p>
		</div>
		<div style="margin: auto;width: 100%;">
			<p style="font-family: 'Segoe UI', Tahoma, Geneva, Verdana, sans-serif;font-style: italic;font-size: x-small;text-align: center;">Si vous n'êtes pas à l'origine de cette demande, veuillez ignorer ce message.</p>
			
			<p style="color: rgb(197, 197, 197);font-family: 'Segoe UI', Tahoma, sans-serif;font-size: 75%;text-align: right;">Made with ❤️ by <a href="http://github.com/urbskali" style="color: rgb(197, 197, 197);font-family: 'Segoe UI', Tahoma, sans-serif;font-size: 100%;">@urbskali</a></p>
		</div>
	
	</div>`;
		sendMail.execute(email, 'Voici votre code de vérification ', html);
		if (users === undefined) users = {};
		if (users[interaction.user.id] === undefined) users[interaction.user.id] = {};
		users[interaction.user.id] = {
			'email': email,
			'verified': 'false',
			'code': code,
		};
		const embed = {
			'type': 'rich',
			'title': 'Bonjour !',
			'description': 'Vous avez reçu un mail qui contient un code de sécurité, merci de le rentrer avec la commande `/code` !\n*Attention, vous avez 1 minute pour rentrer le code !*',
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

		setTimeout(async () => {
			users = require('../data.json');

			if (users[interaction.user.id] === undefined || users[interaction.user.id].verified == 'false') {
				delete users[interaction.user.id];
				fs.writeFile('./data.json', JSON.stringify(users), (err) => {
					if (err) console.log(err);
				});
				await interaction.followUp({ content:'Vous avez mis trop de temps à rentrer le code !', ephemeral: true });
			}
		}, 60000);
		await interaction.reply({ embeds: [embed], ephemeral: true });
	},
};