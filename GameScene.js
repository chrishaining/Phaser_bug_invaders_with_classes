 // I'm not sure where I should define the gameState variable
const gameState = {enemyVelocity: 1};

// Helper Methods below:
//   Do they need the word function? I thought yes, but I get an error message if I put them in
// sortedEnemies() returns an array of enemy sprites sorted by their x coordinate
function sortedEnemies() {
    const orderedByXCoord = gameState.enemies.getChildren().sort((a, b) => a.x - b.x);
    return orderedByXCoord;
}
      // numOfTotalEnemies() returns the number of total enemies 
function numOfTotalEnemies() {
    const totalEnemies = gameState.enemies.getChildren().length;
    return totalEnemies;
}

class GameScene extends Phaser.Scene {
    constructor() {
        super({key: 'GameScene'})
    }
    

    preload() {
        this.load.image('bug1', 'https://s3.amazonaws.com/codecademy-content/courses/learn-phaser/Bug+Invaders/bug_1.png');
        this.load.image('bug2', 'https://s3.amazonaws.com/codecademy-content/courses/learn-phaser/Bug+Invaders/bug_2.png');
        this.load.image('bug3', 'https://s3.amazonaws.com/codecademy-content/courses/learn-phaser/Bug+Invaders/bug_3.png');
        this.load.image('platform', 'https://s3.amazonaws.com/codecademy-content/courses/learn-phaser/physics/platform.png');
        this.load.image('codey', 'https://s3.amazonaws.com/codecademy-content/courses/learn-phaser/Bug+Invaders/codey.png');
        this.load.image('bugPellet', 'https://s3.amazonaws.com/codecademy-content/courses/learn-phaser/Bug+Invaders/bugPellet.png');
        this.load.image('bugRepellent', 'https://s3.amazonaws.com/codecademy-content/courses/learn-phaser/Bug+Invaders/bugRepellent.png');
    }
      
  
      
    create() {
          // When gameState.active is true, the game is being played and not over. When gameState.active is false, then it's game over
        gameState.active = true;
      
          // When gameState.active is false, the game will listen for a pointerup event and restart when the event happens
        this.input.on('pointerup', () => {
            if (gameState.active === false) {
                this.scene.restart();
            }
        })
      
          // Creating static platforms
        const platforms = this.physics.add.staticGroup();
        platforms.create(225, 490, 'platform').setScale(3, 0.3).refreshBody();
      
          // Displays the initial number of bugs, this value is initially hardcoded as 24 
        gameState.scoreText = this.add.text(175, 482, 'Bugs Left: 24', { fontSize: '15px', fill: '#ffffff' });
      
          // Uses the physics plugin to create Codey
        gameState.player = this.physics.add.sprite(225, 450, 'codey').setScale(.5);
      
          // Create Collider objects
        gameState.player.setCollideWorldBounds(true);
        this.physics.add.collider(gameState.player, platforms);
          
          // Creates cursor objects to be used in update()
        gameState.cursors = this.input.keyboard.createCursorKeys();
      
          // Add new code below:
        gameState.enemies = this.physics.add.group();
        for (let yVal = 1; yVal < 4; yVal++) {
            for (let xVal = 1; xVal < 9; xVal++) {
              gameState.enemies.create(50*xVal, 50*yVal, 'bug1').setScale(.6).setGravityY(-200)
            }
        }
        const pellets = this.physics.add.group();
        const genPellet = () => {
            if (numOfTotalEnemies() > 0) {
            let randomBug = Phaser.Utils.Array.GetRandom(gameState.enemies.getChildren());
             pellets.create(randomBug.x, randomBug.y, 'bugPellet')
            }
        }
        
        gameState.pelletsLoop = this.time.addEvent(
            {
            delay: 300,
            callback: genPellet,
            callbackScope: this,
            loop: true,
        })
        
        this.physics.add.collider(pellets, platforms, (pellet) => {pellet.destroy()})
      
        this.physics.add.collider(pellets, gameState.player, () => {
              gameState.active = false;
              gameState.enemyVelocity = 1;
              gameState.pelletsLoop.destroy();
              this.physics.pause();
            //   this.add.text(200, 200, 'Game Over', {fontSize: '30px', fill: '#ffffff'})
              this.input.on('pointerdown', () => {
                this.scene.stop('GameScene');
                this.scene.start('EndScene');
                })
          })
      
        gameState.bugRepellent = this.physics.add.group();
      
        this.physics.add.collider(gameState.enemies, gameState.bugRepellent, (bug, repellent) => {
          bug.destroy();
          repellent.destroy();
          gameState.scoreText.setText(`Bugs Left: ${numOfTotalEnemies()}`)
        })
        
        this.physics.add.collider(gameState.enemies, gameState.player, () => {
          gameState.active = false;
          gameState.enemyVelocity = 1;
          this.physics.pause();
        //   this.add.text(200, 200, 'Game Over', {fontSize: '30px', fill: '#ffffff'})
          this.input.on('pointerdown', () => {
            this.scene.stop('GameScene');
            this.scene.start('EndScene');
            })
        })
    }
      
    update() {
        if (gameState.active) {
              // If the game is active, then players can control Codey
            if (gameState.cursors.left.isDown) {
                gameState.player.setVelocityX(-160);
            } 
            else if (gameState.cursors.right.isDown) {
                gameState.player.setVelocityX(160);
            } 
            else {
                gameState.player.setVelocityX(0);
            }

            // pause
            if (gameState.cursors.down.isDown) {
              // if (this.scene.isPaused('GameScene') === false) {
                this.scene.pause('GameScene')}
            // }
            
            // unpause is not working
            // if (gameState.cursors.up.isDown) {
              // if (this.scene.isPaused('GameScene')) {
                // this.scene.resume('GameScene')}
            // }

              // Execute code if the spacebar key is pressed
            if (Phaser.Input.Keyboard.JustDown(gameState.cursors.space)) {
                gameState.bugRepellent.create(gameState.player.x, gameState.player.y, 'bugRepellent').setGravityY(-400)
            }
      
              // Add logic for winning condition and enemy movements below:
            if (numOfTotalEnemies() === 0) {
                gameState.active = false;
                this.physics.pause();
                gameState.enemyVelocity = 1;
                // this.add.text(200, 200, 'You won!', {fontSize: '30px', fill: '#ffffff'});
                this.input.on('pointerdown', () => {
                    this.scene.stop('GameScene');
                    this.scene.start('EndScene');
                    })
            }
            else {
                gameState.enemies.getChildren().forEach(function(bug) {bug.x += gameState.enemyVelocity});
                gameState.leftMostBug = sortedEnemies()[0];
                gameState.rightMostBug = sortedEnemies()[sortedEnemies().length -1];
            if (gameState.leftMostBug.x < 10 || gameState.rightMostBug.x > 440) 
                {
                gameState.enemyVelocity *= -1;             
                gameState.enemies.getChildren().forEach(function(bug) {bug.y += 10})
              }
            }
        }
    }

    // endGame() {
    //     this.physics.pause();
    //     this.input.on('pointerdown', () => {
    //         this.scene.stop('GameScene');
    //         this.scene.start('EndScene')
    //         })
    // }
      
}