class StartScene extends Phaser.Scene {
    constructor() {
        super({key: 'StartScene'})
    }

    create() {
        this.add.text(300, 200, 'Are you ready to play?', {fill: '#ffffff', fontSize: '20px'});
        this.input.on('pointerdown', () => {
            this.scene.stop('StartScene');
            this.scene.start('GameScene')
            })
      }
}