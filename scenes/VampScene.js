
let player;
let cursors;
let mainscene;
var button;
 var p = location.hash;
        console.log(p.substring(1));
		console.log(p)
export default class VampScene extends Phaser.Scene {
    constructor() {
        super({ key: 'VampScene' });
		     this.playerMaxHealth = 100;
        this.playerHealth = this.playerMaxHealth;
		this.hitCooldown = false; // Flag to manage hit cooldown
		 this.currentLevel = 0; // Initialize level counter
		 this.gameEnded=false;
		 this.endText;
		 this.restartButton;
		 this.targetX = 0; 
        this.targetY = 0;
	    this.playerExperience=0;
	    this.experienceToLevelUp=1000;
    }



    preload() {
        // Load images/sprites
        this.load.image('background', 'assets/background.jpg');
		 this.load.image('circle', 'assets/circle.png');
        this.load.spritesheet('player', 'assets/hero.png', { frameWidth: 180, frameHeight: 198 });
		 this.load.spritesheet('enemy', 'assets/enemy.png', { frameWidth: 32, frameHeight: 32 });
		 
		 
		  this.load.image('hammer', 'assets/hammer.png'); 
		   this.load.image('whip', 'assets/whip.png'); 
		   this.load.image('heart', 'assets/heart.png'); 
        // Add more assets as needed
    }

    create() {


	    // Create level-up bar background
    this.levelUpBarBackground = this.add.graphics();
    this.levelUpBarBackground.fillStyle(0x000000, 1); // black background
    this.levelUpBarBackground.fillRect(0, this.cameras.main.height -790, this.cameras.main.width, 20);

    // Create level-up bar fill
    this.levelUpBarFill = this.add.graphics();
    this.levelUpBarFill.fillStyle(0x00ff00, 1); // green fill
    this.levelUpBarFill.fillRect(0,0, 0, 0); // initially empty

    // Fix the level-up bar to the camera
    this.levelUpBarBackground.setScrollFactor(0);
    this.levelUpBarFill.setScrollFactor(0);
///////////////////////////////////////////////////////////////////////////
/* // Delay for 5 seconds before showing the video
    this.time.delayedCall(5000, function() {
        var videoHtml = '<iframe width="560" height="315" src="https://www.youtube.com/embed/lWLcqtf2fos?si=CdgFNmPac7L31syY" title="YouTube video player" frameborder="0" allow="accelerometer; autoplay; muted; clipboard-write; encrypted-media; gyroscope; picture-in-picture; web-share" referrerpolicy="strict-origin-when-cross-origin" allowfullscreen></iframe>';
        var video = this.add.dom(400, 300).createFromHTML(videoHtml);
        video.setOrigin(0.5); // This centers the iframe
    }, [], this);*/
	    
		mainscene=this;
		
		
		    // Start a repeating timer to shoot the hammer
    this.time.addEvent({
        delay: 1000,    // 1000 ms = 1 second
        callback: this.shootHammer,
        callbackScope: this,
        loop: true
    });
		
		  // Create a container for UI elements
    this.uiContainer = this.add.container(this.cameras.main.worldView.x, this.cameras.main.worldView.y);
//    this.uiContainer.setScrollFactor(0);
		
		
		 // Create level text display
        this.levelText = this.add.text(0, 30, 'Level: ' + this.currentLevel, {
            fontSize: '32px',
            fill: '#FFFFFF'
        }).setDepth(8); // Anchored top right

	     this.uiContainer.add(this.levelText);
		
		  // Start a 2-minute countdown timer
       // this.initialTime = 120; // 2 minutes in seconds
		
		this.initialTime = 10; // 2 minutes in seconds

        // Display timer text
        this.timeText = this.add.text(this.cameras.main.width -220, 30, 'Time: ' + this.formatTime(this.initialTime), {
            fontSize: '32px',
            fill: '#FFFFFF'
        }).setDepth(4);

	       this.uiContainer.add(this.timeText);

        // Each second call the countdown function
        this.timedEventWaves = this.time.addEvent({
            delay: 1000,
            callback: this.onCountdown,
            callbackScope: this,
            loop: true
        });
		
		
		
		 // Each second call the countdown function
        this.timedEvent = this.time.addEvent({
            delay: 1000,
            callback: this.onWaves,
            callbackScope: this,
            loop: true
        });
		
		
		
		
		
		
		
		
		
		
		
		// this.hammer2 = this.physics.add.sprite(100, 100, 'hammer');
		
		
		
		
		 this.hammer = this.physics.add.sprite(100, 100, 'hammer');
this.hammer.displayHeight=32;
  this.hammer.displayWidth=32;
  this.hammer.setDepth(3);
  this.hammer.name='hammer'
  
  

  
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
	   .setOrigin(0.5, 0.5).setDepth(-1);
        // Based on your game size, it may "stretch" and distort.
        back.displayWidth = 800;
        back.displayHeight = 600;




  
        // Create player
        this.player = this.physics.add.sprite(400, 300, 'player');
this.player.displayWidth = 50;
        this.player.displayHeight = 50;
		 this.circle = this.physics.add.sprite(400, 300, 'circle').setDepth(5).setCircle(300).setOrigin(0.5, 0.5);
		 this.circle.displayWidth = 200;
        this.circle.displayHeight = 200;
		this.circle.name='circle'
		
		  this.targetX = this.player.x; // Set initial target to player's starting position
        this.targetY = this.player.y; // Set initial target to player's starting position
        this.input.on('pointerdown', (pointer) => {
            this.movePlayerToPoint(pointer.x, pointer.y);
        });


  
  this.whip = this.physics.add.sprite(150, 100, 'whip');
this.whip.displayHeight=32;
  this.whip.displayWidth=32;
  this.whip.setDepth(3);


// Collider to attach the whip to the player
        this.physics.add.collider(this.player, this.whip, this.attachWhipToPlayer, null, this);

		
		
		  // Create a health bar
       // Health bar graphics
        this.healthBarBackground = this.add.graphics();
        this.healthBar = this.add.graphics();
		
		
		
		
		
		
		// Create player
        this.player2 = this.physics.add.sprite(400, 300, 'player');
this.player2.displayWidth = 50;
        this.player2.displayHeight = 50;
		
		player=this.player;
		
		
		       this.loots = this.physics.add.group();
		
		
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
	
	
	

        // Add enemies to the group
        for (let i = 0; i < 20; i++) {
            let enemy = this.enemies.create(Phaser.Math.Between(100, 700), Phaser.Math.Between(10, 50), 'enemy');
			  enemy.anims.play('walky', true);
            // Set up enemy behavior here
        }

        // Enable collision between player and enemies
        this.physics.add.collider(this.player, this.enemies, this.handleCollision, null, this);
		
		this.physics.add.collider(this.hammer, this.enemies, this.handleCollisionItem, null, this);
		
			//this.physics.add.collider(this.circle, this.enemies, this.handleCollisionItem, null, this);
	    this.physics.add.overlap(this.circle, this.enemies, this.handleCollisionItem, null, this);

        // Set up player animations and controls here
    }
	
