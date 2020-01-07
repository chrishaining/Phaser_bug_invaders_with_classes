class GameScene extends Phaser.Scene {
    constructor() {
        super({key: 'GameScene'})
    }

    create() {
        this.add.text(375, 200, 'Here goes', {fill: '#ffffff', fontSize: '20px'});
        this.input.on('pointerdown', () => {
            this.scene.stop('GameScene');
            this.scene.start('EndScene')
            })
      }
}