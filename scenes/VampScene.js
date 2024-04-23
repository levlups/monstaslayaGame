
let player;
let cursors;
 var p = location.hash;
        console.log(p.substring(1));
		console.log(p)
export default class VampScene extends Phaser.Scene {
    constructor() {
        super({ key: 'VampScene' });
    }


    preload() {
        // Load images/sprites
        this.load.image('background', 'assets/background.jpg');
        this.load.spritesheet('player', 'assets/hero.png', { frameWidth: 180, frameHeight: 198 });
		 this.load.spritesheet('enemy', 'assets/enemy.png', { frameWidth: 32, frameHeight: 32 });
		  this.load.image('hammer', 'assets/hammer.png'); 
        // Add more assets as needed
    }

    create() {
		
		
		  // Start a 2-minute countdown timer
       // this.initialTime = 120; // 2 minutes in seconds
		
		this.initialTime = 10; // 2 minutes in seconds

        // Display timer text
        this.timeText = this.add.text(16, 16, 'Time: ' + this.formatTime(this.initialTime), {
            fontSize: '32px',
            fill: '#FFFFFF'
        }).setDepth(4);

        // Each second call the countdown function
        this.timedEvent = this.time.addEvent({
            delay: 1000,
            callback: this.onCountdown,
            callbackScope: this,
            loop: true
        });
		
		
		
		
		
		
		
		
		
		
		
		
		
		
		
		
		
		 this.hammer = this.physics.add.sprite(100, 100, 'hammer');
this.hammer.displayHeight=32;
  this.hammer.displayWidth=32;
  this.hammer.setDepth(3);
  // Orbit parameters
  this.radius = 100;
  this.speed = 0.05;
  this.angle = 0;
		
		this.spaceBar = this.input.keyboard.addKey(Phaser.Input.Keyboard.KeyCodes.SPACE);
   cursors = this.input.keyboard.createCursorKeys();
  
   // Define W, A, S, D keys
  this.WKey = this.input.keyboard.addKey(Phaser.Input.Keyboard.KeyCodes.W);
  this.AKey = this.input.keyboard.addKey(Phaser.Input.Keyboard.KeyCodes.A);
  this.SKey = this.input.keyboard.addKey(Phaser.Input.Keyboard.KeyCodes.S);
  this.DKey = this.input.keyboard.addKey(Phaser.Input.Keyboard.KeyCodes.D);
		
		
		
        // Add background
    const back=   this.add.image(400, 300, 'background')
	   .setOrigin(0.5, 0.5);
        // Based on your game size, it may "stretch" and distort.
        back.displayWidth = 800;
        back.displayHeight = 600;

        // Create player
        this.player = this.physics.add.sprite(400, 300, 'player');
this.player.displayWidth = 50;
        this.player.displayHeight = 50;
		
		
		// Create player
        this.player2 = this.physics.add.sprite(400, 300, 'player');
this.player2.displayWidth = 50;
        this.player2.displayHeight = 50;
		
		player=this.player;
        // Create enemies group
        this.enemies = this.physics.add.group();
		 // idle with only one frame, so repeat is not neaded
		  this.anims.create({
          key: 'walk',
         frames: this.anims.generateFrameNumbers('player', { frames: [0,1,2,3,4,5] }),
        frameRate: 10,
        repeat: -1
    });
	
	
	 this.anims.create({
          key: 'idle',
         frames: this.anims.generateFrameNumbers('player', { frames: [5] }),
        frameRate: 10,
        repeat: -1
    });
	
		 this.player.anims.play('idle', true);
    this.anims.create({
          key: 'walky',
         frames: this.anims.generateFrameNumbers('enemy', { frames: [4,5,6,7] }),
        frameRate: 10,
        repeat: -1
    });
	
	
	 this.anims.create({
          key: 'walky2',
         frames: this.anims.generateFrameNumbers('enemy', { frames: [8,9,10,11] }),
        frameRate: 10,
        repeat: -1
    });

        // Add enemies to the group
        for (let i = 0; i < 20; i++) {
            let enemy = this.enemies.create(Phaser.Math.Between(100, 700), Phaser.Math.Between(100, 500), 'enemy');
			  enemy.anims.play('walky', true);
            // Set up enemy behavior here
        }

        // Enable collision between player and enemies
        this.physics.add.collider(this.player, this.enemies, this.handleCollision, null, this);
		
		this.physics.add.collider(this.hammer, this.enemies, this.handleCollisionItem, null, this);

        // Set up player animations and controls here
    }
	