	attachWhipToPlayer(player, whip) {
    this.whipAttached = true; // Set a flag that the whip is attached
    whip.setVelocity(0, 0); // Stop the whip's movement
}
	
	   shootHammer() {
        if (!this.enemies || this.enemies.getChildren().length === 0) {
            return; // No enemies to shoot at
        }

         // Find the closest enemy using the custom function
    let closestEnemy = this.findClosestEnemy();

		if (closestEnemy) {
			// Create a hammer projectile
			let hammer = this.physics.add.sprite(this.player.x, this.player.y, 'hammer');
			this.physics.moveToObject(hammer, closestEnemy, 300); // Move at 300 pixels/sec
			hammer.displayHeight=32;
			hammer.displayWidth=32;
			// Optionally, add collision for the hammer with the enemy
			this.physics.add.collider(hammer, closestEnemy, (hammer, enemy) => {
				
				 // Randomly decide to drop a heart
        if (Math.random() < 0.25) { // 25% chance to drop a heart
            this.dropHeart(enemy.x, enemy.y);
        }


				/////////////////////////////////////////////////////////////
				 // Calculate a random number to display
    const hitPoints = Phaser.Math.Between(50, 100); // Random points between 50 and 100

    // Create a text object at the enemy's position
    let hitText = this.add.text(enemy.x, enemy.y, hitPoints.toString(), {
	     fontFamily: 'Press Start 2P',
         fontSize: '20px',
        fill: '#ffffff',  // White text
        stroke: '#000000', // Black stroke
        strokeThickness: 3, // Stroke thickness in pixels
        align: 'center'  // Center align text
    }).setOrigin(0.5, 0.5);

    // Make the text disappear after 1 second
    this.time.delayedCall(1000, () => {
        hitText.destroy();
    });
////////////////////////////////////////////////////////////////				
				hammer.destroy(); // Destroy the hammer on hit
				enemy.destroy(); // Optionally destroy the enemy or apply damage
				this.gainExperience(hitPoints)
				// Additional effects upon hit can be added here
			});
		}
    }
	 dropHeart(x, y) {
		 
		  let heart  = this.loots.create(x, y, 'heart');
        //let heart = this.physics.add.sprite(x, y, 'heart');
        heart.setCollideWorldBounds(true);
        this.physics.add.overlap(this.player, heart, this.collectHeart, null, this);
    }
	collectHeart(player, heart) {
        heart.destroy();
        this.playerHealth = Math.min(this.playerHealth + 10, this.playerMaxHealth);
        this.updateHealthBar();
    }
	findClosestEnemy() {
    let closestEnemy = null;
    let closestDistance = Infinity;

    this.enemies.getChildren().forEach((enemy) => {
        let distance = Phaser.Math.Distance.Between(this.player.x, this.player.y, enemy.x, enemy.y);
        if (distance < closestDistance) {
            closestEnemy = enemy;
            closestDistance = distance;
        }
    });

    return closestEnemy;
}

	

