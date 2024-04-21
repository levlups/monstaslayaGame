
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
        // Add more assets as needed
    }

    create() {
		
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

        // Add enemies to the group
        for (let i = 0; i < 20; i++) {
            let enemy = this.enemies.create(Phaser.Math.Between(100, 700), Phaser.Math.Between(100, 500), 'enemy');
			  enemy.anims.play('walky', true);
            // Set up enemy behavior here
        }

        // Enable collision between player and enemies
        this.physics.add.collider(this.player, this.enemies, this.handleCollision, null, this);

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
		
		
		
    }

    handleCollision(player, enemy) {
        // Handle what happens when a player hits an enemy
    }
}
