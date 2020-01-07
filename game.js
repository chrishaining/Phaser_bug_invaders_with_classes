
const config = {
	type: Phaser.AUTO,
	width: 850,
	height: 500,
	backgroundColor: "808080",
	physics: {
		default: 'arcade',
		arcade: {
			gravity: { y: 200 },
			enableBody: true,
		}
	},
	scene: [StartScene, GameScene, EndScene]
};


const game = new Phaser.Game(config);