    update() {
		if(this.circle){
this.circle.x=this.player.x
this.circle.y=this.player.y
		}
	     // Update the container position to stay at the top left of the camera view
    this.uiContainer.setPosition(this.cameras.main.scrollX, this.cameras.main.scrollY);
		 this.updateHealthBar()
		
		 this.loots.getChildren().forEach((loot) => {
            const distance = Phaser.Math.Distance.Between(this.player.x, this.player.y, loot.x, loot.y);
            if (distance < 100) {
                this.physics.moveToObject(loot, this.player, 200);
            }else{
			loot.setVelocity(0, 0);
			}
        });
		
		 
		
		// If the whip is attached, update its position to match the player
    if (this.whipAttached) {
        this.whip.setPosition(this.player.x, this.player.y);
    }
		mainscene.scene.scene.cameras.main.centerOn(this.player.x, this.player.y);
		
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
		 
		 if(this.gameEnded){
			 
			 return;
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
		
		 this.targetX = this.player.x;
        this.targetY = this.player.y;
    }
    else if (this.DKey.isDown || cursors.right.isDown)
    {
        player.body.setVelocityX(200);
        player.anims.play('walk', true);
        player.flipX = false; // use the original sprite looking to the right
		
		 this.targetX = this.player.x;
        this.targetY = this.player.y;
    }
   
    else if (this.WKey.isDown || cursors.up.isDown )
    {
        player.body.setVelocityY(-200); 
        player.anims.play('walk', true);

		this.targetX = this.player.x;
        this.targetY = this.player.y;
		
    }
	else if (this.SKey.isDown || cursors.down.isDown )
    {
        player.body.setVelocityY(200);   
        player.anims.play('walk', true);	

		this.targetX = this.player.x;
        this.targetY = this.player.y;
		
    }
	else{
		player.body.setVelocityY(0);   
player.body.setVelocityX(0);
        player.anims.play('idle', true);	
  // Logic to move player to clicked point
       this.updatePlayerMovement();		
	}
		
	 this.angle += this.speed;
  if (this.angle > 2 * Math.PI) {
      this.angle -= 2 * Math.PI; // reset angle to prevent overflow
  }
  this.hammer.x = player.x + this.radius * Math.cos(this.angle);
  this.hammer.y = player.y + this.radius * Math.sin(this.angle);
		
		
		
    }
	
	    movePlayerToPoint(x, y) {
        this.targetX = x;
        this.targetY = y;
    }

