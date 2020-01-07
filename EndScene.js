class EndScene extends Phaser.Scene {
    constructor() {
        super({key: 'EndScene'})
    }

    create() {
        this.add.text(250, 200, 'Game Over. Click to play again.', {fill: '#ffffff', fontSize: '20px'});
        this.input.on('pointerdown', () => {
            this.scene.stop('EndScene');
            this.scene.start('StartScene')
            })
      }
}