    update() {
		
		 sendMessage(JSON.stringify({id:p.substring(1),x:player.x,y:player.y,side:player.flipX,movingx:player.body.velocity.x,movingy:player.body.velocity.y}))
		 if(p.substring(1) !== otherplayer.id){
			
		 this.player2.x=otherplayer.x
		 this.player2.y=otherplayer.y
		 this.player2.flipX=otherplayer.side
				 if(otherplayer.movingx!==0 || otherplayer.movingy!==0 ){
					 this.player2.anims.play('walk', true);
				 }else{
					  this.player2.anims.play('idle', true);
				 }
		 }
        // Handle player movement and enemy behavior updates
		// Move each enemy towards the player
        this.enemies.children.iterate((enemy) => {
            // Calculate the angle from the enemy to the player
            var angle = Phaser.Math.Angle.Between(enemy.x, enemy.y, this.player.x, this.player.y);
            
            // Calculate velocity vector based on angle and enemy speed
            const speed = 100; // Adjust speed as needed
            enemy.body.velocity.x = Math.cos(angle) * speed;
            enemy.body.velocity.y = Math.sin(angle) * speed;
        });
		
		
		if (this.AKey.isDown || cursors.left.isDown)
    {
        player.body.setVelocityX(-200);
        player.anims.play('walk', true); // walk left
        player.flipX = true; // flip the sprite to the left
    }
    else if (this.DKey.isDown || cursors.right.isDown)
    {
        player.body.setVelocityX(200);
        player.anims.play('walk', true);
        player.flipX = false; // use the original sprite looking to the right
    }
   
    else if (this.WKey.isDown || cursors.up.isDown )
    {
        player.body.setVelocityY(-200); 
        player.anims.play('walk', true);		
    }
	else if (this.SKey.isDown || cursors.down.isDown )
    {
        player.body.setVelocityY(200);   
        player.anims.play('walk', true);		
    }
	else{
		player.body.setVelocityY(0);   
player.body.setVelocityX(0);
        player.anims.play('idle', true);		
	}
		
	 this.angle += this.speed;
  if (this.angle > 2 * Math.PI) {
      this.angle -= 2 * Math.PI; // reset angle to prevent overflow
  }
  this.hammer.x = player.x + this.radius * Math.cos(this.angle);
  this.hammer.y = player.y + this.radius * Math.sin(this.angle);
		
		
		
    }
		
		
     handleCollision(item, enemy) {
		//console.log('hit')
        // Handle what happens when a player hits an enemy
    }
	
	 handleCollisionItem(item, enemy) {
		console.log('item hit')
		enemy.destroy()
        // Handle what happens when a player hits an enemy
    }
	
	
	
	
	 onCountdown() {
        this.initialTime -= 1; // Decrease the timer by one
        this.timeText.setText('Time: ' + this.formatTime(this.initialTime));

          // When the timer reaches zero, check if any enemies are alive
    if (this.initialTime <= 0) {
        this.timedEvent.remove(); // Stop the timer

        // Check if all enemies are dead
        if (this.enemies.countActive(true) === 0) {
            this.resetGame(); // Reset the game if all enemies are dead
        } else {
            this.endGame(); // End the game if any enemies are alive
        }
    }
	
    }
	
	endGame() {
    // Stop all enemies
    this.enemies.setVelocityX(0);
    this.enemies.setVelocityY(0);

    // Display "You are dead" text
    this.add.text(this.sys.game.config.width / 2, this.sys.game.config.height / 2, 'You are dead', {
        fontSize: '64px',
        fill: '#FF0000'
    }).setOrigin(0.5);

    // Optionally, stop the player from moving or taking any actions
    // ... your code to stop the player ...

    // You could also stop the scene or go to a game over scene
    // this.scene.stop();
    // this.scene.start('GameOverScene');
}

    resetGame() {
        // Kill all enemies
        this.enemies.clear(true, true);

        // Reset player position to the middle of the map
        this.player.setPosition(this.sys.game.config.width / 2, this.sys.game.config.height / 2);
		
		
		// Add enemies to the group
        for (let i = 0; i < 20; i++) {
            let enemy = this.enemies.create(Phaser.Math.Between(100, 700), Phaser.Math.Between(100, 500), 'enemy');
			  enemy.anims.play('walky2', true);
            // Set up enemy behavior here
        }

        // Enable collision between player and enemies
        this.physics.add.collider(this.player, this.enemies, this.handleCollision, null, this);

        // You could also restart the scene or reset other game elements as needed
        // this.scene.restart();
		
		 // Reset the initial time for the timer
    //this.initialTime = 120; // 2 minutes in seconds
	 this.initialTime = 10; // 2 minutes in seconds

    // Restart the timer event
    this.timedEvent = this.time.addEvent({
        delay: 1000,
        callback: this.onCountdown,
        callbackScope: this,
        loop: true
    });
	
    }

    formatTime(seconds) {
        // Convert seconds (s) to a mm:ss format
        const minutes = Math.floor(seconds / 60);
    const partInSeconds = seconds % 60;
    const formattedMinutes = String(minutes).padStart(2, '0');
    const formattedSeconds = String(partInSeconds).padStart(2, '0');
    return `${formattedMinutes}:${formattedSeconds}`;
    }

    
}