    updatePlayerMovement() {
        const reachedX = Math.abs(this.player.x - this.targetX) < 4; // Close enough to target x
        const reachedY = Math.abs(this.player.y - this.targetY) < 4; // Close enough to target y

        if (reachedX && reachedY) {
            this.player.body.stop(); // Stop the player when the target is reached
        } else {
			
            const speed = 200; // pixels per second
            this.physics.moveTo(this.player, this.targetX, this.targetY, speed);
			 this.player.anims.play('walk', true);
        }
    }
		
		
     handleCollision(player, enemy) {
		//console.log('hit')
        // Handle what happens when a player hits an enemy
		    if (!this.hitCooldown) {
            this.playerHealth -= 10; // Decrease health by 10 or whatever amount is suitable
            this.updateHealthBar();

            if (this.playerHealth <= 0) {
                // Player is dead, trigger the end game sequence
				if(!this.gameEnded){
                this.endGame();
				 this.gameEnded=true
				}
            } else {
                // Player was hit but is still alive, start hit cooldown
                this.startHitCooldown();
            }
        }
    }
	
	   
   startHitCooldown() {
        this.hitCooldown = true; // Activate the cooldown
        
        // Optionally change the player's appearance to indicate they've been hit
        this.player.setTint(0xff0000);

        // Set a timed event for 1 second to reset the cooldown
        this.time.delayedCall(1000, () => {
            this.hitCooldown = false;
            this.player.clearTint(); // Reset the tint to indicate the player can be hit again
        });
    }
   

	
	 handleCollisionItem(item, enemy) {
		// console.log(item.name)
		 				/////////////////////////////////////////////////////////////
				 // Calculate a random number to display
    const hitPoints = Phaser.Math.Between(50, 100); // Random points between 50 and 100

    // Create a text object at the enemy's position
    let hitText = this.add.text(enemy.x, enemy.y, hitPoints.toString(), {
         fontSize: '20px',
        fill: '#ffffff',  // White text
        stroke: '#000000', // Black stroke
        strokeThickness: 3, // Stroke thickness in pixels
        align: 'center'  // Center align text
    }).setOrigin(0.5, 0.5);

    // Make the text disappear after 1 second
    this.time.delayedCall(1000, () => {
        hitText.destroy();
    });
////////////////////////////////////////////////////////////////
		 
		//console.log('item hit')
		enemy.destroy()
		if(item.name=='circle'){
		 this.gainExperience(0.1)
		}
		else if(item.name=='hammer'){
			 this.gainExperience(1)
		}else{
			return;
		}
        // Handle what happens when a player hits an enemy
    }
	 
	
	    updateHealthBar() {
		
			   // Update health bar position and fill based on player's health
        this.healthBarBackground.clear();
        this.healthBarBackground.fillStyle(0x000000, 1);
		const lolx=this.player.x
		const loly=this.player.y
        this.healthBarBackground.fillRect(lolx - 25, loly -40, 50, 10);
        // Scale the health bar according to the player's health
       // this.healthBar.scaleX = this.playerHealth / this.playerMaxHealth;
        this.healthBar.clear();
        this.healthBar.fillStyle(0xFF0000, 1);
		// const fillWidth = Math.max(0, (this.player.Health / this.player.maxHealth) * 50);
        this.healthBar.fillRect(lolx- 25, loly -40,(this.playerHealth / this.playerMaxHealth) * 50 , 10);
        //this.healthBar.fillRect(this.player.x, this.player.y +42, this.playerHealth, 24);
		
    }
	
	onWaves(){
		//console.log('waves')
		 // Add enemies to the group
        for (let i = 0; i < 20; i++) {
            let enemy = this.enemies.create(Phaser.Math.Between(100, 700), Phaser.Math.Between(10, 50), 'enemy');
			  enemy.anims.play('walky', true);
            // Set up enemy behavior here
        }

        // Enable collision between player and enemies
        this.physics.add.collider(this.player, this.enemies, this.handleCollision, null, this);
		
		this.physics.add.collider(this.hammer, this.enemies, this.handleCollisionItem, null, this);
		
			this.physics.add.collider(this.circle, this.enemies, this.handleCollisionItem, null, this);
		
		
	}
	
	 onCountdown() {
        this.initialTime -= 1; // Decrease the timer by one
        this.timeText.setText('Time: ' + this.formatTime(this.initialTime));

          // When the timer reaches zero, check if any enemies are alive
    if (this.initialTime <= 0) {
        this.timedEvent.remove(); // Stop the timer

        // Check if all enemies are dead
		if (this.enemies.countActive(true)  > 0) {
			
			if(!this.gameEnded){

				
            this.resetGame(); // Reset the game if all enemies are dead
			}
		
        } 
        else if (this.enemies.countActive(true) === 0) {
			if(!this.gameEnded){
            this.resetGame(); // Reset the game if all enemies are dead
			}
		
        } else {
			
			if(!this.gameEnded){
           this.endGame(); // End the game if any enemies are alive
			 //this.resetGame();
			 this.gameEnded=true
			}
        }
    }
	
    }
	
