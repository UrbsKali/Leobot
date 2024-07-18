module.exports = {
	name: 'generate-code',
	execute(len = 6) {
		const chars = '0123456789abcdefghijklmnopqrstuvwxyzABCDEFGHIJKLMNOPQRSTUVWXYZ';
		let code = '';
		for (let i = 0; i < len; i++) {
			code += chars[Math.floor(Math.random() * chars.length)];
		}
		return code;
	},
};