	endGame() {

	
		
		this.enemies.clear(true, true);
    // Stop all enemies
    //this.enemies.setVelocityX(0);
    //this.enemies.setVelocityY(0);
	
	this.player.setVelocityX(0);
    this.player.setVelocityY(0);

    // Display "You are dead" text
  this.endText=  this.add.text(this.sys.game.config.width / 2, this.sys.game.config.height / 2, 'You are dead', {
        fontSize: '64px',
        fill: '#FF0000'
    }).setOrigin(0.5);

    // Optionally, stop the player from moving or taking any actions
    // ... your code to stop the player ...
    // Create a restart button
   /* this.restartButton = this.add.text(this.sys.game.config.width / 2, (this.sys.game.config.height / 2)+50, 'Restart', {
        fontSize: '32px',
        fill: '#FFFFFF'
    }).setOrigin(0.5).setInteractive();

    // When the restart button is clicked, restart the game
    this.restartButton.on('pointerdown', () => {
		 this.enemies.clear(true, true);
		  this.gameEnded=false
      //  this.scene.restart();
	  this.restartButton.setText('')
	this.endText.setText('')
	this.currentLevel=0;
		 this.resetGame();
		
    });

    // Change the button color when hovered
    this.restartButton.on('pointerover', () => this.restartButton.setStyle({ fill: '#FFCC00' }));
    this.restartButton.on('pointerout', () => this.restartButton.setStyle({ fill: '#FFFFFF' }));*/

    // Optionally, stop the player from moving or taking any actions
    // ... your code to stop the player ...

    // You could also stop the scene or go to a game over scene
    // this.scene.stop();
    // this.scene.start('GameOverScene');
	
				 // Specify your button image
    var buttonImage = 'assets/button.png'; // Ensure the path is correct
   var buttonText = ''; // Text you might want to add alongside the image

    // Create a button with an image inside it
    var buttonHtml = '<button style="background-color: transparent; border: none; outline: none; cursor: pointer;"><img src="' + buttonImage + '" alt="Button Image" style="width: 50px; height: auto;">' + buttonText + '</button>';
    button = this.add.dom(this.sys.game.config.width/2, this.sys.game.config.height/2+80).createFromHTML(buttonHtml);
    button.addListener('click');
    button.on('click', function () {
        console.log('Button clicked!');
	     
	   
		  mainscene.gameEnded=false
      
	  //mainscene.restartButton.setText('')
	mainscene.endText.setText('')
	mainscene.currentLevel=0;
	mainscene.resetGame();
	button.setVisible(false);  // This hides the button
    });

	 button.on('pointerover', () => button.setStyle({ fill: '#FFCC00' }));
    button.on('pointerout', () => button.setStyle({ fill: '#FFFFFF' }));
	
}

    resetGame() {

	     this.playerExperience=0;
		//button.setVisible(true); 
		this.playerHealth=100;
		this.updateHealthBar();
		// Reset game elements, then increase the level and update the level text
        this.currentLevel++;
        this.levelText.setText('Level: ' + this.currentLevel);
		
			this.hitCooldown = false;
        // Kill all enemies
      //  this.enemies.clear(true, true);

        // Reset player position to the middle of the map
        this.player.setPosition(this.sys.game.config.width / 2, this.sys.game.config.height / 2);
		
		 this.anims.create({
          key: 'walky'+ this.currentLevel,
         frames: this.anims.generateFrameNumbers('enemy', { frames: [4+ (this.currentLevel *4),5+(this.currentLevel*4),6+(this.currentLevel*4),7+(this.currentLevel*4)] }),
        frameRate: 10,
        repeat: -1
    });
		// Add enemies to the group
        for (let i = 0; i < 20; i++) {
            let enemy = this.enemies.create(Phaser.Math.Between(100, 700), Phaser.Math.Between(100, 500), 'enemy');
			  enemy.anims.play('walky'+this.currentLevel, true);
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

	    updateLevelUpBar(progress) {
        const fillWidth = progress * this.cameras.main.width;
        this.levelUpBarFill.clear();
        this.levelUpBarFill.fillStyle(0x00ff00, 1);
        this.levelUpBarFill.fillRect(0, this.cameras.main.height -790, fillWidth, 20);
    }

    gainExperience(amount) {
        this.playerExperience += amount;
        const progress = this.playerExperience / this.experienceToLevelUp;
        this.updateLevelUpBar(progress);
	   // console.log(progress)
	     //this.updateLevelUpBar(amount);
	    //console.log(amount)
    }

    
}
